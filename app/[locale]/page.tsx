import MainContent from "@/components/MainContent"
import type { Language } from "@/context/language-utils"
import { getTextDirection } from "@/lib/rtl-utils"

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const localeLang = locale as Language
  // Use server-compatible direction detection
  const direction = getTextDirection(localeLang)
  
  return (
    <div dir={direction}>
      <MainContent />
    </div>
  )
}
