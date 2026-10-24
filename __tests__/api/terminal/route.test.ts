import { describe, it, expect, beforeEach, vi } from 'vitest'

const { mockCheck } = vi.hoisted(() => ({
  mockCheck: vi.fn(() => ({ allowed: true, remaining: 5, retryAfterMs: 0 })),
}))

vi.mock('@/lib/security', () => ({
  checkCsrf: vi.fn(),
  createRateLimiter: vi.fn(() => ({
    check: mockCheck,
  })),
  getClientIp: vi.fn(),
  getRequestSize: vi.fn(),
  getRequiredEnv: vi.fn(),
}))

vi.mock('ai', () => ({
  generateText: vi.fn(),
}))

vi.mock('@ai-sdk/groq', () => ({
  groq: vi.fn(() => 'mock-model'),
}))

import { POST } from '@/app/api/terminal/route'
import {
  checkCsrf,
  createRateLimiter,
  getClientIp,
  getRequestSize,
  getRequiredEnv,
} from '@/lib/security'
import { generateText } from 'ai'

describe('Terminal API limits', () => {
  let mockRateLimiter: any

  beforeEach(() => {
    vi.clearAllMocks()
    mockCheck.mockReturnValue({ allowed: true, remaining: 5, retryAfterMs: 0 })
    ;(getRequestSize as any).mockReturnValue(true)
    ;(checkCsrf as any).mockReturnValue(true)
    ;(getClientIp as any).mockReturnValue('1.2.3.4')
    ;(getRequiredEnv as any).mockReturnValue('test-key')
  })

  it('returns 413 if request body too large', async () => {
    ;(getRequestSize as any).mockReturnValue(false)
    const req = new Request('http://localhost:3000/api/terminal', {
      method: 'POST',
    })
    const res = await POST(req)
    expect(res.status).toBe(413)
  })

  it('returns 403 if CSRF check fails', async () => {
    ;(checkCsrf as any).mockReturnValue(false)
    const req = new Request('http://localhost:3000/api/terminal', {
      method: 'POST',
    })
    const res = await POST(req)
    expect(res.status).toBe(403)
  })

  it('returns 429 if rate limited', async () => {
    mockCheck.mockReturnValue({
      allowed: false,
      remaining: 0,
      retryAfterMs: 60000,
    })
    const req = new Request('http://localhost:3000/api/terminal', {
      method: 'POST',
    })
    const res = await POST(req)
    expect(res.status).toBe(429)
  })

  it('returns 400 for invalid JSON', async () => {
    const req = new Request('http://localhost:3000/api/terminal', {
      method: 'POST',
      body: 'not json',
      headers: { 'Content-Type': 'application/json' },
    })
    const res = await POST(req)
    expect(res.status).toBe(400)
  })

  it('returns 400 for empty command', async () => {
    const req = new Request('http://localhost:3000/api/terminal', {
      method: 'POST',
      body: JSON.stringify({ command: '' }),
      headers: { 'Content-Type': 'application/json' },
    })
    const res = await POST(req)
    expect(res.status).toBe(400)
  })

  it('returns 400 for command too long', async () => {
    const longCommand = 'a'.repeat(501)
    const req = new Request('http://localhost:3000/api/terminal', {
      method: 'POST',
      body: JSON.stringify({ command: longCommand }),
      headers: { 'Content-Type': 'application/json' },
    })
    const res = await POST(req)
    expect(res.status).toBe(400)
  })

  it('returns 400 for deterministic commands (client-side)', async () => {
    const req = new Request('http://localhost:3000/api/terminal', {
      method: 'POST',
      body: JSON.stringify({ command: 'help' }),
      headers: { 'Content-Type': 'application/json' },
    })
    const res = await POST(req)
    expect(res.status).toBe(400)
    const json = await res.json()
    expect(json.error).toBe('Use client-side command')
  })

  it('processes AI commands successfully', async () => {
    ;(generateText as any).mockResolvedValue({ text: 'AI response here' })
    const req = new Request('http://localhost:3000/api/terminal', {
      method: 'POST',
      body: JSON.stringify({ command: 'tell me about react' }),
      headers: { 'Content-Type': 'application/json' },
    })
    const res = await POST(req)
    expect(res.status).toBe(200)
    const json = await res.json()
    expect(json.response).toBe('AI response here')
  })
})
