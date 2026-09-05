"use client"

import { useEffect, useState, useMemo } from "react"
import { motion, useReducedMotion } from "framer-motion"
import { ArrowUp } from "lucide-react"
import { useTranslation } from "@/context/language-utils"
import { memo } from "react"

const FloatingNavComponent = () => {
  const [activeSection, setActiveSection] = useState("hero")
  const [scrollProgress, setScrollProgress] = useState(0)
  const [showBackToTop, setShowBackToTop] = useState(false)
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
      { threshold: 0.3 },
    )

    sections.forEach(({ id }) => {
      const element = document.getElementById(id)
      if (element) observer.observe(element)
    })

    const onScroll = () => {
      const total = document.documentElement.scrollHeight - window.innerHeight
      const progress = total > 0 ? Math.min(100, Math.max(0, (window.scrollY / total) * 100)) : 0
      setScrollProgress(progress)
      setShowBackToTop(window.scrollY > 600)
    }

    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => {
      observer.disconnect()
      window.removeEventListener("scroll", onScroll)
    }
  }, [sections])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: shouldReduceMotion ? "auto" : "smooth" })
  }

  return (
    <>
      <motion.div
        layout
        role="navigation"
        aria-label="Section navigation"
        className={`fixed bottom-24 left-1/2 -translate-x-1/2 sm:translate-x-0 sm:bottom-auto sm:top-1/2 sm:-translate-y-1/2 z-40 ${isRTL ? "sm:left-4 sm:right-auto" : "sm:left-auto sm:right-4"}`}
        initial={shouldReduceMotion ? { opacity: 1, x: 0 } : { opacity: 0, x: 20 }}
        animate={shouldReduceMotion ? { opacity: 1, x: 0 } : { opacity: 1, x: 0 }}
        transition={shouldReduceMotion ? { duration: 0 } : { delay: 0.5 }}
      >
        <div className="flex sm:flex-col gap-3 bg-gradient-to-r sm:bg-gradient-to-b from-slate-900/90 to-[#0a1628]/50 backdrop-blur-sm p-3 rounded-full border border-teal-500/30 shadow-lg shadow-teal-500/10">
          {sections.map(({ id, label }) => (
            <button
              key={id}
              onClick={() => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" })}
              className="group relative flex items-center justify-center min-w-[44px] min-h-[44px]"
              aria-label={t("nav.scrollTo", { section: label })}
              aria-current={activeSection === id ? "true" : undefined}
            >
              <span className={`absolute ${isRTL ? "left-full ms-2" : "right-full me-2"} hidden sm:block px-2 py-1 rounded bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap`}>
                {label}
              </span>
              <div
                className={`w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full transition-all duration-300 ${
                  activeSection === id
                    ? "bg-teal-500 dark:bg-teal-400 scale-125"
                    : "bg-gray-400 dark:bg-gray-600 hover:scale-110"
                }`}
              />
            </button>
          ))}
        </div>
      </motion.div>

      <div
        role="progressbar"
        aria-valuenow={Math.round(scrollProgress)}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="Page scroll progress"
        className="fixed top-0 left-0 right-0 h-1 z-[60] pointer-events-none"
      >
        <div
          className="h-full bg-gradient-to-r from-teal-500 to-cyan-400 transition-[width] duration-150 ease-out"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      <motion.button
        type="button"
        onClick={scrollToTop}
        aria-label={t("nav.backToTop")}
        initial={false}
        animate={{
          opacity: showBackToTop ? 1 : 0,
          scale: showBackToTop ? 1 : 0.8,
          pointerEvents: showBackToTop ? "auto" : "none",
        }}
        transition={{ duration: 0.2 }}
        className={`fixed bottom-6 z-50 flex items-center justify-center w-11 h-11 rounded-full bg-teal-500 text-white shadow-lg shadow-teal-500/30 hover:bg-teal-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-400 ${isRTL ? "left-6" : "right-6"}`}
      >
        <ArrowUp className="w-5 h-5" aria-hidden="true" />
      </motion.button>
    </>
  )
}

export default memo(FloatingNavComponent)