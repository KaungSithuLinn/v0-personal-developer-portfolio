import { type Language } from "@/context/language-utils"
import localFont from "next/font/local"
import { Noto_Sans_SC, Noto_Sans_TC, Noto_Sans_Tamil, Noto_Sans_Arabic } from "next/font/google"

// Define font configuration for each language
const FONT_CONFIGS = {
  en: {
    primary: localFont({
      src: "../public/fonts/Satoshi-Variable.woff2",
      variable: "--font-satoshi",
    }),
    secondary: localFont({
      src: "../public/fonts/CalSans-SemiBold.woff2",
      variable: "--font-calsans",
    }),
  },
  zh: {
    primary: Noto_Sans_SC({
      subsets: ["latin"],
      weight: ["400", "500", "700"],
      variable: "--font-noto-sc",
    }),
    secondary: Noto_Sans_TC({
      subsets: ["latin"],
      weight: ["400", "500", "700"],
      variable: "--font-noto-tc",
    }),
  },
  ms: {
    primary: localFont({
      src: "../public/fonts/Satoshi-Variable.woff2",
      variable: "--font-satoshi",
    }),
    secondary: localFont({
      src: "../public/fonts/CalSans-SemiBold.woff2",
      variable: "--font-calsans",
    }),
  },
  ta: {
    primary: Noto_Sans_Tamil({
      subsets: ["latin", "tamil"],
      weight: ["400", "500", "700"],
      variable: "--font-noto-tamil",
    }),
    secondary: localFont({
      src: "../public/fonts/CalSans-SemiBold.woff2",
      variable: "--font-calsans",
    }),
  },
  ar: {
    primary: Noto_Sans_Arabic({
      subsets: ["arabic", "latin"],
      weight: ["400", "500", "700"],
      variable: "--font-noto-arabic",
    }),
    secondary: localFont({
      src: "../public/fonts/CalSans-SemiBold.woff2",
      variable: "--font-calsans",
    }),
  },
} as const

// Define font fallback stacks
const FONT_FALLBACKS = {
  en: {
    primary: "system-ui, sans-serif",
    secondary: "system-ui, sans-serif",
  },
  zh: {
    primary: "'PingFang SC', 'Microsoft YaHei', system-ui, sans-serif",
    secondary: "'PingFang TC', 'Microsoft JhengHei', system-ui, sans-serif",
  },
  ms: {
    primary: "system-ui, sans-serif",
    secondary: "system-ui, sans-serif",
  },
  ta: {
    primary: "'Latha', 'Vijaya', system-ui, sans-serif",
    secondary: "system-ui, sans-serif",
  },
  ar: {
    primary: "'Traditional Arabic', 'Simplified Arabic', system-ui, sans-serif",
    secondary: "system-ui, sans-serif",
  },
} as const

export type FontType = "primary" | "secondary"

// Get font variable name for a specific language and font type
export function getFontVariable(language: Language, type: FontType): string {
  return FONT_CONFIGS[language][type].variable
}

// Get font class name for a specific language and font type
export function getFontClassName(language: Language, type: FontType): string {
  return FONT_CONFIGS[language][type].className
}

// Get complete font stack including fallbacks
export function getFontStack(language: Language, type: FontType): string {
  const fontConfig = FONT_CONFIGS[language][type]
  const fallbacks = FONT_FALLBACKS[language][type]
  return `var(${fontConfig.variable}), ${fallbacks}`
}

// Generate CSS variables for all font configurations
export function generateFontVariables(language: Language): Record<string, string> {
  return {
    "--font-primary": getFontStack(language, "primary"),
    "--font-secondary": getFontStack(language, "secondary"),
  }
}

// Get all font class names for a specific language
export function getLanguageFontClasses(language: Language): string[] {
  return [
    FONT_CONFIGS[language].primary.className,
    FONT_CONFIGS[language].secondary.className,
  ]
}

// Helper function to determine if a language needs a specific font loading strategy
export function needsFontOptimization(language: Language): boolean {
  return ["zh", "ta", "ar"].includes(language)
}

// Generate font preload links for a specific language
export function generateFontPreloadLinks(language: Language): JSX.Element[] {
  if (!needsFontOptimization(language)) {
    return []
  }

  const fonts = Object.values(FONT_CONFIGS[language])
  return fonts.map((font, index) => (
    <link
      key={`${language}-font-${index}`}
      rel="preload"
      href={font.src as string}
      as="font"
      type="font/woff2"
      crossOrigin="anonymous"
    />
  );
}