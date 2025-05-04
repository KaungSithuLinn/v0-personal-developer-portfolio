export type Language = "en" | "zh" | "ms" | "ta" | "ar"

export const SUPPORTED_LANGUAGES: Language[] = ["en", "zh", "ms", "ta", "ar"]
export const DEFAULT_LANGUAGE: Language = "en"
export const RTL_LANGUAGES: Language[] = ["ar"]

export const LANGUAGE_NAMES: Record<Language, string> = {
  en: "English",
  zh: "中文",
  ms: "Bahasa Melayu",
  ta: "தமிழ்",
  ar: "العربية",
}

export const LANGUAGE_REGIONS: Record<Language, string> = {
  en: "en-US",
  zh: "zh-CN",
  ms: "ms-MY",
  ta: "ta-IN",
  ar: "ar-SA",
}

export const FONT_FAMILIES: Record<Language, string> = {
  en: "var(--font-inter)",
  zh: "var(--font-noto-sc)",
  ms: "var(--font-inter)",
  ta: "var(--font-noto-tamil)",
  ar: "var(--font-noto-arabic)",
}

export const TEXT_DIRECTION: Record<Language, "ltr" | "rtl"> = {
  en: "ltr",
  zh: "ltr",
  ms: "ltr",
  ta: "ltr",
  ar: "rtl",
}

export const i18n = {
  defaultLocale: DEFAULT_LANGUAGE,
  locales: SUPPORTED_LANGUAGES,
} as const

interface LanguageConfig {
  lang: Language
  region: string
  dir: "ltr" | "rtl"
  fontFamily: string
}

export function getLanguageConfig(lang: Language): LanguageConfig {
  return {
    lang,
    region: LANGUAGE_REGIONS[lang],
    dir: TEXT_DIRECTION[lang],
    fontFamily: FONT_FAMILIES[lang],
  }
}