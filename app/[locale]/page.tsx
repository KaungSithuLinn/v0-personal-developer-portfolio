"use client"

import Hero from "../components/Hero"
import About from "../components/About"
import Experience from "../components/Experience"
import Skills from "../components/Skills"
import Projects from "../components/Projects"
import Testimonials from "../components/Testimonials"
import Education from "../components/Education"
import Contact from "../components/Contact"
import FloatingNav from "../components/floating-nav"
import DevConsoleInterface from "../components/terminal/eDEXInterface"
import TranslationTester from "@/components/TranslationTester"
import { Language } from "@/context/language-utils"
import { useTranslation } from "@/context/language-utils"

interface Props {
  params: {
    locale: Language
  }
}

export default function Home({ params: { locale } }: Props) {
  const { isRTL } = useTranslation()
  
  return (
    <main className="bg-gray-50 dark:bg-gray-900 min-h-screen">
      <FloatingNav />
      <DevConsoleInterface />
      <Hero />
      <About />
      <Experience />
      <Skills />
      <Projects />
      <Testimonials />
      <Education />
      <Contact />
      {process.env.NODE_ENV === "development" && <TranslationTester />}
    </main>
  )
}