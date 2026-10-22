"use client"

import { useState, useCallback, useEffect } from "react"
import type { FormEvent } from "react"
import { useTranslation } from "@/context/language-utils"

type CommandHistory = {
  command: string
  output: string
  isProcessing?: boolean
}

const COMMAND_OUTPUTS: Record<string, { type: "text"; content: string }> = {
  help: {
    type: "text",
    content:
      "Available commands:\n" +
      "  about       - Learn more about Kaung Sithu Linn\n" +
      "  skills      - View technical skills and proficiencies\n" +
      "  projects    - Browse featured projects\n" +
      "  experience  - See work experience history\n" +
      "  education   - View education and certifications\n" +
      "  contact     - Get contact information\n" +
      "  clear       - Clear terminal output\n" +
      "  help        - Show this help message\n" +
      "  exit        - Exit terminal mode",
  },
  about: {
    type: "text",
    content:
      "Kaung Sithu Linn is a Software Developer specializing in POS systems, fraud detection, and behavioral biometrics with 4+ years of experience building production-grade full-stack applications.",
  },
  skills: {
    type: "text",
    content:
      "Core technologies: TypeScript, React, Next.js, Node.js, Python, PostgreSQL, Redis. Specialties: fraud detection systems, behavioral biometrics, POS integrations, real-time data pipelines.",
  },
  projects: {
    type: "text",
    content:
      "Featured projects include fraud detection dashboards, POS integrations, biometric authentication systems, and full-stack portfolio platforms. See the Projects section above for details.",
  },
  contact: {
    type: "text",
    content:
      "Email: kaungthu.sithu97@gmail.com\nGitHub: github.com/kaungthu97\nLinkedIn: linkedin.com/in/kaung-sithu-linn",
  },
  experience: {
    type: "text",
    content:
      "4+ years in software development. Focused on POS systems, fraud detection, and behavioral biometrics. Built production-grade full-stack applications with React, Node.js, and Python.",
  },
  education: {
    type: "text",
    content:
      "Computer Science background with focus on software engineering, data security, and applied machine learning. Continuous learner with certifications in cloud and security domains.",
  },
}

export function useTerminal() {
  const [input, setInput] = useState<string>("")
  const [history, setHistory] = useState<CommandHistory[]>([])
  const [isProcessing, setIsProcessing] = useState<boolean>(false)
  const { t, language } = useTranslation()

  useEffect(() => {
    setHistory([
      {
        command: "system",
        output: t("terminal.title") + " v1.0.0",
      },
      {
        command: "system",
        output: t("terminal.welcome"),
      },
    ])
  }, [language, t])

  const processCommand = useCallback(
    async (command: string) => {
      setIsProcessing(true)
      setHistory((prev) => [...prev, { command, output: "", isProcessing: true }])

      const lowerCommand = command.toLowerCase()

      if (COMMAND_OUTPUTS[lowerCommand]) {
        const { content } = COMMAND_OUTPUTS[lowerCommand]
        setHistory((prev) => {
          const newHistory = [...prev]
          const lastIndex = newHistory.length - 1
          newHistory[lastIndex] = {
            command,
            output: content,
            isProcessing: false,
          }
          return newHistory
        })
        setIsProcessing(false)
        return
      }

      if (lowerCommand === "clear") {
        setHistory([
          {
            command: "system",
            output: t("terminal.title") + " v1.0.0",
          },
          {
            command: "system",
            output: t("terminal.welcome"),
          },
        ])
        setIsProcessing(false)
        return
      }

      if (lowerCommand === "exit") {
        setHistory((prev) => {
          const newHistory = [...prev]
          const lastIndex = newHistory.length - 1
          newHistory[lastIndex] = {
            command,
            output: "Exiting terminal mode...",
            isProcessing: false,
          }
          return newHistory
        })
        setIsProcessing(false)
        return
      }

      // Fallback: AI assistant
      try {
        const response = await fetch("/api/terminal", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ command }),
        })

        if (!response.ok) {
          throw new Error(`Server error: ${response.status}`)
        }

        const data = (await response.json()) as { response?: string; error?: string }
        const output = data.response || data.error || "Sorry, I couldn't process that request."

        setHistory((prev) => {
          const newHistory = [...prev]
          const lastIndex = newHistory.length - 1
          newHistory[lastIndex] = {
            command,
            output,
            isProcessing: false,
          }
          return newHistory
        })
      } catch (error) {
        console.error("Error generating AI response:", error)
        setHistory((prev) => {
          const newHistory = [...prev]
          const lastIndex = newHistory.length - 1
          newHistory[lastIndex] = {
            command,
            output: "Sorry, I couldn't process that request. Please try again or type 'help' for available commands.",
            isProcessing: false,
          }
          return newHistory
        })
      } finally {
        setIsProcessing(false)
      }
    },
    [t],
  )

  const handleSubmit = useCallback(
    (e?: FormEvent) => {
      e?.preventDefault()
      if (!input.trim() || isProcessing) return

      processCommand(input)
      setInput("")
    },
    [input, isProcessing, processCommand],
  )

  const clearHistory = useCallback(() => {
    setHistory([
      {
        command: "system",
        output: t("terminal.title") + " v1.0.0",
      },
      {
        command: "system",
        output: t("terminal.welcome"),
      },
    ])
  }, [t])

  return {
    input,
    setInput,
    history,
    isProcessing,
    handleSubmit,
    clearHistory,
  }
}