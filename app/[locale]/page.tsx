import MainContent from "@/components/MainContent"
import type { Language } from "@/context/language-utils"
import { getTextDirection } from "@/lib/rtl-utils"

interface Props {
  params: {
    locale: Language
  }
}

export default function Home({ params: { locale } }: Props) {
  // Use server-compatible direction detection
  const direction = getTextDirection(locale)
  
  return (
    <div dir={direction}>
      <MainContent />
    </div>
  )
}