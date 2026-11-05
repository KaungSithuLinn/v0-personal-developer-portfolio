import { describe, it, expect, beforeEach, vi } from "vitest"
import { POST } from "@/app/api/chat/route"

const { mockCheck, mockStreamText } = vi.hoisted(() => ({
  mockCheck: vi.fn(() => ({ allowed: true, remaining: 19, retryAfterMs: 0 })),
  mockStreamText: vi.fn(),
}))

vi.mock("@/lib/security", () => ({
  checkCsrf: vi.fn(),
  createRateLimiter: vi.fn(() => ({ check: mockCheck })),
  getClientIp: vi.fn(),
  getRequestSize: vi.fn(),
  getRequiredEnv: vi.fn(),
}))

vi.mock("@ai-sdk/groq", () => ({
  groq: vi.fn(() => "mock-model"),
}))

vi.mock("ai", () => ({
  streamText: mockStreamText,
}))

import {
  checkCsrf,
  getClientIp,
  getRequestSize,
} from "@/lib/security"

describe("Chat API", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockCheck.mockReturnValue({ allowed: true, remaining: 19, retryAfterMs: 0 })
    ;(getRequestSize as any).mockReturnValue(true)
    ;(checkCsrf as any).mockReturnValue(true)
    ;(getClientIp as any).mockReturnValue("1.2.3.4")
    mockStreamText.mockReturnValue({
      toTextStreamResponse: vi.fn(() => new Response("stream", { status: 200 })),
    })
  })

  it("rejects oversized requests", async () => {
    ;(getRequestSize as any).mockReturnValue(false)
    const res = await POST(new Request("http://localhost:3000/api/chat", { method: "POST" }))
    expect(res.status).toBe(413)
  })

  it("rejects cross-site requests", async () => {
    ;(checkCsrf as any).mockReturnValue(false)
    const res = await POST(new Request("http://localhost:3000/api/chat", { method: "POST" }))
    expect(res.status).toBe(403)
  })

  it("rate limits repeated requests", async () => {
    mockCheck.mockReturnValue({ allowed: false, remaining: 0, retryAfterMs: 4000 })
    const req = new Request("http://localhost:3000/api/chat", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ messages: [{ role: "user", content: "hello" }] }),
    })
    const res = await POST(req)
    expect(res.status).toBe(429)
    expect(res.headers.get("retry-after")).toBe("4")
  })

  it("rejects invalid message payloads", async () => {
    const req = new Request("http://localhost:3000/api/chat", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ messages: [{ role: "system", content: "hello" }] }),
    })
    const res = await POST(req)
    expect(res.status).toBe(400)
  })

  it("streams a valid conversation", async () => {
    const req = new Request("http://localhost:3000/api/chat", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ messages: [{ role: "user", content: "hello" }] }),
    })
    const res = await POST(req)
    expect(res.status).toBe(200)
    expect(mockStreamText).toHaveBeenCalledOnce()
    expect(mockStreamText.mock.calls[0][0].messages).toEqual([
      { role: "user", content: "hello" },
    ])
  })
})