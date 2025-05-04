interface ScrollOptions {
  offset?: number
  duration?: number
  direction?: "ltr" | "rtl"
}

export function smoothScroll(
  element: HTMLElement | null,
  options: ScrollOptions = {}
): Promise<void> {
  return new Promise((resolve) => {
    if (!element) {
      resolve()
      return
    }

    const {
      offset = 0,
      duration = 500,
      direction = document.documentElement.dir as "ltr" | "rtl",
    } = options

    const startPosition = window.scrollY
    const targetPosition = element.getBoundingClientRect().top + window.scrollY - offset
    
    // For RTL layouts, we might need to adjust horizontal scroll
    const startX = window.scrollX
    const targetX = direction === "rtl" 
      ? element.getBoundingClientRect().right + window.scrollX
      : element.getBoundingClientRect().left + window.scrollX

    const startTime = performance.now()

    function easeInOutQuad(t: number): number {
      return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t
    }

    function animate(currentTime: number) {
      const elapsedTime = currentTime - startTime
      const progress = Math.min(elapsedTime / duration, 1)
      const easeProgress = easeInOutQuad(progress)

      const currentY = startPosition + (targetPosition - startPosition) * easeProgress
      const currentX = startX + (targetX - startX) * easeProgress

      window.scrollTo({
        left: currentX,
        top: currentY,
      })

      if (progress < 1) {
        requestAnimationFrame(animate)
      } else {
        // Ensure we hit the exact target
        window.scrollTo({
          left: targetX,
          top: targetPosition,
        })
        resolve()
      }
    }

    requestAnimationFrame(animate)
  })
}

export function scrollToSection(
  sectionId: string,
  options?: ScrollOptions
): Promise<void> {
  const section = document.getElementById(sectionId)
  return smoothScroll(section, options)
}

export function scrollToTop(options?: ScrollOptions): Promise<void> {
  const duration = options?.duration || 500
  return new Promise((resolve) => {
    const startPosition = window.scrollY
    const startTime = performance.now()

    function animate(currentTime: number) {
      const elapsedTime = currentTime - startTime
      const progress = Math.min(elapsedTime / duration, 1)
      const easeProgress = easeInOutQuad(progress)

      window.scrollTo(0, startPosition * (1 - easeProgress))

      if (progress < 1) {
        requestAnimationFrame(animate)
      } else {
        window.scrollTo(0, 0)
        resolve()
      }
    }

    function easeInOutQuad(t: number): number {
      return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t
    }

    requestAnimationFrame(animate)
  })
}

export function isInViewport(element: HTMLElement): boolean {
  const rect = element.getBoundingClientRect()
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  )
}
