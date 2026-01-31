import { Metadata } from "next";
import { LanguageProvider } from "@/context/language-provider";
import { RTLProvider } from "@/context/rtl-provider";
import { type Language } from "@/context/language-utils";
import { i18n } from "@/config/language.config";
import { isRTL } from "@/lib/rtl-utils";
import LanguageSelector from "@/components/LanguageSelector";
import DevInterface from "../components/terminal/DevInterface";
import HtmlAttributeManager from "@/components/HtmlAttributeManager";
import "../globals.css";

// Generate metadata for each locale
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Language }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: `Kaung Sithu Linn - ${locale === "en" ? "Software Developer Portfolio" : "Portfolio"}`,
    description:
      "Personal portfolio website of Kaung Sithu Linn, a software developer specializing in full-stack development, fraud detection, and behavioral biometrics.",
  };
}

// Generate static params for all supported locales
export function generateStaticParams() {
  return i18n.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = (await params) as { locale: Language };
  // Pre-calculate RTL state for initial render using server-compatible function
  const defaultRTL = isRTL(locale);

  // The <html> and <body> tags are already provided by the root layout (app/layout.tsx)
  // This component should only return the content that goes INSIDE the body
  return (
    <LanguageProvider initialLocale={locale}>
      <RTLProvider defaultRTL={defaultRTL}>
        <HtmlAttributeManager
          initialLocale={locale}
          initialDirection={defaultRTL ? "rtl" : "ltr"}
        />
        <LanguageSelector />
        {children}
        <DevInterface />
      </RTLProvider>
    </LanguageProvider>
  );
}
