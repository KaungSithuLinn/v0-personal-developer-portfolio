"use client"

import { useEffect, useRef, useState } from "react"

type ChatMessage = { id: string; role: "user" | "assistant"; content: string }

export function AiAssistantWidget() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const abortRef = useRef<AbortController | null>(null)
  const inputRef = useRef<HTMLInputElement | null>(null)
  const panelRef = useRef<HTMLDivElement | null>(null)
  const triggerRef = useRef<HTMLButtonElement | null>(null)

  useEffect(() => {
    if (open) inputRef.current?.focus()
  }, [open])

  useEffect(() => {
    if (!open) return
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault()
        handleClose()
        return
      }

      if (event.key !== "Tab") return
      const dialog = panelRef.current
      if (!dialog) return
      const focusable = dialog.querySelectorAll<HTMLElement>(
        'button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])'
      )
      if (focusable.length === 0) return
      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }
    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [open])

  useEffect(() => {
    return () => abortRef.current?.abort()
  }, [])

  async function run(messagesToSend: ChatMessage[]) {
    abortRef.current?.abort()
    const controller = new AbortController()
    abortRef.current = controller
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: messagesToSend }),
        signal: controller.signal,
      })
      if (!response.ok || !response.body) throw new Error("Request failed")

      const reader = response.body.getReader()
      const decoder = new TextDecoder()
      let assistantText = ""
      const assistantId = crypto.randomUUID()
      setMessages((prev) => [...prev, { id: assistantId, role: "assistant", content: "" }])

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        assistantText += decoder.decode(value, { stream: true })
        setMessages((prev) =>
          prev.map((message) =>
            message.id === assistantId ? { ...message, content: assistantText } : message
          )
        )
      }
    } catch (caught) {
      if (caught instanceof DOMException && caught.name === "AbortError") return
      setError("Sorry, something went wrong.")
      setMessages((prev) => [
        ...prev,
        { id: crypto.randomUUID(), role: "assistant", content: "Sorry, something went wrong." },
      ])
    } finally {
      setIsLoading(false)
      abortRef.current = null
    }
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    const text = input.trim()
    if (!text || isLoading) return

    const userMessage: ChatMessage = { id: crypto.randomUUID(), role: "user", content: text }
    const nextMessages = [...messages, userMessage]
    setMessages(nextMessages)
    setInput("")
    await run(nextMessages)
  }

  function handleRetry() {
    const lastUserMessage = [...messages].reverse().find((message) => message.role === "user")
    if (!lastUserMessage || isLoading) return
    const retryMessages = messages.filter((message) => message.id !== lastUserMessage.id)
    setMessages(retryMessages)
    void run([...retryMessages, lastUserMessage])
  }

  function handleStop() {
    abortRef.current?.abort()
  }

  function handleClose() {
    abortRef.current?.abort()
    setOpen(false)
    triggerRef.current?.focus()
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {open ? (
        <div
          ref={panelRef}
          role="dialog"
          aria-modal="true"
          aria-label="AI assistant"
          className="w-[min(92vw,360px)] rounded-2xl border border-border bg-card/95 p-4 shadow-lg backdrop-blur-sm"
        >
          <div className="mb-3 flex items-center justify-between">
            <span className="text-sm font-medium">Ask about my work</span>
            <button
              type="button"
              onClick={handleClose}
              className="text-xs text-muted-foreground hover:text-foreground"
              aria-label="Close assistant"
            >
              Close
            </button>
          </div>
          <div
            className="mb-3 max-h-64 space-y-2 overflow-y-auto text-sm"
            aria-live="polite"
            aria-busy={isLoading}
          >
            {messages.map((message) => (
              <div
                key={message.id}
                className={message.role === "user" ? "text-right" : "text-left"}
              >
                <span className="inline-block rounded-lg bg-muted px-3 py-2 whitespace-pre-wrap break-words">
                  {message.content}
                </span>
              </div>
            ))}
            {isLoading ? <p className="text-xs text-muted-foreground">Thinking...</p> : null}
            {error ? (
              <button
                type="button"
                onClick={handleRetry}
                className="text-xs text-primary hover:underline"
              >
                Retry
              </button>
            ) : null}
          </div>
          <form onSubmit={handleSubmit} className="flex gap-2">
            <input
              ref={inputRef}
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder="Ask a question"
              className="flex-1 rounded-md border border-border bg-background px-3 py-2 text-sm"
              aria-label="Chat input"
            />
            {isLoading ? (
              <button
                type="button"
                onClick={handleStop}
                className="rounded-md border border-border px-3 py-2 text-sm"
              >
                Stop
              </button>
            ) : (
              <button
                type="submit"
                className="rounded-md bg-primary px-3 py-2 text-sm text-primary-foreground"
              >
                Send
              </button>
            )}
          </form>
        </div>
      ) : (
        <button
          ref={triggerRef}
          type="button"
          onClick={() => setOpen(true)}
          className="rounded-full bg-primary px-4 py-2 text-sm text-primary-foreground shadow-lg"
          aria-label="Open assistant"
        >
          Ask me
        </button>
      )}
    </div>
  )
}