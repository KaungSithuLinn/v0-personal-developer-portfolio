import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { type Language } from "@/context/language-utils"

export const RTL_LANGUAGES = ["ar"] as const

export function isRTLLanguage(language: Language): boolean {
  return RTL_LANGUAGES.includes(language as (typeof RTL_LANGUAGES)[number])
}

export function getTextDirection(language: Language): "ltr" | "rtl" {
  return isRTLLanguage(language) ? "rtl" : "ltr"
}

export function getLanguageDirection(isRTL: boolean) {
  return {
    direction: isRTL ? "rtl" : "ltr",
    textAlign: isRTL ? "right" : "left",
  } as const
}

export function getFlexDirection(isRTL: boolean, defaultDirection: "row" | "row-reverse" = "row") {
  return isRTL ? (defaultDirection === "row" ? "row-reverse" : "row") : defaultDirection
}

export function getMarginClasses(isRTL: boolean) {
  return {
    start: isRTL ? "mr" : "ml",
    end: isRTL ? "ml" : "mr",
  }
}

export function getPaddingClasses(isRTL: boolean) {
  return {
    start: isRTL ? "pr" : "pl",
    end: isRTL ? "pl" : "pr",
  }
}

// Combine Tailwind classes with RTL support
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Breakpoints that account for text expansion in different languages
const languageBreakpoints: Record<Language, Record<string, number>> = {
  en: {
    sm: 640,
    md: 768,
    lg: 1024,
    xl: 1280,
    "2xl": 1536,
  },
  zh: {
    sm: 640,
    md: 768,
    lg: 1024,
    xl: 1280,
    "2xl": 1536,
  },
  ms: {
    // Malay tends to be slightly longer than English
    sm: 688,
    md: 816,
    lg: 1072,
    xl: 1328,
    "2xl": 1584,
  },
  ta: {
    // Tamil requires more space due to larger characters
    sm: 720,
    md: 848,
    lg: 1104,
    xl: 1360,
    "2xl": 1616,
  },
  ar: {
    // Arabic requires more space due to cursive nature
    sm: 704,
    md: 832,
    lg: 1088,
    xl: 1344,
    "2xl": 1600,
  },
}

export function getBreakpoint(size: string, language: Language): number {
  return languageBreakpoints[language]?.[size] || languageBreakpoints.en[size]
}

export function createMediaQuery(minWidth: number): string {
  return `@media (min-width: ${minWidth}px)`
}

export function useLanguageBreakpoint(size: string, language: Language): string {
  const breakpoint = getBreakpoint(size, language)
  return createMediaQuery(breakpoint)
}

// Text expansion factors for different languages
const textExpansionFactors: Record<Language, number> = {
  en: 1,
  zh: 0.8, // Chinese is generally more compact
  ms: 1.2, // Malay tends to be slightly longer
  ta: 1.3, // Tamil requires more space
  ar: 1.25, // Arabic requires more space
}

export function calculateTextWidth(
  baseWidth: number,
  language: Language
): number {
  return Math.ceil(baseWidth * (textExpansionFactors[language] || 1))
}

// Font size adjustments for different languages
const fontSizeAdjustments: Record<Language, number> = {
  en: 0,
  zh: 2, // Chinese characters need slightly larger size
  ms: 0,
  ta: 1, // Tamil needs slight size increase
  ar: 1, // Arabic needs slight size increase
}

export function adjustFontSize(
  baseSize: number,
  language: Language
): number {
  return baseSize + (fontSizeAdjustments[language] || 0)
}

// Line height adjustments for different languages
const lineHeightAdjustments: Record<Language, number> = {
  en: 1.5,
  zh: 1.8, // Chinese needs more line height
  ms: 1.6,
  ta: 1.8, // Tamil needs more line height
  ar: 1.7, // Arabic needs more line height
}

export function getLineHeight(language: Language): number {
  return lineHeightAdjustments[language] || lineHeightAdjustments.en
}

// Letter spacing adjustments
const letterSpacingAdjustments: Record<Language, string> = {
  en: "normal",
  zh: "-0.05em", // Tighter for Chinese
  ms: "normal",
  ta: "0.02em", // Slightly loose for Tamil
  ar: "normal",
}

export function getLetterSpacing(language: Language): string {
  return letterSpacingAdjustments[language] || letterSpacingAdjustments.en
}

// Helper to generate responsive font sizes
interface ResponsiveFontSizes {
  base: string
  sm: string
  md: string
  lg: string
  xl: string
}

export function generateResponsiveFontSizes(
  baseSize: number,
  language: Language
): ResponsiveFontSizes {
  const adjustedBase = adjustFontSize(baseSize, language)
  
  return {
    base: `${adjustedBase}px`,
    sm: `${adjustedBase * 1.1}px`,
    md: `${adjustedBase * 1.2}px`,
    lg: `${adjustedBase * 1.3}px`,
    xl: `${adjustedBase * 1.4}px`,
  }
}
