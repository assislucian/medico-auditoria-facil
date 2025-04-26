
# MedCheck 🏥

[![CI](https://github.com/username/medcheck/actions/workflows/ci.yml/badge.svg)](https://github.com/username/medcheck/actions/workflows/ci.yml)

Automated medical billing audit system that helps doctors recover underpaid procedures by comparing payments with CBHPM reference values.

```
┌─────────────┐     ┌──────────┐     ┌───────────┐
│   Upload    │────>│ Analysis │────>│ Reporting │
│   Module    │     │ Engine   │     │  Module   │
└─────────────┘     └──────────┘     └───────────┘
       ▲                  │                 │
       │                  v                 v
┌─────────────┐     ┌──────────┐     ┌───────────┐
│  Document   │     │ Database │<────│  Export   │
│ Processing  │     │          │     │  Module   │
└─────────────┘     └──────────┘     └───────────┘
```

## Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Run tests
npm test

# Type check
npm run type-check
```

## Commands

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run test` - Run tests
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript checks
- `npm run type-check:strict` - Run strict TypeScript checks

## Environment Setup

1. Copy `.env.example` to `.env`
2. Configure Supabase credentials
3. Start Supabase: `npm run supabase:start`
4. Run migrations: `npm run db:migrate`

See [DEV_SETUP.md](./DEV_SETUP.md) for detailed setup instructions.

## Architecture

See [ARCHITECTURE.md](./ARCHITECTURE.md) for detailed architecture documentation.

## License

MIT © MedCheck
