"use client"

import { motion } from "framer-motion"
import { Code, Database, Server, Globe, Brain, Zap, MessageSquare, Settings, Search } from "lucide-react"
import Image from "next/image"
import AnimatedSectionHeader from "./AnimatedSectionHeader"
import { useTranslation } from "@/context/language-context"

export default function Skills() {
  const { t } = useTranslation()

  const skills = [
    {
      icon: <Code className="w-8 h-8 text-blue-500" />,
      title: t("skills.frontend"),
      description: t("skills.frontend.desc"),
    },
    {
      icon: <Server className="w-8 h-8 text-green-500" />,
      title: t("skills.backend"),
      description: t("skills.backend.desc"),
    },
    {
      icon: <Database className="w-8 h-8 text-purple-500" />,
      title: t("skills.database"),
      description: t("skills.database.desc"),
    },
    {
      icon: <Brain className="w-8 h-8 text-yellow-500" />,
      title: t("skills.ml"),
      description: t("skills.ml.desc"),
    },
    {
      icon: <Globe className="w-8 h-8 text-indigo-500" />,
      title: t("skills.multilingual"),
      description: t("skills.multilingual.desc"),
    },
    {
      icon: <MessageSquare className="w-8 h-8 text-red-500" />,
      title: t("skills.communication"),
      description: t("skills.communication.desc"),
    },
    {
      icon: <Settings className="w-8 h-8 text-teal-500" />,
      title: t("skills.optimization"),
      description: t("skills.optimization.desc"),
    },
    {
      icon: <Search className="w-8 h-8 text-amber-500" />,
      title: t("skills.research"),
      description: t("skills.research.desc"),
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
      id="skills"
      className="py-20 bg-gradient-to-br from-indigo-50 to-blue-100 dark:from-gray-900 dark:to-blue-900 transition-colors duration-300 overflow-hidden relative"
    >
      <div className="container mx-auto px-6 relative z-10">
        <AnimatedSectionHeader title={t("skills.title")} />
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
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
            >
              {skill.icon}
              <h3 className="text-xl font-semibold mt-4 mb-2 dark:text-white">{skill.title}</h3>
              <p className="text-gray-600 dark:text-gray-300">{skill.description}</p>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          className="mt-16 bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h3 className="text-2xl font-semibold mb-6 dark:text-white flex items-center">
            <Zap className="w-6 h-6 mr-2 text-blue-500" />
            {t("skills.programming")}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="space-y-4">
              <h4 className="font-medium text-lg dark:text-blue-300 text-blue-600">Frontend</h4>
              <div className="space-y-2">
                {["JavaScript", "TypeScript", "React", "Next.js", "HTML/CSS", "Tailwind CSS"].map((tech, idx) => (
                  <div key={idx} className="flex items-center">
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 mr-2">
                      <motion.div
                        className="bg-blue-600 dark:bg-blue-500 h-2.5 rounded-full"
                        initial={{ width: 0 }}
                        whileInView={{ width: `${85 - idx * 5}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, delay: idx * 0.1 }}
                      />
                    </div>
                    <span className="text-sm text-gray-600 dark:text-gray-300 w-24">{tech}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-medium text-lg dark:text-green-300 text-green-600">Backend</h4>
              <div className="space-y-2">
                {["Node.js", "Python", "Java", "C++", ".NET", "Express"].map((tech, idx) => (
                  <div key={idx} className="flex items-center">
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 mr-2">
                      <motion.div
                        className="bg-green-600 dark:bg-green-500 h-2.5 rounded-full"
                        initial={{ width: 0 }}
                        whileInView={{ width: `${80 - idx * 5}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, delay: idx * 0.1 }}
                      />
                    </div>
                    <span className="text-sm text-gray-600 dark:text-gray-300 w-24">{tech}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-medium text-lg dark:text-purple-300 text-purple-600">Specialized</h4>
              <div className="space-y-2">
                {["SQL", "MongoDB", "Machine Learning", "Data Analysis", "UI/UX Design", "DevOps"].map((tech, idx) => (
                  <div key={idx} className="flex items-center">
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 mr-2">
                      <motion.div
                        className="bg-purple-600 dark:bg-purple-500 h-2.5 rounded-full"
                        initial={{ width: 0 }}
                        whileInView={{ width: `${85 - idx * 7}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, delay: idx * 0.1 }}
                      />
                    </div>
                    <span className="text-sm text-gray-600 dark:text-gray-300 w-24">{tech}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
      <div className="absolute bottom-0 right-0 w-64 h-64 -mb-32 -mr-32 opacity-20">
        <Image src="/placeholder.svg?height=256&width=256" alt="Decorative background" width={256} height={256} />
      </div>
    </section>
  )
}
