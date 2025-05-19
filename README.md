# 🧠 MedCheck SaaS — Guia Essencial

[![CI](https://github.com/assislucian/medcheck-app/actions/workflows/ci.yml/badge.svg)](https://github.com/assislucian/medcheck-app/actions)

---

## 🚀 Instalação Rápida

```bash
# Clone o repositório
git clone https://github.com/assislucian/medcheck-app.git
cd medcheck-app

# Backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt

# Frontend
cd frontend
npm ci
```

---

## ⚙️ Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto com base em `.env.example`:

```
DATABASE_URL=sqlite:///./medicos.db
SECRET_KEY=changeme
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
VITE_API_URL=http://localhost:8000
JWT_SECRET=dev-secret-change-me  # Troque em produção por um valor forte e secreto
```

---

## 🏃 Como Rodar

### Backend
```bash
uvicorn src.main:app --reload
```
Acesse: http://localhost:8000/docs

### Frontend
```bash
cd frontend
npm run dev
```
Acesse: http://localhost:8080

---

## 🧪 Testes

### Backend
```bash
pytest
```

### Frontend
```bash
cd frontend
npm run build
```

---

## 🛡️ CI/CD
- Pipeline GitHub Actions: testa backend (pytest) e build do frontend a cada push/PR.
- Badge de status no topo deste README.

---

## 📚 Links Úteis
- `.env.example`: variáveis obrigatórias
- [docs/technical.md](docs/technical.md): stack, padrões, variáveis
- [DEPLOY_PLAN.md](DEPLOY_PLAN.md): checklist de deploy seguro

---

## Autenticação (Login)

Para obter um token JWT, faça um POST para `/token` com os seguintes campos (form-urlencoded):

- `username`: CRM do médico
- `password`: senha
- `scope`: UF do médico (ex: RN)

Exemplo usando `curl`:

```
curl -X POST http://localhost:8000/token \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "username=6091&password=SENHA_DO_MEDICO&scope=RN"
```

A resposta será:
```json
{
  "access_token": "...",
  "token_type": "bearer"
}
```

---

## Ambiente de Desenvolvimento Profissional

1. **Crie seu `.env` a partir do exemplo:**
   ```bash
   cp .env.example .env
   # Edite o valor de JWT_SECRET para produção
   ```

2. **Instale as dependências de produção:**
   ```bash
   pip install -r requirements.txt
   ```

3. **Para desenvolvimento, instale também as dependências extras:**
   ```bash
   pip install -r requirements-dev.txt
   ```

4. **Formatação e lint:**
   - Formate o código com Black:
     ```bash
     black src/
     ```
   - Organize imports:
     ```bash
     isort src/
     ```
   - Cheque lint:
     ```bash
     flake8 src/
     ```

5. **Rodando os testes:**
   ```bash
   pytest
   ```

6. **Executando o backend:**
   ```bash
   uvicorn src.main:app --reload
   ```

7. **Boas práticas:**
   - Nunca versionar `.env`.
   - Sempre usar segredos fortes em produção.
   - Use pre-commit hooks para garantir qualidade de código (opcional).

---
**Dúvidas? Consulte `.notes/` ou abra uma issue.**
