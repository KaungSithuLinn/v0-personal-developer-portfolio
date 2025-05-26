"use client"

import { useState, useEffect, type ReactNode } from "react"
import {
  LanguageContext,
  defaultTranslate,
  type TranslationKey,
  type Language
} from "./language-utils"
import { isRTL } from "@/lib/rtl-utils"
import {
  SUPPORTED_LANGUAGES,
  DEFAULT_LANGUAGE,
  LANGUAGE_NAMES,
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
  
  // Calculate isRTL based on current language using the server-compatible function
  const isRTLValue = isRTL(language)

  const t = (key: TranslationKey, params?: Record<string, string | number>) => {
    return defaultTranslate(key, language, params)
  }

  const getDirection = () => isRTLValue ? "rtl" : "ltr"

  const languageName = (code: Language): string => LANGUAGE_NAMES[code] || code

  useEffect(() => {
    const savedLanguage = localStorage.getItem("language") as Language | null
    if (savedLanguage && SUPPORTED_LANGUAGES.includes(savedLanguage)) {
      setLanguage(savedLanguage)
    }
  }, [])

  const handleLanguageChange = (newLanguage: Language) => {
    if (newLanguage === language) return
    
    setIsTransitioning(true)
    setLanguage(newLanguage)
    localStorage.setItem("language", newLanguage)
    setTimeout(() => setIsTransitioning(false), 300)
  }

  // Always provide context values even during SSR
  const contextValue = {
    language,
    setLanguage: handleLanguageChange,
    t,
    getDirection,
    isRTL: isRTLValue,
    isTransitioning,
    languageName,
  }

  return (
    <LanguageContext.Provider value={contextValue}>
      {children}
    </LanguageContext.Provider>
  )
}
