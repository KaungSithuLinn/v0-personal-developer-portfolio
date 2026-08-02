"use client"

import React, { useEffect, useRef, useState } from "react"
import type { ReactNode, JSX } from "react"

export function useMounted(): boolean {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    return () => setMounted(false)
  }, [])

  return mounted
}

export function useMountedEffect(effect: () => void | (() => void), deps: any[] = []) {
  const mounted = useMounted()
  const hasRunRef = useRef(false)
  const effectRef = useRef(effect)
  effectRef.current = effect

  useEffect(() => {
    if (mounted && !hasRunRef.current) {
      hasRunRef.current = true
      return effectRef.current()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mounted, ...deps])
}

export function useDelayedMount(delay = 100) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), delay)
    return () => clearTimeout(timer)
  }, [delay])

  return mounted
}

interface MountedProps {
  children: ReactNode
  fallback?: ReactNode
}

export function ClientOnly({ children, fallback = null }: MountedProps): JSX.Element {
  const mounted = useMounted()
  return React.createElement(React.Fragment, null, mounted ? children : fallback)
}

export function WithMountTransition({ children, fallback = null }: MountedProps): JSX.Element {
  const mounted = useDelayedMount()
  
  if (!mounted) {
    return React.createElement(React.Fragment, null, fallback)
  }

  return React.createElement(
    'div',
    {
      className: "transition-opacity duration-300",
      style: { opacity: mounted ? 1 : 0 }
    },
    children
  )
}
