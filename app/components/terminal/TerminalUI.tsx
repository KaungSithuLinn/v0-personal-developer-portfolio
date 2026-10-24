"use client"

import * as React from "react"
import { useEffect, useRef, useState, useCallback } from "react"
import { motion, AnimatePresence, useReducedMotion } from "framer-motion"
import { Maximize2, Minimize2, X, ChevronRight } from "lucide-react"
import { useTerminal } from "@/hooks/use-terminal"
import { useMounted } from "@/lib/use-mounted"
import { useTranslation } from "@/context/language-utils"

interface CommandOutput {
  command: string
  output: string | React.ReactNode
  isProcessing?: boolean
  type?: "text" | "jsx" | "success" | "error" | "system"
}

export default function TerminalUI({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }): React.ReactElement | null {
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false)
  const { input, setInput, history, isProcessing, handleSubmit } = useTerminal()
  const terminalRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const closeButtonRef = useRef<HTMLButtonElement>(null)
  const mounted = useMounted()
  const shouldReduceMotion = useReducedMotion()
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

  // Focus trap: keep Tab/Shift+Tab within the dialog
  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault()
        onClose()
        return
      }

      if (event.key !== "Tab") return

      const dialog = terminalRef.current
      if (!dialog) return

      const focusable = dialog.querySelectorAll<HTMLElement>(
        'button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])',
      )
      if (focusable.length === 0) return

      const first = focusable[0]
      const last = focusable[focusable.length - 1]

      if (event.shiftKey) {
        if (document.activeElement === first) {
          event.preventDefault()
          last.focus()
        }
      } else {
        if (document.activeElement === last) {
          event.preventDefault()
          first.focus()
        }
      }
    }

    document.addEventListener("keydown", handleKeyDown)
    return () => {
      document.removeEventListener("keydown", handleKeyDown)
    }
  }, [isOpen, onClose])

  // Restore focus to close button when dialog closes
  useEffect(() => {
    if (!isOpen && closeButtonRef.current) {
      closeButtonRef.current.focus()
    }
  }, [isOpen])

  const toggleFullscreen = useCallback((): void => {
    setIsFullscreen((prev) => !prev)
  }, [])

  const renderCommandOutput = useCallback(
    (item: CommandOutput): React.ReactNode => {
      if (item.isProcessing) {
        return (
          <div className="flex items-center text-primary" aria-live="polite">
            <motion.div
              animate={shouldReduceMotion ? { rotate: 0 } : { rotate: 360 }}
              transition={shouldReduceMotion ? { duration: 0 } : { duration: 1, repeat: Infinity, ease: "linear" }}
              className="me-2"
              aria-hidden="true"
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
        return <div className="text-slate-300">{item.output}</div>
      }

      return <div className="text-teal-100 whitespace-pre-wrap">{item.output}</div>
    },
    [shouldReduceMotion, t],
  )

  if (!mounted) return null

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-labelledby="terminal-title"
          initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 40 }}
          animate={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
          exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 40 }}
          transition={shouldReduceMotion ? { duration: 0 } : { type: "spring", damping: 25, stiffness: 300 }}
          className={`terminal-window ${isFullscreen ? "fullscreen" : "normal"} ${isRTL ? "rtl" : ""}`}
        >
          {/* Terminal header */}
          <div className="terminal-header">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-red-500" aria-hidden="true" />
              <div className="w-3 h-3 rounded-full bg-yellow-500" aria-hidden="true" />
              <div className="w-3 h-3 rounded-full bg-green-500" aria-hidden="true" />
              <span id="terminal-title" className="ms-2 text-primary text-sm font-mono">{t("terminal.title")}</span>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={toggleFullscreen}
                className="text-gray-400 hover:text-white transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                aria-label={isFullscreen ? t("terminal.exitFullscreen") || "Exit Fullscreen" : t("terminal.enterFullscreen") || "Enter Fullscreen"}
              >
                {isFullscreen ? <Minimize2 size={18} aria-hidden="true" /> : <Maximize2 size={18} aria-hidden="true" />}
              </button>
              <button
                ref={closeButtonRef}
                onClick={onClose}
                className="text-gray-400 hover:text-white transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                aria-label={t("terminal.close") || "Close Terminal"}
              >
                <X size={18} aria-hidden="true" />
              </button>
            </div>
          </div>

          {/* Terminal content */}
          <div ref={terminalRef} className="terminal-content" aria-label={t("terminal.outputLog") || "Terminal output log"} role="log" aria-live="polite" aria-relevant="additions">
            {history.map((item, index) => (
              <div key={index} className="mb-2">
                {item.command !== "system" && (
                  <div className="flex items-center text-primary mb-1">
                    <span className="me-1 text-primary">ksl@portfolio:~$</span>
                    <span>{item.command}</span>
                  </div>
                )}
                <div className={`ps-0 ${item.command === "system" ? "text-slate-300" : "text-teal-100"}`}>
                  {renderCommandOutput(item)}
                </div>
              </div>
            ))}
          </div>

          {/* Terminal input */}
          <form onSubmit={handleSubmit} className="terminal-input" role="search">
            <label htmlFor="terminal-input" className="sr-only">{t("terminal.commandLabel")}</label>
            <span className="text-primary me-2 flex-shrink-0" aria-hidden="true">ksl@portfolio:~$</span>
            <input
              id="terminal-input"
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 bg-transparent border-none outline-none text-primary-foreground font-mono focus-visible:ring-1 focus-visible:ring-ring rounded px-1"
              placeholder={t("terminal.commandPlaceholder")}
              disabled={isProcessing}
              autoComplete="off"
              spellCheck="false"
              aria-label={t("terminal.commandLabel")}
            />
            <button
              type="submit"
              disabled={isProcessing}
              className="text-primary hover:text-primary/80 transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              aria-label={t("terminal.execute") || "Execute Command"}
            >
              <ChevronRight size={20} aria-hidden="true" />
            </button>
          </form>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
