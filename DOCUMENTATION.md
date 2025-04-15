
# MedCheck - Documentação Completa

## Visão Geral do Projeto

MedCheck é uma aplicação web desenvolvida para médicos e profissionais de saúde que visa simplificar o processo de auditoria de pagamentos médicos. A aplicação permite que os usuários façam upload de documentos como guias médicas e demonstrativos de pagamento, compare os valores recebidos com tabelas de referência, e identifique possíveis divergências nos pagamentos.

## Tecnologias Utilizadas

- **Frontend**: React, TypeScript, Vite
- **UI/Design**: Tailwind CSS, shadcn/ui
- **Roteamento**: React Router
- **Gerenciamento de Estado**: React Query
- **Ícones**: Lucide React
- **Formulários**: React Hook Form
- **Validação**: Zod
- **Gráficos**: Recharts
- **Notificações**: Sonner

## Estrutura de Arquivos

```
src/
  ├── components/       # Componentes reutilizáveis 
  │   ├── ui/           # Componentes de UI base (shadcn)
  │   ├── history/      # Componentes relacionados à página de histórico
  │   ├── profile/      # Componentes relacionados à página de perfil
  │   ├── reports/      # Componentes relacionados à página de relatórios
  │   ├── settings/     # Componentes relacionados à página de configurações
  │   └── upload/       # Componentes relacionados ao upload de documentos
  ├── hooks/            # Custom hooks
  ├── lib/              # Funções utilitárias
  ├── pages/            # Páginas da aplicação
  └── data/             # Dados estáticos ou mocks
```

## Páginas da Aplicação

### 1. Página Inicial (`/`)
- Página de apresentação do MedCheck, com informações sobre o serviço
- Permite navegação para Login, Registro e Preços
- Componente: `src/pages/Index.tsx`

### 2. Login (`/login`)
- Página de autenticação dos usuários
- Formulário com email e senha
- Componente: `src/pages/Login.tsx`

### 3. Registro (`/register`)
- Página para novos usuários criarem uma conta
- Formulário de cadastro com dados pessoais e profissionais
- Componente: `src/pages/Register.tsx`

### 4. Dashboard (`/dashboard`)
- Visão geral das atividades do usuário
- Gráficos, métricas e indicadores importantes
- Acesso rápido às principais funcionalidades
- Componente: `src/pages/Dashboard.tsx`

### 5. Upload de Documentos (`/uploads`)
- Interface para envio de guias médicas e demonstrativos de pagamento
- Processamento e análise dos documentos enviados
- Comparação de valores
- Componente: `src/pages/Uploads.tsx`

### 6. Histórico de Análises (`/history`)
- Listagem de todas as análises realizadas anteriormente
- Filtros por tipo, status, período, etc.
- Visualização detalhada dos resultados
- Componente: `src/pages/History.tsx`

### 7. Relatórios (`/reports`)
- Relatórios detalhados sobre pagamentos, procedimentos, operadoras, etc.
- Gráficos e tabelas para análise visual
- Opções para exportar dados
- Componente: `src/pages/Reports.tsx`

### 8. Planos e Preços (`/pricing`)
- Informações sobre os planos disponíveis
- Comparação de recursos entre planos
- Funcionalidade para assinatura
- Componente: `src/pages/Pricing.tsx`

### 9. Perfil do Usuário (`/profile`)
- Informações do perfil do médico
- Resumo de atividades
- Especialidades registradas
- Operadoras mais frequentes
- Componente: `src/pages/Profile.tsx`

### 10. Configurações (`/settings`)
- Gerenciamento de informações do perfil
- Preferências de notificações
- Configuração de tabelas de referência
- Componente: `src/pages/Settings.tsx`

### 11. Ajuda (`/help`)
- FAQ e recursos de suporte
- Tutoriais e guias
- Componente: `src/pages/Help.tsx`

### 12. Contato (`/contact`)
- Formulário de contato
- Informações para suporte
- Componente: `src/pages/Contact.tsx`

### 13. Sobre (`/about`)
- Informações sobre a empresa/plataforma
- Componente: `src/pages/About.tsx`

## Componentes Principais

### Navegação

