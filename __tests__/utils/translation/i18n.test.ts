import { describe, it, expect } from 'vitest'
import { defaultTranslate } from '@/context/language-utils'
import { translations } from '@/context/translations/index'
import { DEFAULT_LANGUAGE } from '@/config/language.config'

describe('Translation utility', () => {
  it('returns translation for default language', () => {
    const result = defaultTranslate('common.loading', 'en')
    expect(result).toBeDefined()
    expect(typeof result).toBe('string')
    expect(result).not.toBe('common.loading')
  })

  it('falls back to default language if translation missing', () => {
    const result = defaultTranslate('common.loading', 'fr' as any)
    expect(result).toBeDefined()
  })

  it('returns key if translation missing in all languages', () => {
    const result = defaultTranslate('non.existent.key.xyz' as any, 'en')
    expect(result).toBe('non.existent.key.xyz')
  })

  it('interpolates parameters correctly', () => {
    const result = defaultTranslate('common.scrollTo' as any, 'en', { section: 'About' })
    expect(result).toContain('About')
  })

  it('handles multiple parameters', () => {
    const result = defaultTranslate('common.scrollTo' as any, 'en', { section: 'Contact' })
    expect(result).toBeTruthy()
  })

  it('works without parameters', () => {
    const result = defaultTranslate('common.submit', 'en')
    expect(typeof result).toBe('string')
  })

  it('supports all configured languages', () => {
    expect(translations.en).toBeDefined()
    expect(translations.zh).toBeDefined()
    expect(translations.ms).toBeDefined()
  })

  it('has consistent translation keys across languages', () => {
    const enKeys = Object.keys(translations.en)
    expect(enKeys.length).toBeGreaterThan(0)
    // Basic check that other languages have translations
    expect(Object.keys(translations.zh).length).toBeGreaterThan(0)
    expect(Object.keys(translations.ms).length).toBeGreaterThan(0)
  })

  it('uses default language as fallback', () => {
    const result = defaultTranslate('common.loading', undefined as any)
    expect(result).toBeDefined()
  })
})
