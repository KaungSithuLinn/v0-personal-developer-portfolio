"use client"

import { useState, type ReactElement } from "react"
import { motion } from "framer-motion"
import { useReducedMotion } from "framer-motion"
import { useMounted } from "@/lib/use-mounted"
import { useTranslation } from "@/context/language-utils"
import TerminalUI from "./TerminalUI"
import SystemMonitor from "./SystemMonitor"
import HexGrid from "./HexGrid"
import FileExplorer from "./FileExplorer"
import LanguageSelector from "@/components/LanguageSelector"

// Audit P0-2: respect reduced motion preference

export default function DevConsoleInterface(): ReactElement | null {
  const [isVisible, setIsVisible] = useState<boolean>(false)
  const mounted = useMounted()
  const { t, isRTL } = useTranslation()
  const shouldReduceMotion = useReducedMotion()

  if (!mounted) return null

  return (
    <>
      {/* Background hex grid */}
      <HexGrid className="opacity-30" />

      {/* Language Selector */}
      <LanguageSelector />

      {/* Terminal UI (always visible) */}
      <TerminalUI onClose={() => setIsVisible(false)} />

      {/* Floating action button to toggle interface */}
      <motion.button
        className="fixed top-24 end-6 z-50 p-3 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300"
        onClick={() => setIsVisible(!isVisible)}
        whileHover={shouldReduceMotion ? undefined : { scale: 1.1 }}
        whileTap={shouldReduceMotion ? undefined : { scale: 0.9 }}
        aria-label="Toggle DevConsole Interface"
      >
        {isVisible ? t("systemMonitor.hide") : t("systemMonitor.show")}
      </motion.button>

      {/* Main interface */}
      {isVisible && (
        <motion.div
          initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0 }}
          animate={shouldReduceMotion ? { opacity: 1 } : { opacity: 1 }}
          exit={shouldReduceMotion ? { opacity: 1 } : { opacity: 0 }}
          className="fixed inset-0 z-40 p-4 pointer-events-none"
        >
          <div className="container mx-auto h-full flex flex-col md:flex-row gap-4">
            {/* Left panel */}
            <motion.div
              initial={shouldReduceMotion ? { x: 0, opacity: 1 } : { x: isRTL ? 50 : -50, opacity: 0 }}
              animate={shouldReduceMotion ? { x: 0, opacity: 1 } : { x: 0, opacity: 1 }}
              transition={shouldReduceMotion ? { duration: 0 } : { delay: 0.2 }}
              className="w-full md:w-1/4 pointer-events-auto"
            >
              <FileExplorer />
            </motion.div>

            {/* Right panel */}
            <motion.div
              initial={shouldReduceMotion ? { x: 0, opacity: 1 } : { x: isRTL ? -50 : 50, opacity: 0 }}
              animate={shouldReduceMotion ? { x: 0, opacity: 1 } : { x: 0, opacity: 1 }}
              transition={shouldReduceMotion ? { duration: 0 } : { delay: 0.4 }}
              className="w-full md:w-1/4 pointer-events-auto"
            >
              <SystemMonitor onClose={() => setIsVisible(false)} />
            </motion.div>
          </div>
        </motion.div>
      )}
    </>
  )
}
