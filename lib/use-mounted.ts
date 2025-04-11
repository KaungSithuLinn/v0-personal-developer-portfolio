"use client"

import { useEffect, useState } from "react"

/**
 * Custom hook to check if component is mounted
 * Useful for preventing hydration errors
 */
export function useMounted() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return mounted
}
