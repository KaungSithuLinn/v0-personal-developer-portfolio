import { NextResponse } from 'next/server'
import { z } from 'zod'
import { Resend } from 'resend'

const contactSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  email: z.string().email('Invalid email address'),
  subject: z.string().min(1, 'Subject is required').max(200),
  message: z.string().min(1, 'Message is required').max(5000),
  website: z.string().max(0).optional(),
})

const RATE_LIMIT_WINDOW_MS = 60 * 1000
const RATE_LIMIT_MAX = 3
const rateLimitMap = new Map<string, { count: number; resetTime: number }>()

function getClientIp(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for')
  const realIp = request.headers.get('x-real-ip')
  return forwarded?.split(',')[0]?.trim() || realIp || 'unknown'
}

function checkRateLimit(ip: string): { allowed: boolean; remaining: number } {
  const now = Date.now()

  if (rateLimitMap.size > 10_000) {
    for (const [key, record] of rateLimitMap) {
      if (now > record.resetTime) rateLimitMap.delete(key)
    }
  }

  const record = rateLimitMap.get(ip)

  if (!record || now > record.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW_MS })
    return { allowed: true, remaining: RATE_LIMIT_MAX - 1 }
  }

  if (record.count >= RATE_LIMIT_MAX) {
    return { allowed: false, remaining: 0 }
  }

  record.count++
  return { allowed: true, remaining: RATE_LIMIT_MAX - record.count }
}

function checkCsrf(request: Request): boolean {
  const requestHost = request.headers.get('host')
  if (!requestHost) return false

  const allowedHosts = new Set<string>([requestHost])

  const appUrl = process.env.NEXT_PUBLIC_APP_URL
  if (appUrl) {
    try {
      allowedHosts.add(new URL(appUrl).host)
    } catch {
      return false
    }
  }

  const source = request.headers.get('origin') || request.headers.get('referer')
  if (!source) return false

  try {
    return allowedHosts.has(new URL(source).host)
  } catch {
    return false
  }
}

export async function POST(request: Request) {
  try {
    if (!checkCsrf(request)) {
      return NextResponse.json(
        { error: 'Invalid request origin' },
        { status: 403 }
      )
    }

    const ip = getClientIp(request)
    const rateLimit = checkRateLimit(ip)

    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429 }
      )
    }

    const formData = await request.formData()
    const website = (formData.get('website') ?? '').toString()
    if (website.length > 0) {
      return NextResponse.json({ message: 'Message sent successfully' }, { status: 200 })
    }
    const validated = contactSchema.parse({
      name: formData.get('name'),
      email: formData.get('email'),
      subject: formData.get('subject'),
      message: formData.get('message'),
      website,
    })

    if (!process.env.RESEND_API_KEY || !process.env.CONTACT_EMAIL) {
      console.error('Contact form misconfigured: RESEND_API_KEY or CONTACT_EMAIL missing')
      return NextResponse.json(
        { error: 'Contact form is not configured' },
        { status: 500 }
      )
    }

    const resend = new Resend(process.env.RESEND_API_KEY)

    await resend.emails.send({
      from: 'Portfolio Contact <onboarding@resend.dev>',
      to: [process.env.CONTACT_EMAIL],
      replyTo: validated.email,
      subject: `[Portfolio] ${validated.subject}`,
      html: [
        '<h2>New Contact Form Submission</h2>',
        `<p><strong>Name:</strong> ${escapeHtml(validated.name)}</p>`,
        `<p><strong>Email:</strong> ${escapeHtml(validated.email)}</p>`,
        `<p><strong>Subject:</strong> ${escapeHtml(validated.subject)}</p>`,
        `<p><strong>Message:</strong></p>`,
        `<p>${escapeHtml(validated.message).replace(/\n/g, '<br>')}</p>`,
      ].join('\n'),
    })

    return NextResponse.json(
      { message: 'Message sent successfully', remaining: rateLimit.remaining },
      { status: 200 }
    )
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.issues },
        { status: 400 }
      )
    }

    console.error('Contact form error:', error)
    return NextResponse.json(
      { error: 'Failed to send message' },
      { status: 500 }
    )
  }
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}
