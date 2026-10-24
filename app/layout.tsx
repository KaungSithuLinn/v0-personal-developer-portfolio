import { Metadata } from "next"
import { ThemeProvider } from "@/components/theme-provider"
import { AiAssistantWidget } from "@/app/components/ai-assistant-widget"
import { Suspense } from "react"
import { cookies, headers } from "next/headers"

import { SUPPORTED_LANGUAGES, DEFAULT_LANGUAGE, RTL_LANGUAGES } from "@/config/language.config"
import { Inter, Noto_Sans_SC, Noto_Sans_Arabic, Noto_Sans_Tamil } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
})

const notoSansArabic = Noto_Sans_Arabic({
  subsets: ["arabic"],
  display: "swap",
  variable: "--font-noto-arabic",
  preload: true,
  adjustFontFallback: true,
})

const notoSansSC = Noto_Sans_SC({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  display: "swap",
  variable: "--font-noto-sc",
  preload: true,
})

const notoSansTamil = Noto_Sans_Tamil({
  subsets: ["tamil"],
  weight: ["400", "500", "700"],
  display: "swap",
  variable: "--font-noto-tamil",
  preload: true,
  adjustFontFallback: true,
})

export const metadata: Metadata = {
  title: "Kaung Sithu Linn - Portfolio",
  description: "Software developer portfolio specializing in full-stack development, fraud detection, and behavioral biometrics.",
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const headerStore = await headers()
  const headerLocale = headerStore.get("x-locale")
  const cookieStore = await cookies()
  const cookieLocale = cookieStore.get("language")?.value
  const initialLocale = SUPPORTED_LANGUAGES.includes(headerLocale as (typeof SUPPORTED_LANGUAGES)[number])
    ? (headerLocale as (typeof SUPPORTED_LANGUAGES)[number])
    : SUPPORTED_LANGUAGES.includes(cookieLocale as (typeof SUPPORTED_LANGUAGES)[number])
      ? (cookieLocale as (typeof SUPPORTED_LANGUAGES)[number])
      : DEFAULT_LANGUAGE
  const initialDir = RTL_LANGUAGES.includes(initialLocale) ? "rtl" : "ltr"

  return (
    <html
      suppressHydrationWarning
      lang={initialLocale}
      dir={initialDir}
      className={`${inter.variable} ${notoSansArabic.variable} ${notoSansSC.variable} ${notoSansTamil.variable}`}
    >
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="icon" href="/icon.svg" />
      </head>
      <body className="antialiased min-h-screen bg-grid-faint">
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          <Suspense fallback={<div className="min-h-screen bg-background" />}>
            {children}
          </Suspense>
          <AiAssistantWidget />
          <Analytics />
        </ThemeProvider>
      </body>
    </html>
  )
}
