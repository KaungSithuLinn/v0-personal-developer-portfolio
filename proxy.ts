import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { SUPPORTED_LANGUAGES, DEFAULT_LANGUAGE } from "@/config/language.config"
import { SESSION_COOKIE_NAME, verifySessionToken } from "@/lib/auth"

const SECURITY_HEADERS = {
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "DENY",
  "X-XSS-Protection": "0",
  "Strict-Transport-Security": "max-age=63072000; includeSubDomains; preload",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Permissions-Policy": "camera=(), microphone=(), geolocation=()",
} as const

function buildCsp(nonce: string): string {
  const isDevelopment = process.env.NODE_ENV === "development"

  return [
    "default-src 'self'",
    "base-uri 'self'",
    "frame-ancestors 'none'",
    "object-src 'none'",
    `script-src 'self' 'nonce-${nonce}' 'strict-dynamic'${isDevelopment ? " 'unsafe-eval'" : ""}`,
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: https://v0.blob.com https://hebbkx1anhila5yf.public.blob.vercel-storage.com",
    "font-src 'self' data:",
    "connect-src 'self'",
    "form-action 'self'",
    "upgrade-insecure-requests",
  ].join("; ")
}

function applySecurityHeaders(response: NextResponse, csp: string) {
  response.headers.set("Content-Security-Policy", csp)
  for (const [key, value] of Object.entries(SECURITY_HEADERS)) {
    response.headers.set(key, value)
  }
}

function getSessionToken(request: NextRequest): string | null {
  const cookie = request.cookies.get(SESSION_COOKIE_NAME)?.value
  if (cookie) return cookie
  const header = request.headers.get("cookie") ?? ""
  const match = header.match(new RegExp(`(?:^|; )${SESSION_COOKIE_NAME}=([^;]+)`))
  return match?.[1] ?? null
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  const nonce = Buffer.from(crypto.randomUUID()).toString("base64")
  const csp = buildCsp(nonce)

  if (pathname === "/") {
    const url = new URL(request.nextUrl)
    url.pathname = `/${DEFAULT_LANGUAGE}`
    const response = NextResponse.redirect(url, 307)
    applySecurityHeaders(response, csp)
    return response
  }

  const localePrefix = pathname.match(/^\/(en|zh|ms)(?=\/|$)/)?.[0] ?? ""
  const normalizedPath = localePrefix ? pathname.slice(localePrefix.length) || "/" : pathname

  // Admin/preview surfaces require a valid session.
  if (
    normalizedPath === "/admin" ||
    normalizedPath.startsWith("/admin/") ||
    normalizedPath === "/preview" ||
    normalizedPath.startsWith("/preview/")
  ) {
    const session = verifySessionToken(getSessionToken(request) ?? "")
    if (!session) {
      const first = pathname.split("/")[1]
      const lang = SUPPORTED_LANGUAGES.includes(first as (typeof SUPPORTED_LANGUAGES)[number])
        ? first
        : DEFAULT_LANGUAGE
      const redirectUrl = new URL(`/${lang}/login`, request.nextUrl.origin)
      redirectUrl.searchParams.set("callbackUrl", pathname)
      const response = NextResponse.redirect(redirectUrl, 307)
      applySecurityHeaders(response, csp)
      return response
    }
  }

  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.includes(".") ||
    pathname === "/sitemap.xml" ||
    pathname === "/robots.txt"
  ) {
    const response = NextResponse.next()
    applySecurityHeaders(response, csp)
    return response
  }

  const locale = pathname.split("/")[1]
  if (SUPPORTED_LANGUAGES.includes(locale as (typeof SUPPORTED_LANGUAGES)[number])) {
    const requestHeaders = new Headers(request.headers)
    requestHeaders.set("x-nonce", nonce)
    requestHeaders.set("x-locale", locale)
    requestHeaders.set("Content-Security-Policy", csp)

    const response = NextResponse.next({
      request: { headers: requestHeaders },
    })
    applySecurityHeaders(response, csp)
    return response
  }

  const url = new URL(request.nextUrl)
  url.pathname = `/${DEFAULT_LANGUAGE}${pathname}`
  const response = NextResponse.redirect(url, 307)
  applySecurityHeaders(response, csp)
  return response
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|icon.svg).*)"],
}
