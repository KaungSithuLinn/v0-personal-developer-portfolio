"use client"

import { useState, useEffect, useRef } from "react"
import { useTheme } from "next-themes"
import { useTranslation } from "@/context/language-utils"
import { memo } from "react"

// Audit P0-5: memoized presentational component

const HeaderComponent = () => {
  const [mounted, setMounted] = useState(false)
  const [isVisible, setIsVisible] = useState(true)
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

  if (!mounted) return null

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      const offset = 80 // Height of the header
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
          <ul className="flex gap-3 sm:gap-6 overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
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
            {/* Mobile menu button if needed */}
          </div>
        </div>
      </nav>
    </header>
  )
}

// Audit P0-5: memoized presentational component

export default memo(HeaderComponent)
