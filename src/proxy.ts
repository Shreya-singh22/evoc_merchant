// middleware.js  (project root — same level as next.config.js)
//
// Runs on the Edge runtime, so it CANNOT use Prisma or ioredis. Keep it minimal.
//
// What this does:
//   • Stamps every /api/* request with x-request-id (or echoes the caller's)
//   • Handles CORS for the cross-origin storefronts at <merchant>.evoclabs.shop
//   • Lets Sameesha's frontend pages pass through untouched
//
// Tenant resolution stays inside route handlers (it needs Prisma).

import { NextResponse } from 'next/server';

const ALLOWED_ORIGIN_PATTERNS = [
  /^https:\/\/[a-z0-9-]+\.evoclabs\.shop$/,
  /^https:\/\/(www\.)?evoclabs\.com$/,
  // dev — remove in prod or guard on NODE_ENV
  /^http:\/\/localhost(:\d+)?$/,
];

function isAllowedOrigin(origin) {
  return origin && ALLOWED_ORIGIN_PATTERNS.some((re) => re.test(origin));
}

export function  proxy(request) {
  // Only act on API routes — leave page routes for Sameesha's frontend untouched
  if (!request.nextUrl.pathname.startsWith('/api/')) {
    return NextResponse.next();
  }

  const origin = request.headers.get('origin');
  const requestId = request.headers.get('x-request-id') || 'req_' + crypto.randomUUID();

  // CORS preflight
  if (request.method === 'OPTIONS') {
    const headers = new Headers();
    if (isAllowedOrigin(origin)) {
      headers.set('Access-Control-Allow-Origin', origin);
      headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
      headers.set(
        'Access-Control-Allow-Headers',
        'Content-Type, x-store-id, idempotency-key, x-request-id, authorization',
      );
      headers.set('Access-Control-Max-Age', '86400');
    }
    return new NextResponse(null, { status: 204, headers });
  }

  // Forward request with x-request-id added (so route handlers see it)
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-request-id', requestId);

  const response = NextResponse.next({ request: { headers: requestHeaders } });

  if (isAllowedOrigin(origin)) {
    response.headers.set('Access-Control-Allow-Origin', origin);
    response.headers.set('Vary', 'Origin');
  }
  response.headers.set('x-request-id', requestId);
  return response;
}

export const config = {
  matcher: '/api/:path*',
};
