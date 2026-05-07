'use strict';

const axios = require('axios');
const { prisma, safePrisma } = require('../config/prisma');
const redis = require('../config/redis');
const OrbitApiError = require('../utils/OrbitApiError');
const { sendSuccess } = require('../utils/response');

const FSHIP_BASE = process.env.FSHIP_BASE_URL || 'https://api.fship.in';
const PINCODE_CACHE_TTL = 3600; // 1 hour

// ─────────────────────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────────────────────

/** Resolve storeId from req.store (validateDomain) or x-store-id header */
function resolveStoreId(req) {
  return req.store?.id || req.headers['x-store-id'] || null;
}

/** Fetch LogisticsConfig for a store */
async function getLogisticsConfig(storeId, requestId) {
  const config = await safePrisma(
    () => prisma.logisticsConfig.findUnique({ where: { storeId } }),
    { fallback: null, context: 'logistics.getConfig' }
  );
  if (!config) {
    throw new OrbitApiError(
      'LOGISTICS_NOT_CONFIGURED',
      'Logistics is not configured for this store.',
      requestId,
      404
    );
  }
  return config;
}

// ─────────────────────────────────────────────────────────────────────────────
// PUBLIC — checkPincode  GET /api/logistics/public/pincode/:code  🟢
// ─────────────────────────────────────────────────────────────────────────────
async function checkPincode(req, res, next) {
  const startTime = Date.now();
  const requestId = req.requestId;

  try {
    const { code } = req.params;

    if (!code || !/^\d{6}$/.test(code)) {
      throw new OrbitApiError('INVALID_PINCODE', 'Pincode must be a 6-digit number.', requestId, 400);
    }

    const storeId = resolveStoreId(req);
    if (!storeId) {
      throw new OrbitApiError('TENANT_REQUIRED', 'Store context is required.', requestId, 400);
    }

    // ── Check Redis cache first ──────────────────────────────────────────────
    const cacheKey = `pincode:${storeId}:${code}`;
    try {
      const cached = await redis.get(cacheKey);
      if (cached) {
        return sendSuccess(res, JSON.parse(cached), { statusCode: 200, requestId, startTime });
      }
    } catch (redisErr) {
      console.error('[checkPincode] Redis read error:', redisErr.message);
    }

    // ── Fetch LogisticsConfig ─────────────────────────────────────────────────
    const config = await getLogisticsConfig(storeId, requestId);

    // ── Call FShip API ────────────────────────────────────────────────────────
    let fshipResponse;
    try {
      fshipResponse = await axios.post(
        `${FSHIP_BASE}/api/pincode/check`,
        { pincode: code },
        {
          headers: {
            Authorization: `Bearer ${config.apiKey}`,
            'Content-Type': 'application/json',
          },
          timeout: 8000,
        }
      );
    } catch (fshipErr) {
      const status = fshipErr.response?.status;
      if (status === 404) {
        // Pincode not found in FShip — not serviceable
        const notServiceable = { serviceable: false };
        try {
          await redis.set(cacheKey, JSON.stringify(notServiceable), 'EX', PINCODE_CACHE_TTL);
        } catch (_) {}
        return sendSuccess(res, notServiceable, { statusCode: 200, requestId, startTime });
      }
      throw new OrbitApiError(
        'LOGISTICS_API_ERROR',
        'Failed to reach logistics provider. Please try again.',
        requestId,
        502
      );
    }

    // ── Parse FShip response ──────────────────────────────────────────────────
    const fship = fshipResponse.data;
    const serviceable = !!(fship.serviceable || fship.is_serviceable || fship.status === 'serviceable');
    const result = {
      serviceable,
      codEligible: serviceable ? !!(fship.cod_available || fship.codEligible) : false,
      estimatedDays: fship.tat || fship.estimated_days || fship.estimatedDays || null,
      etaMessage: fship.eta_message || fship.etaMessage || (serviceable ? 'Delivery available' : 'Not serviceable'),
    };

    // ── Cache result ──────────────────────────────────────────────────────────
    try {
      await redis.set(cacheKey, JSON.stringify(result), 'EX', PINCODE_CACHE_TTL);
    } catch (redisErr) {
      console.error('[checkPincode] Redis write error:', redisErr.message);
    }

    return sendSuccess(res, result, { statusCode: 200, requestId, startTime });
  } catch (err) {
    next(err);
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// PUBLIC — trackShipmentPublic  GET /api/logistics/public/track?awb=  🟢
// ─────────────────────────────────────────────────────────────────────────────
async function trackShipmentPublic(req, res, next) {
  const startTime = Date.now();
  const requestId = req.requestId;

  try {
    const { awb } = req.query;

    if (!awb) {
      throw new OrbitApiError('INVALID_REQUEST', 'awb query parameter is required.', requestId, 400);
    }

    const storeId = resolveStoreId(req);
    if (!storeId) {
      throw new OrbitApiError('TENANT_REQUIRED', 'Store context is required.', requestId, 400);
    }

    const config = await getLogisticsConfig(storeId, requestId);

    let trackingData;
    try {
      const response = await axios.get(`${FSHIP_BASE}/api/track`, {
        params: { awb },
        headers: {
          Authorization: `Bearer ${config.apiKey}`,
        },
        timeout: 8000,
      });
      trackingData = response.data;
    } catch (fshipErr) {
      throw new OrbitApiError(
        'LOGISTICS_API_ERROR',
        'Unable to fetch shipment tracking. Please try again.',
        requestId,
        502
      );
    }

    return sendSuccess(
      res,
      {
        awb,
        carrier: trackingData.carrier || trackingData.courier || null,
        status: trackingData.status || null,
        events: trackingData.events || trackingData.tracking_events || [],
        estimatedDelivery: trackingData.estimated_delivery || null,
      },
      { statusCode: 200, requestId, startTime }
    );
  } catch (err) {
    next(err);
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// PUBLIC — getHotProducts  GET /api/logistics/public/hot-products  🟢
// (Placeholder — returns top-ordered products for the store)
// ─────────────────────────────────────────────────────────────────────────────
async function getHotProducts(req, res, next) {
  const startTime = Date.now();
  const requestId = req.requestId;

  try {
    const storeId = resolveStoreId(req);
    if (!storeId) {
      throw new OrbitApiError('TENANT_REQUIRED', 'Store context is required.', requestId, 400);
    }

    // Aggregate top-selling product names from order items for this store
    const topItems = await safePrisma(
      () =>
        prisma.orderItem.groupBy({
          by: ['productId', 'productName'],
          where: { order: { storeId } },
          _sum: { qty: true },
          orderBy: { _sum: { qty: 'desc' } },
          take: 10,
        }),
      { fallback: [], context: 'logistics.getHotProducts' }
    );

    return sendSuccess(
      res,
      {
        products: topItems.map((p) => ({
          productId: p.productId,
          productName: p.productName,
          totalSold: p._sum.qty || 0,
        })),
      },
      { statusCode: 200, requestId, startTime }
    );
  } catch (err) {
    next(err);
  }
}

module.exports = {
  checkPincode,
  trackShipmentPublic,
  getHotProducts,
};
