
# Development Setup Guide

## Prerequisites

- Node.js 18+
- Docker (for Supabase local development)
- Supabase CLI

## Environment Setup

1. Clone the repository
2. Copy environment template:
   ```bash
   cp .env.example .env
   ```

3. Configure environment variables:
   ```env
   SUPABASE_URL=http://localhost:54321
   SUPABASE_ANON_KEY=your-anon-key
   SUPABASE_DB_URL=postgresql://postgres:postgres@localhost:54322/postgres
   ```

## Supabase Local Setup

1. Start Supabase services:
   ```bash
   supabase start
   ```

2. Run migrations:
   ```bash
   supabase db reset
   ```

3. Load reference data:
   ```bash
   npm run db:seed
   ```

## Development Bootstrap Script

Create `scripts/bootstrap.sh`:
```bash
#!/bin/bash

# Install dependencies
npm install

# Start Supabase
supabase start

# Run migrations
supabase db reset

# Start development server
npm run dev
```

Make it executable:
```bash
chmod +x scripts/bootstrap.sh
```

## Running Tests

```bash
# Run all tests
npm test

# Run specific test file
npm test src/test/smoke/auth.test.ts

# Run with coverage
npm run test:coverage
```

## Common Issues

1. **Supabase connection errors**
   - Ensure Docker is running
   - Check if ports 54321-54326 are available

2. **Type errors**
   - Run `npm run type-check`
   - For strict mode: `npm run type-check:strict`
