"use client"

import { motion } from "framer-motion"

interface LogoProps {
  size?: number
  className?: string
}

export default function Logo({ size = 40, className = "" }: LogoProps) {
  return (
    <motion.div
      className={`relative flex items-center justify-center ${className}`}
      style={{ width: size, height: size }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
    >
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg"
        initial={{ rotate: 0 }}
        animate={{ rotate: 360 }}
        transition={{ duration: 20, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
        style={{ opacity: 0.8 }}
      />
      <div className="absolute inset-1 bg-white dark:bg-gray-900 rounded-lg flex items-center justify-center">
        <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
          KSTL
        </span>
      </div>
    </motion.div>
  )
}

