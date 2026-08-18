"use client"

import { useState, useEffect, type ReactElement } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useReducedMotion } from "framer-motion"
import { Code, Monitor, Globe } from "lucide-react"
import { useMounted } from "@/lib/use-mounted"
import { useTranslation } from "@/context/language-utils"
import TerminalUI from "./TerminalUI"
import SystemMonitor from "./SystemMonitor"
import HexGrid from "./HexGrid"
import FileExplorer from "./FileExplorer"
import LanguageSelector from "@/components/LanguageSelector"

export default function UnifiedDevConsole(): ReactElement | null {
  const [terminalOpen, setTerminalOpen] = useState(false)
  const [monitorOpen, setMonitorOpen] = useState(false)
  const [showAdvanced, setShowAdvanced] = useState(false)
  const mounted = useMounted()
  const { t, isRTL } = useTranslation()
  const shouldReduceMotion = useReducedMotion()

  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setTerminalOpen(false)
        setMonitorOpen(false)
        setShowAdvanced(false)
      }
    }

    window.addEventListener("keydown", handleEsc)
    return () => window.removeEventListener("keydown", handleEsc)
  }, [])

  if (!mounted) return null

  return (
    <>
      <HexGrid className="opacity-30" />

      <LanguageSelector />

      {/* Terminal Button */}
      <motion.button
        className="terminal-button"
        onClick={() => setTerminalOpen(!terminalOpen)}
        whileHover={shouldReduceMotion ? undefined : { scale: 1.1 }}
        whileTap={shouldReduceMotion ? undefined : { scale: 0.9 }}
        aria-label={terminalOpen ? t("terminal.hide") : t("terminal.show")}
      >
        <Code size={20} />
      </motion.button>

      {/* System Monitor Button */}
      <motion.button
        className="monitor-button"
        onClick={() => setMonitorOpen(!monitorOpen)}
        whileHover={shouldReduceMotion ? undefined : { scale: 1.1 }}
        whileTap={shouldReduceMotion ? undefined : { scale: 0.9 }}
        aria-label={monitorOpen ? t("systemMonitor.hide") : t("systemMonitor.show")}
      >
        <Monitor size={20} />
      </motion.button>

      {/* Advanced Console Toggle */}
      <motion.button
        className="fixed top-24 end-6 z-50 p-3 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300"
        onClick={() => setShowAdvanced(!showAdvanced)}
        whileHover={shouldReduceMotion ? undefined : { scale: 1.1 }}
        whileTap={shouldReduceMotion ? undefined : { scale: 0.9 }}
        aria-label="Toggle Advanced Console"
      >
        <Globe size={20} />
      </motion.button>

      <AnimatePresence>
        {terminalOpen && (
          <TerminalUI onClose={() => setTerminalOpen(false)} />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {monitorOpen && (
          <motion.div
            initial={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            animate={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 1, y: 0 }}
            exit={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={shouldReduceMotion ? { duration: 0 } : { type: "spring", damping: 20 }}
            className={`fixed bottom-36 start-6 z-40 w-[90%] md:w-[400px] monitor-window`}
          >
            <SystemMonitor onClose={() => setMonitorOpen(false)} />
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showAdvanced && (
          <motion.div
            initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0 }}
            animate={shouldReduceMotion ? { opacity: 1 } : { opacity: 1 }}
            exit={shouldReduceMotion ? { opacity: 1 } : { opacity: 0 }}
            className="fixed inset-0 z-40 p-4 pointer-events-none"
          >
            <div className="container mx-auto h-full flex flex-col md:flex-row gap-4">
              <motion.div
                initial={shouldReduceMotion ? { x: 0, opacity: 1 } : { x: isRTL ? 50 : -50, opacity: 0 }}
                animate={shouldReduceMotion ? { x: 0, opacity: 1 } : { x: 0, opacity: 1 }}
                transition={shouldReduceMotion ? { duration: 0 } : { delay: 0.2 }}
                className="w-full md:w-1/4 pointer-events-auto"
              >
                <FileExplorer />
              </motion.div>

              <motion.div
                initial={shouldReduceMotion ? { x: 0, opacity: 1 } : { x: isRTL ? -50 : 50, opacity: 0 }}
                animate={shouldReduceMotion ? { x: 0, opacity: 1 } : { x: 0, opacity: 1 }}
                transition={shouldReduceMotion ? { duration: 0 } : { delay: 0.4 }}
                className="w-full md:w-1/4 pointer-events-auto"
              >
                <SystemMonitor onClose={() => setShowAdvanced(false)} />
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
