import pandas as pd
import pdfplumber
import re
from pathlib import Path

# Helper function to extract full text (can be placed inside or outside parse_demonstrativo)
def extract_full_text(path: Path) -> str:
    """Extracts all text from a PDF file."""
    full_text = ""
    with pdfplumber.open(path) as pdf:
        for page in pdf.pages:
            page_text = page.extract_text()
            if page_text:
                full_text += page_text + "\n"
    return full_text

def find_column(df: pd.DataFrame, pattern: str) -> str:
    """Encontra o nome da coluna que corresponde ao regex (case-insensitive)."""
    for col in df.columns:
        if re.search(pattern, col, re.IGNORECASE):
            return col
    raise KeyError(f"Coluna com padrão {pattern!r} não encontrada em {df.columns.tolist()}")

def clean_currency(value) -> float:
    """Converte strings tipo 'R$ 1.234,56' ou '1234.56' em float."""
    if pd.isna(value):
        return 0.0
    s = str(value)
    # remove tudo que não seja dígito, vírgula ou ponto
    s = re.sub(r"[^\d,\.]", "", s)
    # vírgula -> ponto
    s = s.replace(",", ".")
    try:
        return float(s)
    except:
        return 0.0

def load_cbhpm(path: Path) -> pd.DataFrame:
    """Carrega CBHPM2015 e retorna DataFrame com dtype correto."""
    df = pd.read_excel(path, sheet_name="CBHPM2015")
    df['codigo'] = df['codigo'].astype(int)
    return df[[
        'codigo',
        'procedimento',
        'valor_cirurgiao',
        'valor_anestesista',
        'valor_primeiro_auxiliar'
    ]]

def parse_demonstrativo(path: Path, user_crm: str) -> pd.DataFrame:
    """
    Extrai dados do PDF, tentando primeiro tabelas estruturadas e caindo para regex se necessário.
    """
    import re
    all_rows = []
    used_method = None
    essential_cols = {'Cód. Serv.', 'Liberado', 'Glosa', 'Pro rata'}

    with pdfplumber.open(path) as pdf:
        # 1) Tenta extrair tabelas estruturadas
        for page in pdf.pages:
            tables = page.extract_tables()
            for table in tables:
                df = pd.DataFrame(table[1:], columns=table[0])
                print(f"[Tabela] Colunas detectadas na página {page.page_number}: {df.columns.tolist()}")
                # Se encontrou as colunas essenciais, usa essa tabela
                if essential_cols.issubset(df.columns):
                    all_rows.append(df[list(essential_cols)])
                    used_method = 'tabela'
            if used_method == 'tabela':
                break

        # 2) Se não usou tabela válida, cai em regex
        if used_method != 'tabela':
            print("DEBUG: Nenhuma tabela válida encontrada — usando fallback por regex.")
            text = "".join(p.extract_text() + "\n" for p in pdf.pages if p.extract_text())
            pattern = re.compile(
               r'\b(30\d{6})\b[\s\S]{0,30}?(\d{1,3}(?:\.\d{3})*,\d{2})\s+(\d+,\d{2})\s+(\d+,\d{2})',
               re.IGNORECASE
            )
            matches = pattern.findall(text)
            print(f"[Regex] Encontradas {len(matches)} linhas via fallback.")
            df = pd.DataFrame(matches, columns=['Cód. Serv.', 'Apresentado', 'Liberado', 'Glosa'])
            all_rows.append(df)

    # concatena tudo e segue com o fluxo de limpeza e merge...
    demo_df = pd.concat(all_rows, ignore_index=True)
    return demo_df

def valor_por_papel(row: pd.Series) -> float:
    """Retorna o valor CBHPM correto de acordo com o papel."""
    if row['papel'].lower().startswith('cirurg'):
        return row['valor_cirurgiao']
    if row['papel'].lower().startswith('anest'):
        return row['valor_anestesista']
    return row['valor_primeiro_auxiliar']

def process_guides(guides_dir: Path, user_crm: str) -> pd.DataFrame:
    """Processa todas as guias em um diretório e retorna um DataFrame consolidado."""
    all_records = []
    
    for guide_file in guides_dir.glob("*.pdf"):
        print(f"\nProcessando guia: {guide_file.name}")
        try:
            df_guide = parse_demonstrativo(guide_file, user_crm)
            all_records.append(df_guide)
        except Exception as e:
            print(f"Erro ao processar guia {guide_file.name}: {e}")
    
    if not all_records:
        raise RuntimeError("Nenhuma guia foi processada com sucesso")
    
    return pd.concat(all_records, ignore_index=True)

