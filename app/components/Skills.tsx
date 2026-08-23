"use client"

import { motion } from "framer-motion"
import { useReducedMotion } from "framer-motion"
import { Code, Database, Server, Globe, Brain, Zap, MessageSquare, Settings, Search } from "lucide-react"
import AnimatedSectionHeader from "./AnimatedSectionHeader"
import { useTranslation } from "@/context/language-utils"
import { memo } from "react"

const SkillsComponent = () => {
  const { t, isRTL } = useTranslation()
  const shouldReduceMotion = useReducedMotion()

  const skills = [
    {
      icon: <Code className="w-8 h-8 text-teal-600 dark:text-teal-400" />,
      title: t("skills.frontend"),
      description: t("skills.frontend.desc"),
    },
    {
      icon: <Server className="w-8 h-8 text-teal-600 dark:text-teal-400" />,
      title: t("skills.backend"),
      description: t("skills.backend.desc"),
    },
    {
      icon: <Database className="w-8 h-8 text-teal-600 dark:text-teal-400" />,
      title: t("skills.database"),
      description: t("skills.database.desc"),
    },
    {
      icon: <Brain className="w-8 h-8 text-teal-600 dark:text-teal-400" />,
      title: t("skills.ml"),
      description: t("skills.ml.desc"),
    },
    {
      icon: <Globe className="w-8 h-8 text-teal-600 dark:text-teal-400" />,
      title: t("skills.multilingual"),
      description: t("skills.multilingual.desc"),
    },
    {
      icon: <MessageSquare className="w-8 h-8 text-teal-600 dark:text-teal-400" />,
      title: t("skills.communication"),
      description: t("skills.communication.desc"),
    },
    {
      icon: <Settings className="w-8 h-8 text-teal-600 dark:text-teal-400" />,
      title: t("skills.optimization"),
      description: t("skills.optimization.desc"),
    },
    {
      icon: <Search className="w-8 h-8 text-teal-600 dark:text-teal-400" />,
      title: t("skills.research"),
      description: t("skills.research.desc"),
    },
  ]

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  }

  return (
    <section
      id="skills"
      className="py-20 section-bg transition-colors duration-300 overflow-hidden relative"
    >
      <div className="absolute inset-0 glow-teal opacity-20" aria-hidden="true" />
      <div className={`absolute bottom-0 ${isRTL ? "left-0" : "right-0"} w-64 h-64 -mb-32 ${isRTL ? "-ml-32" : "-mr-32"} glow-navy opacity-40`} aria-hidden="true" />
      <div className="container mx-auto px-6 relative z-10">
        <AnimatedSectionHeader title={t("skills.title")} />
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0 }}
          whileInView={shouldReduceMotion ? undefined : "show"}
          viewport={shouldReduceMotion ? undefined : { once: true }}
        >
          {skills.map((skill, index) => (
            <motion.div
              key={index}
              className="card-glass p-6 rounded-xl shadow-md hover:shadow-xl hover:border-primary/30 transition-all duration-300"
              variants={item}
              whileHover={shouldReduceMotion ? undefined : { scale: 1.03 }}
            >
              <div className="p-2 bg-accent rounded-lg w-fit">{skill.icon}</div>
              <h3 className="text-xl font-semibold mt-4 mb-2 text-foreground">{skill.title}</h3>
              <p className="text-muted-foreground">{skill.description}</p>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          className="mt-16 card-glass p-8 rounded-xl shadow-lg"
          initial={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={shouldReduceMotion ? undefined : { once: true, margin: "-50px" }}
          transition={shouldReduceMotion ? { duration: 0 } : { duration: 0.5 }}
        >
          <h3 className="text-2xl font-semibold mb-6 dark:text-white flex items-center">
            <Zap className="w-6 h-6 me-2 text-teal-500" />
            {t("skills.programming")}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="space-y-4">
              <h4 className="font-medium text-lg text-primary dark:text-primary-foreground">Frontend</h4>
              <div className="space-y-2">
                {["JavaScript", "TypeScript", "React", "Next.js", "HTML/CSS", "Tailwind CSS"].map((tech, idx) => (
                  <div key={idx} className="flex items-center">
                    <div className="w-full bg-muted rounded-full h-2.5 me-2" role="progressbar" aria-valuenow={parseInt(`${85 - idx * 5}`)} aria-valuemin={0} aria-valuemax={100} aria-label={`${tech} proficiency`}>
                    <motion.div
                        className="bg-teal-400 dark:bg-teal-500 h-2.5 rounded-full"
                        initial={shouldReduceMotion ? { width: `${85 - idx * 5}%` } : { width: 0 }}
                        animate={shouldReduceMotion ? { width: `${85 - idx * 5}%` } : { width: `${85 - idx * 5}%` }}
                        transition={shouldReduceMotion ? { duration: 0 } : { duration: 1, delay: idx * 0.1 }}
                      />
                    </div>
                    <span className="text-sm text-muted-foreground min-w-[5rem]">{tech}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-medium text-lg text-primary dark:text-primary-foreground">Backend</h4>
              <div className="space-y-2">
                {["Node.js", "Python", "Java", "C++", ".NET", "Express"].map((tech, idx) => (
                  <div key={idx} className="flex items-center">
                    <div className="w-full bg-muted rounded-full h-2.5 me-2" role="progressbar" aria-valuenow={parseInt(`${80 - idx * 5}`)} aria-valuemin={0} aria-valuemax={100} aria-label={`${tech} proficiency`}>
                    <motion.div
                        className="bg-teal-400 dark:bg-teal-500 h-2.5 rounded-full"
                        initial={shouldReduceMotion ? { width: `${80 - idx * 5}%` } : { width: 0 }}
                        animate={shouldReduceMotion ? { width: `${80 - idx * 5}%` } : { width: `${80 - idx * 5}%` }}
                        transition={shouldReduceMotion ? { duration: 0 } : { duration: 1, delay: idx * 0.1 }}
                      />
                    </div>
                    <span className="text-sm text-muted-foreground min-w-[5rem]">{tech}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-medium text-lg text-primary dark:text-primary-foreground">Specialized</h4>
              <div className="space-y-2">
                {["SQL", "MongoDB", "Machine Learning", "Data Analysis", "UI/UX Design", "DevOps"].map((tech, idx) => (
                  <div key={idx} className="flex items-center">
                    <div className="w-full bg-muted rounded-full h-2.5 me-2" role="progressbar" aria-valuenow={parseInt(`${85 - idx * 7}`)} aria-valuemin={0} aria-valuemax={100} aria-label={`${tech} proficiency`}>
                    <motion.div
                        className="bg-teal-400 dark:bg-teal-500 h-2.5 rounded-full"
                        initial={shouldReduceMotion ? { width: `${85 - idx * 7}%` } : { width: 0 }}
                        animate={shouldReduceMotion ? { width: `${85 - idx * 7}%` } : { width: `${85 - idx * 7}%` }}
                        transition={shouldReduceMotion ? { duration: 0 } : { duration: 1, delay: idx * 0.1 }}
                      />
                    </div>
                    <span className="text-sm text-muted-foreground min-w-[5rem]">{tech}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default memo(SkillsComponent)