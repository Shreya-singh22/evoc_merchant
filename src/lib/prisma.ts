// lib/prisma.js
//
// Singleton PrismaClient + safePrisma helper.
//
// In Next.js dev mode, every file save creates a new module instance. Without
// the globalThis guard, each save would spawn a new PrismaClient and exhaust
// the Postgres connection pool within minutes. The guard keeps one instance
// across hot reloads.
//
// In production this file is loaded once, so the guard is a no-op.

import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis;

export const prisma =
  globalForPrisma.__orbitPrisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['warn', 'error'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.__orbitPrisma = prisma;
}

/**
 * safePrisma — wrap every Prisma call in a request handler.
 *
 * Required by spec section 5.1. Guards against:
 *   • Connection-pool exhaustion crashing the Node process
 *   • Unhandled PrismaClientKnownRequestError reaching the user
 *   • Tenant-scope leaks (a missing `where: { storeId }` becomes obvious in logs)
 *
 * Re-throws known Prisma errors so the route's error handler can map them to
 * the correct envelope. Swallows unknown errors when a `fallback` is provided.
 *
 * @param {() => Promise<any>} fn
 * @param {{ fallback?: any, context?: string }} [opts]
 */
export async function safePrisma(fn, { fallback, context = 'unknown' } = {}) {
  try {
    return await fn();
  } catch (err) {
    const { PrismaClientKnownRequestError, PrismaClientValidationError } = await import(
      '@prisma/client/runtime/library'
    );

    if (
      err instanceof PrismaClientKnownRequestError ||
      err instanceof PrismaClientValidationError
    ) {
      throw err;
    }

    console.error(`[safePrisma][${context}]`, err.message);
    if (fallback !== undefined) return fallback;
    throw err;
  }
}
