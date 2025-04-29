"use client"

import { useEffect, useRef, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Terminal, Maximize2, Minimize2, X, ChevronRight } from "lucide-react"
import { useTerminal } from "@/hooks/use-terminal"
import { useMounted } from "@/lib/use-mounted"

export default function TerminalUI(): JSX.Element | null {
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false)
  const { input, setInput, history, isProcessing, handleSubmit } = useTerminal()
  const terminalRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const mounted = useMounted()

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

  return (
    <>
      {/* Terminal toggle button */}
      <motion.button
        className="fixed bottom-6 right-6 z-50 p-3 rounded-full bg-gray-800 text-cyan-400 shadow-lg hover:bg-gray-700 transition-colors"
        onClick={toggleTerminal}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        aria-label="Toggle Terminal"
      >
        <Terminal size={24} />
      </motion.button>

      {/* Terminal window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
            transition={{ type: "spring", damping: 20 }}
            className={`fixed ${
              isFullscreen ? "inset-0" : "bottom-20 right-6 w-[90%] md:w-[600px] h-[500px]"
            } z-40 flex flex-col rounded-lg overflow-hidden border border-cyan-500/30 shadow-2xl shadow-cyan-500/20`}
          >
            {/* Terminal header */}
            <div className="bg-gray-900 border-b border-cyan-500/30 p-2 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-red-500" onClick={() => setIsOpen(false)}></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span className="ml-2 text-cyan-400 text-sm font-mono">eDEX-UI Portfolio Terminal</span>
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
                  onClick={() => setIsOpen(false)}
                  className="text-gray-400 hover:text-white transition-colors"
                  aria-label="Close Terminal"
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            {/* Terminal content */}
            <div
              ref={terminalRef}
              className="flex-1 bg-gray-900/95 backdrop-blur-sm p-4 overflow-y-auto font-mono text-sm text-green-400"
            >
              {history.map((item, index) => (
                <div key={index} className="mb-2">
                  {item.command !== "system" && (
                    <div className="flex items-center text-cyan-400 mb-1">
                      <span className="mr-1">guest@portfolio:~$</span>
                      <span>{item.command}</span>
                    </div>
                  )}
                  <div className={`pl-0 ${item.command === "system" ? "text-yellow-400" : "text-green-300"}`}>
                    {item.isProcessing ? (
                      <div className="flex items-center">
                        <div className="animate-pulse">Processing...</div>
                      </div>
                    ) : (
                      item.output
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Terminal input */}
            <form onSubmit={handleSubmit} className="bg-gray-900 border-t border-cyan-500/30 p-2 flex items-center">
              <span className="text-cyan-400 mr-2 flex-shrink-0">guest@portfolio:~$</span>
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="flex-1 bg-transparent border-none outline-none text-green-400 font-mono"
                placeholder="Type a command or question..."
                disabled={isProcessing}
                autoComplete="off"
                spellCheck="false"
              />
              <button
                type="submit"
                disabled={isProcessing}
                className="text-cyan-400 hover:text-cyan-300 transition-colors"
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
