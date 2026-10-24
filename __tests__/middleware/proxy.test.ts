import { describe, it, expect, beforeEach, vi } from 'vitest'

// Mock dependencies
vi.mock('@/config/language.config', () => ({
  SUPPORTED_LANGUAGES: ['en', 'zh', 'ms', 'ta', 'ar'],
  DEFAULT_LANGUAGE: 'en',
}))

vi.mock('next/server', () => {
  return {
    NextResponse: {
      redirect: vi.fn((url: URL, status?: number) => {
        return {
          type: 'redirect',
          url: url.toString(),
          status: status || 307,
          headers: new Map(),
        }
      }),
      next: vi.fn((options?: any) => {
        return {
          type: 'next',
          headers: new Map(),
          request: options?.request,
        }
      }),
    },
  }
})

import { proxy } from '@/proxy'
import { NextResponse } from 'next/server'

describe('proxy middleware routing behavior', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    const envTest = process.env as any
    envTest.NODE_ENV = 'test'
  })

  it('redirects root / to default language', () => {
    const request = {
      nextUrl: new URL('http://localhost:3000/'),
      headers: new Headers(),
    } as any

    const result = proxy(request)
    expect(NextResponse.redirect).toHaveBeenCalled()
    expect(result.url).toContain('/en')
  })

  it('passes through _next paths with security headers', () => {
    const request = {
      nextUrl: new URL('http://localhost:3000/_next/static/chunk.js'),
      headers: new Headers(),
    } as any

    const result = proxy(request)
    expect(NextResponse.next).toHaveBeenCalled()
    expect(result.type).toBe('next')
  })

  it('passes through api paths', () => {
    const request = {
      nextUrl: new URL('http://localhost:3000/api/contact'),
      headers: new Headers(),
    } as any

    const result = proxy(request)
    expect(NextResponse.next).toHaveBeenCalled()
  })

  it('passes through files with extensions', () => {
    const request = {
      nextUrl: new URL('http://localhost:3000/favicon.ico'),
      headers: new Headers(),
    } as any

    const result = proxy(request)
    expect(NextResponse.next).toHaveBeenCalled()
  })

  it('passes through sitemap.xml', () => {
    const request = {
      nextUrl: new URL('http://localhost:3000/sitemap.xml'),
      headers: new Headers(),
    } as any

    const result = proxy(request)
    expect(NextResponse.next).toHaveBeenCalled()
  })

  it('passes through robots.txt', () => {
    const request = {
      nextUrl: new URL('http://localhost:3000/robots.txt'),
      headers: new Headers(),
    } as any

    const result = proxy(request)
    expect(NextResponse.next).toHaveBeenCalled()
  })

  it('allows supported locale paths and sets headers', () => {
    const request = {
      nextUrl: new URL('http://localhost:3000/zh/about'),
      headers: new Headers(),
    } as any

    const result = proxy(request)
    expect(NextResponse.next).toHaveBeenCalled()
    expect((result as any).request.headers.get('x-locale')).toBe('zh')
    expect((result as any).request.headers.get('x-nonce')).toBeDefined()
  })

  it('redirects unsupported locale paths to default locale', () => {
    const request = {
      nextUrl: new URL('http://localhost:3000/fr/about'),
      headers: new Headers(),
    } as any

    const result = proxy(request)
    expect(NextResponse.redirect).toHaveBeenCalled()
    expect(result.url).toContain('/en/fr/about')
  })

  it('redirects paths without locale to default locale', () => {
    const request = {
      nextUrl: new URL('http://localhost:3000/about'),
      headers: new Headers(),
    } as any

    const result = proxy(request)
    expect(NextResponse.redirect).toHaveBeenCalled()
    expect(result.url).toContain('/en/about')
  })
})

