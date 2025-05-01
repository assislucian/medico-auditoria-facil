# Validador de Demonstrativos e Guias Médicas (CBHPM)

## Visão Geral

Este projeto é um validador automatizado de demonstrativos de pagamento e guias médicas, pronto para uso nacional por médicos de qualquer especialidade. Ele compara os procedimentos extraídos de PDFs de demonstrativos e guias com a tabela CBHPM2015, garantindo precisão, transparência e robustez para auditoria e conferência de honorários.

## Funcionalidades

- Extração automática de procedimentos de demonstrativos e guias em PDF
- Validação cruzada com a tabela CBHPM (qualquer código/procedimento)
- Relatórios de diferenças financeiras, glosas e inconsistências
- Pronto para múltiplos layouts e operadoras
- Testes automatizados para garantir robustez

## Instalação

1. Clone o repositório:

   ```bash
   git clone <repo-url>
   cd backend_test
   ```

2. Crie e ative um ambiente virtual (opcional, mas recomendado):

   ```bash
   python3 -m venv venv
   source venv/bin/activate
   ```

3. Instale as dependências:

   ```bash
   pip install -r requirements.txt
   ```

## Estrutura dos Arquivos de Entrada

- **CBHPM**: `data/cbhpm/CBHPM2015_v1.xlsx`
  - Colunas obrigatórias: `codigo`, `procedimento`, `valor_cirurgiao`, `valor_anestesista`, `valor_primeiro_auxiliar`
- **Demonstrativo**: `data/demonstrativos/Demonstrativo-outubro_2024.pdf` (ou outros)
- **Guias**: PDFs em `data/guias/` (ex: `noivana.pdf`, `nubia_katia.pdf`, ...)

## Como Rodar o Pipeline

1. Certifique-se de que os arquivos estejam nas pastas corretas.
2. Execute o pipeline principal:

   ```bash
   python src/main.py
   ```

3. O relatório final será exibido no terminal, incluindo:
   - Total de procedimentos extraídos
   - Diferenças financeiras
   - Amostras dos DataFrames

## Como Rodar os Testes Automatizados

1. Certifique-se de que os arquivos de teste estejam presentes (ou os reais para integração):
2. Execute:

   ```bash
   PYTHONPATH=. pytest -v tests/
   ```

3. Todos os testes devem passar para garantir a integridade do pipeline.

## Como Contribuir

- Fork este repositório e envie um Pull Request
- Adicione exemplos de PDFs de diferentes operadoras/estados para ampliar a robustez
- Escreva testes para novos layouts ou regras de negócio

## Suporte e Contato

- Para dúvidas técnicas, abra uma issue no [GitHub](https://github.com/seudominio/seurepo)
- Para contato comercial ou integração, envie e-mail para: suporte@seudominio.com.br

## Observações

- O parser é facilmente adaptável para novos layouts de PDF
- Pronto para uso nacional, aceitando qualquer código da CBHPM
- Modular e preparado para integração com frontend/API

---

**Desenvolvido para garantir transparência, segurança e autonomia ao médico brasileiro.** 