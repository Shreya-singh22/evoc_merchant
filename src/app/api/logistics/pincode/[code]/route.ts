// app/api/logistics/pincode/[code]/route.js
//
// GET /api/logistics/pincode/:code
//
// Public, rate-limited. Spec section 4.2 step 3 ("Delivery form: Pincode validation").
//
// NOTE: path matches the spec exactly — /api/logistics/pincode/:code, no /public/
// prefix. The Express version had `/public/pincode/:code` which deviated from the
// PDF and would have broken Sameesha's storefront integration.

import { withErrorHandler } from '@/lib/with-error-handler';
import { OrbitApiError } from '@/lib/orbit-api-error';
import { jsonOk } from '@/lib/api-response';
import { rateLimit } from '@/lib/rate-limit';
import { resolveTenant } from '@/lib/tenant';
import { prisma, safePrisma } from '@/lib/prisma';
import { redis } from '@/lib/redis';
import { checkPincodeWithFShip } from '@/lib/logistics/fship';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const CACHE_TTL = 3600; // 1 hour

export const GET = withErrorHandler(async (request, context) => {
  const { requestId, startTime } = context;

  await rateLimit(request, { key: 'pincode', max: 60, windowSec: 60, requestId });

  // Next.js 15 makes params a Promise — `await` is forward-compatible with 14.x
  const { code } = await context.params;

  if (!/^\d{6}$/.test(code)) {
    throw new OrbitApiError('INVALID_PINCODE', 'Pincode must be 6 digits.', requestId, 400);
  }

  const store = await resolveTenant(request, requestId);

  // Cache per (store, pincode) — different merchants may use different couriers
  const cacheKey = `pincode:${store.id}:${code}`;
  try {
    const cached = await redis.get(cacheKey);
    if (cached) return jsonOk(JSON.parse(cached), { requestId, startTime });
  } catch (_) {
    // Redis miss / unavailable — fall through to live lookup
  }

  const config = await safePrisma(
    () => prisma.logisticsConfig.findUnique({ where: { storeId: store.id } }),
    { fallback: null, context: 'pincode.config' },
  );

  if (!config) {
    throw new OrbitApiError(
      'LOGISTICS_NOT_CONFIGURED',
      'Logistics is not configured for this store.',
      requestId,
      404,
    );
  }

  const result = await checkPincodeWithFShip({
    pincode: code,
    apiKey: config.apiKey,
    requestId,
  });

  try {
    await redis.set(cacheKey, JSON.stringify(result), 'EX', CACHE_TTL);
  } catch (_) {
    // Cache write failure isn't fatal — we still return the result
  }

  return jsonOk(result, { requestId, startTime });
});
