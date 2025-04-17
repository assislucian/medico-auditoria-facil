
# Médico Auditoria Fácil - Backend

Este diretório contém toda a infraestrutura de backend do aplicativo Médico Auditoria Fácil.

## Estrutura

- `/config` - Configuração de ambiente e cliente Supabase
- `/migrations` - Arquivos SQL de migração para setup do banco
- `/models` - Definições de tipo TypeScript e schemas Zod
- `/services` - Lógica de negócio e acesso a dados 
- `/functions` - Edge Functions do Supabase
- `/utils` - Funções auxiliares (logger, errorHandler, exportService)
- `/tests` - Testes unitários e de integração

## Desenvolvimento

### Requisitos

- Node.js 18+
- npm 8+
- CLI do Supabase (para deployment de Edge Functions)

### Configuração

1. Crie um arquivo `.env` na raiz do diretório `/backend` com as variáveis:

```
SUPABASE_URL=https://yzrovzblelpnftlegczx.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=your_service_key_here
```

2. Instale as dependências:

```
cd backend
npm install
```

### Executando migrações

Para aplicar as migrações ao banco de dados:

```
npm run migrate
```

### Implantando Edge Functions

Para implantar as Edge Functions:

```
npm run deploy:functions
```

### Executando testes

```
npm test
```

## Integração com o Frontend

O backend é projetado para trabalhar perfeitamente com o frontend existente. Os serviços principais incluem:

- Processamento de uploads de arquivos (guias TISS e demonstrativos)
- Extração de dados usando técnicas de parsing
- Comparação de valores com tabela CBHPM
- Armazenamento e recuperação de análises
- Geração de relatórios e exportação para Excel

## Segurança

- Autenticação JWT via Supabase Auth
- Row-Level Security (RLS) para garantir que usuários acessem apenas seus próprios dados
- Validação de entrada com Zod
- Verificação de CRM contra registros de usuário

## CI/CD

Os workflows do GitHub Actions estão configurados para:

1. Executar lint e testes a cada push
2. Implantar Edge Functions automaticamente em merges para `main`

## Serviços

### uploadService
Gerencia upload de arquivos e processamento inicial.

### processingService
Extrai dados dos arquivos e processa informações de procedimentos.

### databaseService
Gerencia persistência e recuperação de dados no Supabase.

### reportService
Gera relatórios e análises baseados nos dados processados.

### historyService
Gerencia o histórico de análises do usuário.

### exportService
Exporta dados para formatos Excel.
