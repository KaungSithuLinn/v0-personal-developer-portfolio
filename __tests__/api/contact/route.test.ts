import { describe, it, expect, beforeEach, vi } from 'vitest'
import { POST } from '@/app/api/contact/route'

// Mock dependencies
const { mockCheck } = vi.hoisted(() => ({
  mockCheck: vi.fn(() => ({ allowed: true, remaining: 2, retryAfterMs: 0 })),
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

vi.mock('resend', () => ({
  Resend: class {
    emails = {
      send: vi.fn().mockResolvedValue({ id: 'test-email' }),
    }
  },
}))

import {
  checkCsrf,
  createRateLimiter,
  getClientIp,
  getRequestSize,
  getRequiredEnv,
} from '@/lib/security'

describe('Contact API validation', () => {
  let mockRateLimiter: any

  beforeEach(() => {
    vi.clearAllMocks()
    mockCheck.mockReturnValue({ allowed: true, remaining: 2, retryAfterMs: 0 })
    ;(getRequestSize as any).mockReturnValue(true)
    ;(checkCsrf as any).mockReturnValue(true)
    ;(getClientIp as any).mockReturnValue('1.2.3.4')
    ;(getRequiredEnv as any).mockImplementation((name: string) => {
      if (name === 'RESEND_API_KEY') return 'test-key'
      if (name === 'CONTACT_EMAIL') return 'test@example.com'
      return 'value'
    })
  })

  it('returns 413 if request body too large', async () => {
    ;(getRequestSize as any).mockReturnValue(false)
    const req = new Request('http://localhost:3000/api/contact', {
      method: 'POST',
    })
    const res = await POST(req)
    expect(res.status).toBe(413)
    const json = await res.json()
    expect(json.error).toBe('Request body is too large')
  })

  it('returns 403 if CSRF check fails', async () => {
    ;(checkCsrf as any).mockReturnValue(false)
    const req = new Request('http://localhost:3000/api/contact', {
      method: 'POST',
    })
    const res = await POST(req)
    expect(res.status).toBe(403)
    const json = await res.json()
    expect(json.error).toBe('Invalid request origin')
  })

  it('returns 429 if rate limited', async () => {
    mockCheck.mockReturnValue({
      allowed: false,
      remaining: 0,
      retryAfterMs: 5000,
    })
    const req = new Request('http://localhost:3000/api/contact', {
      method: 'POST',
    })
    const res = await POST(req)
    expect(res.status).toBe(429)
    const json = await res.json()
    expect(json.error).toContain('Too many requests')
  })

  it('rejects spam (honeypot field filled)', async () => {
    const formData = new FormData()
    formData.append('name', 'John')
    formData.append('email', 'john@example.com')
    formData.append('subject', 'Test')
    formData.append('message', 'Hello there')
    formData.append('website', 'http://spam.com')
    
    const req = new Request('http://localhost:3000/api/contact', {
      method: 'POST',
      body: formData,
    })
    const res = await POST(req)
    expect(res.status).toBe(200)
    const json = await res.json()
    expect(json.message).toBe('Message sent successfully')
  })

  it('validates required fields', async () => {
    const formData = new FormData()
    formData.append('name', '')
    formData.append('email', 'invalid')
    formData.append('subject', '')
    formData.append('message', '')
    formData.append('website', '')
    
    const req = new Request('http://localhost:3000/api/contact', {
      method: 'POST',
      body: formData,
    })
    const res = await POST(req)
    expect(res.status).toBe(400)
    const json = await res.json()
    expect(json.error).toBe('Validation failed')
  })

  it('successfully sends email with valid data', async () => {
    const formData = new FormData()
    formData.append('name', 'John Doe')
    formData.append('email', 'john@example.com')
    formData.append('subject', 'Hello')
    formData.append('message', 'This is a test message')
    formData.append('website', '')
    
    const req = new Request('http://localhost:3000/api/contact', {
      method: 'POST',
      body: formData,
    })
    const res = await POST(req)
    expect(res.status).toBe(200)
    const json = await res.json()
    expect(json.message).toBe('Message sent successfully')
  })
})
