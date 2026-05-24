# Checkout Workflow Architecture

## Overview

The checkout system uses a multi-step wizard pattern with OTP verification, address management, and dual payment methods (Cash on Delivery and PayU online).

## User Flow

```
Identify → Verify OTP → Details + Address → Payment → Success/Failure
```

### Step Breakdown

1. **Identify**: User enters phone number, OTP sent via 2Factor.in
2. **Verify**: User enters 4-digit OTP, verified against 2Factor.in API
3. **Details**: First name, last name, email (from Your Details form)
4. **Address**: Select existing or add new delivery address
5. **Payment**: Choose COD or PayU online
6. **Success/Failure**: Order confirmation or retry option

## Key Architecture Decisions

### 1. Separation of Concerns

**Your Details** and **Address** are separate:
- Customer name/email lives on the User model
- Delivery address lives on the Address model with a Many-to-One relationship to User

This allows:
- Reusing addresses across multiple orders
- User can have one name but multiple delivery addresses (home, work, etc.)
- Addresses can be set as default

### 2. Schema Design

```prisma
model User {
  id        String    @id @default(cuid())
  phone     String    @unique
  email     String?
  firstName String?
  lastName  String?
  addresses Address[]
  orders    Order[]
}

model Address {
  id         String  @id @default(cuid())
  userId     String
  type       String  @default("HOME") // HOME, WORK, OTHER
  flatHouse  String
  areaStreet String
  city       String
  state      String
  pincode     String
  isDefault  Boolean @default(false)
  user       User    @relation(...)
}
```

Note: Address does NOT have firstName/lastName — it inherits the customer's name from the User's "Your Details" form. This avoids duplication.

### 3. OTP Flow

1. User enters phone → `sendOtp()` → 2Factor.in API sends SMS
2. Session ID stored for verification
3. User enters code → `verifyOtp()` → 2Factor.in validates
4. On success, fetch/create user and auto-fill saved data

### 4. Payment Methods

**Cash on Delivery (COD)**:
- Order created immediately with status `PENDING`
- No online payment flow
- COD fee added to total (Rs. 40)

**PayU Online**:
- Order created with status `PENDING`
- PayU bolt modal opens
- On success: order updated to `PAID`
- On failure: order updated to `FAILED`
- Callback URL handles server-side confirmation

## Validation Strategy

### Defense in Depth

1. **Client-side validation** — For UX (immediate feedback)
2. **Server-side validation** — For security (never trust client)

### Zod Schemas

```typescript
// src/lib/validation.ts

export const customerDetailsSchema = z.object({
  firstName: z.string().min(1, "First name is required").max(50),
  lastName: z.string().min(1, "Last name is required").max(50),
  email: z.string().min(1).email("Please enter a valid email"),
  phone: z.string().min(10).max(15),
});

export const addressSchema = z.object({
  type: z.enum(["HOME", "WORK", "OTHER"]),
  flatHouse: z.string().min(1).max(100),
  areaStreet: z.string().min(1).max(200),
  city: z.string().min(1).max(50),
  state: z.string().min(1).max(50),
  pincode: z.string().length(6).regex(/^\d+$/),
});
```

### Field-Level Error Display

Each form field shows its error below:
- Red border on invalid field
- Red error message text
- Errors clear as user types/fixes

```tsx
<input
  value={value}
  onChange={(e) => {
    setValue(e.target.value);
    setFieldErrors((prev) => ({ ...prev, field: "" }));
  }}
  className={fieldErrors.field ? "border-red-400" : "border-primary/10"}
/>
{fieldErrors.field && <p className="text-red-500">{fieldErrors.field}</p>}
```

## State Management

### Cart Context

The cart is managed via React Context:

```typescript
type CartItem = {
  id: string;
  productId: string;
  sku: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  variant?: string;
};
```

### Checkout State

Local component state manages the multi-step wizard:

```typescript
type Step = "identify" | "verify" | "details" | "payment" | "success";

const [step, setStep] = useState<Step>("identify");
const [customerFirstName, setCustomerFirstName] = useState("");
const [selectedAddress, setSelectedAddress] = useState<AddressData | null>(null);
```

## Environment Variables

```env
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/dbname

# 2Factor.in OTP
TWO_FACTOR_API_KEY=your_api_key

# PayU (server-side only)
PAYU_KEY=your_merchant_key
PAYU_SALT=your_salt_key
```

## Testing Checklist

- [ ] Empty cart redirects home
- [ ] Phone validation (10+ digits)
- [ ] OTP sends successfully
- [ ] OTP resend timer works
- [ ] Invalid OTP shows error
- [ ] Valid OTP proceeds to details
- [ ] Name/email validation works
- [ ] Address form validation works
- [ ] Can save multiple addresses
- [ ] Can select existing address
- [ ] Default address auto-selected
- [ ] COD order created successfully
- [ ] PayU modal opens
- [ ] PayU success updates order
- [ ] PayU failure updates order
- [ ] Cart clears on successful order
- [ ] Order summary shows correct totals
- [ ] COD fee added correctly