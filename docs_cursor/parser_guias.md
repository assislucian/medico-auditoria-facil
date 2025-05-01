Função: Extrair informações estruturadas de guias em PDF.

Lógica:
1. Dividir o texto por número da guia (`r'\d{8}'` ou `r'Guia\s+(\d{8})'`).
2. Em cada bloco, extrair:
   - guia
   - data de execução
   - código, descrição, qtd, status
3. Capturar blocos de "Participação Médico" e identificar CRM e papel:
   - Cirurgião, Anestesista, Primeiro Auxiliar, Segundo Auxiliar
4. Filtrar os registros:
   - manter apenas os procedimentos cujo CRM e papel correspondem ao usuário logado