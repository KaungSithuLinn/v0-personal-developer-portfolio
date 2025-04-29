"use client"

import { useState, useCallback } from "react"
import { generateText } from "ai"
import { groq } from "@ai-sdk/groq"
import type { FormEvent, ReactNode } from "react"

// Define types for command history
type CommandHistory = {
  command: string
  output: string | ReactNode
  isProcessing?: boolean
  type?: "text" | "jsx"
}

// Initial messages
const INITIAL_MESSAGES: CommandHistory[] = [
  {
    command: "system",
    output: "eDEX-UI Portfolio Terminal v1.0.0",
    type: "text",
  },
  {
    command: "system",
    output: "Type 'help' to see available commands",
    type: "text",
  },
]

// Command output templates
const COMMAND_OUTPUTS = {
  help: {
    type: "jsx" as const,
    content: "help-content", // This will be replaced with actual JSX in the component
  },
  about: {
    type: "jsx" as const,
    content: "about-content",
  },
  skills: {
    type: "jsx" as const,
    content: "skills-content",
  },
  projects: {
    type: "jsx" as const,
    content: "projects-content",
  },
  contact: {
    type: "jsx" as const,
    content: "contact-content",
  },
  experience: {
    type: "jsx" as const,
    content: "experience-content",
  },
  education: {
    type: "jsx" as const,
    content: "education-content",
  },
}

export function useTerminal() {
  const [input, setInput] = useState<string>("")
  const [history, setHistory] = useState<CommandHistory[]>(INITIAL_MESSAGES)
  const [isProcessing, setIsProcessing] = useState<boolean>(false)

  const processCommand = useCallback(
    async (command: string) => {
      setIsProcessing(true)
      setHistory((prev) => [...prev, { command, output: "", isProcessing: true }])

      let output: string | ReactNode = ""
      let outputType: "text" | "jsx" = "text"

      // Process built-in commands
      const lowerCommand = command.toLowerCase()

      if (COMMAND_OUTPUTS[lowerCommand as keyof typeof COMMAND_OUTPUTS]) {
        const commandOutput = COMMAND_OUTPUTS[lowerCommand as keyof typeof COMMAND_OUTPUTS]
        output = commandOutput.content
        outputType = commandOutput.type
      } else if (lowerCommand === "clear") {
        setHistory(INITIAL_MESSAGES)
        setIsProcessing(false)
        return
      } else if (lowerCommand === "exit") {
        output = "Exiting terminal mode..."
        outputType = "text"
      } else {
        // Use Groq API for AI responses
        try {
          const response = await generateText({
            model: groq("llama3-70b-8192"),
            prompt: `You are an AI assistant embedded in Kaung Sithu Linn's portfolio website. 
            The portfolio is for a Software Developer specializing in POS systems, fraud detection, and behavioral biometrics with 4+ years of experience.
            
            User query: ${command}
            
            Provide a helpful, concise response in 2-3 sentences maximum. If the query is not related to Kaung's portfolio or professional background, politely suggest using the built-in commands like 'help', 'about', 'skills', etc.`,
            maxTokens: 200,
          })
          output = response.text
          outputType = "text"
        } catch (error) {
          console.error("Error generating AI response:", error)
          output = "Sorry, I couldn't process that request. Please try again or type 'help' for available commands."
          outputType = "text"
        }
      }

      setHistory((prev) => {
        const newHistory = [...prev]
        const lastIndex = newHistory.length - 1
        newHistory[lastIndex] = {
          command,
          output,
          isProcessing: false,
          type: outputType,
        }
        return newHistory
      })
      setIsProcessing(false)
    },
    [setHistory],
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
    setHistory(INITIAL_MESSAGES)
  }, [])

  return {
    input,
    setInput,
    history,
    isProcessing,
    handleSubmit,
    clearHistory,
  }
}
