from fastapi import FastAPI, File, UploadFile, HTTPException, Depends, BackgroundTasks, Form, Body
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse, FileResponse
from pydantic import BaseModel
from uuid import uuid4
import os
import shutil
import logging
import time
import jwt
from datetime import datetime, timedelta
from src.main import parse_demonstrativo, parse_guide_pdf
import pandas as pd
import bcrypt
from sqlalchemy import create_engine, Column, String, Integer, DateTime, desc
from sqlalchemy.orm import declarative_base, sessionmaker
from typing import List

# --- Configurações ---
UPLOAD_DIR = "uploads"
RESULTS_DIR = "results"
CBHPM_VERSION = "2015"
MAX_UPLOAD_SIZE_MB = 10
JWT_SECRET = "supersecret"  # Troque em produção
JWT_ALGORITHM = "HS256"
JWT_EXPIRE_MINUTES = 480
os.makedirs(UPLOAD_DIR, exist_ok=True)
os.makedirs(RESULTS_DIR, exist_ok=True)

# --- Banco de dados SQLAlchemy (SQLite) ---
DATABASE_URL = "sqlite:///medicos.db"
engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
Base = declarative_base()
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

class Medico(Base):
    __tablename__ = "medicos"
    crm = Column(String, primary_key=True, index=True)
    uf = Column(String, nullable=False)
    nome = Column(String, nullable=False)
    senha_hash = Column(String, nullable=False)

class Demonstrativo(Base):
    __tablename__ = "demonstrativos"
    id = Column(Integer, primary_key=True, index=True)
    crm = Column(String, nullable=False, index=True)
    periodo = Column(String, nullable=True, index=True)
    lote = Column(String, nullable=True)
    filename = Column(String, nullable=False)
    total_procedimentos = Column(Integer, nullable=False, default=0)
    apresentado = Column(String, nullable=False, default="R$ 0,00")
    liberado = Column(String, nullable=False, default="R$ 0,00")
    glosa = Column(String, nullable=False, default="R$ 0,00")
    upload_time = Column(DateTime, default=datetime.utcnow)

class Guia(Base):
    __tablename__ = "guias"
    id = Column(Integer, primary_key=True, index=True)
    numero_guia = Column(String, nullable=False, index=True)
    data = Column(String, nullable=False)
    paciente = Column(String, nullable=True)
    codigo = Column(String, nullable=False)
    descricao = Column(String, nullable=False)
    papel = Column(String, nullable=False)
    crm = Column(String, nullable=False)
    qtd = Column(Integer, nullable=False)
    status = Column(String, nullable=True)
    prestador = Column(String, nullable=True)
    user_id = Column(String, nullable=False, index=True)  # CRM do médico

Base.metadata.create_all(bind=engine)

# --- Autenticação JWT real (MVP) ---
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

def create_access_token(data: dict, expires_delta: timedelta = None):
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=JWT_EXPIRE_MINUTES))
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, JWT_SECRET, algorithm=JWT_ALGORITHM)

def decode_jwt(token: str):
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        return payload
    except jwt.PyJWTError:
        raise HTTPException(status_code=401, detail="Token inválido ou expirado")

def get_current_user(token: str = Depends(oauth2_scheme)):
    payload = decode_jwt(token)
    return {"crm": payload.get("crm"), "nome": payload.get("nome")}

# --- FastAPI app ---
app = FastAPI(title="Validador de Demonstrativos e Guias Médicas", version="1.0.0")

# CORS para frontend local
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Logging estruturado ---
logging.basicConfig(level=logging.INFO, format='%(asctime)s %(levelname)s %(message)s')
logger = logging.getLogger("validador")

# --- Models ---
class RegisterRequest(BaseModel):
    uf: str
    crm: str
    nome: str
    senha: str

class RegisterResponse(BaseModel):
    message: str

class ValidateResponse(BaseModel):
    job_id: str
    status: str
    cbhpm_version: str
    detail: str = ""

class StatusResponse(BaseModel):
    job_id: str
    status: str
    result_url: str = None
    cbhpm_version: str
    detail: str = ""

class TokenResponse(BaseModel):
    access_token: str
    token_type: str

