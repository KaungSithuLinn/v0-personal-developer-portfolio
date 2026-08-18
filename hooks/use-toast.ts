"use client"

import { useCallback, useState } from "react"

type Toast = {
  id: string
  title?: string
  description?: string
  variant?: "default" | "destructive"
  duration?: number
}

type ToastState = {
  toasts: Toast[]
}

export function useToast() {
  const [state, setState] = useState<ToastState>({ toasts: [] })

  const toast = useCallback(
    (props: Omit<Toast, "id">) => {
      const id = genId()
      const newToast: Toast = { ...props, id }
      setState((prev) => ({
        ...prev,
        toasts: [newToast, ...prev.toasts].slice(0, 4),
      }))
      if (props.duration !== 0) {
        const timeoutId = setTimeout(() => {
          setState((prev) => ({
            ...prev,
            toasts: prev.toasts.filter((t) => t.id !== id),
          }))
        }, props.duration || 3000)
        return { id, dismiss: () => {
          clearTimeout(timeoutId)
          setState((prev) => ({ ...prev, toasts: prev.toasts.filter((t) => t.id !== id) }))
        }}
      }
      return { id, dismiss: () => setState((prev) => ({ ...prev, toasts: prev.toasts.filter((t) => t.id !== id) })) }
    },
    [setState]
  )

  const dismiss = useCallback((toastId?: string) => {
    setState((prev) => ({
      ...prev,
      toasts: toastId ? prev.toasts.filter((t) => t.id !== toastId) : [],
    }))
  }, [])

  return {
    ...state,
    toast,
    dismiss,
  }
}

let count = 0

function genId() {
  count = (count + 1) % Number.MAX_SAFE_INTEGER
  return count.toString()
}