#### 1. Navbar (`src/components/Navbar.tsx`)
- Barra de navegação superior
- Muda dependendo do estado de autenticação do usuário
- Links para as principais seções do site

#### 2. SideNav (`src/components/SideNav.tsx`)
- Menu lateral para navegação entre as principais funcionalidades
- Visível apenas para usuários autenticados
- Agrupa funcionalidades por categorias
- Inclui seções:
  - Principal (Dashboard, Uploads, Histórico, Relatórios, Planos)
  - Notificações
  - Conta (Perfil, Configurações)
  - Ajuda
  - Sair

### Autenticação

#### 1. LoginForm (`src/components/LoginForm.tsx`)
- Formulário de login com validação
- Opções para lembrar usuário e recuperar senha

#### 2. RegisterForm (`src/components/RegisterForm.tsx`)
- Formulário de cadastro completo
- Validação de dados e termos de uso

### Dashboard

#### 1. Dashboard (`src/components/Dashboard.tsx`)
- Visão geral das métricas e atividades
- Componentes de resumo

### Upload

#### 1. UploadSection (`src/components/UploadSection.tsx`)
- Interface para upload de documentos
- Suporte para guias médicas e demonstrativos de pagamento
- Controle de progresso e status do upload

#### 2. FileDropZone (`src/components/upload/FileDropZone.tsx`)
- Área para arrastar e soltar arquivos
- Seletor de tipo de documento (guia ou demonstrativo)

#### 3. FileList (`src/components/upload/FileList.tsx`)
- Lista de arquivos selecionados
- Opção para remover arquivos

#### 4. UploadProgress (`src/components/upload/UploadProgress.tsx`)
- Barra de progresso para uploads
- Indicação visual do status

#### 5. ComparisonView (`src/components/ComparisonView.tsx`)
- Visualização comparativa dos valores encontrados
- Detecção de divergências entre o pago e o esperado

### Histórico

#### 1. HistorySearch (`src/components/history/HistorySearch.tsx`)
- Busca e filtros para o histórico de análises

#### 2. HistoryTable (`src/components/history/HistoryTable.tsx`)
- Tabela de análises realizadas
- Ordenação e paginação

#### 3. StatusBadge (`src/components/history/StatusBadge.tsx`)
- Indicador visual do status das análises

### Relatórios

#### 1. ReportsHeader (`src/components/reports/ReportsHeader.tsx`)
- Cabeçalho com filtros de período e outros controles

#### 2. StatusCardsSection (`src/components/reports/StatusCardsSection.tsx`)
- Cards com métricas principais

#### 3. OverviewCharts (`src/components/reports/OverviewCharts.tsx`)
- Gráficos e visualizações de dados

#### 4. HospitalsTable (`src/components/reports/HospitalsTable.tsx`)
- Tabela com informações por hospital/clínica

### Perfil

#### 1. ProfileSidebar (`src/components/profile/ProfileSidebar.tsx`)
- Sidebar com dados do usuário
- Foto, nome, especialidade e CRM

#### 2. ProfileTabs (`src/components/profile/ProfileTabs.tsx`)
- Abas para diferentes seções do perfil

#### 3. ActivitySummary (`src/components/profile/ActivitySummary.tsx`)
- Resumo de atividades
- Operadoras frequentes
- Especialidades registradas
- Métricas de uso

### Configurações

#### 1. ProfileSettings (`src/components/settings/ProfileSettings.tsx`)
- Formulário para edição de dados do perfil
- Configurações de conta

#### 2. NotificationsSettings (`src/components/settings/NotificationsSettings.tsx`)
- Preferências de notificações por email e SMS

#### 3. ReferenceTablesSettings (`src/components/settings/ReferenceTablesSettings.tsx`)
- Configuração das tabelas de referência para análise de pagamentos

## Hooks Personalizados

### 1. useProfile (`src/hooks/use-profile.ts`)
- Gerencia dados do perfil do usuário
- Funções para atualizar perfil, preferências de notificação, etc.

### 2. useTheme (`src/hooks/use-theme.tsx`)
- Controla o tema da aplicação (claro/escuro)

### 3. useMobile (`src/hooks/use-mobile.tsx`)
- Detecta se o dispositivo é mobile para ajustes de layout

