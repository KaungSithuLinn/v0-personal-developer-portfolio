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

type ToastAction =
  | { type: "ADD_TOAST"; toast: Toast }
  | { type: "DISMISS_TOAST"; toastId?: string }
  | { type: "REMOVE_TOAST"; toastId: string }

const toastReducer = (state: ToastState, action: ToastAction): ToastState => {
  switch (action.type) {
    case "ADD_TOAST":
      return {
        ...state,
        toasts: [action.toast, ...state.toasts].slice(0, 4),
      }
    case "DISMISS_TOAST":
      return {
        ...state,
        toasts: state.toasts.filter((t) => t.id !== action.toastId),
      }
    case "REMOVE_TOAST":
      return {
        ...state,
        toasts: state.toasts.filter((t) => t.id !== action.toastId),
      }
    default:
      return state
  }
}

let count = 0

function genId() {
  count = (count + 1) % Number.MAX_SAFE_INTEGER
  return count.toString()
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
        setTimeout(() => {
          setState((prev) => ({
            ...prev,
            toasts: prev.toasts.filter((t) => t.id !== id),
          }))
        }, props.duration || 3000)
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

export { toastReducer }
