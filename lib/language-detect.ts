import { type Language } from "@/context/language-utils"
import { SUPPORTED_LANGUAGES, DEFAULT_LANGUAGE, LANGUAGE_REGIONS } from "@/config/language.config"

interface LanguagePreference {
  language: Language
  quality: number
}

export function detectBrowserLanguage(): Language {
  if (typeof window === "undefined") return DEFAULT_LANGUAGE

  // Get browser languages with quality values
  const languages = navigator.languages || [navigator.language]
  const preferences: LanguagePreference[] = []

  languages.forEach((lang, index) => {
    const [language] = lang.toLowerCase().split("-")
    if (SUPPORTED_LANGUAGES.includes(language as Language)) {
      preferences.push({
        language: language as Language,
        // Decrease quality for each subsequent language
        quality: 1 - index * 0.1,
      })
    }
  })

  // Sort by quality and get the best match
  const bestMatch = preferences
    .sort((a, b) => b.quality - a.quality)
    .find(pref => SUPPORTED_LANGUAGES.includes(pref.language))

  return bestMatch?.language || DEFAULT_LANGUAGE
}

export function getRegionalLanguage(language: Language): string {
  return LANGUAGE_REGIONS[language]
}

export function isLanguageSupported(language: string): boolean {
  return SUPPORTED_LANGUAGES.includes(language as Language)
}

// Get language from URL if present (for Next.js routing)
export function getLanguageFromURL(pathname: string): Language | null {
  const segments = pathname.split("/").filter(Boolean)
  const firstSegment = segments[0]?.toLowerCase()

  if (firstSegment && isLanguageSupported(firstSegment)) {
    return firstSegment as Language
  }

  return null
}

// Get language preference order based on browser settings
export function getLanguagePreferences(): Language[] {
  if (typeof window === "undefined") return [DEFAULT_LANGUAGE]

  const browserLanguages = navigator.languages || [navigator.language]
  const preferences: Language[] = []

  // First, add exact matches
  browserLanguages.forEach(lang => {
    const [language] = lang.toLowerCase().split("-")
    if (SUPPORTED_LANGUAGES.includes(language as Language)) {
      preferences.push(language as Language)
    }
  })

  // Then, add remaining supported languages
  SUPPORTED_LANGUAGES.forEach(lang => {
    if (!preferences.includes(lang)) {
      preferences.push(lang)
    }
  })

  return preferences
}