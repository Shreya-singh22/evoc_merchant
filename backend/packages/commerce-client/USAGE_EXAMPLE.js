/**
 * EXAMPLE — How to use @orbit-360/commerce-client in your Next.js storefront
 * Copy the relevant snippets into your storefront code.
 */

// ─────────────────────────────────────────────────────────────────────────────
// 1. SETUP — create ONE shared instance (e.g. lib/commerce.js)
// ─────────────────────────────────────────────────────────────────────────────
const { CommerceClient, OrbitApiError } = require('@orbit-360/commerce-client');

const commerce = new CommerceClient({
  baseUrl: process.env.NEXT_PUBLIC_API_URL,   // 'https://api.evoclabs.com'
  storeId: process.env.NEXT_PUBLIC_STORE_ID,  // your merchant UUID
});

module.exports = { commerce, OrbitApiError };


// ─────────────────────────────────────────────────────────────────────────────
// 2. PINCODE CHECK — onBlur of pincode field (debounced 300ms)
// ─────────────────────────────────────────────────────────────────────────────
async function handlePincodeBlur(pincode) {
  try {
    const result = await commerce.logistics.checkPincode(pincode);

    if (!result.serviceable) {
      showToast('error', "Sorry, we don't ship to this pincode yet");
      blockCheckoutSubmit();
      return;
    }

    showToast('success', `Delivers to ${pincode} in ${result.etaMessage}`);
    if (!result.codEligible) {
      hideCodOption(); // grey out COD payment if not eligible
    }
  } catch (err) {
    if (err instanceof OrbitApiError) {
      showToast('error', err.message);
      console.error('[pincode]', err.code, 'requestId:', err.requestId);
    }
  }
}


// ─────────────────────────────────────────────────────────────────────────────
// 3. DIRECT CHECKOUT — on form submit
// ─────────────────────────────────────────────────────────────────────────────
async function handleCheckoutSubmit({ items, buyer, shipTo, payment }) {
  // Generate idempotency key ONCE per checkout attempt
  // Store in memory — reuse on retry (never localStorage for PII)
  const idempotencyKey = crypto.randomUUID();

  try {
    const result = await commerce.orders.directCheckout(
      { items, buyer, shipTo, payment },
      idempotencyKey
    );

    showToast('success', `Order placed! Track ID: ${result.trackingId}`);

    // Redirect to success page
    window.location.href = `/order/success?id=${result.orderId}&tracking=${result.trackingId}`;

  } catch (err) {
    if (err instanceof OrbitApiError) {
      if (err.code === 'INSUFFICIENT_STOCK') {
        showToast('warning', err.message); // "Only N left, quantity adjusted"
      } else {
        showToast('error', err.message);
      }
      console.error('[checkout]', err.code, 'requestId:', err.requestId);
    }
  }
}


// ─────────────────────────────────────────────────────────────────────────────
// 4. TRACK ORDER — on /track/[trackingId] page
// ─────────────────────────────────────────────────────────────────────────────
async function loadOrderTracking(trackingId) {
  try {
    const tracking = await commerce.orders.trackOrder(trackingId);

    return {
      status: tracking.status,
      items: tracking.items,
      events: tracking.partnerTimestamps || [],
      updatedAt: tracking.updatedAt,
    };
  } catch (err) {
    if (err instanceof OrbitApiError && err.statusCode === 404) {
      return null; // show "order not found" UI
    }
    throw err;
  }
}


// ─────────────────────────────────────────────────────────────────────────────
// 5. LOOKUP ORDER — on /order/lookup page
// ─────────────────────────────────────────────────────────────────────────────
async function handleOrderLookup(orderNumber, email) {
  try {
    const order = await commerce.orders.lookupOrder(orderNumber, email);
    return order;
  } catch (err) {
    if (err instanceof OrbitApiError && err.statusCode === 404) {
      showToast('error', 'No order found with these details.');
      return null;
    }
    throw err;
  }
}
