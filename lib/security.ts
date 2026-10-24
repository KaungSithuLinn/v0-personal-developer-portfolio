import { z } from "zod"

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

export function createRateLimiter(options: z.input<typeof rateLimitSchema>) {
  const { windowMs, maxRequests, maxEntries } = rateLimitSchema.parse(options)
  const store = new Map<string, RateLimitRecord>()

  function prune(now: number) {
    if (store.size <= maxEntries) return

    for (const [key, record] of store) {
      if (now >= record.resetAt) store.delete(key)
    }

    if (store.size > maxEntries) {
      const overflow = store.size - maxEntries
      let removed = 0
      for (const key of store.keys()) {
        store.delete(key)
        removed += 1
        if (removed >= overflow) break
      }
    }
  }

  return {
    check(ip: string): RateLimitResult {
      const now = Date.now()
      prune(now)

      const existing = store.get(ip)
      if (!existing || now >= existing.resetAt) {
        store.set(ip, { count: 1, resetAt: now + windowMs })
        return { allowed: true, remaining: maxRequests - 1, retryAfterMs: 0 }
      }

      if (existing.count >= maxRequests) {
        return { allowed: false, remaining: 0, retryAfterMs: existing.resetAt - now }
      }

      existing.count += 1
      return { allowed: true, remaining: maxRequests - existing.count, retryAfterMs: 0 }
    },
    reset() {
      store.clear()
    },
  }
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
