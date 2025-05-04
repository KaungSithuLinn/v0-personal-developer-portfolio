import { Metadata } from "next"
import { ThemeProvider } from "@/components/theme-provider"
import { LanguageProvider } from "@/context/language-provider"
import { Inter, Noto_Sans_SC, Noto_Sans_Arabic, Noto_Sans_Tamil } from "next/font/google"
import { type Language } from "@/context/language-utils"
import { i18n } from "@/config/language.config"
import LanguageSelector from "@/components/LanguageSelector"
import DevInterface from "../components/terminal/DevInterface"
import "../globals.css"

// Load fonts with proper subsets and weights
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

// Generate metadata for each locale
export async function generateMetadata({ params: { locale } }: { params: { locale: Language } }): Promise<Metadata> {
  return {
    title: `Kaung Sithu Linn - ${locale === 'en' ? 'Software Developer Portfolio' : 'Portfolio'}`,
    description: "Personal portfolio website of Kaung Sithu Linn, a software developer specializing in full-stack development, fraud detection, and behavioral biometrics.",
  }
}

// Generate static params for all supported locales
export function generateStaticParams() {
  return i18n.locales.map((locale) => ({ locale }))
}

export default function LocaleLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode
  params: { locale: Language }
}) {
  // Explicitly compute RTL state based on locale
  const isRTL = locale === "ar"

  return (
    <html
      lang={locale}
      dir={isRTL ? "rtl" : "ltr"}
      suppressHydrationWarning
      className={`${inter.variable} ${notoSansArabic.variable} ${notoSansSC.variable} ${notoSansTamil.variable}`}
    >
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="dir" content={isRTL ? "rtl" : "ltr"} />
        <link rel="icon" href="/placeholder-logo.svg" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      </head>
      <body>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          <LanguageProvider initialLocale={locale}>
            <LanguageSelector />
            {children}
            <DevInterface />
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}