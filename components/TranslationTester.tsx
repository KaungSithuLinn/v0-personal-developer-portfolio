"use client"

import { useState } from "react"
import { useTranslation, type Language } from "@/context/language-context"
import translations from "@/context/translations"

export default function TranslationTester() {
  const { language } = useTranslation()
  const [isOpen, setIsOpen] = useState(false)

  // Get all unique translation keys
  const allKeys = new Set<string>()
  Object.values(translations).forEach((langTranslations) => {
    Object.keys(langTranslations).forEach((key) => allKeys.add(key))
  })

  // Check which keys are missing for each language
  const missingTranslations: Record<Language, string[]> = {
    en: [],
    zh: [],
    ms: [],
    ta: [],
    ar: [],
  }

  allKeys.forEach((key) => {
    Object.keys(translations).forEach((lang) => {
      if (!translations[lang as Language]?.[key]) {
        missingTranslations[lang as Language].push(key)
      }
    })
  })

  // Count missing translations
  const missingCounts = Object.entries(missingTranslations).map(([lang, keys]) => ({
    lang,
    count: keys.length,
  }))

  if (process.env.NODE_ENV !== "development") {
    return null
  }

  return (
    <div className="fixed bottom-6 left-6 z-50">
      <button onClick={() => setIsOpen(!isOpen)} className="bg-red-600 text-white px-4 py-2 rounded-md shadow-lg">
        {isOpen ? "Hide" : "Show"} Translation Test
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black/80 z-50 overflow-auto p-6">
          <div className="bg-white text-black p-6 rounded-lg max-w-4xl mx-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">Translation Tester</h2>
              <button onClick={() => setIsOpen(false)} className="text-gray-500 hover:text-gray-700">
                Close
              </button>
            </div>

            <div className="mb-6">
              <h3 className="text-xl font-semibold mb-2">Missing Translations</h3>
              <div className="grid grid-cols-5 gap-4">
                {missingCounts.map(({ lang, count }) => (
                  <div key={lang} className="p-3 bg-gray-100 rounded-md">
                    <p className="font-medium">{lang}</p>
                    <p className={count > 0 ? "text-red-600" : "text-green-600"}>
                      {count} missing {count === 1 ? "key" : "keys"}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <h3 className="text-xl font-semibold mb-2">Current Language: {language}</h3>
              <p>Total unique keys: {allKeys.size}</p>
            </div>

            <div className="border-t pt-4">
              <h3 className="text-xl font-semibold mb-2">All Translation Keys</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {Array.from(allKeys)
                  .sort()
                  .map((key) => (
                    <div key={key} className="p-2 bg-gray-50 rounded">
                      <p className="font-mono text-sm">{key}</p>
                      <p
                        className={translations[language]?.[key] ? "text-green-600 font-medium" : "text-red-600 italic"}
                      >
                        {translations[language]?.[key] || "Missing translation"}
                      </p>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
