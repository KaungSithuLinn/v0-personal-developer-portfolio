"use client"

import { useCallback, useEffect, useState } from "react"
import { useTranslation } from "@/context/language-utils"

interface TextDirectionOptions {
  allowMixed?: boolean // Whether to allow mixed LTR/RTL content
  defaultDirection?: "ltr" | "rtl" // Default direction if no strong direction is detected
  forceDirection?: boolean // Whether to force the detected direction
}

// Unicode ranges for RTL scripts
const RTL_RANGES = [
  [0x0590, 0x05FF], // Hebrew
  [0x0600, 0x06FF], // Arabic
  [0x0750, 0x077F], // Arabic Supplement
  [0x08A0, 0x08FF], // Arabic Extended-A
  [0xFB50, 0xFDFF], // Arabic Presentation Forms-A
  [0xFE70, 0xFEFF], // Arabic Presentation Forms-B
]

// Check if a character is RTL
function isRTLCharacter(char: string): boolean {
  const code = char.charCodeAt(0)
  return RTL_RANGES.some(([start, end]) => code >= start && code <= end)
}

// Count RTL/LTR characters in text
function getDirectionalCharCount(text: string): { rtl: number; ltr: number } {
  return text.split("").reduce(
    (acc, char) => {
      if (isRTLCharacter(char)) {
        acc.rtl++
      } else if (/[\p{Letter}]/u.test(char)) {
        acc.ltr++
      }
      return acc
    },
    { rtl: 0, ltr: 0 }
  )
}

export function useTextDirection(
  text: string,
  options: TextDirectionOptions = {}
): {
  direction: "ltr" | "rtl"
  isMixed: boolean
  hasRTL: boolean
  updateDirection: (newText: string) => void
} {
  const { isRTL } = useTranslation()
  const {
    allowMixed = false,
    defaultDirection = isRTL ? "rtl" : "ltr",
    forceDirection = false,
  } = options

  const [direction, setDirection] = useState<"ltr" | "rtl">(defaultDirection)
  const [isMixed, setIsMixed] = useState(false)
  const [hasRTL, setHasRTL] = useState(false)

  const detectTextDirection = useCallback(
    (content: string) => {
      if (forceDirection) {
        return defaultDirection
      }

      const { rtl, ltr } = getDirectionalCharCount(content)
      const hasMixedContent = rtl > 0 && ltr > 0
      
      setHasRTL(rtl > 0)
      setIsMixed(hasMixedContent)

      if (!content.trim()) {
        return defaultDirection
      }

      if (allowMixed && hasMixedContent) {
        return rtl > ltr ? "rtl" : "ltr"
      }

      return rtl > 0 ? "rtl" : "ltr"
    },
    [allowMixed, defaultDirection, forceDirection]
  )

  const updateDirection = useCallback(
    (newText: string) => {
      const newDirection = detectTextDirection(newText)
      setDirection(newDirection)
    },
    [detectTextDirection]
  )

  useEffect(() => {
    updateDirection(text)
  }, [text, updateDirection])

  return {
    direction,
    isMixed,
    hasRTL,
    updateDirection,
  }
}

// CSS-in-JS helper for bidirectional text
export function getBiDiStyles(direction: "ltr" | "rtl", isMixed: boolean) {
  return {
    direction,
    textAlign: direction === "rtl" ? "right" : "left",
    unicodeBidi: isMixed ? "embed" : "normal",
  } as const
}

// Utility function to wrap text segments
export function wrapTextSegments(text: string): { dir: 'ltr' | 'rtl'; content: string }[] {
  const segments: { dir: 'ltr' | 'rtl'; content: string }[] = []
  let currentSegment = ""
  let currentDirection: "ltr" | "rtl" | null = null

  for (let i = 0; i < text.length; i++) {
    const char = text[i]
    const isRTL = isRTLCharacter(char)
    const direction = isRTL ? "rtl" : "ltr"

    if (currentDirection === null) {
      currentDirection = direction
    }

    if (direction === currentDirection) {
      currentSegment += char
    } else {
      segments.push({
        dir: currentDirection,
        content: currentSegment
      })
      currentSegment = char
      currentDirection = direction
    }
  }

  if (currentSegment) {
    segments.push({
      dir: currentDirection!,
      content: currentSegment
    })
  }

  return segments
}