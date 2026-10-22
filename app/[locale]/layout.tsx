import { Metadata } from "next"
import { LanguageProvider } from "@/context/language-provider"
import { RTLProvider } from "@/context/rtl-provider"
import { type Language } from "@/context/language-utils"
import { i18n } from "@/config/language.config"
import UnifiedDevConsole from "../components/terminal/UnifiedDevConsole"

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const localeLang = locale as Language
  return {
    title: `Kaung Sithu Linn - ${localeLang === "en" ? "Software Developer Portfolio" : "Portfolio"}`,
    description: "Personal portfolio website of Kaung Sithu Linn, a software developer specializing in full-stack development, fraud detection, and behavioral biometrics.",
    openGraph: {
      title: "Kaung Sithu Linn - Software Developer Portfolio",
      description: "Software developer specializing in full-stack development, fraud detection, and behavioral biometrics.",
      type: "profile",
      locale: localeLang === "zh" ? "zh_CN" : localeLang === "ms" ? "ms_MY" : "en_US",
      url: "https://v0-personal-developer-portfolio-psi-blush.vercel.app",
      siteName: "Kaung Sithu Linn Portfolio",
    },
  }
}

export function generateStaticParams(): { locale: Language }[] {
  return i18n.locales.map((locale) => ({ locale }))
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const localeLang = locale as Language

  return (
    <LanguageProvider initialLocale={localeLang}>
      <RTLProvider>
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>
        {children}
        <UnifiedDevConsole />
      </RTLProvider>
    </LanguageProvider>
  )
}
