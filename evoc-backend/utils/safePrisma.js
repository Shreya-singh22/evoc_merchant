

/**
 * Wraps Prisma queries to prevent crashes and ensure a standard response envelope.
 * 
 * @param {Function} queryFn - The Prisma query to execute (must be wrapped in an arrow function)
 * @param {Object} options - { fallback, context, requestId }
 */
async function safePrisma(queryFn, options = {}) {
  const { fallback = null, context = 'unknown', requestId = 'req_' + Date.now() } = options;
  const start = Date.now();

  try {
    const result = await queryFn();
    const tookMs = Date.now() - start;

    return {
      ok: true,
      data: result,
      meta: { requestId, tookMs }
    };
  } catch (error) {
    console.error(`[safePrisma error in ${context}]:`, error);

    return {
      ok: false,
      error: {
        code: 'DATABASE_ERROR',
        message: 'An internal error occurred while fetching data.'
      },
      data: fallback,
      meta: { requestId, tookMs: Date.now() - start }
    };
  }
}

module.exports = { safePrisma };
