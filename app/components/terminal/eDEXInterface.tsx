"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { useMounted } from "@/lib/use-mounted"
import TerminalUI from "./TerminalUI"
import SystemMonitor from "./SystemMonitor"
import HexGrid from "./HexGrid"
import FileExplorer from "./FileExplorer"

export default function DevConsoleInterface(): JSX.Element | null {
  const [isVisible, setIsVisible] = useState<boolean>(false)
  const mounted = useMounted()

  if (!mounted) return null

  return (
    <>
      {/* Background hex grid */}
      <HexGrid className="opacity-30" />

      {/* Terminal UI (always visible) */}
      <TerminalUI />

      {/* Floating action button to toggle interface */}
      <motion.button
        className="fixed top-24 right-6 z-50 p-3 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300"
        onClick={() => setIsVisible(!isVisible)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        aria-label="Toggle DevConsole Interface"
      >
        {isVisible ? "Hide Interface" : "Show Interface"}
      </motion.button>

      {/* Main interface */}
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-40 p-4 pointer-events-none"
        >
          <div className="container mx-auto h-full flex flex-col md:flex-row gap-4">
            {/* Left panel */}
            <motion.div
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="w-full md:w-1/4 pointer-events-auto"
            >
              <FileExplorer />
            </motion.div>

            {/* Right panel */}
            <motion.div
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="w-full md:w-1/4 pointer-events-auto"
            >
              <SystemMonitor />
            </motion.div>
          </div>
        </motion.div>
      )}
    </>
  )
}
