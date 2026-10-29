import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { verifySessionToken } from "@/lib/auth"

export const runtime = "nodejs"

export async function GET() {
  const cookieStore = await cookies()
  const token = cookieStore.get("ksl_session")?.value
  if (!token) return NextResponse.json({ user: null })
  const payload = verifySessionToken(token)
  if (!payload) return NextResponse.json({ user: null })
  return NextResponse.json({
    user: { id: payload.sub, email: payload.email, isAdmin: payload.isAdmin },
  })
}
