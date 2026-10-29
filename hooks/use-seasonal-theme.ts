"use client"

import { useCallback, useEffect, useState } from "react"
import { useTheme } from "next-themes"
import { isHalloweenWindow, type HalloweenMode } from "@/components/seasonal/theme-detector"

const STORAGE_KEY = "halloween-theme"

export function useSeasonalTheme() {
  const { setTheme } = useTheme()
  const [stored, setStored] = useState<HalloweenMode | null>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw === "on" || raw === "off" || raw === "auto") {
        setStored(raw)
      } else if (isHalloweenWindow()) {
        setStored("auto")
      }
    } catch {
      // localStorage unavailable; fall back to no seasonal theme
    }
  }, [])

  const active =
    mounted &&
    (stored === "on" ||
      (stored === "auto" && isHalloweenWindow()) ||
      (stored === null && isHalloweenWindow()))

  const setHalloween = useCallback(
    (mode: HalloweenMode) => {
      try {
        localStorage.setItem(STORAGE_KEY, mode)
      } catch {
        // ignore storage errors
      }
      setStored(mode)
      if (mode === "on" && typeof setTheme === "function") {
        setTheme("dark")
      }
    },
    [setTheme]
  )

  return { isHalloween: active, setHalloween, mode: stored ?? (isHalloweenWindow() ? "auto" : "off") }
}
