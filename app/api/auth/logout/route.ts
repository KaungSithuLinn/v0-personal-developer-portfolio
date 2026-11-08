import { NextResponse } from "next/server"
import { checkCsrf, NO_STORE_HEADERS } from "@/lib/security"
import { clearSessionCookie } from "@/lib/auth"

export const runtime = "nodejs"

export async function POST(request: Request) {
  if (!checkCsrf(request)) {
    return NextResponse.json({ error: "Invalid request origin" }, { status: 403, headers: NO_STORE_HEADERS })
  }

  const origin = new URL(request.url).origin
  const response = NextResponse.redirect(new URL("/en", origin))
  clearSessionCookie(response)
  return response
}
