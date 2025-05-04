"use client"

import { useState, useEffect, type ReactNode } from "react"
import { LanguageContext, type Language, translate } from "./language-utils"
import translations from "./translations"
import {
  SUPPORTED_LANGUAGES,
  DEFAULT_LANGUAGE,
  RTL_LANGUAGES,
  LANGUAGE_NAMES,
  getLanguageConfig,
} from "@/config/language.config"

interface LanguageProviderProps {
  children: ReactNode
  initialLocale?: Language
}

export function LanguageProvider({ children, initialLocale }: LanguageProviderProps) {
  const [mounted, setMounted] = useState(false)
  const [language, setLanguage] = useState<Language>(initialLocale)
  const [isTransitioning, setIsTransitioning] = useState(false)

  // Explicitly compute isRTL from the current language
  const isRTL = RTL_LANGUAGES.includes(language)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Update language handler
  const handleLanguageChange = (newLanguage: Language) => {
    setIsTransitioning(true)
    setLanguage(newLanguage)
    localStorage.setItem("language", newLanguage)
    // Reset transitioning state after animation
    setTimeout(() => setIsTransitioning(false), 300)
  }

  // Don't render anything on the server
  if (!mounted) {
    return <>{children}</>
  }

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage: handleLanguageChange,
        t: (key, params) => translate(key, language, params),
        isRTL,
        isTransitioning,
        languageName: (lang) => LANGUAGE_NAMES[lang] || lang,
      }}
    >
      {children}
    </LanguageContext.Provider>
  )
}
