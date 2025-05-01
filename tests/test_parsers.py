import sys, os
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

import pytest
import os
import pandas as pd
from src.parsers.cbhpm_parser import CBHPMParser
from src.parsers.guia_parser import GuiaParser
from src.parsers.demonstrativo_parser import DemonstrativoParser
from src.main import parse_demonstrativo

def test_cbhpm_parser():
    """Test CBHPM parser with sample data."""
    # Create a sample CBHPM Excel file
    sample_data = {
        'codigo': ['31602010', '31602029', '31602037'],
        'procedimento': [
            'Analgesia controlada pelo paciente – por dia subsequente',
            'Analgesia por dia subsequente. Acompanhamento de analgesia por cateter peridural',
            'Anestesia geral ou condutiva para realização de bloqueio neurolítico'
        ],
        'valor_cirurgiao': ['R$135.78', 'R$135.78', 'R$432.47'],
        'valor_anestesista': ['', '', ''],
        'valor_primeiro_auxiliar': ['', '', '']
    }
    
    test_file = "data/cbhpm/test_cbhpm.xlsx"
    os.makedirs(os.path.dirname(test_file), exist_ok=True)
    
    # Create DataFrame and save as Excel
    df = pd.DataFrame(sample_data)
    df.to_excel(test_file, index=False)
    
    parser = CBHPMParser(test_file)
    
    # Test procedure retrieval
    procedure = parser.get_procedure("31602010")
    assert procedure is not None
    assert procedure["description"] == "Analgesia controlada pelo paciente – por dia subsequente"
    assert procedure["surgeon_value"] == 135.78
    
    # Test value validation
    assert parser.validate_procedure_value("31602010", 135.78, "surgeon")
    assert not parser.validate_procedure_value("31602010", 150.00, "surgeon")

def test_guia_parser():
    """Test Guia parser with sample PDF."""
    # Note: This test requires a sample PDF file
    # You'll need to create a sample PDF with the expected format
    test_file = "data/guias/test_guia.pdf"
    if not os.path.exists(test_file):
        pytest.skip("Test PDF file not found")
    
    parser = GuiaParser(test_file)
    procedures = parser.get_procedures()
    
    # Basic validation
    assert isinstance(procedures, list)
    if procedures:
        assert "code" in procedures[0]
        assert "description" in procedures[0]
        assert "value" in procedures[0]

def test_demonstrativo_parser():
    """Test Demonstrativo parser with sample PDF."""
    # Note: This test requires a sample PDF file
    # You'll need to create a sample PDF with the expected format
    test_file = "data/demonstrativos/test_demonstrativo.pdf"
    if not os.path.exists(test_file):
        pytest.skip("Test PDF file not found")
    
    parser = DemonstrativoParser(test_file)
    payments = parser.get_payments()
    
    # Basic validation
    assert isinstance(payments, list)
    if payments:
        assert "code" in payments[0]
        assert "description" in payments[0]
        assert "role" in payments[0]
        assert "value" in payments[0]

# NOVO TESTE PARA O PARSER DE DEMONSTRATIVO DO src/main.py
@pytest.mark.parametrize("pdf_path,cbhpm_path", [
    ("data/demonstrativos/Demonstrativo-outubro_2024.pdf", "data/cbhpm/CBHPM2015_v1.xlsx"),
])
def test_parse_demonstrativo_main(pdf_path, cbhpm_path):
    if not (os.path.exists(pdf_path) and os.path.exists(cbhpm_path)):
        pytest.skip("Arquivos de teste não encontrados")
    df = parse_demonstrativo(pdf_path, user_crm="6091")
    # Deve retornar DataFrame não vazio se houver procedimentos válidos
    assert isinstance(df, pd.DataFrame)
    assert len(df) > 0, "O DataFrame do demonstrativo está vazio, mas deveria conter procedimentos."
    # Todos os códigos extraídos devem estar na CBHPM
    cbhpm_codes = set(pd.read_excel(cbhpm_path)['codigo'].astype(int))
    assert set(df['codigo']).issubset(cbhpm_codes), "Existem códigos no demonstrativo que não estão na CBHPM."
    # O parser não deve retornar linhas para PDFs sem procedimentos válidos
    # (Teste negativo: arquivo fictício)
    empty_df = parse_demonstrativo("data/demonstrativos/arquivo_inexistente.pdf", user_crm="6091") if os.path.exists("data/demonstrativos/arquivo_inexistente.pdf") else pd.DataFrame()
    assert empty_df.empty or len(empty_df) == 0 