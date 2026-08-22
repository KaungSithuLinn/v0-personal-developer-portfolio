"use client"

import { useState, useEffect, useRef } from "react"
import { useTheme } from "next-themes"
import { useTranslation } from "@/context/language-utils"
import { motion, AnimatePresence } from "framer-motion"
import { memo } from "react"
import { Menu, X } from "lucide-react"
import Logo from "./Logo"

const HeaderComponent = () => {
  const [mounted, setMounted] = useState(false)
  const [isVisible, setIsVisible] = useState(true)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const lastScrollYRef = useRef(0)
  const [activeSection, setActiveSection] = useState("home")
  const { theme: _theme } = useTheme()
  const { t } = useTranslation()

  useEffect(() => setMounted(true), [])

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY
      setIsVisible(currentScrollY < lastScrollYRef.current || currentScrollY < 100)
      lastScrollYRef.current = currentScrollY
    }

    const handleIntersection = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id)
        }
      })
    }

    window.addEventListener("scroll", handleScroll, { passive: true })

    const observer = new IntersectionObserver(handleIntersection, {
      threshold: 0.3,
    })

    document.querySelectorAll("section[id]").forEach((section) => {
      observer.observe(section)
    })

    return () => {
      window.removeEventListener("scroll", handleScroll)
      observer.disconnect()
    }
  }, [])

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    return () => {
      document.body.style.overflow = ""
    }
  }, [mobileMenuOpen])

  if (!mounted) return null

  const scrollToSection = (sectionId: string) => {
    setMobileMenuOpen(false)
    const element = document.getElementById(sectionId)
    if (element) {
      const offset = 80
      const elementPosition = element.getBoundingClientRect().top
      const offsetPosition = elementPosition + window.pageYOffset - offset

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      })
    }
  }

  const navItems = [
    ["about", t("header.about")],
    ["experience", t("header.experience")],
    ["skills", t("header.skills")],
    ["services", t("header.services")],
    ["education", t("header.education")],
    ["contact", t("header.contact")],
  ]

  return (
    <header
      className={`
        fixed w-full z-50 transition-all duration-300
        ${isVisible ? "top-4" : "-top-24"}
      `}
    >
      <nav className="container mx-auto px-4 sm:px-6">
        <div className="flex justify-between items-center">
          <Logo size={32} />
          <ul className="hidden md:flex gap-1 bg-background/80 dark:bg-card/80 backdrop-blur-md border border-border rounded-full px-2 py-1.5 shadow-lg">
            {navItems.map(([id, label]) => (
              <li key={id}>
                <button
                  onClick={() => scrollToSection(id)}
                  className={`
                    text-sm px-3 py-1.5 rounded-full transition-all duration-200
                    ${
                      activeSection === id
                        ? "bg-primary/10 text-primary dark:text-primary-foreground font-medium"
                        : "text-foreground dark:text-foreground hover:text-primary dark:hover:text-primary"
                    }
                  `}
                >
                  {label}
                </button>
              </li>
            ))}
          </ul>
          <div className="flex items-center gap-2 md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-full text-foreground dark:text-foreground hover:bg-muted transition-colors"
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </nav>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="md:hidden fixed top-16 left-4 right-4 bg-background/95 dark:bg-card/95 backdrop-blur-md border border-border rounded-2xl shadow-xl z-40 overflow-hidden"
          >
            <ul className="flex flex-col p-2 gap-1">
              {navItems.map(([id, label]) => (
                <li key={id}>
                  <button
                    onClick={() => scrollToSection(id)}
                  className={`
                    w-full text-left py-3 px-4 rounded-xl transition-colors duration-200
                    ${
                      activeSection === id
                        ? "bg-primary/10 text-primary dark:text-primary-foreground"
                        : "text-foreground dark:text-foreground hover:bg-muted dark:hover:bg-muted"
                    }
                  `}
                  >
                    {label}
                  </button>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}

export default memo(HeaderComponent)