"use client"

import { useState, useEffect, type ReactNode } from "react"
import { LanguageContext, type Language } from "./language-utils"
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
  const [language, setLanguageState] = useState<Language>(initialLocale || DEFAULT_LANGUAGE)
  const [mounted, setMounted] = useState(false)
  const [isTransitioning, setIsTransitioning] = useState(false)

  // Set up language on client-side
  useEffect(() => {
    setMounted(true)

    // Get stored language preference
    const storedLanguage = localStorage.getItem("language") as Language | null
    const htmlLang = document.documentElement.lang as Language | undefined

    // Priority: 1. Stored preference 2. HTML lang attribute 3. Browser language 4. Default
    if (storedLanguage && SUPPORTED_LANGUAGES.includes(storedLanguage)) {
      setLanguageState(storedLanguage)
      applyLanguageConfig(storedLanguage)
    } else if (htmlLang && SUPPORTED_LANGUAGES.includes(htmlLang)) {
      setLanguageState(htmlLang)
      localStorage.setItem("language", htmlLang)
      applyLanguageConfig(htmlLang)
    } else {
      try {
        const browserLanguage = navigator.language.split("-")[0] as Language
        if (SUPPORTED_LANGUAGES.includes(browserLanguage)) {
          setLanguageState(browserLanguage)
          localStorage.setItem("language", browserLanguage)
          applyLanguageConfig(browserLanguage)
        }
      } catch (error) {
        console.error("Error detecting browser language:", error)
      }
    }
  }, [])

  // Apply language configuration to the document
  const applyLanguageConfig = (lang: Language) => {
    const config = getLanguageConfig(lang)
    document.documentElement.lang = config.lang
    document.documentElement.dir = config.dir
    document.documentElement.style.setProperty("--font-primary", config.fontFamily)
  }

  // Update language with side effects
  const setLanguage = async (newLanguage: Language) => {
    if (newLanguage === language || isTransitioning) return

    setIsTransitioning(true)
    document.documentElement.classList.add("language-transition")
    
    // Update language state and storage
    setLanguageState(newLanguage)
    localStorage.setItem("language", newLanguage)
    
    // Apply new language configuration
    applyLanguageConfig(newLanguage)

    // Allow time for transition
    await new Promise(resolve => setTimeout(resolve, 300))
    
    document.documentElement.classList.remove("language-transition")
    setIsTransitioning(false)
  }

  // Translation function with fallback
  const t = (key: string, params?: Record<string, string>): string => {
    // Get translation with fallback to English
    let translation = translations[language]?.[key] || translations.en?.[key] || key

    // Replace parameters if any
    if (params) {
      Object.entries(params).forEach(([param, value]) => {
        translation = translation.replace(`{${param}}`, value)
      })
    }

    return translation
  }

  // Get language name
  const languageName = (code: Language): string => {
    return LANGUAGE_NAMES[code] || code
  }

  // Check if current language is RTL
  const isRTL = RTL_LANGUAGES.includes(language)

  // Get text direction
  const getDirection = (): "ltr" | "rtl" => {
    return isRTL ? "rtl" : "ltr"
  }

  // Don't render anything on the server
  if (!mounted) {
    return <>{children}</>
  }

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
