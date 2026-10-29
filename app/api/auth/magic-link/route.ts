import { NextResponse } from "next/server"
import { z } from "zod"
import { Resend } from "resend"
import {
  checkCsrf,
  createRateLimiter,
  getClientIp,
  getRequestSize,
  getRequiredEnv,
} from "@/lib/security"
import { signMagicLinkToken } from "@/lib/auth"

const schema = z.object({
  email: z.string().email("Invalid email address").max(254),
})

const rateLimiter = createRateLimiter({
  windowMs: 60_000,
  maxRequests: 3,
  maxEntries: 10_000,
})

const noStoreHeaders = {
  "Cache-Control": "no-store, no-cache, must-revalidate",
}

export const runtime = "nodejs"

export async function POST(request: Request) {
  try {
    if (!getRequestSize(request, 1024)) {
      return NextResponse.json(
        { error: "Request body is too large" },
        { status: 413, headers: noStoreHeaders },
      )
    }

    if (!checkCsrf(request)) {
      return NextResponse.json(
        { error: "Invalid request origin" },
        { status: 403, headers: noStoreHeaders },
      )
    }

    const ip = getClientIp(request)
    const limit = rateLimiter.check(ip)
    if (!limit.allowed) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        {
          status: 429,
          headers: {
            ...noStoreHeaders,
            "Retry-After": String(Math.max(1, Math.ceil(limit.retryAfterMs / 1000))),
          },
        },
      )
    }

    let body: unknown
    try {
      body = await request.json()
    } catch {
      return NextResponse.json(
        { error: "Invalid JSON body" },
        { status: 400, headers: noStoreHeaders },
      )
    }

    const { email } = schema.parse(body)

    const token = signMagicLinkToken(email.toLowerCase())
    if (!token) {
      return NextResponse.json(
        { error: "Authentication is not configured" },
        { status: 500, headers: noStoreHeaders },
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
      { status: 202, headers: noStoreHeaders },
    )
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation failed", details: error.issues },
        { status: 400, headers: noStoreHeaders },
      )
    }
    console.error("Magic link error", error instanceof Error ? error.message : "unknown")
    return NextResponse.json(
      { error: "Failed to send magic link" },
      { status: 500, headers: noStoreHeaders },
    )
  }
}
