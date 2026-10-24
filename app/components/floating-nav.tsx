"use client"

import { useEffect, useState, useMemo } from "react"
import { motion, useReducedMotion } from "framer-motion"
import { ArrowUp } from "lucide-react"
import { useTranslation } from "@/context/language-utils"
import { memo } from "react"
import ModeToggle from "@/components/mode-toggle"

const FloatingNavComponent = () => {
  const [activeSection, setActiveSection] = useState("home")
  const [scrollProgress, setScrollProgress] = useState(0)
  const [showBackToTop, setShowBackToTop] = useState(false)
  const { t, isRTL } = useTranslation()
  const shouldReduceMotion = useReducedMotion()

  const sections = useMemo(
    () => [
      { id: "home", label: t("nav.home") },
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
      <motion.nav
        layout
        role="navigation"
        aria-label={t("nav.sectionNavigation") || "Section navigation"}
        className={`fixed bottom-24 left-1/2 -translate-x-1/2 sm:translate-x-0 sm:bottom-auto sm:top-1/2 sm:-translate-y-1/2 z-40 ${isRTL ? "sm:left-4 sm:right-auto" : "sm:left-auto sm:right-4"}`}
        initial={shouldReduceMotion ? { opacity: 1, x: 0 } : { opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={shouldReduceMotion ? { duration: 0 } : { delay: 0.3, duration: 0.4, ease: "easeOut" }}
      >
        <div className="flex sm:flex-col gap-3 bg-surface-glass backdrop-blur-md p-3 rounded-full border border-surface-glass-border shadow-lg">
          {sections.map(({ id, label }) => (
            <button
              key={id}
              onClick={() => document.getElementById(id)?.scrollIntoView({ behavior: shouldReduceMotion ? "auto" : "smooth" })}
              className="group relative flex items-center justify-center min-w-[44px] min-h-[44px]"
              aria-label={t("nav.scrollTo", { section: label })}
              aria-current={activeSection === id ? "true" : undefined}
            >
              <span className={`absolute ${isRTL ? "left-full ms-2" : "right-full me-2"} hidden sm:block px-2 py-1 rounded bg-surface-overlay text-foreground text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap border border-border`}>
                {label}
              </span>
              <div
                className={`w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full transition-all duration-200 ${
                  activeSection === id
                    ? "bg-primary scale-125"
                    : "bg-muted-foreground/40 hover:bg-primary/70"
                }`}
              />
            </button>
          ))}
        </div>
      </motion.nav>

      <div
        role="progressbar"
        aria-valuenow={Math.round(scrollProgress)}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={t("nav.scrollProgress") || "Page scroll progress"}
        className="fixed top-0 left-0 right-0 h-1 z-[60] pointer-events-none"
      >
        <div
          className="h-full bg-gradient-to-r from-primary to-chart-2 transition-[width] duration-150 ease-out"
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
        className={`fixed bottom-6 z-50 flex items-center justify-center w-11 h-11 rounded-full bg-primary text-primary-foreground shadow-lg shadow-primary/30 hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background ${isRTL ? "left-6" : "right-6"}`}
      >
        <ArrowUp className="w-5 h-5" aria-hidden="true" />
      </motion.button>

      <div className={`fixed bottom-20 z-50 ${isRTL ? "left-6" : "right-6"}`}>
        <ModeToggle />
      </div>
    </>
  )
}

export default memo(FloatingNavComponent)
