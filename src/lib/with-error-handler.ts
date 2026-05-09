// lib/with-error-handler.js
//
// Wraps a route handler with:
//   • requestId generation (or pass-through from x-request-id header)
//   • startTime for the meta.tookMs field
//   • OrbitApiError → standard error envelope
//   • PrismaClientKnownRequestError → P2002 / P2025 / P2021 / P2022 mapping
//   • Unknown error → 500 INTERNAL_SERVER_ERROR (message hidden in prod)
//
// This is the Next.js equivalent of Express's `app.use(errorHandler)`.

import { OrbitApiError } from './orbit-api-error';
import { jsonError } from './api-response';

function newRequestId() {
  return (
    'req_' +
    (globalThis.crypto?.randomUUID?.() || Math.random().toString(36).slice(2))
  );
}

/**
 * @param {(request: Request, context: any) => Promise<Response>} handler
 */
export function withErrorHandler(handler) {
  return async function wrappedHandler(request, routeContext) {
    const requestId = request.headers.get('x-request-id') || newRequestId();
    const context = { ...routeContext, requestId, startTime: Date.now() };

    try {
      const response = await handler(request, context);
      // Echo the requestId back so the SDK can log it
      response.headers.set('x-request-id', requestId);
      return response;
    } catch (err) {
      const isProd = process.env.NODE_ENV === 'production';

      // 1. Our own typed errors
      if (err instanceof OrbitApiError) {
        return jsonError({
          code: err.code,
          message: err.message,
          requestId,
          status: err.statusCode,
          headers: { 'x-request-id': requestId },
        });
      }

      // 2. Prisma errors
      try {
        const { PrismaClientKnownRequestError } = await import(
          '@prisma/client/runtime/library'
        );

        if (err instanceof PrismaClientKnownRequestError) {
          if (err.code === 'P2002') {
            return jsonError({
              code: 'DUPLICATE_RESOURCE',
              message: 'A resource with these details already exists.',
              requestId,
              status: 409,
            });
          }
          if (err.code === 'P2025') {
            return jsonError({
              code: 'RESOURCE_NOT_FOUND',
              message: 'The requested resource was not found.',
              requestId,
              status: 404,
            });
          }
          if (err.code === 'P2021' || err.code === 'P2022') {
            return jsonError({
              code: 'DB_MIGRATION_REQUIRED',
              message: 'Database is out of sync. Run prisma migrate deploy.',
              requestId,
              status: 503,
            });
          }
          return jsonError({
            code: 'DATABASE_ERROR',
            message: isProd ? 'A database error occurred.' : err.message,
            requestId,
            status: 500,
          });
        }
      } catch (_importErr) {
        // Prisma not loadable; fall through
      }

      // 3. Anything else — never leak the stack in prod
      console.error(`[errorHandler][${requestId}]`, err);
      return jsonError({
        code: 'INTERNAL_SERVER_ERROR',
        message: isProd
          ? 'An unexpected error occurred. Please try again later.'
          : err.message,
        requestId,
        status: 500,
      });
    }
  };
}
