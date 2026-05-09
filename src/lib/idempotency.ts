// lib/idempotency.js
//
// Idempotency-Key handling for POST /api/orders/direct (spec section 5.4).
//
// Two bugs from the Express version are fixed here:
//   1. On error, we DELETE the in-flight lock instead of leaving it as
//      "processing" for 24h — which previously caused legitimate retries
//      with the same key to be rejected as CONCURRENT_REQUEST for a full day.
//   2. Redis-down is now fail-CLOSED (503 IDEMPOTENCY_UNAVAILABLE) instead of
//      fail-open. For a money-touching endpoint, the safer default is to
//      refuse rather than risk creating duplicate orders.
//
// Usage:
//   export const POST = withErrorHandler(withIdempotency(handler));

import { redis } from './redis';
import { OrbitApiError } from './orbit-api-error';

const COMPLETED_TTL = 24 * 60 * 60; // 24h replay window for successful orders
const PROCESSING_TTL = 60;          // 60s lock — long enough for any normal checkout

/**
 * @param {(request: Request, context: any) => Promise<Response>} handler
 */
export function withIdempotency(handler) {
  return async function idempotentHandler(request, context) {
    const idempotencyKey = request.headers.get('idempotency-key');
    const requestId = context?.requestId || 'unknown';

    if (!idempotencyKey) {
      throw new OrbitApiError(
        'MISSING_IDEMPOTENCY_KEY',
        'The Idempotency-Key header is required for this endpoint.',
        requestId,
        400,
      );
    }

    const redisKey = `idempotency:${idempotencyKey}`;

    // 1. Check for an existing entry
    let existing;
    try {
      existing = await redis.get(redisKey);
    } catch (err) {
      // Fail closed — refuse the request rather than risk a duplicate order
      throw new OrbitApiError(
        'IDEMPOTENCY_UNAVAILABLE',
        'Service is temporarily unable to verify request uniqueness. Please retry.',
        requestId,
        503,
      );
    }

    if (existing) {
      const parsed = JSON.parse(existing);
      if (parsed.status === 'completed') {
        // Replay the cached response exactly
        return new Response(JSON.stringify(parsed.body), {
          status: parsed.statusCode,
          headers: {
            'Content-Type': 'application/json',
            'X-Idempotent-Replay': 'true',
            'x-request-id': requestId,
          },
        });
      }
      if (parsed.status === 'processing') {
        throw new OrbitApiError(
          'CONCURRENT_REQUEST',
          'A request with this idempotency key is already being processed.',
          requestId,
          409,
        );
      }
    }

    // 2. Acquire short-lived processing lock
    await redis.set(redisKey, JSON.stringify({ status: 'processing' }), 'EX', PROCESSING_TTL);

    try {
      const response = await handler(request, context);

      // 3. Cache the completed response for 24h replay (clone so the body
      //    can still be streamed to the original caller)
      const body = await response.clone().json();
      await redis.set(
        redisKey,
        JSON.stringify({ status: 'completed', statusCode: response.status, body }),
        'EX',
        COMPLETED_TTL,
      );
      return response;
    } catch (err) {
      // CRITICAL: clear the lock so a real retry isn't blocked for 24h.
      await redis.del(redisKey).catch(() => {});
      throw err;
    }
  };
}
