// lib/redis.js
//
// Singleton ioredis connection. Same hot-reload pattern as Prisma: keep one
// connection across module reloads in dev, otherwise we'd open a new socket
// every save and exhaust Redis client slots.

import IORedis from 'ioredis';

const globalForRedis = globalThis;

export const redis =
  globalForRedis.__orbitRedis ??
  new IORedis(process.env.REDIS_URL || 'redis://localhost:6379', {
    maxRetriesPerRequest: 2,
    lazyConnect: false,
  });

if (process.env.NODE_ENV !== 'production') {
  globalForRedis.__orbitRedis = redis;
}

// Don't crash the process on a transient Redis error. Routes that rely on Redis
// must decide their own fallback (cache miss, fail-open, fail-closed, etc).
redis.on('error', (err) => {
  console.error('[redis] error:', err.message);
});
