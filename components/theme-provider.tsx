"use client"

import { ThemeProvider as NextThemesProvider } from "next-themes"
import type { ThemeProviderProps } from "next-themes"
import { useSyncExternalStore } from "react"

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  // Add this to prevent hydration mismatch
  const mounted = useSyncExternalStore(() => () => {}, () => true, () => false)

  // Only render the children when mounted on the client
  if (!mounted) {
    return <>{children}</>
  }

  return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}
