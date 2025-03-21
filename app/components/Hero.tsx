"use client"

import Image from "next/image"
import { Github, Linkedin, Mail, ArrowDown, ExternalLink, Download, ChevronRight } from "lucide-react"
import { motion } from "framer-motion"
import Logo from "./Logo"

const CodePattern = () => (
  <svg className="absolute inset-0 w-full h-full opacity-5" xmlns="http://www.w3.org/2000/svg">
    <pattern
      id="pattern-circles"
      x="0"
      y="0"
      width="50"
      height="50"
      patternUnits="userSpaceOnUse"
      patternContentUnits="userSpaceOnUse"
    >
      <circle id="pattern-circle" cx="10" cy="10" r="1.6257413380501518" fill="#000"></circle>
    </pattern>
    <rect id="rect" x="0" y="0" width="100%" height="100%" fill="url(#pattern-circles)"></rect>
  </svg>
)

export default function Hero() {
  return (
    <section
      id="hero"
      className="min-h-screen relative overflow-hidden bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-indigo-900 dark:to-purple-900"
    >
      {/* Programming-themed Background */}
      <div className="absolute inset-0 z-0">
        <CodePattern />
      </div>

      {/* Animated Gradient */}
      <div className="absolute inset-0 z-0 opacity-30">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-400 via-indigo-500 to-purple-600 animate-gradient-x"></div>
      </div>

      <div className="container mx-auto px-6 pt-32 pb-20 relative z-10">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
          <motion.div
            className="lg:w-1/2 text-center lg:text-left"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center justify-center lg:justify-start mb-6">
              <Logo size={50} />
              <motion.div
                className="ml-4 h-8 w-1 bg-gradient-to-b from-blue-500 to-purple-500"
                initial={{ height: 0 }}
                animate={{ height: 32 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              />
              <motion.h2
                className="ml-4 text-xl text-gray-600 dark:text-gray-400 italic"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
              >
                Crafting Digital Solutions
              </motion.h2>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">
              Kaung Sithu Linn
            </h1>
            <h2 className="text-2xl md:text-3xl font-semibold mb-6 text-gray-700 dark:text-gray-300">
              Software Developer
            </h2>
            <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto lg:mx-0">
              Results-driven developer with 4+ years of experience crafting intuitive user interfaces, conducting
              thorough testing, and delivering high-quality applications that meet complex requirements. Specializing in
              POS systems, fraud detection, and behavioral biometrics.
            </p>

            <div className="flex flex-wrap justify-center lg:justify-start gap-4 mb-8">
              <a
                href="https://github.com/KaungSithuLinn"
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 rounded-full bg-white/80 hover:bg-white dark:bg-gray-800/80 dark:hover:bg-gray-800 transition-colors duration-300 shadow-lg hover:shadow-xl hover:-translate-y-1 transform transition-transform"
                aria-label="GitHub Profile"
              >
                <Github className="w-6 h-6 text-gray-700 dark:text-gray-300" />
              </a>
              <a
                href="https://linkedin.com/in/kaung-sithu-linn-7933781a5"
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 rounded-full bg-white/80 hover:bg-white dark:bg-gray-800/80 dark:hover:bg-gray-800 transition-colors duration-300 shadow-lg hover:shadow-xl hover:-translate-y-1 transform transition-transform"
                aria-label="LinkedIn Profile"
              >
                <Linkedin className="w-6 h-6 text-gray-700 dark:text-gray-300" />
              </a>
              <a
                href="mailto:kaungsithulinn1@gmail.com"
                className="p-3 rounded-full bg-white/80 hover:bg-white dark:bg-gray-800/80 dark:hover:bg-gray-800 transition-colors duration-300 shadow-lg hover:shadow-xl hover:-translate-y-1 transform transition-transform"
                aria-label="Email Contact"
              >
                <Mail className="w-6 h-6 text-gray-700 dark:text-gray-300" />
              </a>
              <a
                href="https://cp3405.pages.dev/"
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 rounded-full bg-white/80 hover:bg-white dark:bg-gray-800/80 dark:hover:bg-gray-800 transition-colors duration-300 shadow-lg hover:shadow-xl hover:-translate-y-1 transform transition-transform"
                aria-label="Portfolio Website"
              >
                <ExternalLink className="w-6 h-6 text-gray-700 dark:text-gray-300" />
              </a>
              <a
                href="/KaungSithuLinn_SoftwareDeveloper_Resume.pdf"
                download
                className="flex items-center gap-2 px-4 py-2 bg-white/80 hover:bg-white dark:bg-gray-800/80 dark:hover:bg-gray-800 rounded-full transition-colors duration-300 shadow-lg hover:shadow-xl hover:-translate-y-1 transform transition-transform text-gray-700 dark:text-gray-300"
                aria-label="Download Resume"
              >
                <Download className="w-5 h-5" />
                <span>Resume</span>
              </a>
            </div>

            <div className="flex flex-wrap gap-4 justify-center lg:justify-start mb-8">
              <motion.button
                onClick={() => document.getElementById("about")?.scrollIntoView({ behavior: "smooth" })}
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Learn More
                <ArrowDown className="w-4 h-4" />
              </motion.button>

              <motion.button
                onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })}
                className="inline-flex items-center gap-2 px-6 py-3 border-2 border-blue-600 dark:border-blue-400 text-blue-600 dark:text-blue-400 rounded-full hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-all duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Contact Me
                <ChevronRight className="w-4 h-4" />
              </motion.button>
            </div>
          </motion.div>

          <motion.div
            className="lg:w-1/2"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="relative w-72 h-72 md:w-96 md:h-96 mx-auto">
              {/* Decorative gradient backgrounds */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 dark:from-blue-600 dark:to-purple-600 rounded-3xl transform rotate-6 opacity-50"
                animate={{
                  rotate: [6, 8, 6, 4, 6],
                  scale: [1, 1.02, 1, 0.98, 1],
                }}
                transition={{
                  duration: 10,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "easeInOut",
                }}
              />
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-purple-400 to-blue-400 dark:from-purple-600 dark:to-blue-600 rounded-3xl transform -rotate-6 opacity-50"
                animate={{
                  rotate: [-6, -4, -6, -8, -6],
                  scale: [1, 0.98, 1, 1.02, 1],
                }}
                transition={{
                  duration: 10,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "easeInOut",
                }}
              />

              {/* Image container with explicit styling */}
              <div className="absolute inset-0 m-4 rounded-2xl overflow-hidden shadow-2xl" style={{ zIndex: 30 }}>
                <div className="relative w-full h-full">
                  <Image
                    src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/KSTL%20Headshot%20Portrait.jpg-gxu4RedFPcOzqK3iU0lk96P56KVoZL.jpeg"
                    alt="Kaung Sithu Linn - Software Developer"
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover object-center"
                    priority
                    onError={(e) => {
                      console.error("Image failed to load")
                      e.currentTarget.src = "/placeholder.svg?height=400&width=400"
                    }}
                  />
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Decorative Elements */}
      <motion.div
        className="absolute bottom-10 left-1/2 transform -translate-x-1/2 flex flex-col items-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.6 }}
      >
        <div className="w-1 h-12 bg-gradient-to-b from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 rounded-full animate-pulse"></div>
      </motion.div>
    </section>
  )
}

