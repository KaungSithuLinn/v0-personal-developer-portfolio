"use client"

import * as React from "react"
import { useEffect, useRef, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Maximize2, Minimize2, X, ChevronRight, Code } from "lucide-react"
import { useTerminal } from "@/hooks/use-terminal"
import { useMounted } from "@/lib/use-mounted"
import { useTranslation } from "@/context/language-context"

interface CommandOutput {
  command: string
  output: string | React.ReactNode
  isProcessing?: boolean
  type?: 'text' | 'jsx' | 'success' | 'error' | 'system'
}

export default function TerminalUI({ onClose }: { onClose: () => void }): React.ReactElement | null {
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false)
  const { input, setInput, history, isProcessing, handleSubmit } = useTerminal()
  const terminalRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const mounted = useMounted()
  const { t, isRTL } = useTranslation()

  // Auto-scroll to bottom when new content is added
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight
    }
  }, [history])

  // Focus input when terminal is opened
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => {
        inputRef.current?.focus()
      }, 100)
    }
  }, [isOpen])

  if (!mounted) return null

  const toggleTerminal = (): void => {
    setIsOpen(!isOpen)
    if (!isOpen && inputRef.current) {
      setTimeout(() => {
        inputRef.current?.focus()
      }, 100)
    }
  }

  const toggleFullscreen = (): void => {
    setIsFullscreen(!isFullscreen)
  }

  // Function to render command output based on type and content
  const renderCommandOutput = (item: CommandOutput): React.ReactNode => {
    if (item.isProcessing) {
      return (
        <div className="flex items-center text-blue-300">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="mr-2"
          >
            ⟳
          </motion.div>
          {t("terminal.processing")}
        </div>
      )
    }

    if (item.type === "error") {
      return <div className="text-red-400">{item.output}</div>
    }

    if (item.type === "system") {
      return <div className="text-indigo-300">{item.output}</div>
    }

    return <div className="text-blue-100">{item.output}</div>
  }

  return (
    <>
      {/* Terminal toggle button */}
      <motion.button
        className="fixed bottom-6 right-6 z-50 p-3 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300"
        onClick={toggleTerminal}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        aria-label="Toggle Terminal"
      >
        <Code size={24} />
      </motion.button>

      {/* Terminal window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
            transition={{ type: "spring", damping: 20 }}
            className={`terminal-window ${isFullscreen ? "fullscreen" : "normal"} ${isRTL ? "rtl" : ""}`}
          >
            {/* Terminal header */}
            <div className="terminal-header">
              <div className="flex items-center space-x-2">
                <button
                  className="w-3 h-3 rounded-full bg-red-500 hover:bg-red-600 transition-colors"
                  onClick={onClose}
                  aria-label="Close Terminal"
                />
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span className="ml-2 text-blue-300 text-sm font-mono">{t("terminal.title")}</span>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={toggleFullscreen}
                  className="text-gray-400 hover:text-white transition-colors"
                  aria-label={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
                >
                  {isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
                </button>
                <button
                  onClick={onClose}
                  className="text-gray-400 hover:text-white transition-colors"
                  aria-label="Close Terminal"
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            {/* Terminal content */}
            <div ref={terminalRef} className="terminal-content">
              {history.map((item, index) => (
                <div key={index} className="mb-2">
                  {item.command !== "system" && (
                    <div className="flex items-center text-blue-400 mb-1">
                      <span className="mr-1">ksl@portfolio:~$</span>
                      <span>{item.command}</span>
                    </div>
                  )}
                  <div className={`pl-0 ${item.command === "system" ? "text-indigo-300" : "text-blue-100"}`}>
                    {renderCommandOutput(item)}
                  </div>
                </div>
              ))}
            </div>

            {/* Terminal input */}
            <form onSubmit={handleSubmit} className="terminal-input">
              <span className="text-blue-400 mr-2 flex-shrink-0">ksl@portfolio:~$</span>
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="flex-1 bg-transparent border-none outline-none text-blue-200 font-mono"
                placeholder="Type a command or question..."
                disabled={isProcessing}
                autoComplete="off"
                spellCheck="false"
              />
              <button
                type="submit"
                disabled={isProcessing}
                className="text-blue-400 hover:text-blue-300 transition-colors"
                aria-label="Execute Command"
              >
                <ChevronRight size={20} />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
