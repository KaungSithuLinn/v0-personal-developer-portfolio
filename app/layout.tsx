import { Metadata } from "next"
import { ThemeProvider } from "@/components/theme-provider"
import { Inter, Noto_Sans_SC, Noto_Sans_Arabic, Noto_Sans_Tamil } from "next/font/google"
import "./globals.css"

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

export const metadata: Metadata = {
  title: "Kaung Sithu Linn - Portfolio",
  description: "Software developer portfolio specializing in full-stack development, fraud detection, and behavioral biometrics.",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html suppressHydrationWarning className={`${inter.variable} ${notoSansArabic.variable} ${notoSansSC.variable} ${notoSansTamil.variable}`}>
      <body>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
