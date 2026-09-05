import MainContent from "@/components/MainContent"
import type { Language } from "@/context/language-utils"
import { getTextDirection } from "@/lib/rtl-utils"

const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Kaung Sithu Linn",
  jobTitle: "Software Developer",
  url: "https://v0-personal-developer-portfolio-psi-blush.vercel.app",
  sameAs: [
    "https://github.com/kaungthu97",
    "https://linkedin.com/in/kaung-sithu-linn",
  ],
  email: "mailto:kaungthu.sithu97@gmail.com",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Singapore",
    addressCountry: "SG",
  },
  alumniOf: [
    {
      "@type": "CollegeOrUniversity",
      name: "James Cook University Singapore",
    },
    {
      "@type": "CollegeOrUniversity",
      name: "INET IT Academy",
    },
  ],
  knowsAbout: [
    "Software Development",
    "Behavioral Biometrics",
    "Fraud Detection",
    "Machine Learning",
    "POS Systems",
    "Full-Stack Development",
  ],
}

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const localeLang = locale as Language
  // Use server-compatible direction detection
  const direction = getTextDirection(localeLang)

  return (
    <div dir={direction}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
      />
      <MainContent />
    </div>
  )
}
