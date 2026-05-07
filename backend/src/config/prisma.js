'use strict';

const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'warn', 'error'] : ['error'],
});

/**
 * safePrisma — wraps every Prisma call so we get consistent error surfaces.
 *
 * @param {Function} fn       — () => prisma.model.operation(...)
 * @param {Object}   options
 * @param {*}        options.fallback  — returned instead of throwing when provided
 * @param {string}   options.context   — label for logs, e.g. 'orders.direct'
 * @returns {Promise<*>}
 */
async function safePrisma(fn, { fallback, context = 'unknown' } = {}) {
  try {
    return await fn();
  } catch (err) {
    // Re-throw Prisma known errors so errorHandler can map them
    const { PrismaClientKnownRequestError, PrismaClientValidationError } = require('@prisma/client/runtime/library');
    if (err instanceof PrismaClientKnownRequestError || err instanceof PrismaClientValidationError) {
      throw err;
    }
    console.error(`[safePrisma][${context}]`, err.message);
    if (fallback !== undefined) return fallback;
    throw err;
  }
}

module.exports = { prisma, safePrisma };
