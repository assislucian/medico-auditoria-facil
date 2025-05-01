import pdfplumber
from typing import List, Dict
import re

class GuiaParser:
    def __init__(self, file_path: str):
        self.file_path = file_path
        self.procedures: List[Dict] = []
        self._parse_pdf()
    
    def _parse_pdf(self):
        """Parse the medical guide PDF and extract procedures."""
        try:
            with pdfplumber.open(self.file_path) as pdf:
                # Extrai beneficiário e prestador do cabeçalho
                header_text = pdf.pages[0].extract_text() or ''
                beneficiary_match = re.search(r'Benefici[áa]rio: [^\-]+- ([A-ZÇÁÉÍÓÚÂÊÔÃÕÜ\s]+)', header_text)
                beneficiario = beneficiary_match.group(1).strip() if beneficiary_match else ''
                prestador_match = re.search(r'Prestador: ([^\|\n]+)', header_text)
                prestador = prestador_match.group(1).strip() if prestador_match else ''

                for page in pdf.pages:
                    text = page.extract_text() or ''
                    # Extrai linhas de procedimentos
                    # Exemplo: 10696456 04/09/2024 30602076 Roll 1 Fechada
                    proc_pattern = re.compile(r'(?P<numero_guia>\d{8})\s+(?P<data>\d{2}/\d{2}/\d{4})\s+(?P<codigo>30\d{6})\s+(?P<descricao>.+?)\s+(?P<qtd>\d+)\s+(?P<status>\w+)', re.MULTILINE)
                    for m in proc_pattern.finditer(text):
                        numero_guia = m.group('numero_guia')
                        data = m.group('data')
                        codigo = m.group('codigo')
                        descricao = m.group('descricao').strip()
                        qtd = int(m.group('qtd'))
                        status = m.group('status')

                        # Para cada papel possível, verifica se está presente no texto do bloco
                        papel_map = {
                            r'Cirurgiao': 'Cirurgião',
                            r'Anestesista': 'Anestesista',
                            r'Primeiro Auxiliar': '1º Auxiliar',
                            r'Segundo Auxiliar': '2º Auxiliar'
                        }
                        for pat, papel_nome in papel_map.items():
                            papel_regex = re.compile(rf'{pat}\s+(?P<crm>\d+)', re.IGNORECASE)
                            papel_match = papel_regex.search(text)
                            if papel_match:
                                crm = papel_match.group('crm')
                                self.procedures.append({
                                    'numero_guia': numero_guia,
                                    'data': data,
                                    'codigo': codigo,
                                    'descricao': descricao,
                                    'papel': papel_nome,
                                    'crm': crm,
                                    'qtd': qtd,
                                    'status': status,
                                    'beneficiario': beneficiario,
                                    'prestador': prestador
                                })
        except Exception as e:
            raise Exception(f"Error parsing medical guide: {str(e)}")
    
    def get_procedures(self) -> List[Dict]:
        """Get all procedures from the guide."""
        return self.procedures
    
    def get_procedure_by_code(self, code: str) -> Dict:
        """Get a specific procedure by its code."""
        for procedure in self.procedures:
            if procedure['codigo'] == code:
                return procedure
        return None
    
    def get_procedure_by_guia_and_code(self, numero_guia: str, codigo: str) -> Dict:
        """Get a specific procedure by its guia number and code."""
        for procedure in self.procedures:
            if procedure['numero_guia'] == numero_guia and procedure['codigo'] == codigo:
                return procedure
        return None 