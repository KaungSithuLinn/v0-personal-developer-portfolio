"use client"

import { useCallback, useEffect, useRef } from "react"
import { useTranslation } from "@/context/language-utils"

interface KeyboardNavigationOptions {
  isRTL?: boolean
  trapFocus?: boolean
  arrowKeyNavigation?: boolean
  homeEndNavigation?: boolean
  pageNavigation?: boolean
  tabNavigation?: boolean
  enterActivation?: boolean
  spaceActivation?: boolean
  escDismissal?: boolean
}

export function useKeyboardNavigation<T extends HTMLElement>(
  options: KeyboardNavigationOptions = {}
) {
  const ref = useRef<T>(null)
  const { isRTL } = useTranslation()
  
  const {
    trapFocus = false,
    arrowKeyNavigation = true,
    homeEndNavigation = true,
    pageNavigation = false,
    tabNavigation = true,
    enterActivation = true,
    spaceActivation = true,
    escDismissal = false,
  } = options

  // Get all focusable elements within the container
  const getFocusableElements = useCallback(() => {
    if (!ref.current) return []
    
    return Array.from(
      ref.current.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      )
    ).filter(el => !el.hasAttribute("disabled"))
  }, [])

  // Handle arrow key navigation
  const handleArrowNavigation = useCallback(
    (e: KeyboardEvent) => {
      if (!arrowKeyNavigation) return
      
      const elements = getFocusableElements()
      const currentIndex = elements.indexOf(document.activeElement as HTMLElement)
      let nextIndex: number

      switch (e.key) {
        case "ArrowRight":
          nextIndex = isRTL 
            ? (currentIndex - 1 + elements.length) % elements.length
            : (currentIndex + 1) % elements.length
          break
        case "ArrowLeft":
          nextIndex = isRTL
            ? (currentIndex + 1) % elements.length
            : (currentIndex - 1 + elements.length) % elements.length
          break
        case "ArrowUp":
          nextIndex = (currentIndex - 1 + elements.length) % elements.length
          break
        case "ArrowDown":
          nextIndex = (currentIndex + 1) % elements.length
          break
        default:
          return
      }

      e.preventDefault()
      elements[nextIndex]?.focus()
    },
    [isRTL, arrowKeyNavigation, getFocusableElements]
  )

  // Handle home/end navigation
  const handleHomeEnd = useCallback(
    (e: KeyboardEvent) => {
      if (!homeEndNavigation) return

      const elements = getFocusableElements()
      
      if (e.key === "Home") {
        e.preventDefault()
        elements[0]?.focus()
      } else if (e.key === "End") {
        e.preventDefault()
        elements[elements.length - 1]?.focus()
      }
    },
    [homeEndNavigation, getFocusableElements]
  )

  // Handle page up/down navigation
  const handlePageNavigation = useCallback(
    (e: KeyboardEvent) => {
      if (!pageNavigation) return

      const elements = getFocusableElements()
      const currentIndex = elements.indexOf(document.activeElement as HTMLElement)
      const pageSize = 5 // Number of items to skip
      let nextIndex: number

      if (e.key === "PageUp") {
        nextIndex = Math.max(0, currentIndex - pageSize)
        e.preventDefault()
        elements[nextIndex]?.focus()
      } else if (e.key === "PageDown") {
        nextIndex = Math.min(elements.length - 1, currentIndex + pageSize)
        e.preventDefault()
        elements[nextIndex]?.focus()
      }
    },
    [pageNavigation, getFocusableElements]
  )

  // Handle tab navigation and focus trapping
  const handleTabNavigation = useCallback(
    (e: KeyboardEvent) => {
      if (!tabNavigation) return

      const elements = getFocusableElements()
      if (!elements.length) return

      if (trapFocus) {
        if (e.key === "Tab") {
          const firstElement = elements[0]
          const lastElement = elements[elements.length - 1]
          
          if (e.shiftKey && document.activeElement === firstElement) {
            e.preventDefault()
            lastElement.focus()
          } else if (!e.shiftKey && document.activeElement === lastElement) {
            e.preventDefault()
            firstElement.focus()
          }
        }
      }
    },
    [tabNavigation, trapFocus, getFocusableElements]
  )

  // Handle enter/space activation
  const handleActivation = useCallback(
    (e: KeyboardEvent) => {
      const isEnter = enterActivation && e.key === "Enter"
      const isSpace = spaceActivation && e.key === " "

      if (isEnter || isSpace) {
        const target = e.target as HTMLElement
        if (target.tagName !== "BUTTON" && target.getAttribute("role") !== "button") {
          return
        }
        
        e.preventDefault()
        target.click()
      }
    },
    [enterActivation, spaceActivation]
  )

  // Handle escape dismissal
  const handleEscape = useCallback(
    (e: KeyboardEvent) => {
      if (escDismissal && e.key === "Escape") {
        e.preventDefault()
        ref.current?.querySelector<HTMLElement>('[data-dismiss="true"]')?.click()
      }
    },
    [escDismissal]
  )

  useEffect(() => {
    const element = ref.current
    if (!element) return

    const handleKeyDown = (e: KeyboardEvent) => {
      handleArrowNavigation(e)
      handleHomeEnd(e)
      handlePageNavigation(e)
      handleTabNavigation(e)
      handleActivation(e)
      handleEscape(e)
    }

    element.addEventListener("keydown", handleKeyDown)
    return () => element.removeEventListener("keydown", handleKeyDown)
  }, [
    handleArrowNavigation,
    handleHomeEnd,
    handlePageNavigation,
    handleTabNavigation,
    handleActivation,
    handleEscape,
  ])

  // Initialize focus
  useEffect(() => {
    if (!ref.current) return
    
    const elements = getFocusableElements()
    if (elements.length) {
      const firstFocusable = elements[0]
      firstFocusable.setAttribute("tabindex", "0")
      firstFocusable.focus()
    }
  }, [getFocusableElements])

  return ref
}

// Utility function to get the next focusable element in a specific direction
export function getNextFocusableElement(
  currentElement: HTMLElement,
  direction: "forward" | "backward" = "forward"
): HTMLElement | null {
  const focusableElements = Array.from(
    document.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    )
  ).filter(el => !el.hasAttribute("disabled"))

  const currentIndex = focusableElements.indexOf(currentElement)
  if (currentIndex === -1) return null

  const nextIndex = direction === "forward"
    ? (currentIndex + 1) % focusableElements.length
    : (currentIndex - 1 + focusableElements.length) % focusableElements.length

  return focusableElements[nextIndex]
}

// Utility function to set initial focus in a container
export function setInitialFocus(container: HTMLElement): void {
  const autofocusElement = container.querySelector<HTMLElement>("[autofocus]")
  if (autofocusElement) {
    autofocusElement.focus()
    return
  }

  const firstFocusable = container.querySelector<HTMLElement>(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  )
  if (firstFocusable) {
    firstFocusable.focus()
  }
}