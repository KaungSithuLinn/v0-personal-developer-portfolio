import { describe, it, expect, beforeEach, vi } from 'vitest'
import {
  createRateLimiter,
  getClientIp,
  checkCsrf,
  getRequestSize,
  getRequiredEnv,
  getSiteUrl,
} from '@/lib/security'

describe('createRateLimiter', () => {
  beforeEach(() => {
    vi.useRealTimers()
  })

  it('allows requests up to maxRequests in window', () => {
    const limiter = createRateLimiter({ windowMs: 60_000, maxRequests: 3 })
    const r1 = limiter.check('1.1.1.1')
    expect(r1.allowed).toBe(true)
    expect(r1.remaining).toBe(2)
    const r2 = limiter.check('1.1.1.1')
    expect(r2.allowed).toBe(true)
    expect(r2.remaining).toBe(1)
    const r3 = limiter.check('1.1.1.1')
    expect(r3.allowed).toBe(true)
    expect(r3.remaining).toBe(0)
    const r4 = limiter.check('1.1.1.1')
    expect(r4.allowed).toBe(false)
    expect(r4.remaining).toBe(0)
    expect(r4.retryAfterMs).toBeGreaterThan(0)
  })

  it('resets after window passes', () => {
    vi.useFakeTimers()
    const limiter = createRateLimiter({ windowMs: 1000, maxRequests: 1 })
    const r1 = limiter.check('2.2.2.2')
    expect(r1.allowed).toBe(true)
    const r2 = limiter.check('2.2.2.2')
    expect(r2.allowed).toBe(false)
    vi.advanceTimersByTime(1001)
    const r3 = limiter.check('2.2.2.2')
    expect(r3.allowed).toBe(true)
    vi.useRealTimers()
  })

  it('prunes entries when over maxEntries', () => {
    const limiter = createRateLimiter({ windowMs: 60_000, maxRequests: 10, maxEntries: 2 })
    limiter.check('a')
    limiter.check('b')
    limiter.check('c') // should trigger pruning
    // After pruning, limiter should still function
    const res = limiter.check('d')
    expect(res.allowed).toBe(true)
  })

  it('reset() clears store', () => {
    const limiter = createRateLimiter({ windowMs: 60_000, maxRequests: 1 })
    expect(limiter.check('x').allowed).toBe(true)
    expect(limiter.check('x').allowed).toBe(false)
    limiter.reset()
    expect(limiter.check('x').allowed).toBe(true)
  })
})

describe('getClientIp', () => {
  const originalEnv = process.env

  beforeEach(() => {
    process.env = { ...originalEnv }
  })

  it('returns x-vercel-forwarded-for first ip on Vercel', () => {
    process.env.VERCEL = '1'
    const req = new Request('http://example.com', {
      headers: { 'x-vercel-forwarded-for': '1.2.3.4, 5.6.7.8' },
    })
    expect(getClientIp(req)).toBe('1.2.3.4')
  })

  it('falls back to other headers if vercel header missing', () => {
    process.env.VERCEL = '1'
    const req = new Request('http://example.com')
    expect(getClientIp(req)).toBe('unknown')
  })

  it('uses x-real-ip when trust proxy enabled', () => {
    process.env.TRUST_PROXY = 'true'
    const req = new Request('http://example.com', {
      headers: { 'x-real-ip': '9.9.9.9' },
    })
    expect(getClientIp(req)).toBe('9.9.9.9')
  })

  it('uses x-forwarded-for when trust proxy enabled', () => {
    process.env.TRUST_PROXY = 'true'
    const req = new Request('http://example.com', {
      headers: { 'x-forwarded-for': '8.8.8.8, 1.1.1.1' },
    })
    expect(getClientIp(req)).toBe('8.8.8.8')
  })

  it('returns unknown when no trusted headers', () => {
    const req = new Request('http://example.com')
    expect(getClientIp(req)).toBe('unknown')
  })
})

