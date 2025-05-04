"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Globe, Check } from "lucide-react"
import { useTranslation, type Language } from "@/context/language-utils"
import { useRouter } from "next/navigation"

export default function LanguageSelector() {
  const [isOpen, setIsOpen] = useState(false)
  const { language, setLanguage, t, languageName, isRTL } = useTranslation()
  const [mounted, setMounted] = useState(false)
  const router = useRouter()

  const languages: Language[] = ["en", "zh", "ms", "ta", "ar"]

  useEffect(() => {
    setMounted(true)
  }, [])

  // Close the language selector when clicking outside
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

  const handleLanguageChange = (lang: Language) => {
    setLanguage(lang)
    setIsOpen(false)
    localStorage.setItem("language", lang)
    // Use router.push for client-side navigation
    router.push(`/${lang}${window.location.pathname.substring(3)}`)
  }

  // Don't render anything until mounted to prevent hydration issues
  if (!mounted) return null

  return (
    <div className="relative language-selector">
      <motion.button
        className="fixed top-20 sm:top-24 left-4 sm:left-6 z-50 p-2 sm:p-3 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300"
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        aria-label={t("common.language")}
        style={isRTL ? { left: "auto", right: "1rem" } : {}}
      >
        <Globe size={18} className="sm:size-20" />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20, x: isRTL ? 20 : -20 }}
            animate={{ opacity: 1, y: 0, x: 0 }}
            exit={{ opacity: 0, y: -20, x: isRTL ? 20 : -20 }}
            transition={{ duration: 0.2 }}
            className="fixed top-36 sm:top-40 left-4 sm:left-6 z-50 bg-gradient-to-br from-gray-900/90 to-blue-900/50 backdrop-blur-sm border border-blue-500/30 rounded-lg shadow-lg shadow-blue-500/10 overflow-hidden language-selector max-w-[90vw] sm:max-w-none"
            style={isRTL ? { left: "auto", right: "1rem" } : {}}
          >
            <div className="p-2 min-w-[160px]">
              <h3 className="text-blue-400 font-mono text-sm border-b border-blue-500/30 pb-1 mb-2">
                {t("common.language")}
              </h3>
              <div className="space-y-1">
                {languages.map((lang) => (
                  <button
                    key={lang}
                    onClick={() => handleLanguageChange(lang)}
                    className={`flex items-center w-full px-3 py-2 rounded-md text-left text-sm transition-colors ${
                      language === lang ? "bg-blue-600/30 text-blue-300" : "hover:bg-gray-800/50 text-gray-300"
                    }`}
                    dir={lang === "ar" ? "rtl" : "ltr"}
                  >
                    {language === lang && <Check size={14} className={`${isRTL ? "ml-2" : "mr-2"} text-blue-400`} />}
                    {language !== lang && <div className={`w-[14px] ${isRTL ? "ml-2" : "mr-2"}`} />}
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
