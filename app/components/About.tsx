"use client"

import { motion } from "framer-motion"
import { useReducedMotion } from "framer-motion"
import { Code, Database, Server, Globe, Brain, TrendingUp } from "lucide-react"
import AnimatedSectionHeader from "./AnimatedSectionHeader"
import { useTranslation } from "@/context/language-utils"
import { memo } from "react"

const AboutComponent = () => {
  const { t, isRTL } = useTranslation()
  const shouldReduceMotion = useReducedMotion()

  const skills = [
    {
      icon: <Code className="w-8 h-8 text-teal-600 dark:text-teal-400" />,
      title: t("about.skills.frontend.title"),
      description: t("about.skills.frontend.description"),
    },
    {
      icon: <Server className="w-8 h-8 text-teal-600 dark:text-teal-400" />,
      title: t("about.skills.backend.title"),
      description: t("about.skills.backend.description"),
    },
    {
      icon: <Database className="w-8 h-8 text-teal-600 dark:text-teal-400" />,
      title: t("about.skills.database.title"),
      description: t("about.skills.database.description"),
    },
    {
      icon: <Brain className="w-8 h-8 text-teal-600 dark:text-teal-400" />,
      title: t("about.skills.ai.title"),
      description: t("about.skills.ai.description"),
    },
    {
      icon: <TrendingUp className="w-8 h-8 text-teal-600 dark:text-teal-400" />,
      title: t("about.skills.marketing.title"),
      description: t("about.skills.marketing.description"),
    },
    {
      icon: <Globe className="w-8 h-8 text-teal-600 dark:text-teal-400" />,
      title: t("about.skills.languages.title"),
      description: t("about.skills.languages.description"),
    },
  ]

  const _container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  }

  return (
    <section
      id="about"
      className="py-20 bg-gradient-to-br from-slate-50 to-white dark:from-background dark:to-[#0a1628] transition-colors duration-300 overflow-hidden relative"
    >
      <div className="absolute inset-0 glow-teal opacity-30" aria-hidden="true" />
      <div className={`absolute bottom-0 ${isRTL ? "left-0" : "right-0"} w-64 h-64 -mb-32 ${isRTL ? "-ml-32" : "-mr-32"} glow-navy opacity-40`} aria-hidden="true" />
      <div className="container mx-auto px-6 relative z-10">
        <AnimatedSectionHeader title={t("about.title")} />
        <div className="flex flex-col md:flex-row items-center justify-between">
          <motion.div
            className="md:w-1/2 mb-8 md:mb-0"
            initial={shouldReduceMotion ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
            whileInView={shouldReduceMotion ? undefined : { opacity: 1, x: 0 }}
            viewport={shouldReduceMotion ? undefined : { once: true, margin: "-50px" }}
            transition={shouldReduceMotion ? { duration: 0 } : { duration: 0.5 }}
          >
            <p className="text-base sm:text-lg text-foreground dark:text-foreground leading-relaxed mb-6">{t("about.paragraph1")}</p>
            <p className="text-base sm:text-lg text-foreground dark:text-foreground leading-relaxed">{t("about.paragraph2")}</p>

            <motion.div
              className="mt-8 p-4 border-s-4 border-primary bg-accent rounded-lg"
              initial={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              animate={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 1, y: 0 }}
              transition={shouldReduceMotion ? { duration: 0 } : { duration: 0.5, delay: 0.3 }}
            >
              <p className="italic text-foreground dark:text-foreground">{t("about.quote")}</p>
            </motion.div>
          </motion.div>

          <motion.div
            className="md:w-1/2 grid grid-cols-2 gap-6"
            initial={shouldReduceMotion ? { opacity: 1 } : "hidden"}
            whileInView={shouldReduceMotion ? undefined : "show"}
            viewport={shouldReduceMotion ? undefined : { once: true }}
          >
            {skills.map((skill, index) => (
              <motion.div
                key={index}
                className="card-glass p-6 rounded-xl shadow-md hover:shadow-xl hover:border-primary/30 transition-all duration-300"
                variants={item}
                whileHover={shouldReduceMotion ? undefined : { scale: 1.03 }}
                role="group"
                aria-label={`${skill.title} skills: ${skill.description}`}
              >
                <div className="p-2 bg-accent rounded-lg w-fit">{skill.icon}</div>
                <h3 className="text-xl font-semibold mt-4 mb-2 text-foreground">{skill.title}</h3>
                <p className="text-muted-foreground">{skill.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default memo(AboutComponent)