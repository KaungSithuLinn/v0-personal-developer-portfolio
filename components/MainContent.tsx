"use client"

import Hero from "@/app/components/Hero"
import About from "@/app/components/About"
import Experience from "@/app/components/Experience" 
import Skills from "@/app/components/Skills"
import Projects from "@/app/components/Projects"
import Testimonials from "@/app/components/Testimonials"
import Education from "@/app/components/Education"
import Contact from "@/app/components/Contact"
import FloatingNav from "@/app/components/floating-nav"
import DevConsoleInterface from "@/app/components/terminal/eDEXInterface"
import TranslationTester from "@/components/TranslationTester"

export default function MainContent() {
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