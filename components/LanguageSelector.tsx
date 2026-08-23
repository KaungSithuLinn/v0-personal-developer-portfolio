"use client"

import { useState, useEffect, useTransition } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Globe, Check } from "lucide-react"
import { useTranslation, type Language } from "@/context/language-utils"
import { useRouter } from "next/navigation"

export default function LanguageSelector() {
  const [isOpen, setIsOpen] = useState(false)
  const { language, setLanguage, t, languageName, isRTL } = useTranslation()
  const [mounted, setMounted] = useState(false)
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  // Audit P0-6: useTransition for async state

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
    startTransition(() => {
      setLanguage(lang)
      setIsOpen(false)
      localStorage.setItem("language", lang)
      router.push(`/${lang}${window.location.pathname.substring(3)}`)
    })
  }

  // Don't render anything until mounted to prevent hydration issues
  if (!mounted) return null

  return (
    <div className="relative language-selector" dir="auto">
      <motion.button
        className="fixed top-4 sm:top-24 right-4 sm:left-6 z-50 p-2 sm:p-3 rounded-full bg-gradient-to-r from-teal-600 to-[#0a1628] text-white shadow-lg hover:from-teal-700 hover:to-[#0a1628] transition-all duration-300 border border-teal-500/30"
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        aria-label={t("common.language")}
        disabled={isPending}
        style={isRTL ? { left: "auto", right: "1rem" } : {}}
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
             className="fixed top-20 sm:top-28 right-4 sm:left-6 z-50 bg-gradient-to-br from-slate-900/90 to-[#0a1628]/50 backdrop-blur-sm border border-teal-500/30 rounded-lg shadow-lg shadow-teal-500/10 overflow-hidden language-selector max-w-[90vw] sm:max-w-none"
            style={isRTL ? { left: "auto", right: "1rem" } : {}}
          >
            <div className="p-2 min-w-[160px]">
              <h3 className="text-teal-400 font-mono text-sm border-b border-teal-500/30 pb-1 mb-2">
                {t("common.language")}
              </h3>
              <div className="space-y-1">
                {languages.map((lang) => (
                  <button
                    key={lang}
                    onClick={() => handleLanguageChange(lang)}
                    className={`flex items-center w-full px-3 py-2 rounded-md text-left text-sm transition-colors ${
                      language === lang ? "bg-teal-600/30 text-teal-300" : "hover:bg-slate-800/50 text-slate-300"
                    }`}
                    dir={lang === "ar" ? "rtl" : "ltr"}
                  >
                    {language === lang && <Check size={14} className={`${isRTL ? "ml-2" : "mr-2"} text-teal-400`} />}
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
