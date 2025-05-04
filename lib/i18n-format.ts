import { type Language } from "@/context/language-utils"
import { LANGUAGE_REGIONS } from "@/config/language.config"

// Language-specific date formats
const DATE_FORMATS: Record<Language, Intl.DateTimeFormatOptions> = {
  en: {
    short: { month: "short", day: "numeric", year: "numeric" },
    medium: { month: "long", day: "numeric", year: "numeric" },
    long: { weekday: "long", month: "long", day: "numeric", year: "numeric" },
  },
  zh: {
    short: { year: "numeric", month: "numeric", day: "numeric" },
    medium: { year: "numeric", month: "long", day: "numeric" },
    long: { year: "numeric", month: "long", day: "numeric", weekday: "long" },
  },
  ms: {
    short: { day: "numeric", month: "short", year: "numeric" },
    medium: { day: "numeric", month: "long", year: "numeric" },
    long: { weekday: "long", day: "numeric", month: "long", year: "numeric" },
  },
  ta: {
    short: { day: "numeric", month: "short", year: "numeric" },
    medium: { day: "numeric", month: "long", year: "numeric" },
    long: { weekday: "long", day: "numeric", month: "long", year: "numeric" },
  },
  ar: {
    short: { day: "numeric", month: "short", year: "numeric" },
    medium: { day: "numeric", month: "long", year: "numeric" },
    long: { weekday: "long", day: "numeric", month: "long", year: "numeric" },
  },
} as const

// Language-specific number formats
const NUMBER_FORMATS: Record<Language, Intl.NumberFormatOptions> = {
  en: {
    decimal: { minimumFractionDigits: 2, maximumFractionDigits: 2 },
    percent: { style: "percent", minimumFractionDigits: 1 },
    currency: { style: "currency", currency: "USD" },
  },
  zh: {
    decimal: { minimumFractionDigits: 2, maximumFractionDigits: 2 },
    percent: { style: "percent", minimumFractionDigits: 1 },
    currency: { style: "currency", currency: "CNY" },
  },
  ms: {
    decimal: { minimumFractionDigits: 2, maximumFractionDigits: 2 },
    percent: { style: "percent", minimumFractionDigits: 1 },
    currency: { style: "currency", currency: "MYR" },
  },
  ta: {
    decimal: { minimumFractionDigits: 2, maximumFractionDigits: 2 },
    percent: { style: "percent", minimumFractionDigits: 1 },
    currency: { style: "currency", currency: "INR" },
  },
  ar: {
    decimal: { minimumFractionDigits: 2, maximumFractionDigits: 2 },
    percent: { style: "percent", minimumFractionDigits: 1 },
    currency: { style: "currency", currency: "AED" },
  },
} as const

// Language to locale mapping
const LANGUAGE_LOCALES: Record<Language, string> = {
  en: "en-US",
  zh: "zh-CN",
  ms: "ms-MY",
  ta: "ta-IN",
  ar: "ar-SA",
}

type DateFormatStyle = "short" | "medium" | "long"
type NumberFormatStyle = "decimal" | "percent" | "currency"

export function formatDate(
  date: Date | string | number,
  language: Language,
  style: DateFormatStyle = "medium"
): string {
  const dateObj = typeof date === "string" ? new Date(date) : new Date(date)
  const locale = LANGUAGE_LOCALES[language]
  const options = DATE_FORMATS[language][style]

  return new Intl.DateTimeFormat(locale, options).format(dateObj)
}

export function formatNumber(
  number: number,
  language: Language,
  style: NumberFormatStyle = "decimal"
): string {
  const locale = LANGUAGE_LOCALES[language]
  const options = NUMBER_FORMATS[language][style]

  return new Intl.NumberFormat(locale, options).format(number)
}

export function formatCurrency(
  amount: number,
  language: Language,
  currency?: string
): string {
  const locale = LANGUAGE_LOCALES[language]
  const options: Intl.NumberFormatOptions = {
    ...NUMBER_FORMATS[language].currency,
    ...(currency && { currency }),
  }

  return new Intl.NumberFormat(locale, options).format(amount)
}

export function formatPercent(
  value: number,
  language: Language,
  decimals = 1
): string {
  const locale = LANGUAGE_LOCALES[language]
  const options: Intl.NumberFormatOptions = {
    ...NUMBER_FORMATS[language].percent,
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }

  return new Intl.NumberFormat(locale, options).format(value)
}

export function formatRelativeTime(
  value: number,
  unit: Intl.RelativeTimeFormatUnit,
  language: Language
): string {
  const locale = LANGUAGE_LOCALES[language]
  const rtf = new Intl.RelativeTimeFormat(locale, { numeric: "auto" })
  return rtf.format(value, unit)
}

export function formatList(
  items: string[],
  language: Language,
  style: "long" | "short" | "narrow" = "long"
): string {
  const locale = LANGUAGE_LOCALES[language]
  const formatter = new Intl.ListFormat(locale, { style, type: "conjunction" })
  return formatter.format(items)
}

// Helper function to determine if a string needs numerical formatting
export function needsNumericalFormatting(text: string): boolean {
  return /\d+([.,]\d+)?%?/.test(text)
}

// Helper function to format numbers within a text string
export function formatTextWithNumbers(
  text: string,
  language: Language
): string {
  return text.replace(/\d+([.,]\d+)?%?/g, match => {
    if (match.endsWith("%")) {
      const number = parseFloat(match.slice(0, -1)) / 100
      return formatPercent(number, language)
    }
    const number = parseFloat(match.replace(",", "."))
    return formatNumber(number, language)
  })
}

// Format time periods in a culturally appropriate way
export function formatTimePeriod(
  startDate: Date,
  endDate: Date | "present",
  language: Language
): string {
  const locale = LANGUAGE_REGIONS[language]
  const dateFormatter = new Intl.DateTimeFormat(locale, {
    year: "numeric",
    month: "short",
  })

  const start = dateFormatter.format(startDate)
  const end = endDate === "present" 
    ? (language === "ar" ? "الحاضر" : language === "zh" ? "至今" : "Present")
    : dateFormatter.format(endDate)

  // Handle RTL languages
  if (language === "ar") {
    return `${end} - ${start}`
  }

  return `${start} - ${end}`
}