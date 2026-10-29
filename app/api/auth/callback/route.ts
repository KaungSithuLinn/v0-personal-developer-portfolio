import { NextResponse } from "next/server"
import {
  verifyMagicLinkToken,
  signSessionToken,
  setSessionCookie,
  isAdminEmail,
} from "@/lib/auth"

export const runtime = "nodejs"

export async function GET(request: Request) {
  const url = new URL(request.url)
  const token = url.searchParams.get("token")
  const callbackUrl = url.searchParams.get("callbackUrl") || "/en"

  if (!token) {
    return NextResponse.redirect(new URL("/en/login?error=missing_token", url.origin))
  }

  const payload = verifyMagicLinkToken(token)
  if (!payload) {
    return NextResponse.redirect(new URL("/en/login?error=expired", url.origin))
  }

  const sessionToken = signSessionToken({
    sub: payload.email,
    email: payload.email,
    isAdmin: isAdminEmail(payload.email),
  })
  if (!sessionToken) {
    return NextResponse.redirect(new URL("/en/login?error=server", url.origin))
  }

  let target: URL
  try {
    target = new URL(callbackUrl, url.origin)
  } catch {
    target = new URL("/en", url.origin)
  }
  if (target.origin !== url.origin) {
    target = new URL("/en", url.origin)
  }

  const response = NextResponse.redirect(target)
  setSessionCookie(response, sessionToken)
  return response
}
