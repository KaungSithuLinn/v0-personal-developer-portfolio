"use client"

import { motion, useReducedMotion } from "framer-motion"
import { memo } from "react"

// Audit P0-2: respect reduced motion preference

interface AnimatedSectionHeaderProps {
  title: string
}

// Audit P0-5: memoized presentational component

const AnimatedSectionHeaderComponent = ({ title }: AnimatedSectionHeaderProps) => {
  const shouldReduceMotion = useReducedMotion()

  return (
    <motion.h2
      className="text-4xl font-bold mb-12 text-center dark:text-white"
      initial={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      animate={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 1, y: 0 }}
      transition={shouldReduceMotion ? { duration: 0 } : { duration: 0.5 }}
    >
      {title}
    </motion.h2>
  )
}

// Audit P0-5: memoized presentational component

export default memo(AnimatedSectionHeaderComponent)
