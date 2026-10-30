"use client"

import { useReducedMotion } from "framer-motion"
import { useSeasonalTheme } from "@/hooks/use-seasonal-theme"

export default function AuthBackground() {
  const shouldReduceMotion = useReducedMotion()
  const { isHalloween } = useSeasonalTheme()

  return (
    <div className="fixed inset-0 -z-10" aria-hidden="true">
      {isHalloween ? (
        <>
          <div className="absolute top-0 left-0 w-96 h-96 bg-primary/10 rounded-full blur-[120px] -translate-x-24 -translate-y-24" />
          <div className="absolute top-0 right-0 w-96 h-96 bg-accent/10 rounded-full blur-[120px] translate-x-24 -translate-y-24" />
          <div className="absolute bottom-0 left-1/2 w-80 h-80 bg-accent/8 rounded-full blur-[100px] translate-x-[-50%] translate-y-24" />
          {!shouldReduceMotion && (
            <>
              <div className="absolute top-1/3 left-1/4 w-64 h-64 bg-primary/5 rounded-full blur-[80px] animate-pulse" />
              <div className="absolute bottom-1/3 right-1/4 w-64 h-64 bg-accent/5 rounded-full blur-[80px] animate-pulse" />
            </>
          )}
        </>
      ) : (
        <>
          <div className="absolute top-0 left-0 w-96 h-96 bg-primary/10 rounded-full blur-[120px] -translate-x-24 -translate-y-24" />
          <div className="absolute top-0 right-0 w-96 h-96 bg-chart-2/10 rounded-full blur-[120px] translate-x-24 -translate-y-24" />
          <div className="absolute bottom-0 left-1/2 w-80 h-80 bg-chart-2/8 rounded-full blur-[100px] translate-x-[-50%] translate-y-24" />
          {!shouldReduceMotion && (
            <>
              <div className="absolute top-1/3 left-1/4 w-64 h-64 bg-primary/5 rounded-full blur-[80px] animate-pulse" />
              <div className="absolute bottom-1/3 right-1/4 w-64 h-64 bg-chart-2/5 rounded-full blur-[80px] animate-pulse" />
            </>
          )}
        </>
      )}
    </div>
  )
}