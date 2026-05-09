// app/api/orders/track/[trackingId]/route.js
//
// GET /api/orders/track/:trackingId
//
// Public, no auth, rate-limited. Spec section 4.2 step 6.
// Returns coarse status + partner timestamps. Never returns buyer PII beyond
// what the buyer themselves entered.

import { withErrorHandler } from '@/lib/with-error-handler';
import { OrbitApiError } from '@/lib/orbit-api-error';
import { jsonOk } from '@/lib/api-response';
import { rateLimit } from '@/lib/rate-limit';
import { prisma, safePrisma } from '@/lib/prisma';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export const GET = withErrorHandler(async (request, context) => {
  const { requestId, startTime } = context;

  await rateLimit(request, { key: 'track', max: 60, windowSec: 60, requestId });

  const { trackingId } = await context.params;

  if (!trackingId || !trackingId.startsWith('trk_')) {
    throw new OrbitApiError('INVALID_TRACKING_ID', 'Tracking ID is malformed.', requestId, 400);
  }

  const order = await safePrisma(
    () =>
      prisma.order.findUnique({
        where: { trackingId },
        include: {
          items: { select: { productName: true, qty: true } },
        },
      }),
    { fallback: null, context: 'track.find' },
  );

  if (!order) {
    throw new OrbitApiError(
      'ORDER_NOT_FOUND',
      'No order found for this tracking ID.',
      requestId,
      404,
    );
  }

  // Whitelist what we return — never include buyerName/Phone/Email/address fields
  return jsonOk(
    {
      orderId: order.id,
      trackingId: order.trackingId,
      status: order.status,
      fulfillmentStatus: order.fulfillmentStatus,
      items: order.items,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
      partnerTimestamps: order.partnerTimestamps || null,
    },
    { requestId, startTime },
  );
});
