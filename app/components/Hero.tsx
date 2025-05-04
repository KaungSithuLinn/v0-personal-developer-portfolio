"use client"

import { motion } from "framer-motion"
import { Github, Linkedin, Mail, FileText } from "lucide-react"
import Image from "next/image"
import { useTranslation } from "@/context/language-utils"

export default function Hero() {
  const { t, isRTL } = useTranslation()

  return (
    <section
      id="home"
      className="min-h-screen pt-28 pb-20 bg-gradient-to-br from-indigo-50 to-blue-100 dark:from-gray-900 dark:to-blue-900 transition-colors duration-300 overflow-hidden relative"
    >
      <div className="container mx-auto px-6 relative">
        <div className={`flex flex-col ${isRTL ? "items-end text-right" : "items-start text-left"} max-w-[800px] mx-auto`}>
          <motion.h1
            className="text-4xl sm:text-6xl font-bold mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {t("hero.title")}
          </motion.h1>

          <motion.h2
            className="text-2xl sm:text-3xl text-gray-600 dark:text-gray-300 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            {t("hero.subtitle")}
          </motion.h2>

          <motion.p
            className="text-lg text-gray-700 dark:text-gray-200 mb-8 max-w-2xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {t("hero.description")}
          </motion.p>

          <motion.div
            className={`flex flex-wrap gap-4 ${isRTL ? "flex-row-reverse" : ""}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <a
              href="https://github.com/yourusername"
              target="_blank"
              rel="noopener noreferrer"
              className={`flex items-center gap-2 ${
                isRTL ? "flex-row-reverse" : ""
              } bg-gray-900 text-white px-4 py-2 rounded-full hover:bg-gray-700 transition-colors`}
            >
              <Github size={20} />
              {t("hero.githubProfile")}
            </a>

            <a
              href="https://linkedin.com/in/yourusername"
              target="_blank"
              rel="noopener noreferrer"
              className={`flex items-center gap-2 ${
                isRTL ? "flex-row-reverse" : ""
              } bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-500 transition-colors`}
            >
              <Linkedin size={20} />
              {t("hero.linkedinProfile")}
            </a>

            <a
              href="mailto:your.email@example.com"
              className={`flex items-center gap-2 ${
                isRTL ? "flex-row-reverse" : ""
              } bg-purple-600 text-white px-4 py-2 rounded-full hover:bg-purple-500 transition-colors`}
            >
              <Mail size={20} />
              {t("hero.emailContact")}
            </a>

            <a
              href="/KaungSithuLinn_SoftwareDeveloper_Resume.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className={`flex items-center gap-2 ${
                isRTL ? "flex-row-reverse" : ""
              } bg-green-600 text-white px-4 py-2 rounded-full hover:bg-green-500 transition-colors`}
            >
              <FileText size={20} />
              {t("hero.downloadResume")}
            </a>
          </motion.div>
        </div>

        <div className="absolute bottom-0 right-0 w-64 h-64 -mb-32 -mr-32 opacity-20">
          <Image src="/placeholder.svg?height=256&width=256" alt={t("hero.profileImageAlt")} width={256} height={256} />
        </div>
      </div>

      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-white/20 dark:to-black/20" />
      </div>
    </section>
  )
}
