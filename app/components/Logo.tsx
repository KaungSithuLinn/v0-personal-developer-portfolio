"use client"

import { motion, useReducedMotion } from "framer-motion"
import { memo } from "react"

interface LogoProps {
  size?: number
  className?: string
}

const LogoComponent = ({ size = 40, className = "" }: LogoProps) => {
  const shouldReduceMotion = useReducedMotion()

  return (
    <motion.div
      className={`relative flex items-center justify-center ${className}`}
      style={{ width: size, height: size }}
      whileHover={shouldReduceMotion ? undefined : { scale: 1.1 }}
      whileTap={shouldReduceMotion ? undefined : { scale: 0.95 }}
      aria-label="Kaung Sithu Linn - Portfolio Logo"
      role="img"
    >
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-lg"
        initial={{ rotate: 0 }}
        animate={shouldReduceMotion ? { rotate: 0 } : { rotate: 360 }}
        transition={shouldReduceMotion ? { duration: 0 } : { duration: 20, repeat: Infinity, ease: "linear" }}
        style={{ opacity: 0.8 }}
      />
      <div className="absolute inset-1 bg-white dark:bg-gray-900 rounded-lg flex items-center justify-center">
        <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-teal-600 to-cyan-600">
          KSTL
        </span>
      </div>
    </motion.div>
  )
}

export default memo(LogoComponent)