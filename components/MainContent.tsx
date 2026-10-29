"use client"

import dynamic from "next/dynamic"
import { useSeasonalTheme } from "@/hooks/use-seasonal-theme"
import TranslationTester from "@/components/TranslationTester"
import AsciiRevealSection from "@/components/AsciiRevealSection"
import HalloweenOverlay from "@/components/halloween/HalloweenOverlay"

const DynamicHero = dynamic(() => import("@/app/components/Hero"))
const DynamicHalloweenHero = dynamic(() => import("@/components/halloween/HalloweenHeroBento"))
const DynamicAbout = dynamic(() => import("@/app/components/About"))
const DynamicExperience = dynamic(() => import("@/app/components/Experience"))
const DynamicSkills = dynamic(() => import("@/app/components/Skills"))
const DynamicProjects = dynamic(() => import("@/app/components/Projects"))
const DynamicTestimonials = dynamic(() => import("@/app/components/Testimonials"))
const DynamicEducation = dynamic(() => import("@/app/components/Education"))
const DynamicContact = dynamic(() => import("@/app/components/Contact"))
const DynamicFloatingNav = dynamic(() => import("@/app/components/floating-nav"))
const DynamicLocationGreeting = dynamic(() => import("@/app/components/location-greeting").then((m) => m.LocationGreeting))

export default function MainContent() {
  const { isHalloween } = useSeasonalTheme()
  const Hero = isHalloween ? DynamicHalloweenHero : DynamicHero

  return (
    <AsciiRevealSection>
      <HalloweenOverlay />
      <main id="main-content" role="main" className="bg-background dark:bg-background min-h-screen">
        <div data-ascii="skip">
          <DynamicFloatingNav />
        </div>
        <Hero />
        <DynamicLocationGreeting />
        <DynamicAbout />
        <DynamicExperience />
        <DynamicSkills />
        <DynamicProjects />
        <DynamicTestimonials />
        <DynamicEducation />
        <DynamicContact />
        {process.env.NODE_ENV === "development" && <TranslationTester />}
      </main>
    </AsciiRevealSection>
  )
}
