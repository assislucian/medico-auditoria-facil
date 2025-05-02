import pdfplumber
from typing import List, Dict
import re

class GuiaParser:
    """
    Parser robusto para guias Unimed:
    - captura descrições multilinha (remove hifens de quebra),
    - detecta dinamicamente todos os procedimentos,
    - associa participações (papel + CRM + status exato),
    - preserva o campo 'qtd' para somatório correto.
    """
    def __init__(self, file_path: str):
        self.file_path = file_path
        self.procedures: List[Dict] = []
        self.beneficiario: str = ''
        self.prestador: str = ''
        self._parse_pdf()

    def _parse_pdf(self):
        try:
            # Abre PDF
            with pdfplumber.open(self.file_path) as pdf:
                first_page = pdf.pages[0].extract_text() or ''
                # Beneficiário: captura nome após o ID e hífen
                m = re.search(r'Benefici[áa]rio:\s*\d+\s*-\s*([A-ZÇÁÉÍÓÚÂÊÔÃÕÜ\s]+)', first_page)
                self.beneficiario = m.group(1).strip() if m else ''
                # Prestador
                m2 = re.search(r'Prestador:\s*([^\n]+)', first_page)
                self.prestador = m2.group(1).strip() if m2 else ''
                # Texto completo
                text = "\n".join(p.extract_text() or '' for p in pdf.pages)

            # Remove hifens de quebra e limpa linhas
            text = text.replace('-\n', '')
            lines = [ln.strip() for ln in text.splitlines() if ln.strip()]

            # Agrupa cada procedimento e seu bloco de participações
            blocks = []
            curr = []
            for ln in lines:
                if re.match(r'^\d{8}\s+\d{2}/\d{2}/\d{4}\s+30\d{6}', ln):
                    if curr:
                        blocks.append(" ".join(curr))
                    curr = [ln]
                else:
                    if curr:
                        curr.append(ln)
            if curr:
                blocks.append(" ".join(curr))

            # Regex para procedimento (captura status exato)
            proc_re = re.compile(
                r'(?P<guia>\d{8})\s+'
                r'(?P<data>\d{2}/\d{2}/\d{4})\s+'
                r'(?P<codigo>30\d{6})\s+'
                r'(?P<descricao>.+?)\s+'
                r'(?P<qtd>\d+)\s+'
                r'(?P<status>Gerado pela execução|Fechada)',
                re.IGNORECASE | re.DOTALL
            )
            # Regex para participações
            papel_re = re.compile(
                r'(?P<papel>Anestesista|Cirurgiao|Primeiro Auxiliar|Segundo Auxiliar)\s+'
                r'(?P<crm>\d+)',
                re.IGNORECASE
            )
            papel_map = {
                'Cirurgiao': 'Cirurgião',
                'Anestesista': 'Anestesista',
                'Primeiro Auxiliar': '1º Auxiliar',
                'Segundo Auxiliar': '2º Auxiliar'
            }

            # Extrai de cada bloco
            for blk in blocks:
                pm = proc_re.search(blk)
                if not pm:
                    continue
                guia = pm.group('guia')
                data = pm.group('data')
                codigo = pm.group('codigo')
                descricao = re.sub(r'\s{2,}', ' ', pm.group('descricao').strip())
                qtd = int(pm.group('qtd'))
                statusG = pm.group('status').strip()

                # Participações: busca seção Participação Médico
                participacoes = []
                part_idx = blk.find('Participação Médico')
                if part_idx != -1:
                    part_section = blk[part_idx:]
                    participacoes = list(papel_re.finditer(part_section))
                else:
                    participacoes = []

                if participacoes:
                    for p in participacoes:
                        raw = p.group('papel')
                        crm = p.group('crm')
                        papel = papel_map.get(raw, raw)
                        self.procedures.append({
                            'numero_guia': guia,
                            'data': data,
                            'beneficiario': self.beneficiario,
                            'prestador': self.prestador,
                            'codigo': codigo,
                            'descricao': descricao,
                            'papel': papel,
                            'crm': crm,
                            'qtd': qtd,
                            'status': statusG
                        })
                else:
                    # Se não houver participações, ainda assim registra o procedimento (sem CRM/papel)
                    self.procedures.append({
                        'numero_guia': guia,
                        'data': data,
                        'beneficiario': self.beneficiario,
                        'prestador': self.prestador,
                        'codigo': codigo,
                        'descricao': descricao,
                        'papel': '',
                        'crm': '',
                        'qtd': qtd,
                        'status': statusG
                    })
        except Exception as e:
            raise RuntimeError(f"Erro ao parsear guia: {e}")

    def get_procedures(self) -> List[Dict]:
        return self.procedures

    def filter_by_crm(self, crm: str) -> List[Dict]:
        return [p for p in self.procedures if p['crm'] == crm]