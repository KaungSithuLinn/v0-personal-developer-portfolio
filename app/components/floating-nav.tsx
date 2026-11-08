"use client"

import { useEffect, useState, useMemo, useRef, useCallback } from "react"
import { ArrowUp } from "lucide-react"
import { useReducedMotion } from "framer-motion"
import { useTranslation } from "@/context/language-utils"
import { memo } from "react"
import ModeToggle from "@/components/mode-toggle"
import SeasonalToggle from "@/components/seasonal-toggle"

const FloatingNavComponent = () => {
  const [activeSection, setActiveSection] = useState("home")
  const [showBackToTop, setShowBackToTop] = useState(false)
  const [navVisible, setNavVisible] = useState(true)
  const navRef = useRef<HTMLElement>(null)
  const progressBarRef = useRef<HTMLDivElement>(null)
  const progressBarContainerRef = useRef<HTMLDivElement>(null)
  const rafIdRef = useRef(0)
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
        const visibleEntries = entries.filter((entry) => entry.isIntersecting)
        if (visibleEntries.length === 0) return
        const currentEntry = visibleEntries.reduce((best, entry) =>
          entry.intersectionRatio > best.intersectionRatio ? entry : best,
        )
        setActiveSection((previous) =>
          previous === currentEntry.target.id ? previous : currentEntry.target.id,
        )
      },
      {
        rootMargin: "-20% 0px -65% 0px",
        threshold: [0, 0.1, 0.25, 0.5, 0.75, 1],
      },
    )

    sections.forEach(({ id }) => {
      const element = document.getElementById(id)
      if (element) observer.observe(element)
    })

    const updateScrollState = () => {
      const currentScrollY = window.scrollY
      const total = document.documentElement.scrollHeight - window.innerHeight
      const progress =
        total > 0 ? Math.min(100, Math.max(0, (currentScrollY / total) * 100)) : 0

      if (progressBarRef.current) {
        progressBarRef.current.style.transform = `scaleX(${progress / 100})`
      }
      if (progressBarContainerRef.current) {
        progressBarContainerRef.current.setAttribute("aria-valuenow", String(Math.round(progress)))
      }

      const nextShowBackToTop = currentScrollY > 600
      setShowBackToTop((previous) => (previous === nextShowBackToTop ? previous : nextShowBackToTop))

      if (window.innerWidth < 768) {
        if (currentScrollY > lastScrollYRef.current + 4 && currentScrollY > 80) {
          setNavVisible(false)
        } else if (currentScrollY < lastScrollYRef.current - 4 || currentScrollY <= 80) {
          setNavVisible(true)
        }
      } else {
        setNavVisible(true)
      }

      lastScrollYRef.current = currentScrollY
      rafIdRef.current = 0
    }

    const handleScroll = () => {
      if (rafIdRef.current) return
      rafIdRef.current = requestAnimationFrame(updateScrollState)
    }

    updateScrollState()
    window.addEventListener("scroll", handleScroll, { passive: true })

    return () => {
      observer.disconnect()
      if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current)
      window.removeEventListener("scroll", handleScroll)
    }
  }, [sections])

  useEffect(() => {
    if (navVisible) return
    const activeElement = document.activeElement
    if (activeElement instanceof HTMLElement && navRef.current?.contains(activeElement)) {
      activeElement.blur()
    }
  }, [navVisible])

  const scrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: shouldReduceMotion ? "auto" : "smooth" })
  }, [shouldReduceMotion])

  return (
    <>
      <nav
        ref={navRef}
        role="navigation"
        aria-label={t("nav.sectionNavigation") || "Section navigation"}
        aria-hidden={!navVisible}
        className={`fixed bottom-24 left-1/2 -translate-x-1/2 sm:translate-x-0 sm:bottom-auto sm:top-1/2 sm:-translate-y-1/2 z-40 bg-card/95 border border-border shadow-lg rounded-full p-3 transition-[transform,opacity] duration-200 ease-out motion-reduce:transition-none will-change-[transform,opacity] ${
          isRTL ? "sm:left-4 sm:right-auto" : "sm:left-auto sm:right-4"
        } ${
          navVisible
            ? "max-sm:translate-y-0 max-sm:opacity-100"
            : "max-sm:translate-y-4 max-sm:opacity-0 max-sm:pointer-events-none"
        }`}
      >
        <div className="flex sm:flex-col gap-3">
          {sections.map(({ id, label }) => (
            <button
              key={id}
              onClick={() =>
                document.getElementById(id)?.scrollIntoView({
                  behavior: shouldReduceMotion ? "auto" : "smooth",
                })
              }
              className="group relative flex items-center justify-center min-w-[44px] min-h-[44px]"
              aria-label={t("nav.scrollTo", { section: label })}
              aria-current={activeSection === id ? "true" : undefined}
              tabIndex={navVisible ? 0 : -1}
            >
              <span
                className={`absolute ${
                  isRTL ? "left-full ms-2" : "right-full me-2"
                } hidden sm:block px-2 py-1 rounded bg-card text-foreground text-sm opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity duration-200 whitespace-nowrap border border-border`}
              >
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
      </nav>

      <div
        ref={progressBarContainerRef}
        role="progressbar"
        aria-valuenow={0}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={t("nav.scrollProgress") || "Page scroll progress"}
        className="fixed top-0 left-0 right-0 h-1 z-[60] pointer-events-none"
      >
        <div
          ref={progressBarRef}
          className="h-full w-full origin-left bg-gradient-to-r from-primary to-chart-2 transition-transform duration-100 ease-out motion-reduce:transition-none"
          style={{ transform: "scaleX(0)" }}
        />
      </div>

      <button
        type="button"
        onClick={scrollToTop}
        aria-label={t("nav.backToTop")}
        aria-hidden={!showBackToTop}
        tabIndex={showBackToTop ? 0 : -1}
        className={`fixed bottom-[4.75rem] z-50 flex items-center justify-center w-11 h-11 rounded-full bg-primary text-primary-foreground shadow-lg shadow-primary/30 hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background transition-[transform,opacity] duration-200 ease-out motion-reduce:transition-none ${
          isRTL ? "left-6" : "right-6"
        } ${
          showBackToTop
            ? "opacity-100 scale-100"
            : "opacity-0 scale-95 pointer-events-none"
        }`}
      >
        <ArrowUp className="w-5 h-5" aria-hidden="true" />
      </button>

      <div className={`fixed bottom-[11.25rem] z-50 ${isRTL ? "left-6" : "right-6"}`}>
        <ModeToggle />
      </div>
      <div className={`fixed bottom-[8rem] z-50 ${isRTL ? "left-6" : "right-6"}`}>
        <SeasonalToggle />
      </div>
    </>
  )
}

export default memo(FloatingNavComponent)
