
# MedCheck: Sistema de Auditoria Médica

## Descrição do Projeto

O MedCheck é um sistema de auditoria médica desenvolvido para automatizar a comparação entre guias TISS e demonstrativos de pagamento. O sistema permite o upload de arquivos PDF, extrai informações relevantes, e realiza uma análise comparativa para identificar divergências entre os valores esperados (baseados na tabela CBHPM) e os valores efetivamente pagos.

## Tecnologias Utilizadas

- **Frontend**: React, TypeScript, Tailwind CSS, Shadcn/UI
- **Backend**: Supabase (banco de dados, autenticação, armazenamento)
- **Edge Functions**: Processamento de arquivos e análise de dados
- **Bibliotecas**: jsPDF, XLSX, date-fns, lucide-react

## Estrutura do Projeto

### Principais Diretórios

- `src/components`: Componentes React reutilizáveis
- `src/pages`: Páginas da aplicação
- `src/services`: Serviços para interação com APIs e lógica de negócio
- `src/hooks`: Hooks personalizados para gerenciamento de estado
- `src/contexts`: Contextos globais da aplicação
- `src/utils`: Funções utilitárias
- `src/types`: Definições de tipos TypeScript
- `src/data`: Dados estáticos

### Backend (Supabase)

- **Storage**: Armazenamento de arquivos PDF
- **Database**: Tabelas para usuários, análises, procedimentos
- **Edge Functions**: Processamento de arquivos e extração de dados

## Fluxo Principal da Aplicação

1. **Upload de Documentos**
   - Usuário faz upload de PDFs de guias e demonstrativos
   - Frontend valida os arquivos antes do envio

2. **Processamento de Arquivos**
   - Arquivos são enviados para o Supabase Storage
   - Edge Function processa os PDFs e extrai dados
   - Simulação da extração OCR para fins de demonstração

3. **Análise Comparativa**
   - Sistema compara valores CBHPM com valores pagos
   - Identifica procedimentos glosados ou pagos parcialmente
   - Calcula diferenças e totais

4. **Visualização de Resultados**
   - Exibição dos resultados em tabela comparativa
   - Destaque visual para divergências
   - Opções para exportação em PDF ou Excel

5. **Histórico de Análises**
   - Armazenamento de resultados para consulta futura
   - Filtragem e busca no histórico
   - Exportação de relatórios

## Componentes Principais

### Upload e Processamento

- `UploadSection`: Gerencia o processo de upload de arquivos
- `FileDropZone`: Interface para arrastar e soltar arquivos
- `ProcessingSection`: Exibe feedback do processamento em tempo real

### Visualização de Resultados

- `ComparisonView`: Exibe o comparativo entre guia e demonstrativo
- `ProceduresTable`: Tabela detalhada de procedimentos e valores
- `ComparisonSummary`: Resumo dos totais e divergências

### Histórico

- `HistoryTable`: Exibe histórico de análises realizadas
- `HistorySearch`: Interface para busca e filtros no histórico

## Serviços

### Serviços de Upload

- `edgeService.ts`: Comunicação com Edge Functions
- `storageService.ts`: Gerenciamento de arquivos no Supabase Storage
- `analysisService.ts`: Gerenciamento dos dados de análise

### Serviços de Histórico

- `historyService.ts`: Busca e filtro de registros históricos
- `exportService.ts`: Exportação de dados para Excel e PDF

## Modelos de Dados

### Tabelas do Banco de Dados

1. **profiles**
   - Dados do perfil do usuário (nome, CRM, etc.)

2. **uploads**
   - Registro de arquivos enviados (guias e demonstrativos)
   - Metadados de processamento

3. **analysis_results**
   - Resultados das análises realizadas
   - Resumo dos totais e divergências

4. **procedures**
   - Detalhes dos procedimentos analisados
   - Valores CBHPM, valores pagos, diferenças

5. **analysis_history**
   - Histórico resumido de análises para a interface

6. **CBHPM2015**
   - Tabela de referência com códigos e valores CBHPM 2015

## Autenticação e Segurança

- Sistema de login e registro via Supabase Auth
- Políticas RLS (Row Level Security) para restringir acesso aos dados
- Cada usuário só visualiza seus próprios dados
- Tokens JWT para autenticação nas requisições

## Funcionalidade de Onboarding

- Tour introdutório para novos usuários
- Preferências persistidas no perfil do usuário
- Opção para reiniciar o tour quando necessário

## Requisitos de Sistema

- Node.js 16+
- NPM ou Yarn
- Conta no Supabase para backend

## Instruções para Desenvolvimento

### Configuração Inicial

1. Clone o repositório
2. Instale dependências: `npm install` ou `yarn`
3. Configure variáveis de ambiente:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`

### Scripts Disponíveis

- `npm run dev`: Inicia servidor de desenvolvimento
- `npm run build`: Compila aplicação para produção
- `npm run lint`: Executa verificação de linting
- `npm run test`: Executa testes

## Débitos Técnicos e Próximos Passos

1. **OCR Real**: Implementar extração de texto real dos PDFs usando Tesseract ou serviços de OCR
2. **Sistema de Contestação**: Adicionar fluxo para contestação de glosas
3. **Dashboard Analítico**: Criar painéis com métricas e gráficos de desempenho
4. **Integração com ANS**: Conformidade com padrões da Agência Nacional de Saúde
5. **Testes Automatizados**: Implementar testes unitários e de integração

## Estrutura de Rotas

- `/`: Página inicial pública
- `/login`: Autenticação de usuário
- `/register`: Registro de novo usuário
- `/forgot-password`: Recuperação de senha
- `/dashboard`: Dashboard principal (autenticado)
- `/nova-auditoria`: Upload e processamento de arquivos
- `/compare`: Visualização detalhada de uma análise
- `/historico`: Histórico de análises anteriores
- `/ajuda`: Documentação e suporte
- `/profile`: Gerenciamento de perfil e preferências

## Contato e Suporte

Para questões técnicas ou suporte, entre em contato com a equipe de desenvolvimento através do sistema de help desk integrado ou pelo email suporte@medcheck.com.br.

## Licenciamento

Todos os direitos reservados. Este sistema é propriedade da MedCheck e seu uso não autorizado é estritamente proibido.
