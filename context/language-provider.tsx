"use client"

import { useState, useEffect, type ReactNode } from "react"
import { LanguageContext, translate } from "./language-utils"
import type { TranslationKey } from "./language-utils"
import {
  SUPPORTED_LANGUAGES,
  DEFAULT_LANGUAGE,
  RTL_LANGUAGES,
  LANGUAGE_NAMES,
  type Language,
} from "@/config/language.config"

interface LanguageProviderProps {
  children: ReactNode
  initialLocale?: string
}

export function LanguageProvider({ children, initialLocale }: LanguageProviderProps) {
  const [language, setLanguage] = useState<Language>(
    (initialLocale as Language) || DEFAULT_LANGUAGE
  )
  const [isTransitioning, setIsTransitioning] = useState(false)
  const isRTL = RTL_LANGUAGES.includes(language)

  const t = (key: TranslationKey, params?: Record<string, string | number>) => {
    return translate(key, language, params)
  }

  const getDirection = () => isRTL ? "rtl" : "ltr"

  const languageName = (code: Language): string => LANGUAGE_NAMES[code] || code

  useEffect(() => {
    const savedLanguage = localStorage.getItem("language") as Language | null
    if (savedLanguage && SUPPORTED_LANGUAGES.includes(savedLanguage)) {
      setLanguage(savedLanguage)
    }
  }, [])

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        t,
        getDirection,
        isRTL,
        isTransitioning,
        languageName,
      }}
    >
      {children}
    </LanguageContext.Provider>
  )
}
