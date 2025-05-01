Função: Extrair informações estruturadas de guias em PDF.

Lógica:
1. Dividir o texto por número da guia (ex.: `r'\d{8}'`, `'Portal web\s+(\d{8})'`, `'Guia n°\s*(\d{8})'`).
2. Em cada bloco, extrair:
   - número da guia
   - data de execução
   - código, descrição, qtd, status
3. Capturar blocos de "Participação Médico" e identificar CRM e papel:
   - Cirurgião, Anestesista, Primeiro Auxiliar, Segundo Auxiliar
   - Para cada procedimento, gerar múltiplas entradas (uma por papel identificado)
4. Beneficiário:
   - Se o nome do beneficiário só aparecer no cabeçalho, propagar esse valor para todos os procedimentos da guia
5. Filtrar os registros:
   - manter apenas os procedimentos cujo CRM e papel correspondem ao usuário logado