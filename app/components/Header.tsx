"use client"

import { useState, useEffect } from "react"
import { useTheme } from "next-themes"
import { useTranslation } from "@/context/language-context"

export default function Header() {
  const [mounted, setMounted] = useState(false)
  const [isVisible, setIsVisible] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)
  const [activeSection, setActiveSection] = useState("home")
  const { theme } = useTheme()
  const { t } = useTranslation()

  useEffect(() => setMounted(true), [])

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY
      setIsVisible(currentScrollY < lastScrollY || currentScrollY < 100)
      setLastScrollY(currentScrollY)
    }

    const handleIntersection = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id)
        }
      })
    }

    window.addEventListener("scroll", handleScroll)

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
  }, [lastScrollY])

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
          <ul className="flex overflow-x-auto scrollbar-hide gap-3 sm:gap-6 sm:flex-wrap sm:justify-center">
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
