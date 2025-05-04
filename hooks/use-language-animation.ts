"use client"

import { useTranslation } from "@/context/language-utils"
import { useCallback, useEffect, useRef, useState } from "react"

interface AnimationConfig {
  duration?: number
  delay?: number
  easing?: string
  slide?: "left" | "right" | "up" | "down"
  fade?: boolean
  scale?: boolean
  rotate?: number
}

interface AnimationResult {
  ref: React.RefObject<HTMLElement | null>
  style: React.CSSProperties
  className: string
  isAnimating: boolean
  replay: () => void
}

export function useLanguageAnimation(config: AnimationConfig = {}): AnimationResult {
  const { isRTL } = useTranslation()
  const ref = useRef<HTMLElement>(null)
  const [isAnimating, setIsAnimating] = useState(false)
  const [key, setKey] = useState(0)

  const {
    duration = 500,
    delay = 0,
    easing = "cubic-bezier(0.4, 0, 0.2, 1)",
    slide,
    fade = false,
    scale = false,
    rotate,
  } = config

  // Adjust slide direction for RTL layouts
  const getSlideTransform = useCallback(() => {
    if (!slide) return ""
    
    const directions = {
      left: isRTL ? "100%" : "-100%",
      right: isRTL ? "-100%" : "100%",
      up: "-100%",
      down: "100%",
    }

    const axis = slide === "up" || slide === "down" ? "Y" : "X"
    return `translate${axis}(${directions[slide]})`
  }, [slide, isRTL])

  // Generate transform string
  const getTransform = useCallback(() => {
    const transforms: string[] = []

    if (slide) transforms.push(getSlideTransform())
    if (scale) transforms.push("scale(0.95)")
    if (typeof rotate === "number") {
      // Adjust rotation direction for RTL
      const adjustedRotate = isRTL ? -rotate : rotate
      transforms.push(`rotate(${adjustedRotate}deg)`)
    }

    return transforms.join(" ")
  }, [getSlideTransform, scale, rotate, isRTL])

  // Animation styles
  const style: React.CSSProperties = {
    opacity: fade ? 0 : 1,
    transform: getTransform(),
    transition: `transform ${duration}ms ${easing} ${delay}ms, opacity ${duration}ms ${easing} ${delay}ms`,
  }

  // Start animation
  useEffect(() => {
    if (!ref.current) return

    const element = ref.current
    setIsAnimating(true)

    const timeoutId = setTimeout(() => {
      if (element) {
        element.style.opacity = "1"
        element.style.transform = "none"
      }
    }, 50)

    const cleanupId = setTimeout(() => {
      setIsAnimating(false)
    }, duration + delay)

    return () => {
      clearTimeout(timeoutId)
      clearTimeout(cleanupId)
    }
  }, [duration, delay, key])

  // Function to replay animation
  const replay = useCallback(() => {
    setKey(prev => prev + 1)
  }, [])

  return {
    ref,
    style,
    className: `language-animation-${key}`,
    isAnimating,
    replay,
  }
}

// Preset animations
export const slideIn = (direction: "left" | "right" | "up" | "down"): AnimationConfig => ({
  slide: direction,
  fade: true,
  duration: 500,
})

export const fadeIn: AnimationConfig = {
  fade: true,
  duration: 500,
}

export const scaleIn: AnimationConfig = {
  scale: true,
  fade: true,
  duration: 500,
}

export const rotateIn = (degrees = 360): AnimationConfig => ({
  rotate: degrees,
  fade: true,
  scale: true,
  duration: 700,
})
