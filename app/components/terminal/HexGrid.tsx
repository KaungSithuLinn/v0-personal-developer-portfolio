"use client"

import { useEffect, useRef, useState } from "react"
import { motion } from "framer-motion"
import { useMounted } from "@/lib/use-mounted"

interface HexGridProps {
  className?: string
}

export default function HexGrid({ className = "" }: HexGridProps): JSX.Element | null {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [dimensions, setDimensions] = useState<{ width: number; height: number }>({ width: 0, height: 0 })
  const mounted = useMounted()

  useEffect(() => {
    if (!mounted) return

    const handleResize = (): void => {
      if (canvasRef.current && canvasRef.current.parentElement) {
        const { width, height } = canvasRef.current.parentElement.getBoundingClientRect()
        setDimensions({ width, height })
        canvasRef.current.width = width
        canvasRef.current.height = height
      }
    }

    handleResize()
    window.addEventListener("resize", handleResize)

    return () => {
      window.removeEventListener("resize", handleResize)
    }
  }, [mounted])

  useEffect(() => {
    if (!canvasRef.current || dimensions.width === 0) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Clear canvas
    ctx.clearRect(0, 0, dimensions.width, dimensions.height)

    // Hexagon properties
    const hexSize = 15
    const hexHeight = hexSize * 2
    const hexWidth = Math.sqrt(3) * hexSize
    const horizontalSpacing = hexWidth
    const verticalSpacing = hexHeight * 0.75

    // Calculate number of hexagons to fill the canvas
    const columns = Math.ceil(dimensions.width / horizontalSpacing) + 1
    const rows = Math.ceil(dimensions.height / verticalSpacing) + 1

    // Animation loop
    let animationFrameId: number
    let time = 0

    const animate = (): void => {
      time += 0.005

      // Clear canvas
      ctx.clearRect(0, 0, dimensions.width, dimensions.height)

      // Draw hexagons with animated opacity
      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < columns; col++) {
          const x = col * horizontalSpacing + (row % 2 === 0 ? 0 : hexWidth / 2)
          const y = row * verticalSpacing

          // Skip hexagons outside the canvas
          if (x < -hexWidth || x > dimensions.width + hexWidth || y < -hexHeight || y > dimensions.height + hexHeight) {
            continue
          }

          // Generate a semi-random opacity based on position and time
          const noise = Math.sin(x * 0.01 + time) * Math.cos(y * 0.01 + time) * 0.5 + 0.5
          const opacity = 0.05 + noise * 0.15

          // Draw hexagon
          ctx.beginPath()
          for (let i = 0; i < 6; i++) {
            const angle = (Math.PI / 3) * i
            const hx = x + hexSize * Math.cos(angle)
            const hy = y + hexSize * Math.sin(angle)
            if (i === 0) {
              ctx.moveTo(hx, hy)
            } else {
              ctx.lineTo(hx, hy)
            }
          }
          ctx.closePath()

          // Style based on position and time
          const gradient = ctx.createLinearGradient(x - hexSize, y - hexSize, x + hexSize, y + hexSize)
          gradient.addColorStop(0, `rgba(0, 255, 255, ${opacity * 0.7})`) // Cyan
          gradient.addColorStop(1, `rgba(128, 0, 255, ${opacity * 0.7})`) // Purple

          ctx.strokeStyle = gradient
          ctx.lineWidth = 1
          ctx.stroke()
        }
      }

      animationFrameId = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      cancelAnimationFrame(animationFrameId)
    }
  }, [dimensions, mounted])

  if (!mounted) return null

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={`absolute inset-0 z-0 overflow-hidden ${className}`}
    >
      <canvas ref={canvasRef} className="w-full h-full" />
    </motion.div>
  )
}
