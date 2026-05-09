// lib/webhooks/verify-fship-signature.js
//
// HMAC-SHA256 verification for FShip webhook callbacks.
//
// FShip signs the raw request body with the shared secret and sends:
//   X-FShip-Signature: sha256=<hex_digest>
//
// In Next.js, we read the raw body via `await request.text()` BEFORE parsing
// JSON. (This is the bug from the Express version: there, global express.json()
// consumed the stream before the handler could see the raw bytes.)

import crypto from 'node:crypto';

/**
 * @param {string} rawBody         — exact bytes the partner signed
 * @param {string|null} signatureHeader — value of the X-FShip-Signature header
 * @param {string} secret          — process.env.FSHIP_WEBHOOK_SECRET
 * @returns {boolean}
 */
export function verifyFShipSignature(rawBody, signatureHeader, secret) {
  if (!signatureHeader || !secret) return false;

  const expected =
    'sha256=' + crypto.createHmac('sha256', secret).update(rawBody).digest('hex');

  try {
    const a = Buffer.from(signatureHeader);
    const b = Buffer.from(expected);
    if (a.length !== b.length) return false;
    return crypto.timingSafeEqual(a, b);
  } catch {
    return false;
  }
}