# --- Simulação de fila de jobs (substitua por Celery/RQ em produção) ---
jobs = {}

# --- Endpoint de cadastro de médico (persistente) ---
@app.post("/api/v1/register", response_model=RegisterResponse)
def register_medico(req: RegisterRequest):
    db = SessionLocal()
    try:
        if db.query(Medico).filter_by(crm=req.crm).first():
            raise HTTPException(status_code=400, detail="CRM já cadastrado")
        senha_hash = bcrypt.hashpw(req.senha.encode(), bcrypt.gensalt()).decode()
        medico = Medico(crm=req.crm, uf=req.uf, nome=req.nome, senha_hash=senha_hash)
        db.add(medico)
        db.commit()
        logger.info(f"Novo médico cadastrado: {req.uf}-{req.crm} - {req.nome}")
        return RegisterResponse(message="Cadastro realizado com sucesso!")
    finally:
        db.close()

# --- Endpoint de login/token (persistente) ---
@app.post("/token", response_model=TokenResponse)
def login(form_data: OAuth2PasswordRequestForm = Depends()):
    # Espera-se que o frontend envie 'username' como CRM e 'uf' como parte do form
    crm = form_data.username
    senha = form_data.password
    uf = form_data.scopes[0] if form_data.scopes else None  # Usar scopes para transportar a UF
    if not uf:
        raise HTTPException(status_code=400, detail="UF obrigatória para login")
    db = SessionLocal()
    try:
        medico = db.query(Medico).filter_by(crm=crm, uf=uf).first()
        if not medico or not bcrypt.checkpw(senha.encode(), medico.senha_hash.encode()):
            raise HTTPException(status_code=401, detail="CRM, UF ou senha inválidos")
        access_token = create_access_token({"crm": crm, "uf": uf, "nome": medico.nome})
        return {"access_token": access_token, "token_type": "bearer"}
    finally:
        db.close()

# --- Processamento real do pipeline ---
def process_validation_job(job_id: str, file_path: str, user: dict):
    logger.info(f"[JOB {job_id}] Iniciando processamento para {file_path} (CRM: {user['crm']})")
    try:
        df = parse_demonstrativo(file_path, user_crm=user['crm'])
        # Calcular agregados
        total_procedimentos = len(df)
        apresentado = df['apresentado'].replace(',', '.', regex=True).astype(float).sum() if 'apresentado' in df else 0.0
        liberado = df['liberado'].replace(',', '.', regex=True).astype(float).sum() if 'liberado' in df else 0.0
        glosa = df['glosa'].replace(',', '.', regex=True).astype(float).sum() if 'glosa' in df else 0.0
        # Salvar agregados no Demonstrativo (se possível identificar periodo/lote)
        # Aqui, para MVP, buscar por nome do arquivo ou metadados
        periodo = None
        lote = None
        if hasattr(df, 'periodo'):
            periodo = df['periodo'][0]
        if hasattr(df, 'lote'):
            lote = df['lote'][0]
        # Atualizar no banco
        db = SessionLocal()
        try:
            demo = db.query(Demonstrativo).filter_by(filename=os.path.basename(file_path)).first()
            if demo:
                demo.total_procedimentos = total_procedimentos
                demo.apresentado = f"R$ {apresentado:,.2f}".replace('.', ',')
                demo.liberado = f"R$ {liberado:,.2f}".replace('.', ',')
                demo.glosa = f"R$ {glosa:,.2f}".replace('.', ',')
                if periodo: demo.periodo = periodo
                if lote: demo.lote = lote
                db.commit()
        finally:
            db.close()
        result_path = os.path.join(RESULTS_DIR, f"{job_id}.json")
        df.to_json(result_path, orient="records", force_ascii=False)
        jobs[job_id] = {"status": "done", "result_path": result_path, "cbhpm_version": CBHPM_VERSION, "crm": user['crm']}
        logger.info(f"[JOB {job_id}] Processamento concluído com sucesso para CRM {user['crm']}")
    except Exception as e:
        jobs[job_id] = {"status": "error", "cbhpm_version": CBHPM_VERSION, "detail": str(e), "crm": user['crm']}
        logger.error(f"[JOB {job_id}] Erro: {e}")

