import MainContent from "@/components/MainContent";
import type { Language } from "@/context/language-utils";
import { getTextDirection } from "@/lib/rtl-utils";

interface Props {
  params: Promise<{
    locale: Language;
  }>;
}

export default async function Home({ params }: Props) {
  const { locale } = await params;
  // Use server-compatible direction detection
  const direction = getTextDirection(locale);

  return (
    <div dir={direction}>
      <MainContent />
    </div>
  );
}
