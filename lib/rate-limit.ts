import "server-only";

/**
 * Minimal in-memory sliding-window rate limiter. Process-local — good enough
 * for a single-instance deployment, but won't share state across serverless
 * instances. Swap for a durable store (e.g. Upstash Redis) before scaling out.
 */
const buckets = new Map<string, number[]>();

export function checkRateLimit(key: string, limit: number, windowMs: number): boolean {
  const now = Date.now();
  const recent = (buckets.get(key) ?? []).filter((t) => now - t < windowMs);
  if (recent.length >= limit) {
    buckets.set(key, recent);
    return false;
  }
  recent.push(now);
  buckets.set(key, recent);
  return true;
}
