import type { ReactNode } from "react"
import "./globals.css"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import { LanguageProvider } from "@/context/language-provider"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "Kaung Sithu Linn - Software Developer | Behavioral Biometrics Specialist",
  description:
    "Portfolio of Kaung Sithu Linn, a Software Developer specializing in POS systems, fraud detection, behavioral biometrics, and digital marketing with 4+ years of experience.",
  keywords:
    "Software Developer, Behavioral Biometrics, Fraud Detection, POS Systems, Machine Learning, Digital Marketing, Singapore, Bachelor of Information Technology",
  openGraph: {
    title: "Kaung Sithu Linn - Software Developer",
    description: "Specializing in POS systems, fraud detection, behavioral biometrics, and digital marketing",
    url: "https://kaungsithulinn.com",
    siteName: "Kaung Sithu Linn Portfolio",
    images: [
      {
        url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/KSTL%20Headshot%20Portrait.jpg-gxu4RedFPcOzqK3iU0lk96P56KVoZL.jpeg",
        width: 800,
        height: 600,
        alt: "Kaung Sithu Linn - Software Developer",
      },
    ],
    locale: "en_US",
    type: "website",
  },
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} language-transition`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <LanguageProvider>{children}</LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
