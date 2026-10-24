import { groq } from "@ai-sdk/groq"
import { convertToModelMessages, streamText } from "ai"
import { z } from "zod"

const bodySchema = z.object({
  messages: z.array(z.any()),
})

export async function POST(request: Request) {
  const parsed = bodySchema.safeParse(await request.json().catch(() => ({})))
  if (!parsed.success) {
    return new Response("Invalid request", { status: 400 })
  }

  const modelMessages = await convertToModelMessages(parsed.data.messages)

  const result = streamText({
    model: groq("llama-3.3-70b-versatile") as any,
    system:
      "You are a helpful assistant for Kaung Sithu Linn's developer portfolio. Answer concisely about his skills, projects, and experience. If unsure, say you do not know.",
    messages: modelMessages,
  })

  return result.toTextStreamResponse()
}
