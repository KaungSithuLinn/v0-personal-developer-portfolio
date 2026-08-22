"use client"

import dynamic from "next/dynamic"
import TranslationTester from "@/components/TranslationTester"

const DynamicHero = dynamic(() => import("@/app/components/Hero"))
const DynamicAbout = dynamic(() => import("@/app/components/About"))
const DynamicExperience = dynamic(() => import("@/app/components/Experience"))
const DynamicSkills = dynamic(() => import("@/app/components/Skills"))
const DynamicProjects = dynamic(() => import("@/app/components/Projects"))
const DynamicTestimonials = dynamic(() => import("@/app/components/Testimonials"))
const DynamicEducation = dynamic(() => import("@/app/components/Education"))
const DynamicContact = dynamic(() => import("@/app/components/Contact"))
const DynamicFloatingNav = dynamic(() => import("@/app/components/floating-nav"))

export default function MainContent() {
  return (
    <main id="main-content" role="main" className="bg-slate-50 dark:bg-[#070c16] min-h-screen">
      <DynamicFloatingNav />
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