import { z } from "zod"

export const NO_STORE_HEADERS = {
  "Cache-Control": "no-store, no-cache, must-revalidate",
} as const

const rateLimitSchema = z.object({
  windowMs: z.number().int().positive(),
  maxRequests: z.number().int().positive(),
  maxEntries: z.number().int().positive().optional().default(10_000),
})

type RateLimitRecord = {
  count: number
  resetAt: number
}

export type RateLimitResult = {
  allowed: boolean
  remaining: number
  retryAfterMs: number
}

export type RateLimiter = {
  check(key: string): RateLimitResult
  reset(): void
}

export type RateLimitStore = {
  consume(key: string, now: number): RateLimitRecord
  clear(): void
}

class MemoryRateLimitStore implements RateLimitStore {
  private store = new Map<string, RateLimitRecord>()

  constructor(
    private readonly windowMs: number,
    private readonly maxEntries: number,
  ) {}

  private prune(now: number) {
    if (this.store.size <= this.maxEntries) return

    for (const [key, record] of this.store) {
      if (now >= record.resetAt) this.store.delete(key)
    }

    if (this.store.size > this.maxEntries) {
      const overflow = this.store.size - this.maxEntries
      let removed = 0
      for (const key of this.store.keys()) {
        this.store.delete(key)
        removed += 1
        if (removed >= overflow) break
      }
    }
  }

  consume(key: string, now: number): RateLimitRecord {
    this.prune(now)
    const existing = this.store.get(key)
    if (!existing || now >= existing.resetAt) {
      const record = { count: 1, resetAt: now + this.windowMs }
      this.store.set(key, record)
      return record
    }
    existing.count += 1
    return existing
  }

  clear() {
    this.store.clear()
  }
}

export function createRateLimiter(options: z.input<typeof rateLimitSchema>): RateLimiter {
  const { windowMs, maxRequests, maxEntries } = rateLimitSchema.parse(options)
  const store = new MemoryRateLimitStore(windowMs, maxEntries)

  return {
    check(key: string): RateLimitResult {
      const now = Date.now()
      const record = store.consume(key, now)
      if (record.count > maxRequests) {
        return { allowed: false, remaining: 0, retryAfterMs: Math.max(0, record.resetAt - now) }
      }
      return { allowed: true, remaining: Math.max(0, maxRequests - record.count), retryAfterMs: 0 }
    },
    reset() {
      store.clear()
    },
  }
}

export function rateLimitHeaders(result: RateLimitResult, limit: number): HeadersInit {
  const headers: Record<string, string> = {
    ...NO_STORE_HEADERS,
    "X-RateLimit-Limit": String(limit),
    "X-RateLimit-Remaining": String(result.remaining),
  }
  if (!result.allowed) {
    headers["Retry-After"] = String(Math.max(1, Math.ceil(result.retryAfterMs / 1000)))
  }
  return headers
}

export function isSameOriginRequest(request: Request): boolean {
  return checkCsrf(request)
}

export function getClientIp(request: Request): string {
  const isVercel = process.env.VERCEL === "1"
  const trustProxy = isVercel || process.env.TRUST_PROXY === "true"

  if (isVercel) {
    const vercelIp = request.headers.get("x-vercel-forwarded-for")
    const firstVercelIp = vercelIp?.split(",")[0]?.trim()
    if (firstVercelIp) return firstVercelIp
  }

  if (trustProxy) {
    const realIp = request.headers.get("x-real-ip")?.trim()
    if (realIp) return realIp

    const forwarded = request.headers.get("x-forwarded-for")
    const firstForwardedIp = forwarded?.split(",")[0]?.trim()
    if (firstForwardedIp) return firstForwardedIp
  }

  return "unknown"
}

export function checkCsrf(request: Request): boolean {
  const secFetchSite = request.headers.get("sec-fetch-site")
  if (secFetchSite && !["same-origin", "none"].includes(secFetchSite)) {
    return false
  }

  const requestHost = request.headers.get("host")
  if (!requestHost) return false

  const allowedHosts = new Set<string>([requestHost])

  const appUrl = process.env.NEXT_PUBLIC_APP_URL
  if (appUrl) {
    try {
      allowedHosts.add(new URL(appUrl).host)
    } catch {
      return false
    }
  }

  const source = request.headers.get("origin") || request.headers.get("referer")
  if (!source) {
    return secFetchSite === "same-origin" || secFetchSite === "none"
  }

  try {
    return allowedHosts.has(new URL(source).host)
  } catch {
    return false
  }
}

export function getRequestSize(request: Request, maxBytes: number): boolean {
  const contentLength = request.headers.get("content-length")
  if (!contentLength) return true

  const size = Number(contentLength)
  return Number.isFinite(size) && size >= 0 && size <= maxBytes
}

export function getRequiredEnv(name: string): string {
  const value = process.env[name]
  if (!value) {
    throw new Error(`${name} is required`)
  }
  return value
}

export function getSiteUrl(request?: Request): string {
  const configuredUrl = process.env.NEXT_PUBLIC_SITE_URL
  if (configuredUrl) {
    try {
      return new URL(configuredUrl).origin
    } catch {
      throw new Error("NEXT_PUBLIC_SITE_URL must be a valid URL")
    }
  }

  if (request) {
    const host = request.headers.get("host")
    if (host) {
      const protocol = request.headers.get("x-forwarded-proto") || "https"
      return `${protocol}://${host}`
    }
  }

  return process.env.NODE_ENV === "production"
    ? "https://example.com"
    : "http://localhost:3000"
}
