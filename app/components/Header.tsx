"use client"

import { useState, useEffect, useRef } from "react"
import { useTheme } from "next-themes"
import { useTranslation } from "@/context/language-utils"
import { motion, AnimatePresence } from "framer-motion"
import { memo } from "react"
import { Menu, X } from "lucide-react"

// Audit P0-5: memoized presentational component

const HeaderComponent = () => {
  const [mounted, setMounted] = useState(false)
  const [isVisible, setIsVisible] = useState(true)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const lastScrollYRef = useRef(0)
  const [activeSection, setActiveSection] = useState("home")
  const { theme } = useTheme()
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
        ${isVisible ? "top-0" : "-top-20"}
        ${theme === "dark" ? "bg-gray-900/95" : "bg-white/95"}
        backdrop-blur-sm shadow-md
      `}
    >
      <nav className="container mx-auto px-4 sm:px-6 py-3 sm:py-4">
        <div className="flex justify-between sm:justify-center items-center">
          <ul className="hidden sm:flex gap-3 sm:gap-6">
            {navItems.map(([id, label]) => (
              <li key={id} className="flex-shrink-0">
                <button
                  onClick={() => scrollToSection(id)}
                  className={`
                    text-sm sm:text-base whitespace-nowrap transition-colors duration-300
                    ${
                      activeSection === id
                        ? "text-blue-600 dark:text-blue-400"
                        : theme === "dark"
                          ? "text-gray-300 hover:text-white"
                          : "text-gray-800 hover:text-blue-600"
                    }
                  `}
                >
                  {label}
                </button>
              </li>
            ))}
          </ul>
          <div className="flex items-center gap-2 sm:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
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
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="sm:hidden fixed top-[57px] left-0 right-0 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 shadow-lg z-40 overflow-hidden"
          >
            <ul className="flex flex-col py-4 px-6 gap-2">
              {navItems.map(([id, label]) => (
                <li key={id}>
                  <button
                    onClick={() => scrollToSection(id)}
                    className={`
                      w-full text-left py-3 px-4 rounded-lg transition-colors duration-300
                      ${
                        activeSection === id
                          ? "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20"
                          : theme === "dark"
                            ? "text-gray-200 hover:text-white hover:bg-gray-800"
                            : "text-gray-800 hover:text-blue-600 hover:bg-gray-50"
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

// Audit P0-5: memoized presentational component

export default memo(HeaderComponent)
