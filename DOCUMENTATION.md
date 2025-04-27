
# MedCheck - Documentação Completa

## Visão Geral do Projeto

MedCheck é uma aplicação web desenvolvida para médicos e profissionais de saúde que visa simplificar o processo de auditoria de pagamentos médicos. A aplicação permite que os usuários façam upload de documentos como guias médicas e demonstrativos de pagamento, compare os valores recebidos com tabelas de referência, e identifique possíveis divergências nos pagamentos.

## Arquitetura do Sistema

### Frontend
- **Tecnologia Principal**: React com TypeScript e Vite
- **UI/Design**: Tailwind CSS combinado com shadcn/ui para componentes consistentes
- **Roteamento**: React Router v6
- **Gerenciamento de Estado**: 
  - React Query para dados da API
  - Context API para estados globais (autenticação, tema)
  - useState para estados locais de componentes
- **Formulários**: React Hook Form com validação Zod
- **Visualização de Dados**: Recharts para gráficos
- **Notificações**: Sistema de toast com Sonner

### Backend (Supabase)
- **Banco de Dados**: PostgreSQL gerenciado pelo Supabase
- **Autenticação**: Sistema nativo do Supabase
- **Armazenamento**: Supabase Storage para arquivos
- **Edge Functions**: Para processamento de dados e lógica de negócio
  - uploadGuide: Processa uploads de guias médicas
  - uploadDemonstrative: Processa uploads de demonstrativos de pagamento
  - generate-contestation: Gera documentos de contestação para divergências
- **Row-Level Security (RLS)**: Políticas para controle de acesso aos dados
- **Procedimentos Armazenados**: Funções PostgreSQL para lógica no banco de dados

### Integração Frontend-Backend
- Cliente Supabase para JavaScript
- Tipagem forte com TypeScript para todas as interações com o banco
- React Query para gerenciar estado dos dados e cache

## Estrutura de Arquivos

```
src/
  ├── components/       # Componentes reutilizáveis 
  │   ├── ui/           # Componentes de UI base (shadcn)
  │   ├── dashboard/    # Componentes do dashboard
  │   ├── audit/        # Componentes de auditoria
  │   ├── about/        # Componentes da página sobre
  │   ├── history/      # Componentes da página de histórico
  │   ├── profile/      # Componentes da página de perfil
  │   ├── onboarding/   # Componentes do processo de onboarding
  │   ├── comparison/   # Componentes da página de comparativo
  │   ├── settings/     # Componentes da página de configurações
  │   └── upload/       # Componentes de upload de documentos
  ├── contexts/         # Contextos React (AuthContext, etc)
  │   └── auth/         # Contexto de autenticação
  ├── hooks/            # Custom hooks
  │   ├── profile/      # Hooks relacionados ao perfil
  │   └── use-*.ts      # Outros hooks específicos
  ├── integrations/     # Integrações com serviços externos
  │   └── supabase/     # Cliente e tipos do Supabase
  ├── lib/              # Funções utilitárias
  ├── pages/            # Páginas da aplicação
  ├── services/         # Serviços para lógica de negócio
  │   ├── analysis/     # Serviços para análise de dados
  │   └── upload/       # Serviços para upload de arquivos
  ├── types/            # Definições de tipos TypeScript
  └── utils/            # Utilitários diversos
      └── supabase/     # Helpers para Supabase
```

## Backend (Supabase)

### Estrutura do Banco de Dados
O banco de dados é estruturado para suportar as seguintes funcionalidades chave:

#### Tabelas Principais
1. **profiles**: Dados do perfil do usuário
   - Vinculado à tabela `auth.users` do Supabase
   - Armazena preferências, especialidade médica, CRM, etc.
   - Controla status de onboarding e trial

2. **analysis_results**: Resultados de análises de documentos
   - Armazena informações sobre cada análise realizada
   - Vinculada ao usuário que realizou a análise
   - Contém resumo dos resultados (valorCBHPM, valorPago, diferença)

3. **procedures**: Procedimentos médicos de cada análise
   - Detalhes dos procedimentos identificados
   - Valores CBHPM, valores pagos, diferenças
   - Metadados como guia, beneficiário, papel do médico

4. **guides**: Guias médicas cadastradas
   - Dados da guia como número, hospital, data de execução
   - Vínculo com o usuário que cadastrou a guia

5. **demonstrativos**: Dados de pagamentos recebidos
   - Valores pagos para cada procedimento
   - Vínculo com a guia e o usuário

6. **contestations**: Contestações geradas para divergências
   - Textos de contestação para procedimentos subpagos
   - Status de acompanhamento da contestação

#### Views
1. **v_payment_audit**: Visão que combina dados de guias, demonstrativos e CBHPM
   - Facilita a análise comparativa entre valores esperados e recebidos
   - Cálculo automático de diferenças e status de pagamento

### Row-Level Security (RLS)
Políticas de segurança implementadas para garantir que:
- Usuários só possam acessar seus próprios dados
- Análises, procedimentos e uploads são protegidos por usuário
- Dados sensíveis são acessíveis apenas aos donos

