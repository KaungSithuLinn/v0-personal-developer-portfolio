import { Metadata } from "next"
import { ThemeProvider } from "@/components/theme-provider"
import { Suspense } from "react"
import "./globals.css"

// Audit P0-3: suspense boundary for non-critical content

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
    <html suppressHydrationWarning>
      <body className="antialiased min-h-screen">
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          <Suspense fallback={<div className="min-h-screen bg-background" />}>
            {children}
          </Suspense>
        </ThemeProvider>
      </body>
    </html>
  )
}
