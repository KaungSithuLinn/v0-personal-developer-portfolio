"use client"

import { createContext, useContext } from "react"
import { type Language } from "../config/language.config"
import { type LanguageContextType } from "./language-utils"

// Create the context with default values
export const LanguageContext = createContext<LanguageContextType>({
  language: "en",
  setLanguage: () => {},
  t: (key) => String(key),
  getDirection: () => "ltr",
  isRTL: false,
  isTransitioning: false,
  languageName: () => "",
})

// Custom hook for using the language context
export function useTranslation() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error("useTranslation must be used within a LanguageProvider")
  }
  return context
}