# --- Endpoint de upload/validação ---
@app.post("/api/v1/validate", response_model=ValidateResponse)
def validate_file(
    background_tasks: BackgroundTasks,
    file: UploadFile = File(...),
    user: dict = Depends(get_current_user)
):
    # Limite de tamanho (leitura manual do arquivo)
    contents = file.file.read()
    if len(contents) > MAX_UPLOAD_SIZE_MB * 1024 * 1024:
        raise HTTPException(status_code=413, detail="Arquivo muito grande")
    # Salva arquivo temporário
    job_id = str(uuid4())
    file_path = os.path.join(UPLOAD_DIR, f"{job_id}_{file.filename}")
    with open(file_path, "wb") as buffer:
        buffer.write(contents)
    # Cria job assíncrono
    jobs[job_id] = {"status": "processing", "cbhpm_version": CBHPM_VERSION, "crm": user['crm']}
    background_tasks.add_task(process_validation_job, job_id, file_path, user)
    logger.info(f"[API] Upload recebido de CRM {user['crm']} para job {job_id}")
    return ValidateResponse(job_id=job_id, status="processing", cbhpm_version=CBHPM_VERSION)

# --- Endpoint de status/resultados ---
@app.get("/api/v1/status/{job_id}", response_model=StatusResponse)
def get_status(job_id: str, user: dict = Depends(get_current_user)):
    job = jobs.get(job_id)
    if not job or job.get("crm") != user["crm"]:
        raise HTTPException(status_code=404, detail="Job não encontrado para este CRM")
    result_url = None
    if job["status"] == "done":
        result_url = f"/api/v1/result/{job_id}"
    return StatusResponse(job_id=job_id, status=job["status"], result_url=result_url, cbhpm_version=job["cbhpm_version"], detail=job.get("detail", ""))

# --- Endpoint para download do resultado ---
@app.get("/api/v1/result/{job_id}")
def download_result(job_id: str, user: dict = Depends(get_current_user)):
    job = jobs.get(job_id)
    if not job or job["status"] != "done" or job.get("crm") != user["crm"]:
        raise HTTPException(status_code=404, detail="Resultado não disponível para este CRM")
    return FileResponse(job["result_path"], media_type="application/json", filename=f"resultado_{job_id}.json")

# --- Endpoint de cross-check Demonstrativo + Guias ---
@app.post("/api/v1/validate-cross")
def validate_cross(
    demonstrativo: UploadFile = File(...),
    guias: List[UploadFile] = File(...),
    user: dict = Depends(get_current_user)
):
    # Salva arquivos temporários
    job_id = str(uuid4())
    demo_path = os.path.join(UPLOAD_DIR, f"{job_id}_demonstrativo.pdf")
    with open(demo_path, "wb") as f:
        shutil.copyfileobj(demonstrativo.file, f)
    guias_paths = []
    for idx, guia in enumerate(guias):
        guia_path = os.path.join(UPLOAD_DIR, f"{job_id}_guia_{idx}.pdf")
        with open(guia_path, "wb") as f:
            shutil.copyfileobj(guia.file, f)
        guias_paths.append(guia_path)

    # Parse demonstrativo
    try:
        df_demo = parse_demonstrativo(demo_path, user_crm=user['crm'])
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Erro ao processar demonstrativo: {e}")

    # Parse guias
    guias_dfs = []
    for guia_path in guias_paths:
        try:
            df_guia = parse_guide_pdf(guia_path, user['crm'])
            guias_dfs.append(df_guia)
        except Exception as e:
            raise HTTPException(status_code=400, detail=f"Erro ao processar guia: {e}")
    if not guias_dfs:
        raise HTTPException(status_code=400, detail="Nenhuma guia válida encontrada.")
    df_guias = pd.concat(guias_dfs, ignore_index=True)

    # Padroniza as chaves de merge
    for col in ['guia', 'codigo', 'crm']:
        if col not in df_demo.columns:
            df_demo[col] = None
        if col not in df_guias.columns:
            df_guias[col] = None
    key_demo = key_guia = ['guia', 'codigo', 'crm']
    # Merge outer e conta divergências
    merged = pd.merge(df_demo, df_guias, left_on=key_demo, right_on=key_guia, how='outer', indicator=True)
    pendentes_demo = merged[merged['_merge'] == 'left_only']
    pendentes_guia = merged[merged['_merge'] == 'right_only']
    divergencias = merged[merged['_merge'] == 'both']

    resumo = {
        'Lançamentos no Demonstrativo': len(df_demo),
        'Procedimentos nas Guias': len(df_guias),
        'No Demo sem Guia correspondente': len(pendentes_demo),
        'Guia sem lançamento no Demo': len(pendentes_guia),
        'Procedimentos cruzados': len(divergencias),
    }

    # Salva relatório detalhado
    result_path = os.path.join(RESULTS_DIR, f"{job_id}_relatorio.csv")
    merged.to_csv(result_path, index=False)
    report_url = f"/api/v1/result-cross/{job_id}"

    return {"summary": resumo, "report_url": report_url}

