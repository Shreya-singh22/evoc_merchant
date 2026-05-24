# Onboarding & Setup Guide

This document covers everything needed to run the project locally and deploy to production.

## Prerequisites

- Node.js 18+
- PostgreSQL 14+
- npm or yarn

## Local Development Setup

### 1. Clone & Install

```bash
git clone <repo-url>
cd evoc-merchant
npm install
```

### 2. Environment Variables

Create `.env.local` in the project root:

```env
# Database (required)
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/evoc_checkout

# PayU (server-side only)
PAYU_KEY=your_merchant_key
PAYU_SALT=your_salt_key

# 2Factor.in OTP (required for real SMS)
TWO_FACTOR_API_KEY=your_2factor_api_key
```

### 3. Database Setup

```bash
# Generate Prisma client
npx prisma generate

# Create database tables
npx prisma db push

# Optional: Open Prisma Studio to view data
npx prisma studio
```

### 4. Start Development Server

```bash
npm run dev
```

The app runs at `http://localhost:3000`. Navigate to `/checkout-mock` to test the checkout flow.

## Testing the Checkout Flow

### Test Data Requirements

Before testing, you'll need:

1. **Add products to the database** — The cart needs products to checkout. Add test products directly via Prisma Studio or create an admin panel.

2. **Configure 2Factor.in** — For OTP to work in production, you need a real 2Factor.in API key. In development/test mode, check server logs for the OTP code (it's returned in the API response for testing).

### Testing Checklist

1. Add a product to cart
2. Go to `/checkout-mock`
3. Enter phone number (10+ digits)
4. OTP is sent — check logs for the code in dev mode
5. Enter OTP to verify
6. Fill in Your Details (name, email)
7. Add a delivery address
8. Select payment method:
   - **COD**: Order created immediately
   - **PayU**: Modal opens → complete payment → order updated

### PayU Test Credentials

For testing PayU in UAT mode, use these test cards:

| Card Number | Expiry | CVV |
|-------------|--------|-----|
| 5123456789012346 | Any future date | Any 3 digits |
| 4916338906587770 | Any future date | Any 3 digits |

UAT gateway: `https://test.payu.in`

## Production Deployment

### Required Changes

#### 1. Environment Variables

**Set these in production (Vercel dashboard or hosting provider):**

```env
# Production PayU keys
PAYU_KEY=your_production_merchant_key
PAYU_SALT=your_production_salt

# Production 2Factor.in key
TWO_FACTOR_API_KEY=your_production_2factor_key

# Production database
DATABASE_URL=postgresql://user:password@prod-host:5432/dbname
```

#### 2. PayU Configuration

In your PayU merchant dashboard, add callback URLs:
- Success: `https://yourdomain.com/api/payu/callback`
- Failure: `https://yourdomain.com/api/payu/callback`

#### 3. Database

Use a production PostgreSQL 14+ instance. Run migrations before deployment:
```bash
npx prisma migrate deploy
# OR
npx prisma db push
```

#### 4. Vercel Deployment

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy (from project root)
vercel

# Set environment variables in Vercel dashboard
vercel env add DATABASE_URL
vercel env add PAYU_SALT
vercel env add TWO_FACTOR_API_KEY
# etc.

# Production deploy
vercel --prod
```

### Production Checklist

- [ ] Production PayU keys configured
- [ ] Production 2Factor.in API key
- [ ] Production database (not local)
- [ ] `npx prisma migrate deploy` run
- [ ] Callback URLs added to PayU dashboard
- [ ] HTTPS enabled (required by PayU)

## External Services

### PayU
- Dashboard: https://onboarding.payu.in
- Sandbox available for testing
- Requires HTTPS in production

### 2Factor.in
- Dashboard: https://2factor.in
- Pay-per-SMS pricing
- In dev mode, check server logs for OTP codes instead of SMS

## Troubleshooting

### PayU Issues

**"429 Too Many Requests"**:
- Script loaded multiple times
- Clear browser cache
- Check only one PayU script tag in layout.tsx

**"Hyphen-DNE" error**:
- Transaction ID has hyphens
- Use alphanumeric IDs (Prisma CUID works)

**Payment shows as FAILED but was successful**:
- Wrong response path — check `boltResponse.response.status`
- Hash mismatch — verify hash format for callbacks

### Database Issues

**Connection refused**:
- PostgreSQL not running → `pg_ctl start` or restart service
- Wrong DATABASE_URL format
- Firewall blocking port 5432

**Tables not found**:
- Run `npx prisma db push`
- Check DATABASE_URL points to correct database

### OTP Issues

**OTP not sending**:
- Check TWO_FACTOR_API_KEY is set
- Check API key has credits
- Check phone number format (+91 prefix)

**OTP always invalid**:
- Check sessionId matches
- OTP expires after 5 minutes
- Rate limiting (max 5 OTP/hour)

## Architecture Summary

```
┌─────────────────────────────────────────────────────────────┐
│                        Frontend                              │
│  /checkout-mock ─── /checkout-mock/success ─── /track-order │
└──────────────────────────┬──────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                    API Routes (Server Actions)               │
│  /api/payu/callback ─── /api/mock-checkout/*                │
└──────────────────────────┬──────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                      PostgreSQL                               │
│  Users ── Orders ── Addresses ── OtpVerification            │
└─────────────────────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                    External Services                         │
│  PayU (payments) ─── 2Factor.in (OTP SMS)                   │
└─────────────────────────────────────────────────────────────┘
```