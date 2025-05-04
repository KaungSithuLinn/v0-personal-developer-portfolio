import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { match } from "@formatjs/intl-localematcher"
import { type Language } from "./context/language-utils"
import { SUPPORTED_LANGUAGES, DEFAULT_LANGUAGE, LANGUAGE_REGIONS } from "./config/language.config"

// Determine user's preferred language
function getPreferredLanguage(request: NextRequest): Language {
  // Get language from cookie
  const cookieLang = request.cookies.get("NEXT_LOCALE")?.value as Language
  if (cookieLang && SUPPORTED_LANGUAGES.includes(cookieLang)) {
    return cookieLang
  }

  // Get Accept-Language header
  const acceptLanguage = request.headers.get("accept-language") || ""
  try {
    // Parse languages from header
    const languages = acceptLanguage
      .split(",")
      .map(lang => lang.split(";")[0])
      .map(lang => lang.split("-")[0])

    // Match against supported languages
    const matchedLanguage = match(
      languages,
      SUPPORTED_LANGUAGES,
      DEFAULT_LANGUAGE
    ) as Language

    return matchedLanguage
  } catch {
    return DEFAULT_LANGUAGE
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Skip middleware for static files and API routes
  if (
    pathname.includes("/_next") ||
    pathname.includes("/api/") ||
    pathname.includes("/static/") ||
    pathname.match(/\.(ico|jpg|jpeg|png|gif|svg|css|js)$/)
  ) {
    return NextResponse.next()
  }

  // Get language from URL or user preference
  const pathnameLanguage = pathname.split("/")[1] as Language
  const isValidLanguage = SUPPORTED_LANGUAGES.includes(pathnameLanguage)
  const preferredLanguage = getPreferredLanguage(request)

  // If URL has no language prefix, redirect to preferred language
  if (!isValidLanguage) {
    const redirectUrl = new URL(
      `/${preferredLanguage}${pathname === "/" ? "" : pathname}`,
      request.url
    )
    return NextResponse.redirect(redirectUrl)
  }

  // Store language preference in cookie
  const response = NextResponse.next()
  response.cookies.set("NEXT_LOCALE", pathnameLanguage, {
    path: "/",
    maxAge: 60 * 60 * 24 * 365, // 1 year
  })

  // Set language-specific headers
  response.headers.set("Content-Language", LANGUAGE_REGIONS[pathnameLanguage])
  
  // Set vary header to ensure proper caching
  response.headers.set("Vary", "Accept-Language")

  // Add Link header for language alternates
  const alternateLinks = SUPPORTED_LANGUAGES
    .filter(lang => lang !== pathnameLanguage)
    .map(lang => {
      const url = new URL(request.url)
      url.pathname = `/${lang}${pathname.replace(`/${pathnameLanguage}`, "")}`
      return `<${url.href}>; rel="alternate"; hreflang="${LANGUAGE_REGIONS[lang]}"`
    })
    .join(", ")

  if (alternateLinks) {
    response.headers.set("Link", alternateLinks)
  }

  // Add x-default language
  const defaultUrl = new URL(request.url)
  defaultUrl.pathname = `/${DEFAULT_LANGUAGE}${pathname.replace(`/${pathnameLanguage}`, "")}`
  response.headers.append("Link", `<${defaultUrl.href}>; rel="alternate"; hreflang="x-default"`)

  return response
}

export const config = {
  matcher: [
    // Skip static files and API routes
    "/((?!api|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)",
  ],
}
