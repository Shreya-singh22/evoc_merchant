// lib/rate-limit.js
//
// Redis-backed per-IP rate limiter. Replaces the express-rate-limit middleware.
// Required by spec section 5.4 ("public endpoints sit behind a per-IP bucket").
//
// Strategy: fixed-window counter (one INCR per request, EXPIRE on first hit).
// Simple, low-cardinality, accurate enough for the storefront's traffic shape.
// If we ever need bursty smoothing, swap to a token bucket later.
//
// Usage inside a route:
//   await rateLimit(request, { key: 'pincode', max: 60, windowSec: 60, requestId });

import { redis } from './redis';
import { OrbitApiError } from './orbit-api-error';

function getClientIp(request) {
  // Vercel / most proxies forward via x-forwarded-for; fall back to x-real-ip.
  return (
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    request.headers.get('x-real-ip') ||
    'unknown'
  );
}

/**
 * @param {Request} request
 * @param {{ key: string, max?: number, windowSec?: number, requestId?: string }} opts
 */
export async function rateLimit(request, { key, max = 60, windowSec = 60, requestId }) {
  const ip = getClientIp(request);
  const bucket = `ratelimit:${key}:${ip}`;

  try {
    const count = await redis.incr(bucket);
    if (count === 1) {
      await redis.expire(bucket, windowSec);
    }
    if (count > max) {
      throw new OrbitApiError(
        'RATE_LIMIT_EXCEEDED',
        'Too many requests — please try again shortly.',
        requestId,
        429,
      );
    }
  } catch (err) {
    if (err instanceof OrbitApiError) throw err;
    // Redis is down — fail open. Public endpoints are read-mostly; better to
    // serve traffic than to block legitimate users on infrastructure.
    console.warn('[rateLimit] Redis unavailable — allowing request');
  }
}
