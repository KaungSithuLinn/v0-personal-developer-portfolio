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

const contactSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100),
  email: z.string().trim().email("Invalid email address").max(254),
  subject: z.string().trim().min(1, "Subject is required").max(200),
  message: z.string().trim().min(1, "Message is required").max(5000),
  website: z.string().max(0).optional(),
})

const rateLimiter = createRateLimiter({
  windowMs: 60_000,
  maxRequests: 3,
  maxEntries: 10_000,
})

const noStoreHeaders = {
  "Cache-Control": "no-store, no-cache, must-revalidate",
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;")
}

export async function POST(request: Request) {
  try {
    if (!getRequestSize(request, 1024 * 1024)) {
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
    const rateLimit = rateLimiter.check(ip)

    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        {
          status: 429,
          headers: {
            ...noStoreHeaders,
            "Retry-After": String(Math.max(1, Math.ceil(rateLimit.retryAfterMs / 1000))),
          },
        },
      )
    }

    const formData = await request.formData()
    const website = (formData.get("website") ?? "").toString()
    if (website.length > 0) {
      return NextResponse.json(
        { message: "Message sent successfully" },
        { status: 200, headers: noStoreHeaders },
      )
    }

    const validated = contactSchema.parse({
      name: formData.get("name"),
      email: formData.get("email"),
      subject: formData.get("subject"),
      message: formData.get("message"),
      website,
    })

    const resendApiKey = getRequiredEnv("RESEND_API_KEY")
    const contactEmail = getRequiredEnv("CONTACT_EMAIL")
    const resend = new Resend(resendApiKey)

    await resend.emails.send({
      from: process.env.CONTACT_FROM || "Portfolio Contact <onboarding@resend.dev>",
      to: [contactEmail],
      replyTo: validated.email,
      subject: `[Portfolio] ${validated.subject}`,
      html: [
        "<h2>New Contact Form Submission</h2>",
        `<p><strong>Name:</strong> ${escapeHtml(validated.name)}</p>`,
        `<p><strong>Email:</strong> ${escapeHtml(validated.email)}</p>`,
        `<p><strong>Subject:</strong> ${escapeHtml(validated.subject)}</p>`,
        "<p><strong>Message:</strong></p>",
        `<p>${escapeHtml(validated.message).replace(/\n/g, "<br>")}</p>`,
      ].join("\n"),
    })

    return NextResponse.json(
      { message: "Message sent successfully", remaining: rateLimit.remaining },
      { status: 200, headers: noStoreHeaders },
    )
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation failed", details: error.issues },
        { status: 400, headers: noStoreHeaders },
      )
    }

    console.error("Contact form error", { message: error instanceof Error ? error.message : "unknown" })
    return NextResponse.json(
      { error: "Failed to send message" },
      { status: 500, headers: noStoreHeaders },
    )
  }
}