def compare_demonstrative_with_guides(demo_df: pd.DataFrame, guides_df: pd.DataFrame) -> dict:
    """Compara o demonstrativo com as guias e retorna um dicionário com as discrepâncias."""
    # Agrupa por código e soma os valores
    demo_grouped = demo_df.groupby('codigo').agg({
        'liberado': 'sum',
        'valor_tabela': 'first',  # Pega o primeiro valor da tabela (deve ser o mesmo para todos)
        'diferenca': 'sum',
        'diferenca_percent': 'mean'  # Média das diferenças percentuais
    }).reset_index()
    
    guides_grouped = guides_df.groupby('codigo').agg({
        'liberado': 'sum'
    }).reset_index()
    
    # Encontra procedimentos que estão em um mas não no outro
    demo_codes = set(demo_grouped['codigo'])
    guides_codes = set(guides_grouped['codigo'])
    
    only_in_demo = demo_codes - guides_codes
    only_in_guides = guides_codes - demo_codes
    
    # Encontra procedimentos com valores diferentes
    merged = pd.merge(demo_grouped, guides_grouped, on='codigo', how='outer', suffixes=('_demo', '_guides'))
    different_values = merged[merged['liberado_demo'] != merged['liberado_guides']]
    
    return {
        'only_in_demo': list(only_in_demo),
        'only_in_guides': list(only_in_guides),
        'different_values': different_values.to_dict('records') if not different_values.empty else [],
        'demo_total': demo_grouped['liberado'].sum(),
        'guides_total': guides_grouped['liberado'].sum()
    }

def main():
    user_crm = "6091"  # vindo do login
    cbhpm = load_cbhpm(Path("data/cbhpm/CBHPM2015_v1.xlsx"))

    # Processa o demonstrativo
    print("\n=== Processando Demonstrativo ===")
    df_demo = parse_demonstrativo(
        Path("data/demonstrativos/Demonstrativo-outubro_2024.pdf"),
        user_crm
    )

    # Processa as guias
    print("\n=== Processando Guias ===")
    df_guides = process_guides(Path("data/guias"), user_crm)

    # Faz merge com CBHPM para o demonstrativo
    df_demo = df_demo.merge(cbhpm, on="codigo", how="left")
    if df_demo['procedimento'].isna().any():
        missing = df_demo[df_demo['procedimento'].isna()]['codigo'].unique()
        raise RuntimeError(f"Códigos CBHPM não encontrados: {missing.tolist()}")

    # Calcula valor_tabela e diferenças para o demonstrativo
    df_demo['valor_tabela'] = df_demo.apply(valor_por_papel, axis=1)
    df_demo['diferenca'] = df_demo['liberado'] - df_demo['valor_tabela']
    df_demo['diferenca_percent'] = (df_demo['diferenca'] / df_demo['valor_tabela'] * 100).round(2)

    # Compara demonstrativo com guias
    print("\n=== Comparando Demonstrativo com Guias ===")
    
    # Encontra procedimentos que estão em um mas não no outro
    # Para o demonstrativo, usamos apenas código e papel
    missing_in_guides = df_demo[~df_demo.set_index(['codigo', 'papel']).index
                                   .isin(df_guides.set_index(['codigo', 'papel']).index)]
    missing_in_demo = df_guides[~df_guides.set_index(['codigo', 'papel']).index
                                   .isin(df_demo.set_index(['codigo', 'papel']).index)]
    
    # Imprime o relatório de comparação
    print("\n=== Relatório de Comparação ===")
    print(f"\nTotal no Demonstrativo: R$ {df_demo['liberado'].sum():.2f}")
    
    if not missing_in_guides.empty:
        print("\nProcedimentos apenas no Demonstrativo:")
        for _, row in missing_in_guides.iterrows():
            print(f"- {row['codigo']}: {row['procedimento']} (R$ {row['liberado']:.2f})")
    
    if not missing_in_demo.empty:
        print("\nProcedimentos apenas nas Guias:")
        for _, row in missing_in_demo.iterrows():
            print(f"- {row['codigo']}: Guia {row['guia']}, Papel: {row['papel']}")
    
    # Imprime o demonstrativo final
    print("\n=== Demonstrativo Final ===")
    print(df_demo[['codigo','papel','liberado','valor_tabela','diferenca','diferenca_percent']])

if __name__ == "__main__":
    main()
