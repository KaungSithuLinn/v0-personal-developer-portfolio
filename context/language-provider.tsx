"use client"

import { useState, useEffect, useCallback, useMemo, type ReactNode } from "react"
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

  const isRTLValue = useMemo(() => isRTL(language), [language])

  const t = useCallback(
    (key: TranslationKey, params?: Record<string, string | number>) =>
      defaultTranslate(key, language, params),
    [language],
  )

  const getDirection = useCallback(() => (isRTL(language) ? "rtl" : "ltr"), [language])

  const languageName = useCallback(
    (code: Language) => LANGUAGE_NAMES[code] || code,
    [],
  )

  useEffect(() => {
    const savedLanguage = localStorage.getItem("language") as Language | null
    if (savedLanguage && SUPPORTED_LANGUAGES.includes(savedLanguage)) {
      setLanguage(savedLanguage)
    }
  }, [])

  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.lang = language
      document.documentElement.dir = isRTLValue ? "rtl" : "ltr"
    }
  }, [language, isRTLValue])

  const handleLanguageChange = useCallback((newLanguage: Language) => {
    if (newLanguage === language) return

    setIsTransitioning(true)
    setLanguage(newLanguage)
    localStorage.setItem("language", newLanguage)
    setTimeout(() => setIsTransitioning(false), 300)
  }, [language])

  const contextValue = useMemo(
    () => ({
      language,
      setLanguage: handleLanguageChange,
      t,
      getDirection,
      isRTL: isRTLValue,
      isTransitioning,
      languageName,
    }),
    [language, handleLanguageChange, t, getDirection, isRTLValue, isTransitioning, languageName],
  )

  return (
    <LanguageContext.Provider value={contextValue}>
      {children}
    </LanguageContext.Provider>
  )
}
