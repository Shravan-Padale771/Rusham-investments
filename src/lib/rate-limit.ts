import "server-only";

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  /** Seconds until the client may retry. */
  retryAfter: number;
}

export interface RateLimiter {
  limit(key: string): Promise<RateLimitResult>;
}

const WINDOW_SECONDS = 15 * 60;
const MAX_REQUESTS = 5;

/**
 * In-memory sliding window. Fine for local development and a single server
 * instance. On serverless platforms (Vercel) each instance has its own memory,
 * so configure the Upstash adapter below for reliable production limiting.
 */
class MemoryRateLimiter implements RateLimiter {
  private hits = new Map<string, number[]>();

  async limit(key: string): Promise<RateLimitResult> {
    const now = Date.now();
    const windowMs = WINDOW_SECONDS * 1000;
    const recent = (this.hits.get(key) ?? []).filter((t) => now - t < windowMs);

    if (recent.length >= MAX_REQUESTS) {
      this.hits.set(key, recent);
      return {
        allowed: false,
        remaining: 0,
        retryAfter: Math.ceil((recent[0] + windowMs - now) / 1000),
      };
    }

    recent.push(now);
    this.hits.set(key, recent);

    if (this.hits.size > 5000) {
      for (const [k, v] of this.hits) {
        if (v.every((t) => now - t >= windowMs)) this.hits.delete(k);
      }
    }
    return { allowed: true, remaining: MAX_REQUESTS - recent.length, retryAfter: 0 };
  }
}

/**
 * Upstash Redis (REST) fixed-window limiter. Works on serverless/edge with no
 * extra dependency. Enabled when UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN are set.
 */
class UpstashRateLimiter implements RateLimiter {
  constructor(
    private url: string,
    private token: string,
    private fallback: RateLimiter,
  ) {}

  async limit(key: string): Promise<RateLimitResult> {
    try {
      const redisKey = `rusham:contact:${key}`;
      const res = await fetch(`${this.url}/pipeline`, {
        method: "POST",
        headers: { Authorization: `Bearer ${this.token}`, "Content-Type": "application/json" },
        body: JSON.stringify([
          ["INCR", redisKey],
          ["EXPIRE", redisKey, String(WINDOW_SECONDS), "NX"],
          ["TTL", redisKey],
        ]),
        cache: "no-store",
      });
      if (!res.ok) throw new Error(`Upstash responded ${res.status}`);
      const data = (await res.json()) as Array<{ result: number }>;
      const count = Number(data[0]?.result ?? 0);
      const ttl = Number(data[2]?.result ?? WINDOW_SECONDS);
      return {
        allowed: count <= MAX_REQUESTS,
        remaining: Math.max(0, MAX_REQUESTS - count),
        retryAfter: count <= MAX_REQUESTS ? 0 : Math.max(1, ttl),
      };
    } catch (error) {
      console.error("[rate-limit] Upstash unavailable, using in-memory fallback:", (error as Error).message);
      return this.fallback.limit(key);
    }
  }
}

const globalForLimiter = globalThis as typeof globalThis & { __rushamLimiter?: RateLimiter };

export function getRateLimiter(): RateLimiter {
  if (globalForLimiter.__rushamLimiter) return globalForLimiter.__rushamLimiter;
  const memory = new MemoryRateLimiter();
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  globalForLimiter.__rushamLimiter = url && token ? new UpstashRateLimiter(url, token, memory) : memory;
  return globalForLimiter.__rushamLimiter;
}

export function getClientIp(headers: Headers): string {
  const forwarded = headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return headers.get("x-real-ip") ?? "unknown";
}
