"use client"

import { useEffect, useRef, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Maximize2, Minimize2, X, ChevronRight, Code } from "lucide-react"
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

  // Function to render command output based on type and content
  const renderCommandOutput = (item: any) => {
    if (item.isProcessing) {
      return (
        <div className="flex items-center">
          <div className="animate-pulse">Processing...</div>
        </div>
      )
    }

    if (item.type === "text" || !item.type) {
      return item.output
    }

    // Handle JSX content based on the content identifier
    if (item.type === "jsx") {
      switch (item.output) {
        case "help-content":
          return (
            <div className="space-y-1">
              <p>Available commands:</p>
              <p>
                <span className="text-blue-400">help</span> - Show this help message
              </p>
              <p>
                <span className="text-blue-400">about</span> - Display information about Kaung Sithu Linn
              </p>
              <p>
                <span className="text-blue-400">skills</span> - List technical skills
              </p>
              <p>
                <span className="text-blue-400">projects</span> - Show featured projects
              </p>
              <p>
                <span className="text-blue-400">contact</span> - Display contact information
              </p>
              <p>
                <span className="text-blue-400">experience</span> - Show work experience
              </p>
              <p>
                <span className="text-blue-400">education</span> - Show educational background
              </p>
              <p>
                <span className="text-blue-400">clear</span> - Clear the terminal
              </p>
              <p>
                <span className="text-blue-400">exit</span> - Exit terminal mode
              </p>
              <p>
                <span className="text-blue-400">[anything else]</span> - Ask the AI assistant
              </p>
            </div>
          )
        case "about-content":
          return (
            <div className="space-y-2">
              <p className="text-blue-500 font-bold">Kaung Sithu Linn</p>
              <p>Software Developer specializing in POS systems, fraud detection, and behavioral biometrics.</p>
              <p>
                Results-driven developer with 4+ years of experience crafting intuitive user interfaces, conducting
                thorough testing, and delivering high-quality applications that meet complex requirements.
              </p>
            </div>
          )
        case "skills-content":
          return (
            <div className="grid grid-cols-2 gap-2">
              <div>
                <p className="text-blue-400 font-bold">Frontend</p>
                <ul className="list-disc list-inside">
                  <li>JavaScript</li>
                  <li>HTML5</li>
                  <li>CSS</li>
                  <li>UI Design</li>
                </ul>
              </div>
              <div>
                <p className="text-indigo-400 font-bold">Backend</p>
                <ul className="list-disc list-inside">
                  <li>Python</li>
                  <li>Java</li>
                  <li>C++</li>
                  <li>.NET</li>
                </ul>
              </div>
              <div>
                <p className="text-purple-400 font-bold">Database</p>
                <ul className="list-disc list-inside">
                  <li>SQL</li>
                  <li>Data Management</li>
                </ul>
              </div>
              <div>
                <p className="text-blue-500 font-bold">AI/ML</p>
                <ul className="list-disc list-inside">
                  <li>Behavioral Biometrics</li>
                  <li>Deep Learning</li>
                </ul>
              </div>
            </div>
          )
        case "projects-content":
          return (
            <div className="space-y-3">
              <div>
                <p className="text-blue-500 font-bold">Mouse Dynamics for Online Assessment Fraud Detection</p>
                <p>
                  Developed a machine learning model to detect fraudulent behavior during online assessments using mouse
                  dynamics as a behavioral biometric.
                </p>
              </div>
              <div>
                <p className="text-purple-500 font-bold">
                  Mouse Dynamics Biometric Fraud Detection System using Deep Learning
                </p>
                <p>
                  Developed a fraud detection system using mouse dynamics and deep learning to enhance the security of
                  online assessments.
                </p>
              </div>
              <div>
                <p className="text-indigo-500 font-bold">Continuous Authentication with Behavioral Biometrics</p>
                <p>
                  Conducted a literature review on the use of behavioral biometrics, specifically mouse dynamics and
                  keystroke analysis, for continuous user authentication.
                </p>
              </div>
            </div>
          )
        case "contact-content":
          return (
            <div className="space-y-2">
              <p>
                <span className="text-blue-400">Email:</span> kaungsithulinn1@gmail.com
              </p>
              <p>
                <span className="text-blue-400">Phone:</span> +65 8460 6093
              </p>
              <p>
                <span className="text-blue-400">Address:</span> Block 124 # 14-2923 Paya Lebar Way, Singapore 381124
              </p>
              <p>
                <span className="text-blue-400">GitHub:</span>{" "}
                <a href="https://github.com/KaungSithuLinn" className="text-indigo-400 hover:underline">
                  github.com/KaungSithuLinn
                </a>
              </p>
              <p>
                <span className="text-blue-400">LinkedIn:</span>{" "}
                <a
                  href="https://linkedin.com/in/kaung-sithu-linn-7933781a5"
                  className="text-indigo-400 hover:underline"
                >
                  linkedin.com/in/kaung-sithu-linn-7933781a5
                </a>
              </p>
            </div>
          )
        case "experience-content":
          return (
            <div className="space-y-3">
              <div>
                <p className="text-blue-500 font-bold">eVolva Software House</p>
                <p className="text-gray-400">Software Developer and Client Tester | Dec 2018 - Present</p>
                <ul className="list-disc list-inside">
                  <li>Designed and developed a POS system using Microsoft .NET</li>
                  <li>Upgraded an outdated Microsoft Access POS system to a modern SQL standalone application</li>
                  <li>Resolved LAN interference issues with the VPN network</li>
                  <li>Delivered an optimized POS system that increased store efficiency by over 50%</li>
                </ul>
              </div>
            </div>
          )
        case "education-content":
          return (
            <div className="space-y-3">
              <div>
                <p className="text-purple-500 font-bold">Master of Information Technology (Business Informatics)</p>
                <p className="text-gray-400">James Cook University Singapore | Mar 2024 – Apr 2025</p>
              </div>
              <div>
                <p className="text-blue-500 font-bold">Bachelor of Information Technology</p>
                <p className="text-gray-400">James Cook University Singapore | Nov 2022 – Feb 2024</p>
              </div>
              <div>
                <p className="text-indigo-500 font-bold">Higher National Diploma of Software Engineering (Level 5)</p>
                <p className="text-gray-400">INET IT ACADEMY | Mar 2018 – Oct 2022</p>
              </div>
            </div>
          )
        default:
          return item.output
      }
    }

    return item.output
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
            className={`fixed ${
              isFullscreen ? "inset-0" : "bottom-20 right-6 w-[90%] md:w-[600px] h-[500px]"
            } z-40 flex flex-col rounded-lg overflow-hidden border border-blue-500/30 shadow-2xl shadow-blue-500/20`}
          >
            {/* Terminal header */}
            <div className="bg-gradient-to-r from-blue-900/95 to-purple-900/95 backdrop-blur-md border-b border-blue-500/30 p-2 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-red-500" onClick={() => setIsOpen(false)}></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span className="ml-2 text-blue-300 text-sm font-mono">KSL DevConsole</span>
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
              className="flex-1 bg-gradient-to-br from-gray-900/95 to-blue-900/40 backdrop-blur-sm p-4 overflow-y-auto font-mono text-sm text-blue-300"
            >
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
            <form
              onSubmit={handleSubmit}
              className="bg-gradient-to-r from-blue-900/95 to-purple-900/95 backdrop-blur-md border-t border-blue-500/30 p-2 flex items-center"
            >
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
