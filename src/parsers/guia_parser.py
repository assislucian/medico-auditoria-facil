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
                    # Divide por procedimentos (cada bloco começa com 8 dígitos + data)
                    proc_blocks = re.split(r'(?=\d{8}\s+\d{2}/\d{2}/\d{4})', text)
                    for blk in proc_blocks:
                        proc_match = re.match(r'(?P<numero_guia>\d{8})\s+(?P<data>\d{2}/\d{2}/\d{4})\s+(?P<codigo>30\d{6})\s+(?P<descricao>.+?)\s+(?P<qtd>\d+)\s+(?P<status>\w+)', blk, re.DOTALL)
                        if not proc_match:
                            continue
                        numero_guia = proc_match.group('numero_guia')
                        data = proc_match.group('data')
                        codigo = proc_match.group('codigo')
                        descricao = proc_match.group('descricao').strip()
                        qtd = int(proc_match.group('qtd'))
                        status = proc_match.group('status')

                        # Extrai bloco de participação imediatamente após o procedimento
                        part_match = re.search(r'Participa[çc][ãa]o\s+M[ée]dico(.+)', blk, re.DOTALL)
                        part_text = blk.split('Participação')[1] if 'Participação' in blk else ''
                        # Cada papel pode aparecer em qualquer ordem
                        papel_crm_regex = re.compile(r'(Cirurgiao|Anestesista|Primeiro Auxiliar|Segundo Auxiliar)\s*(\d+)\s*-\s*([A-ZÇÁÉÍÓÚÂÊÔÃÕÜ\s]+)\s*(\d{2}/\d{2}/\d{4}\s+\d{2}:\d{2})?\s*(\d{2}/\d{2}/\d{4}\s+\d{2}:\d{2})?\s*(\w+)?', re.IGNORECASE)
                        for papel_match in papel_crm_regex.finditer(part_text):
                            papel_raw = papel_match.group(1)
                            crm = papel_match.group(2)
                            # nome = papel_match.group(3)  # pode ser usado se quiser
                            papel_map = {
                                'Cirurgiao': 'Cirurgião',
                                'Anestesista': 'Anestesista',
                                'Primeiro Auxiliar': '1º Auxiliar',
                                'Segundo Auxiliar': '2º Auxiliar'
                            }
                            papel = papel_map.get(papel_raw, papel_raw)
                            self.procedures.append({
                                'numero_guia': numero_guia,
                                'data': data,
                                'codigo': codigo,
                                'descricao': descricao,
                                'papel': papel,
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