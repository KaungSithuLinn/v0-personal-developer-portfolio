"use client"

import dynamic from "next/dynamic"
import TranslationTester from "@/components/TranslationTester"

// Audit P0-4: dynamic import with ssr disabled

const DynamicHero = dynamic(() => import("@/app/components/Hero"), { ssr: false })
const DynamicAbout = dynamic(() => import("@/app/components/About"), { ssr: false })
const DynamicExperience = dynamic(() => import("@/app/components/Experience"), { ssr: false })
const DynamicSkills = dynamic(() => import("@/app/components/Skills"), { ssr: false })
const DynamicProjects = dynamic(() => import("@/app/components/Projects"), { ssr: false })
const DynamicTestimonials = dynamic(() => import("@/app/components/Testimonials"), { ssr: false })
const DynamicEducation = dynamic(() => import("@/app/components/Education"), { ssr: false })
const DynamicContact = dynamic(() => import("@/app/components/Contact"), { ssr: false })
const DynamicFloatingNav = dynamic(() => import("@/app/components/floating-nav"), { ssr: false })
const DynamicDevConsole = dynamic(() => import("@/app/components/terminal/eDEXInterface"), { ssr: false })

export default function MainContent() {
  return (
    <main className="bg-gray-50 dark:bg-gray-900 min-h-screen">
      <DynamicFloatingNav />
      <DynamicDevConsole />
      <DynamicHero />
      <DynamicAbout />
      <DynamicExperience />
      <DynamicSkills />
      <DynamicProjects />
      <DynamicTestimonials />
      <DynamicEducation />
      <DynamicContact />
      {process.env.NODE_ENV === "development" && <TranslationTester />}
    </main>
  )
}
