import { type Metadata } from "next"
import { type Language } from "@/context/language-utils"
import { SUPPORTED_LANGUAGES, LANGUAGE_REGIONS } from "@/config/language.config"

interface GenerateMetadataOptions {
  currentLang: Language
  title: Record<Language, string>
  description: Record<Language, string>
  keywords: Record<Language, string[]>
  baseUrl: string
  path?: string
}

export function generateMetadata({
  currentLang,
  title,
  description,
  keywords,
  baseUrl,
  path = "",
}: GenerateMetadataOptions): Metadata {
  const alternateLanguages = SUPPORTED_LANGUAGES.reduce((acc, lang) => {
    acc[LANGUAGE_REGIONS[lang]] = `${baseUrl}/${lang}${path}`
    return acc
  }, {} as Record<string, string>)

  return {
    title: title[currentLang] || title.en,
    description: description[currentLang] || description.en,
    keywords: keywords[currentLang] || keywords.en,
    alternates: {
      canonical: `${baseUrl}/${currentLang}${path}`,
      languages: alternateLanguages,
    },
    openGraph: {
      title: title[currentLang] || title.en,
      description: description[currentLang] || description.en,
      locale: LANGUAGE_REGIONS[currentLang],
      alternateLocale: Object.values(LANGUAGE_REGIONS).filter(
        (locale) => locale !== LANGUAGE_REGIONS[currentLang]
      ),
    },
    twitter: {
      title: title[currentLang] || title.en,
      description: description[currentLang] || description.en,
    },
  }
}

export function getLanguageAlternates(baseUrl: string, path = "") {
  return SUPPORTED_LANGUAGES.map((lang) => ({
    tag: LANGUAGE_REGIONS[lang],
    url: `${baseUrl}/${lang}${path}`,
  }))
}