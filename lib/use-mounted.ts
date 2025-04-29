"use client"

import { useEffect, useState } from "react"

/**
 * Custom hook to check if component is mounted
 * Useful for preventing hydration errors
 * @returns boolean indicating if component is mounted
 */
export function useMounted(): boolean {
  const [mounted, setMounted] = useState<boolean>(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return mounted
}
