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
                # First, get the execution number and patient info from the header
                text = pdf.pages[0].extract_text()
                execution_match = re.search(r'Execução:\s*(\d+)', text)
                beneficiary_match = re.search(r'Beneficiário:\s*(\d+)\s*-\s*([^\n]+)', text)
                
                execution_number = execution_match.group(1) if execution_match else None
                beneficiary_id = beneficiary_match.group(1) if beneficiary_match else None
                beneficiary_name = beneficiary_match.group(2).strip() if beneficiary_match else None
                
                current_procedure = None
                current_roles = []
                
                for page in pdf.pages:
                    text = page.extract_text()
                    if not text:
                        continue
                    
                    # Extract procedures using regex
                    # Format: Guia Dt execução Código Descrição Qtd Status
                    procedure_pattern = r'(\d+)\s+(\d{2}/\d{2}/\d{4})\s+(\d{8})\s+([^\n]+?)\s+(\d+)\s+Gerado pela execução'
                    matches = re.finditer(procedure_pattern, text)
                    
                    for match in matches:
                        # If we have a previous procedure, save it
                        if current_procedure:
                            current_procedure['roles'] = current_roles
                            self.procedures.append(current_procedure)
                            current_roles = []
                        
                        guia = match.group(1)
                        date = match.group(2)
                        code = match.group(3)
                        description = match.group(4).strip()
                        quantity = int(match.group(5))
                        
                        current_procedure = {
                            'execution_number': execution_number,
                            'beneficiary': {
                                'id': beneficiary_id,
                                'name': beneficiary_name
                            },
                            'guia': guia,
                            'date': date,
                            'code': code,
                            'description': description,
                            'quantity': quantity
                        }
                    
                    # Extract role information
                    role_pattern = r'(Cirurgiao|Anestesista|Primeiro Auxiliar)\s+(\d+)\s+-\s+([^\n]+?)\s+(\d{2}/\d{2}/\d{4}\s+\d{2}:\d{2})\s+(\d{2}/\d{2}/\d{4}\s+\d{2}:\d{2})\s+(\w+)'
                    role_matches = re.finditer(role_pattern, text)
                    
                    for role_match in role_matches:
                        role = {
                            'role': role_match.group(1),
                            'id': role_match.group(2),
                            'name': role_match.group(3),
                            'start_time': role_match.group(4),
                            'end_time': role_match.group(5),
                            'status': role_match.group(6)
                        }
                        current_roles.append(role)
                
                # Don't forget to save the last procedure
                if current_procedure:
                    current_procedure['roles'] = current_roles
                    self.procedures.append(current_procedure)
                        
        except Exception as e:
            raise Exception(f"Error parsing medical guide: {str(e)}")
    
    def get_procedures(self) -> List[Dict]:
        """Get all procedures from the guide."""
        return self.procedures
    
    def get_procedure_by_code(self, code: str) -> Dict:
        """Get a specific procedure by its code."""
        for procedure in self.procedures:
            if procedure['code'] == code:
                return procedure
        return None
    
    def get_procedure_by_guia_and_code(self, guia: str, code: str) -> Dict:
        """Get a specific procedure by its guia number and code."""
        for procedure in self.procedures:
            if procedure['guia'] == guia and procedure['code'] == code:
                return procedure
        return None 