
# MedCheck Architecture

## Folder Structure

```
src/
├── components/     # Reusable UI components
│   ├── ui/        # Basic UI elements
│   └── layout/    # Layout components
├── contexts/      # React contexts
├── hooks/         # Custom hooks
├── integrations/  # External service integrations
├── lib/          # Utility functions
├── pages/        # Page components
├── services/     # Business logic services
├── test/         # Test files
└── types/        # TypeScript definitions

supabase/
├── functions/    # Edge functions
└── migrations/   # Database migrations
```

## Core Modules

- **Authentication** (`contexts/auth/`): User authentication and session management
- **Upload** (`components/upload/`): File upload and validation
- **Analysis** (`services/analysis/`): Document processing and payment analysis
- **Reporting** (`services/reports/`): Analysis results and exports
- **Database** (`integrations/supabase/`): Data persistence layer

## Data Flow

1. **Document Upload**
   - User uploads PDF files
   - Files are validated and stored in Supabase Storage
   - Processing queue is triggered

2. **Analysis Process**
   - Documents are processed to extract procedures
   - Payments are compared with CBHPM reference values
   - Results are stored in database

3. **Reporting**
   - Users can view analysis results
   - Generate reports and exports
   - Track payment recovery progress

## Technology Stack

- React + TypeScript
- Supabase (Auth, Database, Storage, Edge Functions)
- Vite + Vitest
- shadcn/ui + Tailwind CSS
