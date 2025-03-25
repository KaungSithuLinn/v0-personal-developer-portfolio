import "./globals.css"
import { Inter } from "next/font/google"
import type React from "react"
import { ThemeProvider } from "@/components/theme-provider"
import { ModeToggle } from "@/components/mode-toggle"
import Script from "next/script"

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
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
      </head>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <div className="fixed top-4 right-4 z-50">
            <ModeToggle />
          </div>
          {children}
        </ThemeProvider>
        {/* Structured data for SEO */}
        <Script
          id="schema-person"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Person",
              name: "Kaung Sithu Linn",
              url: "https://kaungsithulinn.com",
              jobTitle: "Software Developer",
              worksFor: {
                "@type": "Organization",
                name: "eVolva Software House",
              },
              alumniOf: {
                "@type": "EducationalOrganization",
                name: "James Cook University Singapore",
              },
              knowsAbout: [
                "Software Development",
                "Behavioral Biometrics",
                "Fraud Detection",
                "POS Systems",
                "Machine Learning",
                "Digital Marketing",
              ],
              hasCredential: [
                {
                  "@type": "EducationalOccupationalCredential",
                  name: "Bachelor of Information Technology",
                  credentialCategory: "Degree",
                  recognizedBy: {
                    "@type": "Organization",
                    name: "James Cook University Singapore",
                  },
                  dateCreated: "2024-03-07",
                },
                {
                  "@type": "EducationalOccupationalCredential",
                  name: "The Fundamentals of Digital Marketing",
                  credentialCategory: "Certificate",
                  recognizedBy: {
                    "@type": "Organization",
                    name: "Google Digital Garage",
                  },
                  dateCreated: "2023-04-03",
                },
              ],
              image:
                "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/KSTL%20Headshot%20Portrait.jpg-gxu4RedFPcOzqK3iU0lk96P56KVoZL.jpeg",
              sameAs: ["https://github.com/KaungSithuLinn", "https://linkedin.com/in/kaung-sithu-linn-7933781a5"],
            }),
          }}
        />
      </body>
    </html>
  )
}



import './globals.css'