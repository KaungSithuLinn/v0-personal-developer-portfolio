"use client"

import { useState, useEffect, type ReactNode } from "react"
import { LanguageContext, type Language } from "./language-context"
import translations from "./translations"

// Define RTL languages
const RTL_LANGUAGES: Language[] = ["ar"] // Arabic is RTL

interface LanguageProviderProps {
  children: ReactNode
}

export function LanguageProvider({ children }: LanguageProviderProps) {
  // Initialize with default language
  const [language, setLanguageState] = useState<Language>("en")
  const [mounted, setMounted] = useState(false)

  // Set up language on client-side
  useEffect(() => {
    setMounted(true)

    // Get stored language preference
    const storedLanguage = localStorage.getItem("language") as Language | null

    // If there's a stored preference, use it
    if (storedLanguage && Object.keys(translations).includes(storedLanguage)) {
      setLanguageState(storedLanguage)
    } else {
      // Otherwise try to detect from browser
      try {
        const browserLanguage = navigator.language.split("-")[0] as Language

        // If browser language is supported, use it
        if (Object.keys(translations).includes(browserLanguage)) {
          setLanguageState(browserLanguage)
          localStorage.setItem("language", browserLanguage)
        }
      } catch (error) {
        console.error("Error detecting browser language:", error)
      }
    }
  }, [])

  // Update language with side effects
  const setLanguage = (newLanguage: Language) => {
    setLanguageState(newLanguage)
    localStorage.setItem("language", newLanguage)

    // Apply RTL if needed
    if (typeof document !== "undefined") {
      document.documentElement.dir = RTL_LANGUAGES.includes(newLanguage) ? "rtl" : "ltr"
    }
  }

  // Apply RTL when language changes
  useEffect(() => {
    if (mounted && typeof document !== "undefined") {
      document.documentElement.dir = RTL_LANGUAGES.includes(language) ? "rtl" : "ltr"
    }
  }, [language, mounted])

  // Translation function
  const t = (key: string, params?: Record<string, string>): string => {
    // Get the translation
    let translation = translations[language]?.[key] || translations.en?.[key] || key

    // Replace parameters if any
    if (params) {
      Object.entries(params).forEach(([param, value]) => {
        translation = translation.replace(`{${param}}`, value)
      })
    }

    return translation
  }

  // Get text direction
  const getDirection = (): "ltr" | "rtl" => {
    return RTL_LANGUAGES.includes(language) ? "rtl" : "ltr"
  }

  // Check if current language is RTL
  const isRTL = RTL_LANGUAGES.includes(language)

  // Get language name
  const languageName = (code: Language): string => {
    const names: Record<Language, string> = {
      en: "English",
      zh: "中文",
      ms: "Bahasa Melayu",
      ta: "தமிழ்",
      ar: "العربية",
    }
    return names[code] || code
  }

  // Don't render anything on the server
  if (!mounted) {
    return <>{children}</>
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, getDirection, isRTL, languageName }}>
      {children}
    </LanguageContext.Provider>
  )
}
