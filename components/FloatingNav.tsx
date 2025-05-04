"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Home, User, Briefcase, Wrench, FolderGit2, GraduationCap, PhoneCall } from "lucide-react"
import { useTranslation } from "@/context/language-utils"

export default function FloatingNav() {
  const [activeSection, setActiveSection] = useState("")
  const [visible, setVisible] = useState(true)
  const { t, isRTL, isTransitioning } = useTranslation()

  const navItems = [
    { id: "home", label: t("nav.home"), icon: Home },
    { id: "about", label: t("nav.about"), icon: User },
    { id: "experience", label: t("nav.experience"), icon: Briefcase },
    { id: "skills", label: t("nav.skills"), icon: Wrench },
    { id: "projects", label: t("nav.projects"), icon: FolderGit2 },
    { id: "education", label: t("nav.education"), icon: GraduationCap },
    { id: "contact", label: t("nav.contact"), icon: PhoneCall },
  ]

  useEffect(() => {
    const handleScroll = () => {
      // Hide nav when scrolling down, show when scrolling up
      const currentScroll = window.scrollY
      setVisible(currentScroll < lastScroll || currentScroll < 100)
      lastScroll = currentScroll

      // Update active section
      const sections = navItems.map((item) => document.getElementById(item.id)).filter(Boolean)
      const currentSection = sections.find((section) => {
        const rect = section?.getBoundingClientRect()
        return rect && rect.top <= 100 && rect.bottom >= 100
      })

      if (currentSection) {
        setActiveSection(currentSection.id)
      }
    }

    let lastScroll = 0
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <AnimatePresence>
      {visible && (
        <motion.nav
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          transition={{ duration: 0.2 }}
          className={`fixed bottom-8 left-1/2 -translate-x-1/2 z-50 px-4 py-3 rounded-full bg-gradient-to-br from-gray-900/90 to-blue-900/50 backdrop-blur-sm border border-blue-500/30 shadow-lg shadow-blue-500/10 ${
            isTransitioning ? "opacity-50" : ""
          }`}
          style={{ direction: isRTL ? "rtl" : "ltr" }}
        >
          <ul className={`flex gap-4 sm:gap-6 ${isRTL ? "flex-row-reverse" : ""}`}>
            {navItems.map(({ id, label, icon: Icon }) => (
              <li key={id}>
                <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                  <a
                    href={`#${id}`}
                    className={`block p-2 rounded-full transition-colors relative group ${
                      activeSection === id
                        ? "text-blue-400 bg-blue-500/10"
                        : "text-gray-400 hover:text-blue-400 hover:bg-blue-500/10"
                    }`}
                    aria-label={label}
                  >
                    <Icon size={20} />
                    <span
                      className={`absolute ${
                        isRTL ? "right-full mr-2" : "left-full ml-2"
                      } top-1/2 -translate-y-1/2 px-2 py-1 rounded bg-gray-900 text-gray-200 text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none`}
                    >
                      {label}
                    </span>
                  </a>
                </motion.div>
              </li>
            ))}
          </ul>
        </motion.nav>
      )}
    </AnimatePresence>
  )
}
