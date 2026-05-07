# Orbit-360 · Gauthami Backend Scope

Node.js + Express 5 | PostgreSQL via Prisma 4 | MongoDB via Mongoose | Redis via ioredis | BullMQ

---

## 📁 Project Structure

```
orbit-360/
├── prisma/
│   └── schema.prisma
├── src/
│   ├── config/
│   │   ├── prisma.js        # Prisma client + safePrisma wrapper
│   │   ├── redis.js         # ioredis client
│   │   └── mongo.js         # Mongoose connection
│   ├── controllers/
│   │   ├── orderController.js
│   │   └── logisticsController.js
│   ├── middleware/
│   │   ├── requestId.js     # Global request ID generator
│   │   ├── auth.js          # JWT auth
│   │   ├── rbac.js          # Role-based access control
│   │   ├── idempotency.js   # Redis-backed idempotency for POST /direct
│   │   ├── validateDomain.js # Multi-tenant resolver
│   │   ├── rateLimit.js     # publicLimiter + merchantLimiter
│   │   └── errorHandler.js  # Global error handler
│   ├── routes/
│   │   ├── orderRoutes.js
│   │   └── logisticsRoutes.js
│   ├── utils/
│   │   ├── OrbitApiError.js  # Typed error class
│   │   ├── response.js       # sendSuccess / sendError helpers
│   │   └── roles.js          # ROLES constants
│   └── server.js
├── .env.example
└── package.json
```

---

## ⚡ Quick Start

### 1. Clone / extract and install

```bash
cd orbit-360
npm install
```

### 2. Configure environment

```bash
cp .env.example .env
# Edit .env with your real DB credentials
```

Required env vars:
```
DATABASE_URL=postgresql://user:pass@localhost:5432/orbit360
MONGO_URI=mongodb://localhost:27017/orbit360
REDIS_HOST=127.0.0.1
REDIS_PORT=6379
JWT_SECRET=your_strong_secret_here
```

### 3. Run Prisma migrations

```bash
npx prisma generate
npx prisma migrate dev --name init
```

> For production: `npx prisma migrate deploy`

### 4. Start the server

```bash
# Development (with auto-reload)
npm run dev

# Production
npm start
```

Server starts on **http://localhost:4000**

---

## 📡 API Reference

### Orders

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| `POST` | `/api/orders/direct` | 🟢 Public | Atomic guest checkout (requires `Idempotency-Key` header) |
| `GET` | `/api/orders/track/:trackingId` | 🟢 Public | Track order by tracking ID |
| `POST` | `/api/orders/lookup` | 🟢 Public | Lookup order by orderNumber + email |
| `GET` | `/api/orders/store/:storeId` | 🟠 Merchant | List all orders for a store |
| `GET` | `/api/orders/:id` | 🟡 Auth | Get order detail |
| `PUT` | `/api/orders/:id/status` | 🟠 Merchant | Update order status |
| `PUT` | `/api/orders/:id/fulfillment` | 🟠 Merchant | Update fulfillment status |
| `DELETE` | `/api/orders/:id` | 🟠 Merchant | Cancel order (soft delete) |

### Logistics

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| `GET` | `/api/logistics/public/pincode/:code` | 🟢 Public | Check pincode serviceability (Redis-cached 1hr) |
| `GET` | `/api/logistics/public/track?awb=` | 🟢 Public | Track shipment via FShip |
| `GET` | `/api/logistics/public/hot-products` | 🟢 Public | Top-selling products for store |

---

## 🔑 Key Design Decisions

- **`Idempotency-Key` header** is required for `POST /api/orders/direct`. Include a UUID v4 in every request.
- **`x-store-id` header** takes priority over subdomain for tenant resolution.
- **No buyer PII** (phone/email) is ever returned in error payloads or logs.
- **All Prisma calls** use `safePrisma(...)` — never raw `prisma.*` in controllers.
- **`directCheckout`** runs entirely inside `prisma.$transaction` for atomicity.

---

## 🧪 Example: Direct Checkout

```bash
curl -X POST http://localhost:4000/api/orders/direct \
  -H "Content-Type: application/json" \
  -H "Idempotency-Key: $(uuidgen)" \
  -H "x-store-id: clxxx..." \
  -d '{
    "items": [{ "productId": "prod_123", "variantId": "var_456", "qty": 2 }],
    "buyer": { "name": "Ravi Kumar", "phone": "9876543210", "email": "ravi@example.com" },
    "shipTo": { "line1": "12 MG Road", "city": "Bengaluru", "state": "KA", "pincode": "560001" },
    "payment": { "method": "COD" }
  }'
```

---

## 🛡️ Error Codes

| Code | HTTP | Meaning |
|------|------|---------|
| `MISSING_IDEMPOTENCY_KEY` | 400 | Idempotency-Key header missing |
| `CONCURRENT_REQUEST` | 409 | Same idempotency key is in-flight |
| `TENANT_REQUIRED` | 400 | x-store-id or subdomain missing |
| `INSUFFICIENT_STOCK` | 409 | Variant stock < requested qty |
| `ORDER_NOT_FOUND` | 404 | No order for given ID / tracking ID |
| `LOGISTICS_NOT_CONFIGURED` | 404 | Store has no LogisticsConfig |
| `FORBIDDEN` | 403 | Store ownership mismatch |
| `UNAUTHORIZED` | 401 | Missing / invalid JWT |
| `DUPLICATE_RESOURCE` | 409 | Prisma P2002 unique constraint |
| `DB_MIGRATION_REQUIRED` | 503 | Prisma P2021/P2022 missing table |
| `INTERNAL_SERVER_ERROR` | 500 | Unhandled error |