# --- Endpoint para download do relatório cross-check ---
@app.get("/api/v1/result-cross/{job_id}")
def download_cross_report(job_id: str, user: dict = Depends(get_current_user)):
    result_path = os.path.join(RESULTS_DIR, f"{job_id}_relatorio.csv")
    if not os.path.exists(result_path):
        raise HTTPException(status_code=404, detail="Relatório não encontrado")
    return FileResponse(result_path, media_type="text/csv", filename=f"relatorio_cross_{job_id}.csv")

# --- Endpoint de upload de demonstrativo ---
@app.post("/api/v1/demonstrativos/upload")
def upload_demonstrativo(
    file: UploadFile = File(...),
    periodo: str = Form(None),
    lote: str = Form(None),
    user: dict = Depends(get_current_user)
):
    db = SessionLocal()
    try:
        # Processar o PDF para extrair agregados antes de salvar
        job_id = str(uuid4())
        filename = f"{job_id}_{file.filename}"
        file_path = os.path.join(UPLOAD_DIR, filename)
        with open(file_path, "wb") as f:
            shutil.copyfileobj(file.file, f)
        try:
            from src.parsers.demonstrativo_parser import DemonstrativoParser
            parser = DemonstrativoParser(file_path)
            summary = parser.get_summary()
            total_procedimentos = summary['total_procedures']
            apresentado = summary['total_presented']
            liberado = summary['total_approved']
            glosa = summary['total_glosa']
            periodo = periodo or summary['period']
        except Exception as e:
            total_procedimentos = 0
            apresentado = 0.0
            liberado = 0.0
            glosa = 0.0
        # Log detalhado do upload
        logger.info(f"[UPLOAD] CRM={user['crm']} | periodo={periodo} | lote={lote or filename} | filename={filename}")
        # Validação obrigatória do período
        if not periodo:
            logger.error(f"[UPLOAD] Falha: demonstrativo sem período extraído! Arquivo: {filename}")
            raise HTTPException(status_code=400, detail="Não foi possível extrair o período do demonstrativo. Verifique o PDF.")
        # Trava de duplicidade: não permitir demonstrativo duplicado para mesmo CRM, período e lote (ou filename se lote não informado)
        unique_lote = lote or filename
        exists = db.query(Demonstrativo).filter_by(crm=user['crm'], periodo=periodo, lote=unique_lote).first()
        if exists:
            logger.warning(f"[UPLOAD] Duplicidade detectada: CRM={user['crm']} | periodo={periodo} | lote={unique_lote}")
            raise HTTPException(status_code=400, detail="Já existe demonstrativo para este período e lote.")
        demonstrativo = Demonstrativo(
            crm=user['crm'],
            periodo=periodo,
            lote=unique_lote,
            filename=filename,
            total_procedimentos=total_procedimentos,
            apresentado=f"R$ {apresentado:,.2f}".replace('.', ','),
            liberado=f"R$ {liberado:,.2f}".replace('.', ','),
            glosa=f"R$ {glosa:,.2f}".replace('.', ',')
        )
        db.add(demonstrativo)
        db.commit()
        return {
            "message": "Upload e processamento realizado com sucesso!",
            "id": demonstrativo.id,
            "periodo": demonstrativo.periodo,
            "lote": demonstrativo.lote,
            "total_procedimentos": demonstrativo.total_procedimentos,
            "apresentado": demonstrativo.apresentado,
            "liberado": demonstrativo.liberado,
            "glosa": demonstrativo.glosa
        }
    finally:
        db.close()