### 4. useToast (`src/hooks/use-toast.ts`)
- Interface para mostrar notificações toast

## Fluxos de Usuário Principais

### 1. Fluxo de Autenticação
- Usuário acessa a página inicial
- Navega para login ou registro
- Após autenticação, é direcionado ao Dashboard

### 2. Fluxo de Análise de Documentos
- Usuário acessa a página de Upload
- Seleciona e faz upload dos arquivos (guias e demonstrativos)
- O sistema processa os arquivos e exibe comparação
- Os resultados são salvos no histórico

### 3. Fluxo de Visualização de Relatórios
- Usuário acessa a página de Relatórios
- Seleciona filtros desejados
- Visualiza os dados em formato de tabelas e gráficos
- Pode exportar os relatórios, se necessário

### 4. Fluxo de Gerenciamento de Perfil
- Usuário acessa a página de Perfil
- Visualiza suas informações e estatísticas
- Pode navegar para Configurações para editar dados

## Integração de Dados

O sistema utiliza React Query para gerenciamento de estado e comunicação com APIs. Atualmente, os dados são simulados, mas a estrutura está preparada para integração com uma API real.

### Principais Fontes de Dados
1. **Dados do Usuário**: Perfil, preferências, configurações
2. **Análises**: Resultados do processamento de documentos
3. **Histórico**: Registro de todas as análises realizadas
4. **Tabelas de Referência**: Valores padrão para comparação de pagamentos

## Componentes de UI

A aplicação utiliza componentes do shadcn/ui, que é uma coleção de componentes React reutilizáveis construídos com Radix UI e estilizados com Tailwind CSS.

Principais componentes UI utilizados:
- Card, CardContent, CardHeader, CardTitle
- Button
- Badge
- Input, Textarea, Select, Checkbox
- Form (React Hook Form)
- Tabs
- Dialog
- Toast
- Sheet (menu lateral móvel)
- Avatar
- Tooltips
- Skeleton (loading states)
- etc.

## Gerenciamento de Estado

1. **Estado Local**: Gerenciado via React useState para componentes específicos
2. **Estado Global da API**: Gerenciado via React Query para dados da API
3. **Estado de Tema**: Gerenciado via ThemeProvider

## Responsividade

A aplicação é totalmente responsiva, adaptando-se a diferentes tamanhos de tela:
- Em dispositivos móveis, o menu lateral é substituído por um menu hamburger
- Componentes se reorganizam para se adequar ao espaço disponível
- Media queries do Tailwind são usadas para ajustar layouts (md:, lg:, etc.)

## Próximos Passos e Possíveis Melhorias

1. **Autenticação Real**: Implementar um sistema de autenticação completo
2. **Backend**: Integrar com um backend real para armazenamento e processamento de dados
3. **OCR**: Adicionar reconhecimento óptico de caracteres para extração automática de dados de PDFs
4. **Exportação de Dados**: Adicionar funcionalidades para exportação em diferentes formatos
5. **Integrações**: Conectar com sistemas de gestão médica e hospitalar
6. **Notificações Push**: Implementar notificações em tempo real
7. **Dashboard Personalizado**: Permitir que o usuário customize seu dashboard
8. **App Mobile**: Desenvolver uma versão mobile nativa

## Considerações para Desenvolvimento

1. **Manter a Consistência de UI**: Seguir os padrões estabelecidos para componentes UI
2. **Componentização**: Continuar dividindo componentes grandes em unidades menores e reutilizáveis
3. **TypeScript**: Garantir tipagem correta em todas as adições
4. **Testes**: Adicionar testes para garantir a estabilidade da aplicação
5. **Performance**: Monitorar o desempenho, especialmente em operações pesadas como upload de arquivos
6. **Acessibilidade**: Garantir que todos os novos componentes sigam as diretrizes de acessibilidade

## Conclusão

O MedCheck é uma aplicação robusta para auditoria de pagamentos médicos, oferecendo uma interface moderna e funcional para que médicos e profissionais de saúde identifiquem e recuperem valores pagos incorretamente pelas operadoras de saúde. A arquitetura do projeto é modular e extensível, permitindo fácil manutenção e adição de novas funcionalidades.
