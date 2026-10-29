"use client"

import { motion } from "framer-motion"
import { useReducedMotion } from "framer-motion"
import { Github, Linkedin, Mail, FileText } from "lucide-react"
import Image from "next/image"
import { memo } from "react"
import { useTranslation } from "@/context/language-utils"

const HeroVariantComponent = () => {
  const { t, isRTL } = useTranslation()
  const shouldReduceMotion = useReducedMotion()

  const base = (extra: string = "") =>
    `flex items-center gap-2 border border-border text-foreground px-4 py-2 rounded-full min-h-[44px] hover:bg-accent hover:text-accent-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background ${extra}`

  return (
    <section
      id="home"
      className="min-h-screen pt-28 pb-20 section-bg transition-colors duration-300 overflow-hidden relative"
    >
      <div className="container mx-auto px-6 relative">
        <div className="flex flex-col md:flex-row items-center gap-12">
          <motion.div
            className={`flex-1 ${isRTL ? "text-end" : "text-start"}`}
            initial={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={shouldReduceMotion ? { duration: 0 } : { duration: 0.5, ease: "easeOut" }}
          >
            <motion.h1
              className="text-4xl sm:text-6xl font-bold mb-4 text-foreground"
              initial={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={shouldReduceMotion ? { duration: 0 } : { duration: 0.5, ease: "easeOut" }}
            >
              {t("hero.title")}
            </motion.h1>

            <motion.h2
              className="text-2xl sm:text-3xl text-muted-foreground mb-8"
              initial={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={shouldReduceMotion ? { duration: 0 } : { duration: 0.5, delay: 0.1, ease: "easeOut" }}
            >
              {t("hero.subtitle")}
            </motion.h2>

            <motion.p
              className="text-lg text-foreground/90 mb-8 max-w-2xl leading-relaxed"
              initial={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={shouldReduceMotion ? { duration: 0 } : { duration: 0.5, delay: 0.2, ease: "easeOut" }}
            >
              {t("hero.description")}
            </motion.p>

            <motion.div
              className="flex flex-wrap gap-4"
              initial={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={shouldReduceMotion ? { duration: 0 } : { duration: 0.5, delay: 0.3, ease: "easeOut" }}
            >
              <a
                href="https://github.com/kaungthu97"
                target="_blank"
                rel="noopener noreferrer"
                className={base("bg-orange-500 text-orange-900 hover:bg-orange-400")}
              >
                <Github size={20} aria-hidden="true" />
                {t("hero.githubProfile")}
              </a>

              <a
                href="https://linkedin.com/in/kaung-sithu-linn"
                target="_blank"
                rel="noopener noreferrer"
                className={base("bg-purple-600 text-white hover:bg-purple-500")}
              >
                <Linkedin size={20} aria-hidden="true" />
                {t("hero.linkedinProfile")}
              </a>

              <a
                href="mailto:kaungthu.sithu97@gmail.com"
                className={base()}
              >
                <Mail size={20} aria-hidden="true" />
                {t("hero.emailContact")}
              </a>

              <a
                href="/KaungSithuLinn_SoftwareDeveloper_Resume.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className={base("bg-purple-700 text-white hover:bg-purple-600")}
              >
                <FileText size={20} aria-hidden="true" />
                {t("hero.downloadResume")}
              </a>
            </motion.div>
          </motion.div>

          <motion.div
            className={`flex-1 flex justify-center ${isRTL ? "md:order-first" : ""}`}
            initial={shouldReduceMotion ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={shouldReduceMotion ? { duration: 0 } : { duration: 0.6, delay: 0.2, ease: "easeOut" }}
          >
            <div className="relative w-72 h-72 sm:w-80 sm:h-80 md:w-96 md:h-96">
              <div className="absolute inset-0 rounded-2xl overflow-hidden shadow-xl ring-4 ring-orange-500/40 dark:ring-orange-500/30">
                <div className="absolute inset-0 rounded-2xl border-2 border-purple-500/40 -inset-px" aria-hidden="true" />
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
                      e.currentTarget.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400' viewBox='0 0 400 400'%3E%3Crect width='400' height='400' fill='%230b0a0e'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='central' text-anchor='middle' fill='%23f97316' font-family='system-ui' font-size='80' font-weight='bold'%3EKSTL%3C/text%3E%3C/svg%3E"
                    }}
                  />
                </div>
              </div>
              <div className="absolute -inset-3 rounded-3xl border-2 border-purple-500/20 -z-10" aria-hidden="true" />
            </div>
          </motion.div>
        </div>

        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background/10 dark:to-background/10" />
        </div>
      </div>
    </section>
  )
}

export default memo(HeroVariantComponent)
