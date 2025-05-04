import { type Language } from "@/context/language-utils"
import { headers } from "next/headers"

interface LanguageAlternate {
  language: Language
  url: string
}

interface SEOMetadata {
  title: string
  description: string
  canonical: string
  alternates: LanguageAlternate[]
  robots?: string
  openGraph?: {
    title?: string
    description?: string
    type?: string
    url?: string
    locale?: string
    siteName?: string
    images?: {
      url: string
      width?: number
      height?: number
      alt?: string
    }[]
  }
}

const LANGUAGE_LOCALES: Record<Language, string> = {
  en: "en_US",
  zh: "zh_CN",
  ms: "ms_MY",
  ta: "ta_IN",
  ar: "ar_SA",
}

export function generateSEOMetadata({
  title,
  description,
  path,
  language,
  openGraph,
}: {
  title: string
  description: string
  path: string
  language: Language
  openGraph?: SEOMetadata["openGraph"]
}): SEOMetadata {
  const headersList = headers()
  const host = headersList.get("host") || ""
  const protocol = process.env.NODE_ENV === "development" ? "http" : "https"
  const baseUrl = `${protocol}://${host}`
  
  // Generate canonical URL for current language
  const canonical = `${baseUrl}/${language}${path}`
  
  // Generate alternates for other languages
  const alternates: LanguageAlternate[] = Object.keys(LANGUAGE_LOCALES).map((lang) => ({
    language: lang as Language,
    url: `${baseUrl}/${lang}${path}`,
  }))

  return {
    title,
    description,
    canonical,
    alternates,
    robots: "index, follow",
    openGraph: {
      title: openGraph?.title || title,
      description: openGraph?.description || description,
      type: openGraph?.type || "website",
      url: canonical,
      locale: LANGUAGE_LOCALES[language],
      siteName: openGraph?.siteName || title,
      images: openGraph?.images || [],
    },
  }
}

export function generateStructuredData(
  data: Record<string, any>,
  language: Language
): string {
  return JSON.stringify({
    "@context": "https://schema.org",
    "@type": "WebPage",
    inLanguage: LANGUAGE_LOCALES[language],
    ...data,
  })
}

export function generateHrefLangTags(alternates: LanguageAlternate[]): JSX.Element[] {
  return alternates.map(({ language, url }) => (
    <link
      key={language}
      rel="alternate"
      hrefLang={language}
      href={url}
    />
  ))
}

export function generateLanguageMetaTags(language: Language): JSX.Element[] {
  return [
    <meta
      key="content-language"
      httpEquiv="content-language"
      content={language}
    />,
    <meta
      key="language"
      name="language"
      content={LANGUAGE_LOCALES[language]}
    />,
  ]
}

export function generateRTLMetaTags(isRTL: boolean): JSX.Element[] {
  if (!isRTL) return []
  
  return [
    <meta
      key="dir"
      name="dir"
      content="rtl"
    />,
    <link
      key="rtl-stylesheet"
      rel="stylesheet"
      href="/styles/rtl.css"
      type="text/css"
    />,
  ]
}

interface LocalizedURLProps {
  path: string
  language: Language
  query?: Record<string, string>
}

export function generateLocalizedURL({
  path,
  language,
  query = {},
}: LocalizedURLProps): string {
  const queryString = Object.entries(query)
    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
    .join("&")

  const baseUrl = `/${language}${path}`
  return queryString ? `${baseUrl}?${queryString}` : baseUrl
}