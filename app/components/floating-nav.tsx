"use client"

import { useEffect, useState, useMemo } from "react"
import { motion } from "framer-motion"
import { useReducedMotion } from "framer-motion"
import { useTranslation } from "@/context/language-utils"
import { memo } from "react"

// Audit P0-2: respect reduced motion preference

// Audit P0-5: memoized presentational component

const FloatingNavComponent = () => {
  const [activeSection, setActiveSection] = useState("hero")
  const { t, isRTL } = useTranslation()
  const shouldReduceMotion = useReducedMotion()

  const sections = useMemo(
    () => [
      { id: "hero", label: t("nav.home") },
      { id: "about", label: t("nav.about") },
      { id: "experience", label: t("nav.experience") },
      { id: "skills", label: t("nav.skills") },
      { id: "projects", label: t("nav.projects") },
      { id: "testimonials", label: t("nav.testimonials") },
      { id: "education", label: t("nav.education") },
      { id: "contact", label: t("nav.contact") },
    ],
    [t],
  )

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id)
          }
        })
      },
      { threshold: 0.5 },
    )

    sections.forEach(({ id }) => {
      const element = document.getElementById(id)
      if (element) observer.observe(element)
    })

    return () => observer.disconnect()
  }, [sections])

  return (
    <motion.div
      layout
      role="navigation"
      aria-label="Section navigation"
      className={`fixed bottom-24 left-1/2 -translate-x-1/2 sm:translate-x-0 sm:bottom-auto sm:top-1/2 sm:-translate-y-1/2 z-50 ${isRTL ? "sm:left-4 sm:right-auto" : "sm:left-auto sm:right-4"}`}
      initial={shouldReduceMotion ? { opacity: 1, x: 0 } : { opacity: 0, x: 20 }}
      animate={shouldReduceMotion ? { opacity: 1, x: 0 } : { opacity: 1, x: 0 }}
      transition={shouldReduceMotion ? { duration: 0 } : { delay: 0.5 }}
    >
      <div className="flex sm:flex-col gap-3 bg-gradient-to-r sm:bg-gradient-to-b from-gray-900/90 to-blue-900/50 backdrop-blur-sm p-3 rounded-full border border-blue-500/30 shadow-lg shadow-blue-500/10">
        {sections.map(({ id, label }) => (
          <button
            key={id}
            onClick={() => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" })}
            className="group relative flex items-center justify-center"
            aria-label={t("nav.scrollTo", { section: label })}
          >
            <span className={`absolute ${isRTL ? "left-full ms-2" : "right-full me-2"} hidden sm:block px-2 py-1 rounded bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap`}>
              {label}
            </span>
            <div
              className={`w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full transition-all duration-300 ${
                activeSection === id
                  ? "bg-blue-600 dark:bg-blue-400 scale-125"
                  : "bg-gray-400 dark:bg-gray-600 hover:scale-110"
              }`}
            />
          </button>
        ))}
      </div>
    </motion.div>
  )
}

// Audit P0-5: memoized presentational component

export default memo(FloatingNavComponent)
