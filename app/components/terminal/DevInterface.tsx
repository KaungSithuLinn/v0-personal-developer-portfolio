"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Code, Monitor } from "lucide-react"
import { useTranslation } from "@/context/language-context"
import { useMounted } from "@/lib/use-mounted"
import TerminalUI from "./TerminalUI"
import SystemMonitor from "./SystemMonitor"

export default function DevInterface() {
  const [terminalOpen, setTerminalOpen] = useState(false)
  const [monitorOpen, setMonitorOpen] = useState(false)
  const { t, isRTL } = useTranslation()
  const mounted = useMounted()

  // Handle ESC key to close windows
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        if (terminalOpen) setTerminalOpen(false)
        if (monitorOpen) setMonitorOpen(false)
      }
    }

    window.addEventListener("keydown", handleEsc)
    return () => window.removeEventListener("keydown", handleEsc)
  }, [terminalOpen, monitorOpen])

  if (!mounted) return null

  return (
    <>
      <AnimatePresence mode="wait">
        {/* Terminal Button */}
        <motion.button
          className="terminal-button"
          onClick={() => setTerminalOpen(!terminalOpen)}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          aria-label={terminalOpen ? t("terminal.hide") : t("terminal.show")}
        >
          <Code size={20} />
        </motion.button>

        {/* System Monitor Button */}
        <motion.button
          className="monitor-button"
          onClick={() => setMonitorOpen(!monitorOpen)}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          aria-label={monitorOpen ? t("systemMonitor.hide") : t("systemMonitor.show")}
        >
          <Monitor size={20} />
        </motion.button>

        {/* Terminal Window */}
        {terminalOpen && <TerminalUI onClose={() => setTerminalOpen(false)} />}

        {/* System Monitor Window */}
        {monitorOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ type: "spring", damping: 20 }}
            className={`fixed bottom-36 ${isRTL ? "right-6" : "left-6"} z-40 w-[90%] md:w-[400px]`}
          >
            <SystemMonitor onClose={() => setMonitorOpen(false)} />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}