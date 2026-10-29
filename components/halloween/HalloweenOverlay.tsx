"use client"

import { motion, useReducedMotion } from "framer-motion"
import { useSeasonalTheme } from "@/hooks/use-seasonal-theme"

const EYES = [
  { x: -14, y: -56, delay: 0 },
  { x: 112, y: -40, delay: 0.7 },
  { x: -42, y: 96, delay: 0.35 },
]

export default function HalloweenOverlay() {
  const { isHalloween } = useSeasonalTheme()
  const shouldReduceMotion = useReducedMotion()

  if (!isHalloween) return null

  return (
    <div className="fixed inset-0 pointer-events-none z-[35]" aria-hidden="true">
      <div className="absolute top-0 left-0 w-16 h-16 border-t-2 border-l-2 border-orange-500/30" />
      <div className="absolute top-0 right-0 w-16 h-16 border-t-2 border-r-2 border-purple-500/30" />
      <div className="absolute bottom-0 left-0 w-16 h-16 border-b-2 border-l-2 border-purple-500/30" />
      <div className="absolute bottom-0 right-0 w-16 h-16 border-b-2 border-r-2 border-orange-500/30" />

      <div className="absolute top-1/4 left-[-8%] w-48 h-48 rounded-full bg-orange-500/10 blur-3xl -z-10" />
      <div className="absolute bottom-1/4 right-[-8%] w-48 h-48 rounded-full bg-purple-500/10 blur-3xl -z-10" />

      {!shouldReduceMotion && (
        <>
          {EYES.map((eye, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 rounded-full bg-orange-400/90 shadow-[0_0_10px_rgba(249,115,22,0.95)]"
              style={{ left: `calc(50% + ${eye.x}px)`, top: `calc(50% + ${eye.y}px)` }}
              animate={{ y: [eye.y, eye.y - 10, eye.y], x: [eye.x, eye.x + 6, eye.x] }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
                delay: eye.delay,
              }}
            />
          ))}
        </>
      )}
    </div>
  )
}
