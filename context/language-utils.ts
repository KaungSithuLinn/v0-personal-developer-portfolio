"use client"

import { createContext, useContext } from "react"
import { 
  LANGUAGE_NAMES, 
  DEFAULT_LANGUAGE,
  type Language 
} from "@/config/language.config"
import translations from "./translations"

// Re-export the Language type
export type { Language }

// Define TranslationsType using the structure of our translations
export type TranslationKey = keyof typeof translations.en

export interface LanguageContextType {
  language: Language
  setLanguage: (language: Language) => void
  t: (key: TranslationKey, params?: Record<string, string | number>) => string
  getDirection: () => "ltr" | "rtl"
  isRTL: boolean
  isTransitioning: boolean
  languageName: (code: Language) => string
}

// Default translation function that works without context
export const defaultTranslate = (
  key: TranslationKey,
  language: Language = DEFAULT_LANGUAGE,
  params?: Record<string, string | number>
): string => {
  const translation = String(translations[language]?.[key] || translations[DEFAULT_LANGUAGE][key] || key)

  if (!params) {
    return translation
  }

  return Object.entries(params).reduce<string>(
    (acc, [paramKey, value]) => acc.replace(`{${paramKey}}`, String(value)),
    translation
  )
}

// Create the context with default values using the defaultTranslate function
export const LanguageContext = createContext<LanguageContextType>({
  language: DEFAULT_LANGUAGE,
  setLanguage: () => {},
  t: (key, params) => defaultTranslate(key, DEFAULT_LANGUAGE, params),
  getDirection: () => "ltr",
  isRTL: false,
  isTransitioning: false,
  languageName: (lang) => LANGUAGE_NAMES[lang] || lang,
})

export const useTranslation = () => {
  const context = useContext(LanguageContext)
  if (!context) {
    // Provide fallback implementation if context is not available
    return {
      language: DEFAULT_LANGUAGE,
      setLanguage: () => {},
      t: (key: TranslationKey, params?: Record<string, string | number>) => 
        defaultTranslate(key, DEFAULT_LANGUAGE, params),
      getDirection: () => "ltr",
      isRTL: false,
      isTransitioning: false,
      languageName: (lang: Language) => LANGUAGE_NAMES[lang] || lang,
    }
  }
  return context
}