### Edge Functions
1. **uploadGuide**: Processamento de uploads de guias médicas
2. **uploadDemonstrative**: Processamento de uploads de demonstrativos
3. **generate-contestation**: Geração de documentos de contestação
4. **process-analysis**: Análise e extração de dados dos documentos
5. **get-analysis**: Recuperação de análises armazenadas
6. **generate-report**: Geração de relatórios personalizados
7. **generate-compare**: Geração de comparativos detalhados

### Funções do Banco
1. **update_onboarding_status**: Atualiza o status de onboarding do usuário
2. **create_profile_for_user**: Cria perfil automaticamente para novos usuários
3. **get_dashboard_stats**: Gera estatísticas para o dashboard
4. **check_trial_status**: Verifica status da versão de teste
5. **process_subscription_payment**: Processa pagamentos de assinaturas

## Fluxos de Usuário Principais

### Onboarding
1. Usuário registra-se na plataforma
2. Completa informações do perfil (CRM, especialidade)
3. Visualiza tour guiado das funcionalidades
4. Recebe confirmação de ativação do período de teste

### Upload e Análise
1. Usuário acessa página de uploads
2. Faz upload de guia médica e/ou demonstrativo
3. Sistema processa os documentos (edge function)
4. Resultados são exibidos com comparação CBHPM
5. Análise é salva no histórico

### Auditoria de Pagamentos
1. Usuário acessa página de análise de guia
2. Visualiza comparativo entre valores esperados (CBHPM) e recebidos
3. Identifica procedimentos pagos abaixo do valor esperado
4. Seleciona procedimentos para contestação
5. Gera documento de contestação automático

### Comparativo de Pagamentos
1. Usuário seleciona análise no histórico
2. Acessa página de comparativo detalhado
3. Visualiza procedimentos agrupados por papel médico
4. Identifica divergências entre valor pago e CBHPM
5. Pode exportar dados para contestação

### Gerenciamento de Contestações
1. Usuário identifica procedimentos subpagos
2. Seleciona procedimentos para contestação
3. Sistema gera documento formal de contestação
4. Usuário acompanha status das contestações
5. Recebe notificações sobre atualizações de status

## Integração Frontend-Backend

### Cliente Supabase
Configurado em `src/integrations/supabase/client.ts` com:
- Persistência de sessões
- Atualização automática de tokens
- Detecção de sessão na URL
- Headers globais

### Helpers de Supabase
Implementados em `src/utils/supabase/`:
- Funções tipadas para operações comuns
- Extração segura de dados
- Gerenciamento de perfis
- Tratamento de tickets e mensagens
- Funções de acesso a artigos e análises

## Processo de Autenticação

### Fluxo de Login/Registro
1. Usuário acessa página de login ou registro
2. Insere credenciais (email/senha ou provedor OAuth)
3. AuthContext valida e armazena a sessão
4. Roteamento condicional baseado em autenticação
5. PrivateRoute protege rotas que exigem autenticação

### Gerenciamento de Sessão
- Verificação automática de sessão existente
- Listeners para mudanças de estado de autenticação
- Armazenamento local para persistência de sessão
- Lógica de redirecionamento para rotas protegidas

## Responsividade e UI/UX

### Estratégia de Responsividade
- Design mobile-first com Tailwind CSS
- Breakpoints consistentes para diferentes tamanhos de tela
- Componentes adaptáveis que reorganizam conforme o espaço
- Menu lateral colapsável em dispositivos móveis

### Componentes de UI
- Shadcn/UI como base para componentes consistentes
- Paleta de cores profissional para ambientes médicos
- Componentes acessíveis e testáveis
- Sistema de tema claro/escuro

## Manutenção e Desenvolvimento

### Boas Práticas
- Componentização para facilitar manutenção
- Hooks personalizados para lógica reutilizável
- Tipagem forte com TypeScript
- Comentários em seções críticas do código
- Estrutura de pasta organizada por domínio

### Próximos Passos
1. Implementar integração com sistemas hospitalares
2. Adicionar reconhecimento OCR mais avançado
3. Expandir relatórios e dashboards analíticos
4. Desenvolver aplicativo móvel complementar
5. Implementar recursos de colaboração entre médicos

## Ambiente e Deployment

### Requisitos
- Node.js 18+ e npm 8+
- Acesso ao projeto Supabase
- Chaves e URLs de API configuradas

### Deployment
- Configuração de CI/CD para deploy automático
- Ambientes de staging e produção
- Backups regulares do banco de dados
- Monitoramento de Edge Functions

## Segurança

### Medidas Implementadas
- Autenticação JWT via Supabase Auth
- Row-Level Security para proteção de dados
- Validação de entrada com Zod
- Verificação de CRM contra registros de usuário
- Armazenamento seguro de chaves API
- CORS configurado corretamente nas Edge Functions

## Considerações Finais

O MedCheck foi arquitetado como uma aplicação robusta e escalável, com foco na experiência do usuário médico e na segurança dos dados. A combinação de React no frontend e Supabase no backend proporciona um desenvolvimento ágil sem comprometer a qualidade ou segurança.

Para desenvolvedores que estão começando a trabalhar com este projeto, recomenda-se familiarizar-se primeiro com a estrutura de arquivos e os principais componentes, bem como entender a arquitetura do banco de dados Supabase e as políticas de segurança implementadas.
