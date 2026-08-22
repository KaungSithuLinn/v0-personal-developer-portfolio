"use client"

import { motion } from "framer-motion"
import { useReducedMotion } from "framer-motion"
import { Github, Linkedin, Mail, FileText } from "lucide-react"
import Image from "next/image"
import { useTranslation } from "@/context/language-utils"
import { memo } from "react"

const HeroComponent = () => {
  const { t, isRTL } = useTranslation()
  const shouldReduceMotion = useReducedMotion()

  return (
    <section
      id="home"
      className="min-h-screen pt-28 pb-20 bg-gradient-to-br from-slate-50 to-white dark:from-[#070c16] dark:to-[#0a1628] transition-colors duration-300 overflow-hidden relative"
    >
      <div className="container mx-auto px-6 relative">
        <div className="flex flex-col md:flex-row items-center gap-12">
          <motion.div
            className={`flex-1 ${isRTL ? "text-end" : "text-start"}`}
            initial={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            animate={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 1, y: 0 }}
            transition={shouldReduceMotion ? { duration: 0 } : { duration: 0.5 }}
          >
            <motion.h1
              className="text-4xl sm:text-6xl font-bold mb-4 text-gray-900 dark:text-white"
              initial={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              animate={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 1, y: 0 }}
              transition={shouldReduceMotion ? { duration: 0 } : { duration: 0.5 }}
            >
              {t("hero.title")}
            </motion.h1>

            <motion.h2
              className="text-2xl sm:text-3xl text-gray-600 dark:text-gray-300 mb-8"
              initial={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              animate={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 1, y: 0 }}
              transition={shouldReduceMotion ? { duration: 0 } : { duration: 0.5, delay: 0.1 }}
            >
              {t("hero.subtitle")}
            </motion.h2>

            <motion.p
              className="text-lg text-gray-700 dark:text-gray-200 mb-8 max-w-2xl"
              initial={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              animate={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 1, y: 0 }}
              transition={shouldReduceMotion ? { duration: 0 } : { duration: 0.5, delay: 0.2 }}
            >
              {t("hero.description")}
            </motion.p>

            <motion.div
              className="flex flex-wrap gap-4"
              initial={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              animate={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 1, y: 0 }}
              transition={shouldReduceMotion ? { duration: 0 } : { duration: 0.5, delay: 0.3 }}
            >
              <a
                href="https://github.com/kaungthu97"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 bg-gray-900 text-white px-4 py-2 rounded-full hover:bg-gray-700 transition-colors"
              >
                <Github size={20} />
                {t("hero.githubProfile")}
              </a>

              <a
                href="https://linkedin.com/in/kaung-sithu-linn"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 bg-teal-600 text-white px-4 py-2 rounded-full hover:bg-teal-500 transition-colors"
              >
                <Linkedin size={20} />
                {t("hero.linkedinProfile")}
              </a>

              <a
                href="mailto:kaungthu.sithu97@gmail.com"
                className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-500 transition-colors"
              >
                <Mail size={20} />
                {t("hero.emailContact")}
              </a>

              <a
                href="/KaungSithuLinn_SoftwareDeveloper_Resume.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 bg-cyan-600 text-white px-4 py-2 rounded-full hover:bg-cyan-500 transition-colors"
              >
                <FileText size={20} />
                {t("hero.downloadResume")}
              </a>
            </motion.div>
          </motion.div>

          <motion.div
            className={`flex-1 flex justify-center ${isRTL ? "md:order-first" : ""}`}
            initial={shouldReduceMotion ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
            animate={shouldReduceMotion ? { opacity: 1, scale: 1 } : { opacity: 1, scale: 1 }}
            transition={shouldReduceMotion ? { duration: 0 } : { duration: 0.6, delay: 0.2 }}
          >
            <div className="relative w-72 h-72 sm:w-80 sm:h-80 md:w-96 md:h-96 opacity-80">
              <div className="absolute inset-0 rounded-2xl overflow-hidden shadow-2xl ring-1 ring-gray-200/50 dark:ring-gray-700/50">
                <div className="relative w-full h-full">
                  <Image
                    src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/KSTL%20Headshot%20Portrait.jpg-gxu4RedFPcOzqK3iU0lk96P56KVoZL.jpeg"
                    alt={t("hero.profileImageAlt")}
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
              <div className="absolute -inset-3 rounded-3xl border-2 border-teal-500/20 dark:border-teal-400/20 -z-10" />
            </div>
          </motion.div>
        </div>

        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-white/10 dark:to-black/10" />
        </div>
      </div>
    </section>
  )
}

export default memo(HeroComponent)