# --- Endpoint para deletar demonstrativo ---
from fastapi import status
@app.delete("/api/v1/demonstrativos/{demo_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_demonstrativo(demo_id: int, user: dict = Depends(get_current_user)):
    db = SessionLocal()
    try:
        demo = db.query(Demonstrativo).filter_by(id=demo_id, crm=user['crm']).first()
        if not demo:
            raise HTTPException(status_code=404, detail="Demonstrativo não encontrado.")
        db.delete(demo)
        db.commit()
        return
    finally:
        db.close()

# --- Endpoint de listagem de demonstrativos ---
@app.get("/api/v1/demonstrativos")
def list_demonstrativos(
    periodo: str = None,
    lote: str = None,
    user: dict = Depends(get_current_user)
):
    db = SessionLocal()
    try:
        query = db.query(Demonstrativo).filter_by(crm=user['crm'])
        if periodo:
            query = query.filter_by(periodo=periodo)
        if lote:
            query = query.filter_by(lote=lote)
        demos = query.order_by(Demonstrativo.upload_time.desc()).all()
        return [
            {
                "id": d.id,
                "periodo": d.periodo,
                "lote": d.lote,
                "total_procedimentos": d.total_procedimentos,
                "apresentado": d.apresentado,
                "liberado": d.liberado,
                "glosa": d.glosa,
                "filename": d.filename,
                "upload_time": d.upload_time.isoformat()
            } for d in demos
        ]
    finally:
        db.close()

# --- Endpoint de download de demonstrativo ---
@app.get("/api/v1/demonstrativos/{demo_id}/download")
def download_demonstrativo(demo_id: int, user: dict = Depends(get_current_user)):
    db = SessionLocal()
    try:
        demo = db.query(Demonstrativo).filter_by(id=demo_id, crm=user['crm']).first()
        if not demo:
            raise HTTPException(status_code=404, detail="Demonstrativo não encontrado")
        file_path = os.path.join(UPLOAD_DIR, demo.filename)
        if not os.path.exists(file_path):
            raise HTTPException(status_code=404, detail="Arquivo não encontrado")
        return FileResponse(file_path, media_type="application/pdf", filename=demo.filename)
    finally:
        db.close()

# --- Endpoint para obter procedimentos do demonstrativo ---
@app.get("/api/v1/demonstrativos/{demo_id}/procedimentos")
def get_demonstrativo_procedures(demo_id: int, user: dict = Depends(get_current_user)):
    db = SessionLocal()
    try:
        demo = db.query(Demonstrativo).filter_by(id=demo_id, crm=user['crm']).first()
        if not demo:
            raise HTTPException(status_code=404, detail="Demonstrativo não encontrado")
        file_path = os.path.join(UPLOAD_DIR, demo.filename)
        if not os.path.exists(file_path):
            raise HTTPException(status_code=404, detail="Arquivo do demonstrativo não encontrado")
        from src.parsers.demonstrativo_parser import DemonstrativoParser
        parser = DemonstrativoParser(file_path)
        return parser.get_payments()
    finally:
        db.close()

# --- Endpoint de upload de guia TISS ---
@app.post("/api/v1/guias/upload")
def upload_guia(
    file: UploadFile = File(...),
    user: dict = Depends(get_current_user)
):
    """
    Recebe um PDF de guia TISS, extrai os dados, salva no banco e retorna em JSON.
    Exige autenticação e filtra por CRM.
    """
    import tempfile
    from src.parsers.guia_parser import GuiaParser
    import json
    import shutil
    import os

    # Valida tipo de arquivo
    if not file.filename.lower().endswith('.pdf'):
        raise HTTPException(status_code=400, detail="Apenas arquivos PDF são aceitos.")
    # Salva arquivo temporário
    with tempfile.NamedTemporaryFile(delete=False, suffix='.pdf') as tmp:
        shutil.copyfileobj(file.file, tmp)
        tmp_path = tmp.name
    try:
        parser = GuiaParser(tmp_path)
        procedures = parser.get_procedures()
        # Filtra por CRM do usuário autenticado
        crm = str(user.get('crm'))
        filtered = [p for p in procedures if str(p.get('crm')) == crm]
        # Se não houver campo de CRM, retorna tudo (fallback)
        if not filtered and procedures:
            filtered = procedures
        # Salva no banco automaticamente
        db = SessionLocal()
        try:
            for proc in filtered:
                guia = Guia(
                    numero_guia=proc.get('numero_guia'),
                    data=proc.get('data'),
                    paciente=proc.get('beneficiario'),
                    codigo=proc.get('codigo'),
                    descricao=proc.get('descricao'),
                    papel=proc.get('papel'),
                    crm=proc.get('crm'),
                    qtd=proc.get('qtd'),
                    status=proc.get('status'),
                    prestador=proc.get('prestador'),
                    user_id=crm
                )
                db.add(guia)
            db.commit()
        finally:
            db.close()
        return {"crm": crm, "procedures": filtered}
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Erro ao processar guia: {e}")
    finally:
        os.unlink(tmp_path)

# --- Endpoint para salvar guias ---
@app.post("/api/v1/guias/save")
def save_guias(
    procedimentos: list = Body(...),
    user: dict = Depends(get_current_user)
):
    """
    Salva array de procedimentos extraídos de guias no banco, associando ao usuário autenticado.
    """
    db = SessionLocal()
    try:
        for proc in procedimentos:
            guia = Guia(
                numero_guia=proc.get('numero_guia'),
                data=proc.get('data'),
                paciente=proc.get('beneficiario'),
                codigo=proc.get('codigo'),
                descricao=proc.get('descricao'),
                papel=proc.get('papel'),
                crm=proc.get('crm'),
                qtd=proc.get('qtd'),
                status=proc.get('status'),
                prestador=proc.get('prestador'),
                user_id=user['crm']
            )
            db.add(guia)
        db.commit()
        return {"message": f"{len(procedimentos)} guias salvas com sucesso"}
    finally:
        db.close()

# --- Endpoint para listar guias ---
@app.get("/api/v1/guias")
def list_guias(user: dict = Depends(get_current_user)):
    """
    Retorna todas as guias do usuário autenticado, ordenadas por data decrescente.
    """
    db = SessionLocal()
    try:
        guias = db.query(Guia).filter_by(user_id=user['crm']).order_by(desc(Guia.data)).all()
        return [
            {
                "numero_guia": g.numero_guia,
                "data": g.data,
                "beneficiario": g.paciente,
                "codigo": g.codigo,
                "descricao": g.descricao,
                "papel": g.papel,
                "crm": g.crm,
                "qtd": g.qtd,
                "status": g.status,
                "prestador": g.prestador
            }
            for g in guias
        ]
    finally:
        db.close()

# --- Endpoint para deletar guia ---
from fastapi import status
@app.delete("/api/v1/guias/{numero_guia}", status_code=status.HTTP_204_NO_CONTENT)
def delete_guia(numero_guia: str, user: dict = Depends(get_current_user)):
    db = SessionLocal()
    try:
        deleted = db.query(Guia).filter_by(numero_guia=numero_guia, user_id=user['crm']).delete()
        db.commit()
        if not deleted:
            raise HTTPException(status_code=404, detail="Guia não encontrada.")
        return
    finally:
        db.close()

# --- Observações ---
# - Para produção, troque JWT_SECRET por segredo seguro e use HTTPS
# - Substitua jobs dict por Redis/Celery/DB para escalabilidade real
# - Adapte process_validation_job para rodar o pipeline Python real
# - Para S3/MinIO, troque o salvamento de arquivos/resultados
# - Para Prometheus, adicione instrumentação com prometheus_fastapi_instrumentator
# - Para rate-limiting, use slowapi/starlette-limiter
# - Para logs estruturados, use structlog 