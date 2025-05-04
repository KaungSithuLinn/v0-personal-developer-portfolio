"use client"

import { useEffect, useRef, useState } from "react"

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

  useEffect(() => {
    if (mounted && !hasRunRef.current) {
      hasRunRef.current = true
      return effect()
    }
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
  children: React.ReactNode
  fallback?: React.ReactNode
}

export function ClientOnly({ children, fallback = null }: MountedProps) {
  const mounted = useMounted()
  return mounted ? <>{children}</> : <>{fallback}</>
}

export function WithMountTransition({ children, fallback = null }: MountedProps) {
  const mounted = useDelayedMount()
  
  if (!mounted) return <>{fallback}</>

  return (
    <div
      className="transition-opacity duration-300"
      style={{ opacity: mounted ? 1 : 0 }}
    >
      {children}
    </div>
  )
}
