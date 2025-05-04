"use client"

import { motion } from "framer-motion"
import { Code, Database, Server, Globe, Brain, TrendingUp } from "lucide-react"
import Image from "next/image"
import { useTranslation } from "@/context/language-utils"

export default function About() {
  const { t } = useTranslation()

  const skills = [
    {
      icon: <Code className="w-8 h-8 text-blue-500" />,
      title: t("about.skills.frontend.title"),
      description: t("about.skills.frontend.description"),
    },
    {
      icon: <Server className="w-8 h-8 text-green-500" />,
      title: t("about.skills.backend.title"),
      description: t("about.skills.backend.description"),
    },
    {
      icon: <Database className="w-8 h-8 text-purple-500" />,
      title: t("about.skills.database.title"),
      description: t("about.skills.database.description"),
    },
    {
      icon: <Brain className="w-8 h-8 text-yellow-500" />,
      title: t("about.skills.ai.title"),
      description: t("about.skills.ai.description"),
    },
    {
      icon: <TrendingUp className="w-8 h-8 text-red-500" />,
      title: t("about.skills.marketing.title"),
      description: t("about.skills.marketing.description"),
    },
    {
      icon: <Globe className="w-8 h-8 text-indigo-500" />,
      title: t("about.skills.languages.title"),
      description: t("about.skills.languages.description"),
    },
  ]

  const container = {
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
      className="py-20 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-indigo-900 transition-colors duration-300 overflow-hidden relative"
    >
      <div className="container mx-auto px-6 relative z-10">
        <motion.h2
          className="text-4xl font-bold mb-8 text-center dark:text-white"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          {t("about.title")}
        </motion.h2>
        <div className="flex flex-col md:flex-row items-center justify-between">
          <motion.div
            className="md:w-1/2 mb-8 md:mb-0"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <p className="text-xl text-gray-700 dark:text-gray-300 leading-relaxed mb-6">{t("about.paragraph1")}</p>
            <p className="text-xl text-gray-700 dark:text-gray-300 leading-relaxed">{t("about.paragraph2")}</p>

            <motion.div
              className="mt-8 p-4 border-l-4 border-blue-500 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-400 rounded"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <p className="italic text-gray-700 dark:text-gray-300">{t("about.quote")}</p>
            </motion.div>
          </motion.div>

          <motion.div
            className="md:w-1/2 grid grid-cols-2 gap-6"
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
          >
            {skills.map((skill, index) => (
              <motion.div
                key={index}
                className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
                variants={item}
                whileHover={{ scale: 1.03 }}
                role="group"
                aria-label={`${skill.title} skills: ${skill.description}`}
              >
                {skill.icon}
                <h3 className="text-xl font-semibold mt-4 mb-2 dark:text-white">{skill.title}</h3>
                <p className="text-gray-600 dark:text-gray-300">{skill.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
      <div className="absolute bottom-0 right-0 w-64 h-64 -mb-32 -mr-32 opacity-20">
        <Image
          src="/placeholder.svg?height=256&width=256"
          alt={t("about.decorativeImageAlt")}
          width={256}
          height={256}
        />
      </div>
    </section>
  )
}
