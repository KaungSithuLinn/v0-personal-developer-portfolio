"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Globe, Check } from "lucide-react"
import { useTranslation, type Language } from "@/context/language-context"

export default function LanguageSelector() {
  const [isOpen, setIsOpen] = useState(false)
  const { language, setLanguage, t } = useTranslation()

  const languages = [
    { code: "en", name: t("common.english") },
    { code: "zh", name: t("common.chinese") },
    { code: "ms", name: t("common.malay") },
    { code: "ta", name: t("common.tamil") },
  ]

  return (
    <div className="relative">
      <motion.button
        className="fixed top-24 left-6 z-50 p-3 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300"
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        aria-label={t("common.language")}
      >
        <Globe size={20} />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="fixed top-40 left-6 z-50 bg-gradient-to-br from-gray-900/90 to-blue-900/50 backdrop-blur-sm border border-blue-500/30 rounded-lg shadow-lg shadow-blue-500/10 overflow-hidden"
          >
            <div className="p-2">
              <h3 className="text-blue-400 font-mono text-sm border-b border-blue-500/30 pb-1 mb-2">
                {t("common.language")}
              </h3>
              <div className="space-y-1">
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => {
                      setLanguage(lang.code as Language)
                      setIsOpen(false)
                    }}
                    className={`flex items-center w-full px-3 py-2 rounded-md text-left text-sm transition-colors ${
                      language === lang.code ? "bg-blue-600/30 text-blue-300" : "hover:bg-gray-800/50 text-gray-300"
                    }`}
                  >
                    {language === lang.code && <Check size={14} className="mr-2 text-blue-400" />}
                    {language !== lang.code && <div className="w-[14px] mr-2" />}
                    {lang.name}
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
