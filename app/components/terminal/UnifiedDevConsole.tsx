"use client"

import { useState, useEffect, type ReactElement } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useReducedMotion } from "framer-motion"
import { Code, Monitor } from "lucide-react"
import { useMounted } from "@/lib/use-mounted"
import { useTranslation } from "@/context/language-utils"
import TerminalUI from "./TerminalUI"
import SystemMonitor from "./SystemMonitor"
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
      <LanguageSelector />

      <motion.button
        className="terminal-button"
        onClick={() => setTerminalOpen(!terminalOpen)}
        whileHover={shouldReduceMotion ? undefined : { scale: 1.1 }}
        whileTap={shouldReduceMotion ? undefined : { scale: 0.9 }}
        aria-label={terminalOpen ? t("terminal.hide") : t("terminal.show")}
      >
        <Code size={20} />
      </motion.button>

      <motion.button
        className="monitor-button"
        onClick={() => setMonitorOpen(!monitorOpen)}
        whileHover={shouldReduceMotion ? undefined : { scale: 1.1 }}
        whileTap={shouldReduceMotion ? undefined : { scale: 0.9 }}
        aria-label={monitorOpen ? t("systemMonitor.hide") : t("systemMonitor.show")}
      >
        <Monitor size={20} />
      </motion.button>

      <motion.button
        className="fixed top-4 end-4 sm:top-24 sm:end-6 z-50 p-3 rounded-full bg-gradient-to-r from-teal-600 to-blue-700 text-white shadow-lg hover:from-teal-700 hover:to-blue-800 transition-all duration-300"
        onClick={() => setShowAdvanced(!showAdvanced)}
        whileHover={shouldReduceMotion ? undefined : { scale: 1.1 }}
        whileTap={shouldReduceMotion ? undefined : { scale: 0.9 }}
        aria-label={showAdvanced ? t("console.advancedHide") : t("console.advanced")}
      >
<svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          className="h-5 w-5"
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M9.94358 1.25H14.0564C15.8942 1.24998 17.3498 1.24997 18.489 1.40314C19.6614 1.56076 20.6104 1.89288 21.3588 2.64124C22.1071 3.38961 22.4392 4.33856 22.5969 5.51098C22.75 6.65019 22.75 8.10583 22.75 9.94359V11.0549C22.75 11.7174 22.75 12.3176 22.7368 12.8591C22.7455 12.9047 22.75 12.9518 22.75 13C22.75 13.0641 22.7419 13.1264 22.7268 13.1858C22.7103 13.6299 22.682 14.0312 22.6335 14.3918C22.5125 15.2919 22.2536 16.0497 21.6517 16.6517C21.0497 17.2536 20.2919 17.5125 19.3918 17.6335C18.5248 17.75 17.4225 17.75 16.0549 17.75H12.75V21.25H16C16.4142 21.25 16.75 21.5858 16.75 22C16.75 22.4142 16.4142 22.75 16 22.75H8C7.58579 22.75 7.25 22.4142 7.25 22C7.25 21.5858 7.58579 21.25 8 21.25H11.25V17.75H7.94513C6.57754 17.75 5.47522 17.75 4.60825 17.6335C3.70814 17.5125 2.95027 17.2536 2.34835 16.6517C1.74643 16.0497 1.48754 15.2919 1.36652 14.3918C1.31805 14.0312 1.28974 13.6299 1.2732 13.1858C1.25805 13.1264 1.25 13.0641 1.25 13C1.25 12.9518 1.25454 12.9047 1.26323 12.859C1.24998 12.3176 1.24999 11.7174 1.25 11.0549L1.25 9.94358C1.24998 8.10582 1.24997 6.65019 1.40314 5.51098C1.56076 4.33856 1.89288 3.38961 2.64124 2.64124C3.38961 1.89288 4.33856 1.56076 5.51098 1.40314C6.65019 1.24997 8.10582 1.24998 9.94358 1.25ZM2.80673 13.75C2.81924 13.9063 2.83451 14.0533 2.85315 14.1919C2.9518 14.9257 3.13225 15.3142 3.40901 15.591C3.68577 15.8678 4.07435 16.0482 4.80812 16.1469C5.56347 16.2484 6.56458 16.25 8 16.25H16C17.4354 16.25 18.4365 16.2484 19.1919 16.1469C19.9257 16.0482 20.3142 15.8678 20.591 15.591C20.8678 15.3142 21.0482 14.9257 21.1469 14.1919C21.1655 14.0533 21.1808 13.9063 21.1933 13.75H2.80673ZM21.2463 12.25H2.75371C2.75016 11.8736 2.75 11.459 2.75 11V10C2.75 8.09318 2.75159 6.73851 2.88976 5.71085C3.02503 4.70476 3.27869 4.12511 3.7019 3.7019C4.12511 3.27869 4.70476 3.02502 5.71085 2.88976C6.73851 2.75159 8.09318 2.75 10 2.75H14C15.9068 2.75 17.2615 2.75159 18.2892 2.88976C19.2952 3.02502 19.8749 3.27869 20.2981 3.7019C20.7213 4.12511 20.975 4.70476 21.1102 5.71085C21.2484 6.73851 21.25 8.09318 21.25 10V11C21.25 11.459 21.2498 11.8736 21.2463 12.25Z"
            fill="currentColor"
          />
        </svg>
      </motion.button>

      <AnimatePresence>
        {terminalOpen && (
          <TerminalUI isOpen={terminalOpen} onClose={() => setTerminalOpen(false)} />
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