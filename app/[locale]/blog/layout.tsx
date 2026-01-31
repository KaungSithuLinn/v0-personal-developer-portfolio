import { Suspense } from "react";
import { Metadata } from "next";
import type { Language } from "@/config/language.config";

interface BlogLayoutProps {
  children: React.ReactNode;
  params: Promise<{
    locale: string;
  }>;
}

export async function generateMetadata({
  params,
}: BlogLayoutProps): Promise<Metadata> {
  const { locale } = (await params) as { locale: Language };

  // TODO: Add proper translations for blog metadata
  const titles = {
    en: "Blog & Notes - Kaung Sithu Linn",
    zh: "博客与笔记 - Kaung Sithu Linn",
    ms: "Blog & Nota - Kaung Sithu Linn",
    ta: "வலைப்பதிவு & குறிப்புகள் - Kaung Sithu Linn",
    ar: "المدونة والملاحظات - Kaung Sithu Linn",
  };

  const descriptions = {
    en: "Technical insights, tutorials, and thoughts on software development, web technologies, and programming best practices.",
    zh: "关于软件开发、网络技术和编程最佳实践的技术见解、教程和思考。",
    ms: "Wawasan teknikal, tutorial, dan pemikiran tentang pembangunan perisian, teknologi web, dan amalan terbaik pengaturcaraan.",
    ta: "மென்பொருள் மேம்பாடு, வலை தொழில்நுட்பங்கள் மற்றும் நிரலாக்க சிறந்த நடைமுறைகள் பற்றிய தொழில்நுட்ப நுண்ணறிவு, பயிற்சிகள் மற்றும் எண்ணங்கள்.",
    ar: "رؤى تقنية ودروس وأفكار حول تطوير البرمجيات وتقنيات الويب وأفضل ممارسات البرمجة.",
  };

  return {
    title: titles[locale],
    description: descriptions[locale],
    openGraph: {
      title: titles[locale],
      description: descriptions[locale],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: titles[locale],
      description: descriptions[locale],
    },
  };
}

export default function BlogLayout({ children }: BlogLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <Suspense
        fallback={
          <div className="flex items-center justify-center min-h-screen">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        }
      >
        {children}
      </Suspense>
    </div>
  );
}
