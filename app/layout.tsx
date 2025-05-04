import { Metadata } from "next"
import { ThemeProvider } from "@/components/theme-provider"
import { LanguageProvider } from "@/context/language-provider"
import { Inter, Noto_Sans_SC, Noto_Sans_Arabic, Noto_Sans_Tamil } from "next/font/google"
import { type Language } from "@/context/language-utils"
import "./globals.css"
import { DEFAULT_LANGUAGE } from "@/config/language.config"
import { redirect } from "next/navigation"

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

// Language-specific metadata
export const metadata: Metadata = {
  title: "Kaung Sithu Linn - Software Developer Portfolio",
  description: "Personal portfolio website of Kaung Sithu Linn, a software developer specializing in full-stack development, fraud detection, and behavioral biometrics.",
  keywords: ["software developer", "full-stack", "fraud detection", "behavioral biometrics", "portfolio"],
}

// Separate translations for dynamic content
const translations: Record<Language, { title: string; description: string; keywords: string[] }> = {
  en: {
    title: "Kaung Sithu Linn - Software Developer Portfolio",
    description: "Personal portfolio website of Kaung Sithu Linn, a software developer specializing in full-stack development, fraud detection, and behavioral biometrics.",
    keywords: ["software developer", "full-stack", "fraud detection", "behavioral biometrics", "portfolio"],
  },
  zh: {
    title: "Kaung Sithu Linn - 软件开发工程师作品集",
    description: "Kaung Sithu Linn的个人作品集网站，专注于全栈开发、欺诈检测和行为生物识别的软件开发工程师。",
    keywords: ["软件开发", "全栈开发", "欺诈检测", "行为生物识别", "作品集"],
  },
  ms: {
    title: "Kaung Sithu Linn - Portfolio Pembangun Perisian",
    description: "Laman web portfolio peribadi Kaung Sithu Linn, pembangun perisian yang pakar dalam pembangunan full-stack, pengesanan penipuan, dan biometrik tingkah laku.",
    keywords: ["pembangun perisian", "full-stack", "pengesanan penipuan", "biometrik tingkah laku", "portfolio"],
  },
  ta: {
    title: "Kaung Sithu Linn - மென்பொருள் மேம்பாட்டாளர் போர்ட்ஃபோலியோ",
    description: "முழு-ஸ்டேக் மேம்பாடு, மோசடி கண்டறிதல் மற்றும் நடத்தை உயிரிமெட்ரிக்ஸ் ஆகியவற்றில் நிபுணத்துவம் பெற்ற மென்பொருள் மேம்பாட்டாளர் Kaung Sithu Linn இன் தனிப்பட்ட போர்ட்ஃபோலியோ வலைத்தளம்.",
    keywords: ["மென்பொருள் மேம்பாட்டாளர்", "முழு-ஸ்டேக்", "மோசடி கண்டறிதல்", "நடத்தை உயிரிமெட்ரிக்ஸ்", "போர்ட்ஃபோலியோ"],
  },
  ar: {
    title: "كونج سيثو لين - محفظة مطور البرمجيات",
    description: "موقع المحفظة الشخصية لكونج سيثو لين، مطور برمجيات متخصص في التطوير الشامل وكشف الاحتيال والقياسات الحيوية السلوكية.",
    keywords: ["مطور برمجيات", "تطوير شامل", "كشف احتيال", "قياسات حيوية سلوكية", "محفظة أعمال"],
  },
}

export default function RootLayout() {
  redirect(`/${DEFAULT_LANGUAGE}`)
}
