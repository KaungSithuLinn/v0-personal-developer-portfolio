"use client"

import { useState, useCallback, type ReactNode } from "react"
import { generateText } from "ai"
import { groq } from "@ai-sdk/groq"
import type { FormEvent } from "react"

type CommandHistory = {
  command: string
  output: string | ReactNode
  isProcessing?: boolean
}

const INITIAL_MESSAGES: CommandHistory[] = [
  {
    command: "system",
    output: "eDEX-UI Portfolio Terminal v1.0.0",
  },
  {
    command: "system",
    output: "Type 'help' to see available commands",
  },
]

export function useTerminal() {
  const [input, setInput] = useState<string>("")
  const [history, setHistory] = useState<CommandHistory[]>(INITIAL_MESSAGES)
  const [isProcessing, setIsProcessing] = useState<boolean>(false)

  const processCommand = useCallback(
    async (command: string) => {
      setIsProcessing(true)
      setHistory((prev) => [...prev, { command, output: "", isProcessing: true }])

      let output: string | ReactNode = ""

      // Process built-in commands
      if (command.toLowerCase() === "help") {
        output = (
          <div className="space-y-1">
            <p>Available commands:</p>
            <p>
              <span className="text-cyan-400">help</span> - Show this help message
            </p>
            <p>
              <span className="text-cyan-400">about</span> - Display information about Kaung Sithu Linn
            </p>
            <p>
              <span className="text-cyan-400">skills</span> - List technical skills
            </p>
            <p>
              <span className="text-cyan-400">projects</span> - Show featured projects
            </p>
            <p>
              <span className="text-cyan-400">contact</span> - Display contact information
            </p>
            <p>
              <span className="text-cyan-400">experience</span> - Show work experience
            </p>
            <p>
              <span className="text-cyan-400">education</span> - Show educational background
            </p>
            <p> - Show educational background</p>
            <p>
              <span className="text-cyan-400">clear</span> - Clear the terminal
            </p>
            <p>
              <span className="text-cyan-400">exit</span> - Exit terminal mode
            </p>
            <p>
              <span className="text-cyan-400">[anything else]</span> - Ask the AI assistant
            </p>
          </div>
        )
      } else if (command.toLowerCase() === "about") {
        output = (
          <div className="space-y-2">
            <p className="text-green-400 font-bold">Kaung Sithu Linn</p>
            <p>Software Developer specializing in POS systems, fraud detection, and behavioral biometrics.</p>
            <p>
              Results-driven developer with 4+ years of experience crafting intuitive user interfaces, conducting
              thorough testing, and delivering high-quality applications that meet complex requirements.
            </p>
          </div>
        )
      } else if (command.toLowerCase() === "skills") {
        output = (
          <div className="grid grid-cols-2 gap-2">
            <div>
              <p className="text-yellow-400 font-bold">Frontend</p>
              <ul className="list-disc list-inside">
                <li>JavaScript</li>
                <li>HTML5</li>
                <li>CSS</li>
                <li>UI Design</li>
              </ul>
            </div>
            <div>
              <p className="text-green-400 font-bold">Backend</p>
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
              <p className="text-blue-400 font-bold">AI/ML</p>
              <ul className="list-disc list-inside">
                <li>Behavioral Biometrics</li>
                <li>Deep Learning</li>
              </ul>
            </div>
          </div>
        )
      } else if (command.toLowerCase() === "projects") {
        output = (
          <div className="space-y-3">
            <div>
              <p className="text-blue-400 font-bold">Mouse Dynamics for Online Assessment Fraud Detection</p>
              <p>
                Developed a machine learning model to detect fraudulent behavior during online assessments using mouse
                dynamics as a behavioral biometric.
              </p>
            </div>
            <div>
              <p className="text-purple-400 font-bold">
                Mouse Dynamics Biometric Fraud Detection System using Deep Learning
              </p>
              <p>
                Developed a fraud detection system using mouse dynamics and deep learning to enhance the security of
                online assessments.
              </p>
            </div>
            <div>
              <p className="text-green-400 font-bold">Continuous Authentication with Behavioral Biometrics</p>
              <p>
                Conducted a literature review on the use of behavioral biometrics, specifically mouse dynamics and
                keystroke analysis, for continuous user authentication.
              </p>
            </div>
          </div>
        )
      } else if (command.toLowerCase() === "contact") {
        output = (
          <div className="space-y-2">
            <p>
              <span className="text-cyan-400">Email:</span> kaungsithulinn1@gmail.com
            </p>
            <p>
              <span className="text-cyan-400">Phone:</span> +65 8460 6093
            </p>
            <p>
              <span className="text-cyan-400">Address:</span> Block 124 # 14-2923 Paya Lebar Way, Singapore 381124
            </p>
            <p>
              <span className="text-cyan-400">GitHub:</span>{" "}
              <a href="https://github.com/KaungSithuLinn" className="text-blue-400 hover:underline">
                github.com/KaungSithuLinn
              </a>
            </p>
            <p>
              <span className="text-cyan-400">LinkedIn:</span>{" "}
              <a href="https://linkedin.com/in/kaung-sithu-linn-7933781a5" className="text-blue-400 hover:underline">
                linkedin.com/in/kaung-sithu-linn-7933781a5
              </a>
            </p>
          </div>
        )
      } else if (command.toLowerCase() === "experience") {
        output = (
          <div className="space-y-3">
            <div>
              <p className="text-green-400 font-bold">eVolva Software House</p>
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
      } else if (command.toLowerCase() === "education") {
        output = (
          <div className="space-y-3">
            <div>
              <p className="text-purple-400 font-bold">Master of Information Technology (Business Informatics)</p>
              <p className="text-gray-400">James Cook University Singapore | Mar 2024 – Apr 2025</p>
            </div>
            <div>
              <p className="text-blue-400 font-bold">Bachelor of Information Technology</p>
              <p className="text-gray-400">James Cook University Singapore | Nov 2022 – Feb 2024</p>
            </div>
            <div>
              <p className="text-green-400 font-bold">Higher National Diploma of Software Engineering (Level 5)</p>
              <p className="text-gray-400">INET IT ACADEMY | Mar 2018 – Oct 2022</p>
            </div>
          </div>
        )
      } else if (command.toLowerCase() === "clear") {
        setHistory(INITIAL_MESSAGES)
        setIsProcessing(false)
        return
      } else if (command.toLowerCase() === "exit") {
        output = "Exiting terminal mode..."
        // Add logic to exit terminal mode
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
        } catch (error) {
          console.error("Error generating AI response:", error)
          output = "Sorry, I couldn't process that request. Please try again or type 'help' for available commands."
        }
      }

      setHistory((prev) => {
        const newHistory = [...prev]
        const lastIndex = newHistory.length - 1
        newHistory[lastIndex] = { command, output, isProcessing: false }
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
