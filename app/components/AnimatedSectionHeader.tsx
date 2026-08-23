"use client"

import { motion, useReducedMotion } from "framer-motion"
import { memo } from "react"

interface AnimatedSectionHeaderProps {
  title: string
  eyebrow?: string
}

const AnimatedSectionHeaderComponent = ({ title, eyebrow }: AnimatedSectionHeaderProps) => {
  const shouldReduceMotion = useReducedMotion()

  return (
    <div className="text-center mb-12">
      {eyebrow && (
        <motion.span
          className="inline-block text-xs font-semibold uppercase tracking-widest text-teal-600 dark:text-teal-400 mb-3"
          initial={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
          whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={shouldReduceMotion ? undefined : { once: true }}
          transition={shouldReduceMotion ? { duration: 0 } : { duration: 0.4 }}
        >
          {eyebrow}
        </motion.span>
      )}
      <motion.h2
        className="text-3xl sm:text-4xl font-bold text-foreground relative inline-block"
        initial={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
        whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
        viewport={shouldReduceMotion ? undefined : { once: true, margin: "-50px" }}
        transition={shouldReduceMotion ? { duration: 0 } : { duration: 0.5 }}
      >
        {title}
        <motion.span
          className="absolute -bottom-2 left-1/2 -translate-x-1/2 h-1 bg-gradient-to-r from-teal-500 to-blue-600 rounded-full"
          initial={shouldReduceMotion ? { width: "4rem" } : { width: 0 }}
          whileInView={shouldReduceMotion ? undefined : { width: "4rem" }}
          viewport={shouldReduceMotion ? undefined : { once: true }}
          transition={shouldReduceMotion ? { duration: 0 } : { duration: 0.6, delay: 0.2 }}
        />
      </motion.h2>
    </div>
  )
}

export default memo(AnimatedSectionHeaderComponent)