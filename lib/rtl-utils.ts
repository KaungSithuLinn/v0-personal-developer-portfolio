import { type Language } from "@/config/language.config"
import { RTL_LANGUAGES } from "@/config/language.config"

/**
 * Server-compatible function to check if a language is RTL
 */
export function isRTL(language: Language): boolean {
  return RTL_LANGUAGES.includes(language)
}

/**
 * Get text direction for a language
 */
export function getTextDirection(language: Language): "ltr" | "rtl" {
  return isRTL(language) ? "rtl" : "ltr"
}
