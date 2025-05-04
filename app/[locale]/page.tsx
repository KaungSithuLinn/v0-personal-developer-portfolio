import MainContent from "@/components/MainContent"
import type { Language } from "@/context/language-utils"

interface Props {
  params: {
    locale: Language
  }
}

export default function Home({ params: { locale } }: Props) {
  return <MainContent />
}