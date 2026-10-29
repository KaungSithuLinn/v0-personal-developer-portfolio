"use client"

import { motion, useReducedMotion } from "framer-motion"
import { useAuth } from "@/hooks/use-auth"

export default function AuthShell({ children }: { children: React.ReactNode }) {
  const { isLoading } = useAuth()
  const shouldReduceMotion = useReducedMotion()

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <span className="flex items-center gap-2 text-muted-foreground">Signing in…</span>
      </div>
    )
  }

  return (
    <motion.div
      initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={shouldReduceMotion ? { duration: 0 } : { duration: 0.4, ease: "easeOut" }}
      className="min-h-screen flex items-center justify-center bg-background"
    >
      {children}
    </motion.div>
  )
}
