import type { Request, Response, NextFunction, RequestHandler } from "express";

type Entry = { count: number; resetAt: number };

/**
 * Small in-memory fixed-window limiter for a single backend instance.
 * Use a shared store (for example Redis) if the API is scaled to multiple replicas.
 */
export function createRateLimit(maxRequests: number, windowMs: number): RequestHandler {
  const entries = new Map<string, Entry>();
  let lastCleanup = 0;

  return (req: Request, res: Response, next: NextFunction) => {
    const now = Date.now();
    const key = req.ip || req.socket.remoteAddress || "unknown";
    let entry = entries.get(key);

    if (!entry || entry.resetAt <= now) {
      entry = { count: 0, resetAt: now + windowMs };
      entries.set(key, entry);
    }

    entry.count += 1;

    // Periodically remove expired keys so the map does not grow indefinitely.
    if (now - lastCleanup > 60_000) {
      for (const [ip, value] of entries) {
        if (value.resetAt <= now) entries.delete(ip);
      }
      lastCleanup = now;
    }

    res.setHeader("RateLimit-Limit", String(maxRequests));
    res.setHeader("RateLimit-Remaining", String(Math.max(0, maxRequests - entry.count)));
    res.setHeader("RateLimit-Reset", String(Math.ceil(entry.resetAt / 1000)));

    if (entry.count > maxRequests) {
      res.setHeader("Retry-After", String(Math.ceil((entry.resetAt - now) / 1000)));
      res.status(429).json({ error: "Too many requests. Please try again later." });
      return;
    }

    next();
  };
}
