'use strict';

const redis = require('../config/redis');
const OrbitApiError = require('../utils/OrbitApiError');

const TTL_SECONDS = 86400; // 24 hours

/**
 * idempotency middleware
 *
 * Must only be applied to POST /api/orders/direct.
 *
 * Flow:
 *   - Missing key on POST → 400 MISSING_IDEMPOTENCY_KEY
 *   - Key present, status "completed" → return cached response immediately
 *   - Key present, status "processing" → 409 CONCURRENT_REQUEST
 *   - New key → mark "processing", run handler, cache result as "completed"
 */
async function idempotency(req, res, next) {
  const idempotencyKey = req.headers['idempotency-key'];

  if (!idempotencyKey) {
    return next(
      new OrbitApiError(
        'MISSING_IDEMPOTENCY_KEY',
        'The Idempotency-Key header is required for this endpoint.',
        req.requestId,
        400
      )
    );
  }

  const redisKey = `idempotency:${idempotencyKey}`;

  try {
    const existing = await redis.get(redisKey);

    if (existing) {
      const parsed = JSON.parse(existing);

      if (parsed.status === 'completed') {
        // Replay cached response exactly
        return res.status(parsed.statusCode).json(parsed.body);
      }

      if (parsed.status === 'processing') {
        return next(
          new OrbitApiError(
            'CONCURRENT_REQUEST',
            'A request with this idempotency key is already being processed.',
            req.requestId,
            409
          )
        );
      }
    }

    // First request — mark as processing
    await redis.set(redisKey, JSON.stringify({ status: 'processing' }), 'EX', TTL_SECONDS);

    // Intercept res.json to capture the response body & status code
    const originalJson = res.json.bind(res);
    res.json = async function (body) {
      try {
        // Store completed result
        await redis.set(
          redisKey,
          JSON.stringify({ status: 'completed', statusCode: res.statusCode, body }),
          'EX',
          TTL_SECONDS
        );
      } catch (cacheErr) {
        // Log but don't fail the response
        console.error('[idempotency] Failed to cache completed response:', cacheErr.message);
      }
      return originalJson(body);
    };

    next();
  } catch (err) {
    console.error('[idempotency] Redis error:', err.message);
    // On Redis failure, allow the request through (fail-open) to avoid outage
    next();
  }
}

module.exports = idempotency;
