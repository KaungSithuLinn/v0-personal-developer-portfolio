"use client"

import { useEffect } from "react"
import { useSeasonalTheme } from "@/hooks/use-seasonal-theme"

export default function SeasonalClassApplier() {
  const { isHalloween } = useSeasonalTheme()

  useEffect(() => {
    if (typeof document === "undefined") return

    if (isHalloween) {
      document.documentElement.classList.add("halloween")
    } else {
      document.documentElement.classList.remove("halloween")
    }
  }, [isHalloween])

  return null
}
