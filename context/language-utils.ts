import { createContext, useContext } from "react"
import { LANGUAGE_NAMES, type Language } from "@/config/language.config"
import translations, { type TranslationsType } from "./translations"

export interface LanguageContextType {
  language: Language
  setLanguage: (language: Language) => void
  t: (key: keyof TranslationsType[Language], params?: Record<string, string | number>) => string
  isRTL: boolean
  isTransitioning: boolean
  languageName: (lang: Language) => string
}

export const LanguageContext = createContext<LanguageContextType>({
  language: "en",
  setLanguage: () => {},
  t: (key) => key,
  isRTL: false,
  isTransitioning: false,
  languageName: (lang) => LANGUAGE_NAMES[lang] || lang,
})

export const useTranslation = () => useContext(LanguageContext)

export function translate(
  key: keyof TranslationsType[Language],
  language: Language,
  params?: Record<string, string | number>
): string {
  const translation = translations[language]?.[key] || key

  if (!params) {
    return translation
  }

  return Object.entries(params).reduce(
    (acc, [key, value]) => acc.replace(`{${key}}`, String(value)),
    translation
  )
}