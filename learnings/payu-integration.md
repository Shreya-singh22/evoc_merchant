# PayU Checkout Plus Integration

## Script Loading

Load PayU script in `layout.tsx` using Next.js `Script` component — never conditionally in components.

```tsx
// src/app/layout.tsx
import Script from "next/script";

const isDev = process.env.NODE_ENV === "development";
const payuScriptUrl = isDev
  ? "https://jssdk-uat.payu.in/bolt/bolt.min.js"
  : "https://jssdk.payu.in/bolt/bolt.min.js";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
        <Script src={payuScriptUrl} strategy="beforeInteractive" />
      </body>
    </html>
  );
}
```

Loading multiple times causes 429 rate limit errors. Script auto-switches between UAT (dev) and production based on `NODE_ENV`.

## Transaction ID Format

**No hyphens in txnid** — PayU rejects them.

- ❌ `ORD-12345-ABC`
- ✅ `ORDMPJ9KAVT284` or Prisma CUID

Use Prisma-generated CUID directly as the transaction ID.

## Hash Formats

Two different hash formats — payment init and callback verification.

### Payment Initialization Hash

```
key|txnid|amount|productinfo|firstname|email|udf1|udf2|udf3|udf4|udf5|SALT
```

### Callback Verification Hash

```
SALT|status|udf10|udf9|...|udf3|udf2|udf1|email|firstname|productinfo|amount|txnid|key
```

Callback hash starts with SALT first, in reverse order from init hash.

## Bolt Response Structure

Response is nested under `.response` property:

```typescript
window.bolt.launch(payuData, {
  responseHandler: (boltResponse) => {
    const res = boltResponse.response;
    
    if (res.status === "success" || res.txnStatus === "SUCCESS") {
      // Payment successful
    }
  }
});
```

Check both `status` and `txnStatus` for compatibility.

## UDF Fields

Used for passing custom data PayU doesn't support natively:

- `udf1`: userId
- `udf2`: orderId
- `udf3-udf5`: reserved

## Common Errors

| Error | Cause | Fix |
|-------|-------|-----|
| 429 Too Many Requests | Script loaded multiple times | Single script in layout.tsx only |
| Hyphen-DNE | txnid has hyphens | Use alphanumeric ID only |
| Always FAILED | Wrong response path | Use `boltResponse.response.status` |
| Hash mismatch | Wrong callback hash format | Remember: SALT first, reverse order |

## Security Rules

1. `PAYU_SALT` stays server-side only — never expose to client
2. Always verify callback hash before updating order status
3. Validate all inputs client-side (UX) and server-side (security)

## Callback URL (/api/payu/callback)

This is PayU's server-side webhook — it fires when PayU processes a payment regardless of what happens on the client.

**Why it exists as a backup:**

| Scenario | responseHandler | Callback |
|----------|----------------|----------|
| User closes browser mid-payment | ❌ Never fires | ✅ Updates order |
| responseHandler crashes | ❌ No update | ✅ Updates order |
| updateOrder API call fails | ❌ No retry | ✅ Can retry |

The callback is a **failsafe**, not the primary path. Both fire — responseHandler updates immediately for UX, callback verifies on the server side for reliability.

## Testing Checklist

- [ ] Script loads without 429 errors
- [ ] Transaction ID accepted (no hyphen error)
- [ ] Hash generates correctly
- [ ] Payment modal opens
- [ ] Payment success updates order to PAID
- [ ] Payment failure updates order to FAILED
- [ ] Callback hash verification passes
- [ ] All UDF fields captured correctly