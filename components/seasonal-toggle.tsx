"use client"

import { useSeasonalTheme } from "@/hooks/use-seasonal-theme"
import { useScreenReader } from "@/components/ScreenReaderAnnouncer"
import { useTranslation } from "@/context/language-utils"
import { Moon } from "lucide-react"

export default function SeasonalToggle() {
  const { isHalloween, setHalloween } = useSeasonalTheme()
  const { announce } = useScreenReader()
  const { t } = useTranslation()

  const handleClick = () => {
    const next = isHalloween ? "off" : "on"
    setHalloween(next)
    announce(next === "on" ? t("common.halloweenEnabled") : t("common.halloweenDisabled"))
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-pressed={isHalloween}
      aria-label={isHalloween ? t("common.disableHalloween") : t("common.enableHalloween")}
      className={`flex items-center justify-center w-11 h-11 rounded-full border transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background ${
        isHalloween
          ? "bg-orange-500/20 text-orange-400 border-orange-500/40 hover:bg-orange-500/30"
          : "bg-slate-900/70 text-white border-teal-500/30 hover:border-teal-400"
      }`}
    >
      <Moon size={16} aria-hidden="true" />
    </button>
  )
}
