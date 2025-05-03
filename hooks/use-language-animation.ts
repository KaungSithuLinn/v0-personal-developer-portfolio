"use client"

import { useEffect, useState } from "react"
import { useTranslation } from "@/context/language-context"

/**
 * Hook to handle animations when language changes
 * @returns Object with animation state and reset function
 */
export function useLanguageAnimation() {
  const { language } = useTranslation()
  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    // Trigger animation when language changes
    setIsAnimating(true)

    // Reset animation after it completes
    const timer = setTimeout(() => {
      setIsAnimating(false)
    }, 300) // Match this with your CSS transition duration

    return () => clearTimeout(timer)
  }, [language])

  // Function to manually reset animation state
  const resetAnimation = () => setIsAnimating(false)

  return { isAnimating, resetAnimation }
}
