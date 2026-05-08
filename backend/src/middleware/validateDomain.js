'use strict';

const { prisma, safePrisma } = require('../config/prisma');
const OrbitApiError = require('../utils/OrbitApiError');

/**
 * validateDomain middleware
 * Resolves the tenant (Store) from either:
 *   1. x-store-id header (takes priority)
 *   2. Subdomain extracted from the Host header
 *
 * Attaches the store record as req.store.
 * This middleware is mounted globally but gracefully skips
 * routes that don't need tenant resolution.
 */
async function validateDomain(req, res, next) {
  try {
    // x-store-id header takes priority per spec
    const storeIdHeader = req.headers['x-store-id'];
    let store = null;

    if (storeIdHeader) {
      store = await safePrisma(
        () => prisma.store.findUnique({ where: { id: storeIdHeader } }),
        { fallback: null, context: 'validateDomain.byId' }
      );
    } else {
      // Attempt subdomain resolution
      const host = req.hostname || '';
      const parts = host.split('.');
      if (parts.length >= 3) {
        const subdomain = parts[0];
        store = await safePrisma(
          () => prisma.store.findUnique({ where: { subdomain } }),
          { fallback: null, context: 'validateDomain.bySubdomain' }
        );
      }
    }

    // Attach if found; routes that need it will check req.store
    req.store = store || null;
    next();
  } catch (err) {
    next(err);
  }
}

module.exports = validateDomain;
