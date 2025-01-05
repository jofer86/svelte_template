interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const store = new Map<string, RateLimitEntry>();

const WINDOW_MS = 60 * 1000; // 1 minute
const MAX_REQUESTS = 100; // 100 requests per minute

export function rateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = store.get(ip);

  // Clean up old entries
  if (entry && entry.resetAt < now) {
    store.delete(ip);
  }

  // If no entry exists or it's expired, create a new one
  if (!entry || entry.resetAt < now) {
    store.set(ip, {
      count: 1,
      resetAt: now + WINDOW_MS
    });
    return true;
  }

  // Increment the counter
  entry.count++;

  // Check if over limit
  if (entry.count > MAX_REQUESTS) {
    return false;
  }

  return true;
}

// Cleanup function to prevent memory leaks
setInterval(() => {
  const now = Date.now();
  for (const [ip, entry] of store.entries()) {
    if (entry.resetAt < now) {
      store.delete(ip);
    }
  }
}, WINDOW_MS);