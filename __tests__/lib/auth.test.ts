import { describe, it, expect, beforeEach, afterEach, vi } from "vitest"
import {
  signSessionToken,
  verifySessionToken,
  signMagicLinkToken,
  verifyMagicLinkToken,
  isAdminEmail,
  signToken,
  verifyToken,
} from "@/lib/auth"

describe("auth tokens", () => {
  const originalEnv = process.env

  beforeEach(() => {
    process.env = { ...originalEnv, SESSION_SECRET: "test-secret" }
  })

  afterEach(() => {
    process.env = originalEnv
    vi.useRealTimers()
  })

  it("returns null when no secret is configured", () => {
    delete process.env.SESSION_SECRET
    expect(signToken({ purpose: "test" }, 1000)).toBeNull()
    expect(signSessionToken({ sub: "user@example.com", email: "user@example.com", isAdmin: false })).toBeNull()
  })

  it("signs and verifies a session token", () => {
    const token = signSessionToken({ sub: "user@example.com", email: "user@example.com", isAdmin: true })
    expect(token).not.toBeNull()
    const payload = verifySessionToken(token as string)
    expect(payload?.purpose).toBe("session")
    expect(payload?.email).toBe("user@example.com")
    expect(payload?.isAdmin).toBe(true)
  })

  it("rejects a tampered session token", () => {
    const token = signSessionToken({ sub: "user@example.com", email: "user@example.com", isAdmin: false })
    const tampered = `${token?.slice(0, -1)}x`
    expect(verifySessionToken(tampered as string)).toBeNull()
  })

  it("rejects a token with the wrong purpose", () => {
    const token = signMagicLinkToken("user@example.com")
    expect(verifySessionToken(token as string)).toBeNull()
  })

  it("signs and verifies a magic link token", () => {
    const token = signMagicLinkToken("user@example.com")
    const payload = verifyMagicLinkToken(token as string)
    expect(payload?.purpose).toBe("magic-link")
    expect(payload?.email).toBe("user@example.com")
  })

  it("rejects expired tokens", () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date("2026-01-01T00:00:00.000Z"))
    const token = signToken({ purpose: "session" }, 1000)
    vi.setSystemTime(new Date("2026-01-01T00:00:02.000Z"))
    expect(verifyToken(token as string)).toBeNull()
  })

  it("checks admin email allowlists", () => {
    process.env.ADMIN_EMAILS = "admin@example.com, owner@example.com"
    expect(isAdminEmail("Admin@Example.com")).toBe(true)
    expect(isAdminEmail("user@example.com")).toBe(false)
  })
})