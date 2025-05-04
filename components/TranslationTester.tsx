"use client"

import { useState } from "react"
import { useTranslation } from "@/context/language-utils"
import { useTextDirection } from "@/hooks/use-text-direction"
import { useScreenReader } from "./ScreenReaderAnnouncer"
import { formatDate, formatNumber, formatList } from "@/lib/i18n-format"
import { SUPPORTED_LANGUAGES } from "@/config/language.config"

export default function TranslationTester() {
  const { t, language, isRTL } = useTranslation()
  const { announce } = useScreenReader()
  const [testText, setTestText] = useState("")
  const { direction, isMixed, updateDirection } = useTextDirection(testText, { allowMixed: true })

  // Test data
  const now = new Date()
  const numbers = [1234567.89, 42, 0.123]
  const listItems = ["Apple", "Banana", "Orange"]

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newText = e.target.value
    setTestText(newText)
    updateDirection(newText)
  }

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-8">
      <h2 className="text-2xl font-bold mb-4">Translation & Direction Tester</h2>

      {/* Language Display */}
      <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
        <p>Current Language: {language}</p>
        <p>Text Direction: {direction}</p>
        <p>Mixed Content: {isMixed ? "Yes" : "No"}</p>
      </div>

      {/* Direction Tester */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold">Text Direction Test</h3>
        <textarea
          value={testText}
          onChange={handleTextChange}
          className="w-full h-32 p-4 border rounded-lg"
          dir={direction}
          placeholder="Enter text to test direction..."
        />
      </div>

      {/* Date Formatting */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold">Date Formatting</h3>
        <div className="grid gap-4">
          <p>Short: {formatDate(now, language, "short")}</p>
          <p>Medium: {formatDate(now, language, "medium")}</p>
          <p>Long: {formatDate(now, language, "long")}</p>
        </div>
      </div>

      {/* Number Formatting */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold">Number Formatting</h3>
        <div className="grid gap-4">
          {numbers.map((num, i) => (
            <p key={i}>{formatNumber(num, language)}</p>
          ))}
        </div>
      </div>

      {/* List Formatting */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold">List Formatting</h3>
        <p>{formatList(listItems, language)}</p>
      </div>

      {/* Translation Examples */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold">Translation Examples</h3>
        <div className="grid gap-4">
          {SUPPORTED_LANGUAGES.map((lang) => (
            <button
              key={lang}
              onClick={() => {
                announce(t("common.languageTest", { language: lang }))
              }}
              className={`p-4 rounded-lg ${
                lang === language
                  ? "bg-blue-500 text-white"
                  : "bg-gray-100 dark:bg-gray-800 hover:bg-blue-100 dark:hover:bg-blue-900"
              }`}
              dir={lang === "ar" ? "rtl" : "ltr"}
            >
              {t("common.testMessage")}
            </button>
          ))}
        </div>
      </div>

      {/* Text Alignment Test */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold">Text Alignment Test</h3>
        <div className={`grid gap-4 ${isRTL ? "text-right" : "text-left"}`}>
          <p className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">{t("common.testParagraph")}</p>
          <p className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg ltr-text">
            Left-to-Right Text
          </p>
          <p className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg rtl-text">
            Right-to-Left Text
          </p>
        </div>
      </div>
    </div>
  )
}