describe('checkCsrf', () => {
  it('returns false if sec-fetch-site is cross-site', () => {
    const req = new Request('http://example.com', {
      headers: { 'sec-fetch-site': 'cross-site', host: 'example.com' },
    })
    expect(checkCsrf(req)).toBe(false)
  })

  it('allows same-origin with sec-fetch-site', () => {
    const req = new Request('http://example.com', {
      headers: { 'sec-fetch-site': 'same-origin', host: 'example.com' },
    })
    expect(checkCsrf(req)).toBe(true)
  })

  it('allows none with sec-fetch-site', () => {
    const req = new Request('http://example.com', {
      headers: { 'sec-fetch-site': 'none', host: 'example.com' },
    })
    expect(checkCsrf(req)).toBe(true)
  })

  it('returns false if host missing', () => {
    const req = new Request('http://example.com', {
      headers: { origin: 'http://example.com' },
    })
    expect(checkCsrf(req)).toBe(false)
  })

  it('validates origin against allowed hosts', () => {
    const req = new Request('http://example.com', {
      headers: { host: 'example.com', origin: 'http://example.com' },
    })
    expect(checkCsrf(req)).toBe(true)
  })

  it('rejects invalid origin', () => {
    const req = new Request('http://example.com', {
      headers: { host: 'example.com', origin: 'http://evil.com' },
    })
    expect(checkCsrf(req)).toBe(false)
  })

  it('accepts NEXT_PUBLIC_APP_URL as allowed host', () => {
    process.env.NEXT_PUBLIC_APP_URL = 'https://app.example.com'
    const req = new Request('http://example.com', {
      headers: { host: 'example.com', origin: 'https://app.example.com' },
    })
    expect(checkCsrf(req)).toBe(true)
    delete process.env.NEXT_PUBLIC_APP_URL
  })

  it('returns false if NEXT_PUBLIC_APP_URL is invalid', () => {
    process.env.NEXT_PUBLIC_APP_URL = 'not-a-url'
    const req = new Request('http://example.com', {
      headers: { host: 'example.com', origin: 'http://example.com' },
    })
    expect(checkCsrf(req)).toBe(false)
    delete process.env.NEXT_PUBLIC_APP_URL
  })

  it('checks referer if origin missing', () => {
    const req = new Request('http://example.com', {
      headers: { host: 'example.com', referer: 'http://example.com/page' },
    })
    expect(checkCsrf(req)).toBe(true)
  })

  it('allows same-origin if no origin/referer but sec-fetch-site is same-origin', () => {
    const req = new Request('http://example.com', {
      headers: { host: 'example.com', 'sec-fetch-site': 'same-origin' },
    })
    expect(checkCsrf(req)).toBe(true)
  })
})

describe('getRequestSize', () => {
  it('returns true if no content-length', () => {
    const req = new Request('http://example.com')
    expect(getRequestSize(req, 1024)).toBe(true)
  })

  it('returns true if size within limit', () => {
    const req = new Request('http://example.com', {
      headers: { 'content-length': '500' },
    })
    expect(getRequestSize(req, 1024)).toBe(true)
  })

  it('returns false if size exceeds limit', () => {
    const req = new Request('http://example.com', {
      headers: { 'content-length': '2000' },
    })
    expect(getRequestSize(req, 1024)).toBe(false)
  })

  it('returns false if content-length is not finite', () => {
    const req = new Request('http://example.com', {
      headers: { 'content-length': 'abc' },
    })
    expect(getRequestSize(req, 1024)).toBe(false)
  })
})

describe('getRequiredEnv', () => {
  it('returns env value if exists', () => {
    process.env.TEST_VAR = 'hello'
    expect(getRequiredEnv('TEST_VAR')).toBe('hello')
    delete process.env.TEST_VAR
  })

  it('throws if env missing', () => {
    expect(() => getRequiredEnv('MISSING_VAR_XYZ')).toThrow('MISSING_VAR_XYZ is required')
  })
})

describe('getSiteUrl', () => {
  const originalEnv = process.env

  beforeEach(() => {
    process.env = { ...originalEnv }
  })

  it('uses NEXT_PUBLIC_SITE_URL if configured', () => {
    process.env.NEXT_PUBLIC_SITE_URL = 'https://example.com'
    expect(getSiteUrl()).toBe('https://example.com')
  })

  it('throws if NEXT_PUBLIC_SITE_URL is invalid', () => {
    process.env.NEXT_PUBLIC_SITE_URL = 'not-a-url'
    expect(() => getSiteUrl()).toThrow('NEXT_PUBLIC_SITE_URL must be a valid URL')
  })

  it('uses request headers if no env var', () => {
    delete process.env.NEXT_PUBLIC_SITE_URL
    const req = new Request('http://example.com', {
      headers: { host: 'mysite.com', 'x-forwarded-proto': 'https' },
    })
    expect(getSiteUrl(req)).toBe('https://mysite.com')
  })

  it('falls back to defaults based on NODE_ENV', () => {
    delete process.env.NEXT_PUBLIC_SITE_URL
    const envProd = process.env as any
    envProd.NODE_ENV = 'production'
    expect(getSiteUrl()).toBe('https://example.com')
    const envDev = process.env as any
    envDev.NODE_ENV = 'development'
    expect(getSiteUrl()).toBe('http://localhost:3000')
  })
})

