"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Globe, Check } from "lucide-react"
import { useTranslation, type Language } from "@/context/language-utils"
import { useRouter, usePathname } from "next/navigation"

export default function LanguageSelector() {
  const [isOpen, setIsOpen] = useState(false)
  const { language, setLanguage, t, languageName, isRTL } = useTranslation()
  const [mounted, setMounted] = useState(false)
  const router = useRouter()
  const pathname = usePathname()
  const triggerRef = useRef<HTMLButtonElement>(null)

  const languages: Language[] = ["en", "zh", "ms", "ta", "ar"]

  useEffect(() => {
    setMounted(true)
  }, [])

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement
      if (!target.closest(".language-selector") && isOpen) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isOpen])

  // Keyboard handling
  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false)
        triggerRef.current?.focus()
      }
    }

    document.addEventListener("keydown", handleKeyDown)
    return () => {
      document.removeEventListener("keydown", handleKeyDown)
    }
  }, [isOpen])

  const handleLanguageChange = useCallback(
    (lang: Language) => {
      setLanguage(lang)
      localStorage.setItem("language", lang)

      // Build new path by replacing the first locale segment
      const segments = pathname.split("/")
      segments[1] = lang
      const newPath = segments.join("/")

      router.push(newPath)
      setIsOpen(false)
      triggerRef.current?.focus()
    },
    [router, pathname, setLanguage],
  )

  if (!mounted) return null

  return (
    <div className="relative language-selector" dir="auto">
      <motion.button
        ref={triggerRef}
        className="fixed top-4 sm:top-24 end-4 sm:start-6 z-50 p-2 sm:p-3 rounded-full bg-gradient-to-r from-teal-600 to-[#0a1628] text-white shadow-lg hover:from-teal-700 hover:to-[#0a1628] transition-all duration-300 border border-teal-500/30"
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        aria-label={t("common.language")}
        aria-expanded={isOpen}
        aria-haspopup="menu"
      >
        <Globe size={18} className="sm:size-7" />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20, x: isRTL ? 20 : -20 }}
            animate={{ opacity: 1, y: 0, x: 0 }}
            exit={{ opacity: 0, y: -20, x: isRTL ? 20 : -20 }}
            transition={{ duration: 0.2 }}
            className="fixed top-20 sm:top-28 end-4 sm:start-6 z-50 bg-gradient-to-br from-slate-900/90 to-[#0a1628]/50 backdrop-blur-sm border border-teal-500/30 rounded-lg shadow-lg shadow-teal-500/10 overflow-hidden language-selector max-w-[90vw] sm:max-w-none"
            role="menu"
            aria-label={t("common.language")}
          >
            <div className="p-2 min-w-[160px]">
              <h3 className="text-teal-400 font-mono text-sm border-b border-teal-500/30 pb-1 mb-2">
                {t("common.language")}
              </h3>
              <div className="space-y-1" role="group">
                {languages.map((lang) => (
                  <button
                    key={lang}
                    onClick={() => handleLanguageChange(lang)}
                    className={`flex items-center w-full px-3 py-2 rounded-md text-left text-sm transition-colors ${
                      language === lang ? "bg-teal-600/30 text-teal-300" : "hover:bg-slate-800/50 text-slate-300"
                    }`}
                    dir={lang === "ar" ? "rtl" : "ltr"}
                    role="menuitem"
                    aria-current={language === lang ? "true" : undefined}
                  >
                    {language === lang && <Check size={14} className="ms-2 text-teal-400" />}
                    {language !== lang && <div className="w-[14px] ms-2" />}
                    {languageName(lang)}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
