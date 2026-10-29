"use client"

import { useReducedMotion } from "framer-motion"

export default function AuthBackground() {
  const shouldReduceMotion = useReducedMotion()

  return (
    <div className="fixed inset-0 -z-10" aria-hidden="true">
      <div className="absolute top-0 left-0 w-96 h-96 bg-orange-500/10 rounded-full blur-[120px] -translate-x-24 -translate-y-24" />
      <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-[120px] translate-x-24 -translate-y-24" />
      <div className="absolute bottom-0 left-1/2 w-80 h-80 bg-purple-500/8 rounded-full blur-[100px] translate-x-[-50%] translate-y-24" />
      {!shouldReduceMotion && (
        <>
          <div className="absolute top-1/3 left-1/4 w-64 h-64 bg-orange-500/5 rounded-full blur-[80px] animate-pulse" />
          <div className="absolute bottom-1/3 right-1/4 w-64 h-64 bg-purple-500/5 rounded-full blur-[80px] animate-pulse" />
        </>
      )}
    </div>
  )
}
