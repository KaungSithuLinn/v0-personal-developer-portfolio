import { groq } from "@ai-sdk/groq"
import { streamText, type ModelMessage } from "ai"
import { z } from "zod"
import {
  checkCsrf,
  createRateLimiter,
  getClientIp,
  getRequestSize,
} from "@/lib/security"

const messageSchema: z.ZodType<ModelMessage> = z.discriminatedUnion("role", [
  z.object({
    role: z.literal("user"),
    content: z.string().trim().min(1).max(2000),
  }),
  z.object({
    role: z.literal("assistant"),
    content: z.string().trim().min(1).max(2000),
  }),
])

const bodySchema = z.object({
  messages: z.array(messageSchema).min(1).max(20),
})

const rateLimiter = createRateLimiter({
  windowMs: 60_000,
  maxRequests: 20,
  maxEntries: 10_000,
})

const noStoreHeaders = {
  "Cache-Control": "no-store, no-cache, must-revalidate",
}

export const runtime = "nodejs"

export async function POST(request: Request) {
  try {
    if (!getRequestSize(request, 128 * 1024)) {
      return new Response("Request body is too large", {
        status: 413,
        headers: noStoreHeaders,
      })
    }

    if (!checkCsrf(request)) {
      return new Response("Invalid request origin", {
        status: 403,
        headers: noStoreHeaders,
      })
    }

    const rateLimit = rateLimiter.check(getClientIp(request))
    if (!rateLimit.allowed) {
      return new Response("Too many requests. Please try again later.", {
        status: 429,
        headers: {
          ...noStoreHeaders,
          "Retry-After": String(Math.max(1, Math.ceil(rateLimit.retryAfterMs / 1000))),
        },
      })
    }

    const parsed = bodySchema.safeParse(await request.json().catch(() => null))
    if (!parsed.success) {
      return new Response("Invalid request", {
        status: 400,
        headers: noStoreHeaders,
      })
    }

    const result = streamText({
      model: groq("llama-3.3-70b-versatile") as any,
      system:
        "You are a helpful assistant for Kaung Sithu Linn's developer portfolio. Answer concisely about his skills, projects, and experience. If unsure, say you do not know.",
      messages: parsed.data.messages,
    })

    return result.toTextStreamResponse({ headers: noStoreHeaders })
  } catch (error) {
    console.error("Chat API error", error instanceof Error ? error.message : "unknown")
    return new Response("Chat is temporarily unavailable", {
      status: 500,
      headers: noStoreHeaders,
    })
  }
}