import { NextResponse } from "next/server"
import { z } from "zod"
import { Resend } from "resend"
import {
  checkCsrf,
  createRateLimiter,
  getClientIp,
  getRequestSize,
  getRequiredEnv,
  NO_STORE_HEADERS,
  rateLimitHeaders,
} from "@/lib/security"
import { signMagicLinkToken } from "@/lib/auth"

const schema = z.object({
  email: z.string().email("Invalid email address").max(254),
})

const MAGIC_LINK_RATE_LIMIT = { windowMs: 60_000, maxRequests: 3, maxEntries: 10_000 } as const
const rateLimiter = createRateLimiter(MAGIC_LINK_RATE_LIMIT)

export const runtime = "nodejs"

export async function POST(request: Request) {
  try {
    if (!getRequestSize(request, 1024)) {
      return NextResponse.json(
        { error: "Request body is too large" },
        { status: 413, headers: NO_STORE_HEADERS },
      )
    }

    if (!checkCsrf(request)) {
      return NextResponse.json(
        { error: "Invalid request origin" },
        { status: 403, headers: NO_STORE_HEADERS },
      )
    }

    const ip = getClientIp(request)
    const limit = rateLimiter.check(`magic-link:${ip}`)
    if (!limit.allowed) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        {
          status: 429,
          headers: rateLimitHeaders(limit, MAGIC_LINK_RATE_LIMIT.maxRequests),
        },
      )
    }

    let body: unknown
    try {
      body = await request.json()
    } catch {
      return NextResponse.json(
        { error: "Invalid JSON body" },
        { status: 400, headers: NO_STORE_HEADERS },
      )
    }

    const { email } = schema.parse(body)

    const token = signMagicLinkToken(email.toLowerCase())
    if (!token) {
      return NextResponse.json(
        { error: "Authentication is not configured" },
        { status: 500, headers: NO_STORE_HEADERS },
      )
    }

    const resendApiKey = getRequiredEnv("RESEND_API_KEY")
    const resend = new Resend(resendApiKey)
    const siteUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
    const link = `${siteUrl}/en/auth/callback?token=${encodeURIComponent(token)}`

    await resend.emails.send({
      from: process.env.CONTACT_FROM || "Portfolio Auth <onboarding@resend.dev>",
      to: [email],
      subject: "Sign in to your portfolio",
      html: [
        "<p>Use this link to sign in:</p>",
        `<p><a href="${link}">${link}</a></p>`,
        "<p>This link expires in 15 minutes.</p>",
      ].join(""),
    })

    return NextResponse.json(
      { message: "Magic link sent" },
      { status: 202, headers: NO_STORE_HEADERS },
    )
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation failed", details: error.issues },
        { status: 400, headers: NO_STORE_HEADERS },
      )
    }
    console.error("Magic link error", error instanceof Error ? error.message : "unknown")
    return NextResponse.json(
      { error: "Failed to send magic link" },
      { status: 500, headers: NO_STORE_HEADERS },
    )
  }
}
