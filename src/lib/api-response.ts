// lib/api-response.js
//
// Envelope helpers per spec section 3.4. Note: requestId lives in `meta` for
// BOTH success and error responses. (The Express version had it inside `error`
// for failures — that was a spec deviation, fixed here.)

import { NextResponse } from 'next/server';

/**
 * Standard success envelope.
 *   { ok: true, data: { ... }, meta: { requestId, tookMs } }
 *
 * @param {any} data
 * @param {{ requestId?: string, startTime?: number, status?: number, headers?: Record<string,string> }} [opts]
 */
export function jsonOk(data, { requestId, startTime, status = 200, headers } = {}) {
  const tookMs = startTime ? Date.now() - startTime : 0;
  return NextResponse.json(
    {
      ok: true,
      data,
      meta: { requestId: requestId || 'unknown', tookMs },
    },
    { status, headers },
  );
}

/**
 * Standard error envelope.
 *   { ok: false, error: { code, message }, meta: { requestId } }
 *
 * @param {{ code: string, message: string, requestId?: string, status?: number, headers?: Record<string,string> }} opts
 */
export function jsonError({ code, message, requestId, status = 500, headers } = {}) {
  return NextResponse.json(
    {
      ok: false,
      error: { code, message },
      meta: { requestId: requestId || 'unknown' },
    },
    { status, headers },
  );
}
