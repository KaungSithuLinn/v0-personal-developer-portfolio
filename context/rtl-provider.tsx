"use client"

import { ReactNode } from "react"
import { useTranslation } from "./language-utils"
import { isRTL } from "@/lib/rtl-utils"

interface RTLProviderProps {
  children: ReactNode
  defaultRTL?: boolean
}

export function RTLProvider({ children, defaultRTL = false }: RTLProviderProps) {
  const { language } = useTranslation()
  const isRTLValue = isRTL(language)
  
  return (
    <div dir={isRTLValue ? "rtl" : "ltr"} className="h-full">
      {children}
    </div>
  )
}