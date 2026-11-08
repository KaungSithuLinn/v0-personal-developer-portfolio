"use client"

import { useEffect, useState, useMemo, useRef } from "react"
import { motion, useReducedMotion } from "framer-motion"
import { ArrowUp } from "lucide-react"
import { useTranslation } from "@/context/language-utils"
import { memo } from "react"
import ModeToggle from "@/components/mode-toggle"
import SeasonalToggle from "@/components/seasonal-toggle"

const FloatingNavComponent = () => {
  const [activeSection, setActiveSection] = useState("home")
  const [scrollProgress, setScrollProgress] = useState(0)
  const [showBackToTop, setShowBackToTop] = useState(false)
  const [navVisible, setNavVisible] = useState(true)
  const navRef = useRef<HTMLElement>(null)
const lastScrollYRef = useRef(0)
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
      const currentScrollY = window.scrollY
      const total = document.documentElement.scrollHeight - window.innerHeight
      const progress = total > 0 ? Math.min(100, Math.max(0, (currentScrollY / total) * 100)) : 0
      setScrollProgress(progress)
      setShowBackToTop(currentScrollY > 600)

      if (currentScrollY > lastScrollYRef.current + 4 && currentScrollY > 80) {
        setNavVisible(false)
      } else if (currentScrollY < lastScrollYRef.current - 4 || currentScrollY <= 80) {
        setNavVisible(true)
      }
      lastScrollYRef.current = currentScrollY
    }

    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => {
      observer.disconnect()
      window.removeEventListener("scroll", onScroll)
    }
  }, [sections])

  useEffect(() => {
    if (!navVisible && navRef.current?.contains(document.activeElement)) {
      ;(document.activeElement as HTMLElement | null)?.blur()
    }
  }, [navVisible])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: shouldReduceMotion ? "auto" : "smooth" })
  }

  return (
    <>
      <motion.nav
        layout
        role="navigation"
        aria-label={t("nav.sectionNavigation") || "Section navigation"}
        className={`fixed bottom-24 left-1/2 -translate-x-1/2 sm:translate-x-0 sm:bottom-auto sm:top-1/2 sm:-translate-y-1/2 z-40 transition-[opacity,transform,visibility] duration-300 ease-out ${
          isRTL ? "sm:left-4 sm:right-auto" : "sm:left-auto sm:right-4"
        } ${
          navVisible
            ? "max-sm:translate-y-0 max-sm:opacity-100 max-sm:visible"
            : "max-sm:translate-y-4 max-sm:opacity-0 max-sm:invisible max-sm:pointer-events-none"
        }`}
        initial={shouldReduceMotion ? { opacity: 1, x: 0 } : { opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={shouldReduceMotion ? { duration: 0 } : { delay: 0.3, duration: 0.4, ease: "easeOut" }}
      >
        <div className="flex sm:flex-col gap-3 bg-card/80 backdrop-blur-md p-3 rounded-full border border-border shadow-lg">
          {sections.map(({ id, label }) => (
            <button
              key={id}
              onClick={() => document.getElementById(id)?.scrollIntoView({ behavior: shouldReduceMotion ? "auto" : "smooth" })}
              className="group relative flex items-center justify-center min-w-[44px] min-h-[44px]"
              aria-label={t("nav.scrollTo", { section: label })}
              tabIndex={navVisible ? 0 : -1}
              aria-current={activeSection === id ? "true" : undefined}
            >
              <span className={`absolute ${isRTL ? "left-full ms-2" : "right-full me-2"} hidden sm:block px-2 py-1 rounded bg-card text-foreground text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap border border-border`}>
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
        className={`fixed bottom-[4.25rem] z-50 flex items-center justify-center w-11 h-11 rounded-full bg-primary text-primary-foreground shadow-lg shadow-primary/30 hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background ${isRTL ? "left-6" : "right-6"}`}
      >
        <ArrowUp className="w-5 h-5" aria-hidden="true" />
      </motion.button>

      <div className={`fixed bottom-40 z-50 ${isRTL ? "left-6" : "right-6"}`}>
        <ModeToggle />
      </div>
      <div className={`fixed bottom-28 z-50 ${isRTL ? "left-6" : "right-6"}`}>
        <SeasonalToggle />
      </div>
    </>
  )
}

export default memo(FloatingNavComponent)
