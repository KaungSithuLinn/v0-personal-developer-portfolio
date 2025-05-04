import { createContext, useContext } from "react"
import { LANGUAGE_NAMES, type Language } from "@/config/language.config"
import translations from "./translations"

// Define TranslationsType using the structure of our translations
export type TranslationKey = keyof typeof translations[Language]

export interface LanguageContextType {
  language: Language
  setLanguage: (language: Language) => void
  t: (key: TranslationKey, params?: Record<string, string | number>) => string
  getDirection: () => "ltr" | "rtl"
  isRTL: boolean
  isTransitioning: boolean
  languageName: (code: Language) => string
}

export const LanguageContext = createContext<LanguageContextType>({
  language: "en",
  setLanguage: () => {},
  t: (key: TranslationKey) => String(key),
  getDirection: () => "ltr",
  isRTL: false,
  isTransitioning: false,
  languageName: (lang) => LANGUAGE_NAMES[lang] || lang,
})

export const useTranslation = () => useContext(LanguageContext)

export function translate(
  key: TranslationKey,
  language: Language,
  params?: Record<string, string | number>
): string {
  const translation = String(translations[language]?.[key] || key)

  if (!params) {
    return translation
  }

  return Object.entries(params).reduce(
    (acc, [paramKey, value]) => acc.replace(`{${paramKey}}`, String(value)),
    translation
  )
}