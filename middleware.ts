import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { SUPPORTED_LANGUAGES, DEFAULT_LANGUAGE } from "@/config/language.config"

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Redirect the bare root to the default locale.
  if (pathname === "/") {
    const url = request.nextUrl.clone()
    url.pathname = `/${DEFAULT_LANGUAGE}`
    return NextResponse.redirect(url, 307)
  }
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.includes(".") ||
    pathname === "/sitemap.xml" ||
    pathname === "/robots.txt"
  ) {
    return NextResponse.next()
  }

  // Check if the pathname starts with a supported locale
  const locale = pathname.split("/")[1]
  if (SUPPORTED_LANGUAGES.includes(locale as (typeof SUPPORTED_LANGUAGES)[number])) {
    const requestHeaders = new Headers(request.headers)
    requestHeaders.set("x-locale", locale)
    return NextResponse.next({ request: { headers: requestHeaders } })
  }

  // Invalid locale — redirect to default
  const url = request.nextUrl.clone()
  url.pathname = `/${DEFAULT_LANGUAGE}${pathname}`
  return NextResponse.redirect(url)
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|icon.svg).*)"],
}


