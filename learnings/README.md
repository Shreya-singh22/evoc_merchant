# Learnings & Documentation

This folder contains accumulated knowledge about the project.

## Quick Links

| Document | Description |
|----------|-------------|
| [Onboarding Guide](./onboarding.md) | Setup, local dev, production deployment |
| [PayU Integration](./payu-integration.md) | PayU checkout integration gotchas |

## Quick Reference

### Key Environment Variables

```env
# Database (PostgreSQL 14+)
DATABASE_URL=

# PayU (server-side only, never expose to client)
PAYU_KEY=
PAYU_SALT=

# OTP (2Factor.in)
TWO_FACTOR_API_KEY=
```

### Critical Paths

| Path | Purpose |
|------|---------|
| `/checkout-mock` | Main checkout flow |
| `/api/payu/callback` | PayU payment callback |
| `/api/mock-checkout/*` | Mock checkout API routes |

### Prisma Commands

```bash
npx prisma generate   # Generate client
npx prisma db push     # Push schema to DB
npx prisma migrate     # Run migrations
npx prisma studio      # GUI for database
```

### Build & Deploy

```bash
npm run build          # Production build
npm run dev            # Development
vercel --prod          # Production deploy
```