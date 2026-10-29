import { createHmac, timingSafeEqual } from "crypto"

const SESSION_NAME = "ksl_session"
const SESSION_TTL_MS = 7 * 24 * 60 * 60 * 1000
const MAGIC_LINK_TTL_MS = 15 * 60 * 1000

export type SessionPayload = {
  purpose: "session"
  sub: string
  email: string
  isAdmin: boolean
  iat: number
  exp: number
}

export type MagicLinkPayload = {
  purpose: "magic-link"
  email: string
  iat: number
  exp: number
}

function getSecret(): string | undefined {
  return process.env.SESSION_SECRET || undefined
}

export function signToken(payload: Record<string, unknown>, ttlMs: number): string | null {
  const secret = getSecret()
  if (!secret) return null

  const now = Date.now()
  const full = { ...payload, iat: now, exp: now + ttlMs }
  const header = Buffer.from(JSON.stringify({ alg: "HS256", typ: "JWT" })).toString("base64url")
  const body = Buffer.from(JSON.stringify(full)).toString("base64url")
  const sig = createHmac("sha256", secret).update(`${header}.${body}`).digest("base64url")
  return `${header}.${body}.${sig}`
}

export function verifyToken<T = Record<string, unknown>>(token: string): T | null {
  try {
    const secret = getSecret()
    if (!secret) return null

    const parts = token.split(".")
    if (parts.length !== 3) return null
    const [header, body, sig] = parts
    if (!header || !body || !sig) return null

    const expected = createHmac("sha256", secret).update(`${header}.${body}`).digest("base64url")
    if (!timingSafeEqual(Buffer.from(expected), Buffer.from(sig))) return null

    const payload = JSON.parse(Buffer.from(body, "base64url").toString("utf8")) as T & { exp: number }
    if (Date.now() > payload.exp) return null
    return payload as T
  } catch {
    return null
  }
}

export function signSessionToken(payload: Omit<SessionPayload, "purpose" | "iat" | "exp">): string | null {
  return signToken({ ...payload, purpose: "session" }, SESSION_TTL_MS)
}

export function verifySessionToken(token: string): SessionPayload | null {
  const payload = verifyToken<SessionPayload>(token)
  if (!payload || payload.purpose !== "session") return null
  return payload
}

export function signMagicLinkToken(email: string): string | null {
  return signToken({ purpose: "magic-link", email }, MAGIC_LINK_TTL_MS)
}

export function verifyMagicLinkToken(token: string): MagicLinkPayload | null {
  const payload = verifyToken<MagicLinkPayload>(token)
  if (!payload || payload.purpose !== "magic-link") return null
  return payload
}

export function getSessionCookie(): string | undefined {
  try {
    const { cookies } = require("next/headers")
    return cookies().get(SESSION_NAME)?.value
  } catch {
    return undefined
  }
}

export function setSessionCookie(response: { headers: { set: (key: string, value: string) => void } }, token: string): void {
  const secure = process.env.NODE_ENV === "production"
  response.headers.set(
    "Set-Cookie",
    `${SESSION_NAME}=${token}; HttpOnly${secure ? "; Secure" : ""}; SameSite=Lax; Path=/; Max-Age=${Math.floor(
      SESSION_TTL_MS / 1000,
    )}`,
  )
}

export function clearSessionCookie(response: { headers: { set: (key: string, value: string) => void } }): void {
  response.headers.set(
    "Set-Cookie",
    `${SESSION_NAME}=; HttpOnly; SameSite=Lax; Path=/; Max-Age=0`,
  )
}

export function isAdminEmail(email: string): boolean {
  const allowlist = process.env.ADMIN_EMAILS
    ?.split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean) ?? []
  return allowlist.includes(email.toLowerCase())
}
