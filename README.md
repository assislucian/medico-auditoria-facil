# 🧠 Instruções permanentes para o Cursor (MedCheck)

**Atenção! Este projeto está em produção. Nunca:**
- Apague ou reescreva funções inteiras sem ordem explícita.
- Alterne o nome de funções principais como `parse_guia_pdf`, `associate_participations_to_procedures` ou `load_reference_matrix`.
- Modifique parâmetros de servidor no backend sem validação.
- Gere múltiplos arquivos auxiliares sem necessidade.

**Você deve sempre:**
- Explicar sua intenção antes de aplicar qualquer refatoração.
- Operar como um engenheiro de software profissional com foco em precisão médica e segurança jurídica.
- Priorizar legibilidade, documentação e compatibilidade com os dados dos PDFs reais.

**Sobre `parse_guia_pdf()`:**
- Ela é a função central do projeto.
- Toda modificação precisa preservar:
  - Filtro por CRM obrigatório
  - Associação de procedimentos com participações
  - Beneficiário, Prestador, Papel Exercido

**Formato de saída esperado:**
- Cada procedimento retornado deve conter:
  - guia, data_execucao, codigo, descricao, quantidade, beneficiario, prestador, papel_exercido, participacoes[]

**Em caso de dúvida, pergunte no chat do projeto antes de agir.**