"use client"

import { useEffect, useRef } from "react"
import { useTranslation } from "@/context/language-utils"

interface ScreenReaderAnnouncerProps {
  message?: string
  assertive?: boolean
  clearOnUnmount?: boolean
}

export function ScreenReaderAnnouncer({
  message,
  assertive = false,
  clearOnUnmount = true,
}: ScreenReaderAnnouncerProps) {
  const { language, isRTL } = useTranslation()
  const announcerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (message && announcerRef.current) {
      // Clear existing content first
      announcerRef.current.textContent = ""
      
      // Force a reflow to ensure the change is announced
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      announcerRef.current.offsetHeight
      
      // Set the new message
      announcerRef.current.textContent = message
    }
  }, [message])

  useEffect(() => {
    return () => {
      if (clearOnUnmount && announcerRef.current) {
        announcerRef.current.textContent = ""
      }
    }
  }, [clearOnUnmount])

  return (
    <div
      ref={announcerRef}
      role="status"
      aria-live={assertive === true ? "assertive" : "polite"}
      aria-atomic="true"
      className="sr-only"
      lang={language}
      dir={isRTL ? "rtl" : "ltr"}
    />
  )
}

// Utility hook for screen reader announcements
export function useScreenReader() {
  const { t } = useTranslation()

  const announce = (message: string, assertive = false) => {
    // Create a temporary announcer element
    const announcer = document.createElement("div")
    announcer.setAttribute("role", "status")
    announcer.setAttribute("aria-live", assertive ? "assertive" : "polite")
    announcer.setAttribute("aria-atomic", "true")
    announcer.className = "sr-only"
    
    document.body.appendChild(announcer)
    
    // Force a reflow
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    announcer.offsetHeight
    
    // Set the message
    announcer.textContent = message
    
    // Remove the announcer after a delay
    setTimeout(() => {
      document.body.removeChild(announcer)
    }, 3000)
  }

  const announceLanguageChange = (newLanguage: string) => {
    announce(t("common.languageChanged", { language: newLanguage }), true)
  }

  const announceNavigation = (section: string) => {
    announce(t("common.navigatedTo", { section }))
  }

  const announceLoadingState = (isLoading: boolean) => {
    announce(isLoading ? t("common.loading") : t("common.loaded"))
  }

  return {
    announce,
    announceLanguageChange,
    announceNavigation,
    announceLoadingState,
  }
}