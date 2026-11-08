import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { SESSION_COOKIE_NAME, verifySessionToken } from "@/lib/auth"
import { NO_STORE_HEADERS } from "@/lib/security"

export const runtime = "nodejs"

export async function GET() {
  const cookieStore = await cookies()
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value
  if (!token) return NextResponse.json({ user: null }, { headers: NO_STORE_HEADERS })
  const payload = verifySessionToken(token)
  if (!payload) return NextResponse.json({ user: null }, { headers: NO_STORE_HEADERS })
  return NextResponse.json(
    {
      user: { id: payload.sub, email: payload.email, isAdmin: payload.isAdmin },
    },
    { headers: NO_STORE_HEADERS },
  )
}
