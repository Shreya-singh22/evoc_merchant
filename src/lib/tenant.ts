// lib/tenant.js
//
// Tenant resolution per spec section 3.2.
//   1. x-store-id header (priority — preferred for SSR / API routes)
//   2. Subdomain of <merchant>.evoclabs.shop
// If neither resolves to a real Store row, throw TENANT_REQUIRED.
//
// Express-version bug fixed here: the old middleware silently set req.store = null
// and let the route fall back to the raw header value. A bogus x-store-id would
// pass through and surface later as a Prisma foreign-key error. This version
// always returns a verified Store record or throws.

import { prisma, safePrisma } from './prisma';
import { OrbitApiError } from './orbit-api-error';

/**
 * @param {Request} request — the Next.js Request object
 * @param {string}  requestId
 * @returns {Promise<{ id: string, subdomain: string, name: string }>}
 */
export async function resolveTenant(request, requestId) {
  // 1. Header takes priority
  const headerStoreId = request.headers.get('x-store-id');

  if (headerStoreId) {
    const store = await safePrisma(
      () => prisma.store.findUnique({ where: { id: headerStoreId } }),
      { fallback: null, context: 'tenant.byHeader' },
    );
    if (!store) {
      throw new OrbitApiError(
        'TENANT_REQUIRED',
        'x-store-id does not resolve to a known merchant.',
        requestId,
        400,
      );
    }
    return store;
  }

  // 2. Fall back to subdomain
  const origin = request.headers.get('origin') || '';
  const host = request.headers.get('host') || '';
  const candidate = origin.replace(/^https?:\/\//, '') || host;
  const parts = candidate.split('.');

  // Expect <subdomain>.evoclabs.shop  → at least 3 parts, second part 'evoclabs'
  if (parts.length >= 3 && parts[1] === 'evoclabs') {
    const subdomain = parts[0];
    const store = await safePrisma(
      () => prisma.store.findUnique({ where: { subdomain } }),
      { fallback: null, context: 'tenant.bySubdomain' },
    );
    if (store) return store;
  }

  throw new OrbitApiError(
    'TENANT_REQUIRED',
    'Merchant tenant could not be resolved from x-store-id or subdomain.',
    requestId,
    400,
  );
}
