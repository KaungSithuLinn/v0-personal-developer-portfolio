import { NextResponse } from "next/server"
import { checkCsrf } from "@/lib/security"
import { clearSessionCookie } from "@/lib/auth"

const noStoreHeaders = {
  "Cache-Control": "no-store, no-cache, must-revalidate",
}

export const runtime = "nodejs"

export async function POST(request: Request) {
  if (!checkCsrf(request)) {
    return NextResponse.json({ error: "Invalid request origin" }, { status: 403, headers: noStoreHeaders })
  }

  const origin = new URL(request.url).origin
  const response = NextResponse.redirect(new URL("/en", origin))
  clearSessionCookie(response)
  return response
}
