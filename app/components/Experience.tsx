"use client"

import { Briefcase, Calendar, MapPin } from "lucide-react"
import { motion } from "framer-motion"
import { useReducedMotion } from "framer-motion"
import AnimatedSectionHeader from "./AnimatedSectionHeader"
import { useTranslation } from "@/context/language-utils"
import { memo } from "react"

const ExperienceComponent = () => {
  const { t, isRTL } = useTranslation()
  const shouldReduceMotion = useReducedMotion()

  const experiences = [
    {
      company: t("experience.company"),
      location: t("experience.location"),
      period: t("experience.period"),
      role: t("experience.role"),
      responsibilities: [
        t("experience.responsibilities.1"),
        t("experience.responsibilities.2"),
        t("experience.responsibilities.3"),
        t("experience.responsibilities.4"),
        t("experience.responsibilities.5"),
      ],
    },
  ]

  const item = {
    hidden: { opacity: 0, y: 50 },
    show: { opacity: 1, y: 0 },
  }

  return (
    <section
      id="experience"
      className="py-20 bg-gradient-to-br from-slate-50 to-white dark:from-[#070c16] dark:to-[#0a1628] transition-colors duration-300 overflow-hidden relative"
    >
      <div className="absolute inset-0 glow-navy opacity-30" aria-hidden="true" />
      <div className={`absolute top-0 ${isRTL ? "left-0" : "right-0"} w-64 h-64 -mt-32 ${isRTL ? "-ml-32" : "-mr-32"} glow-teal opacity-40`} aria-hidden="true" />
      <div className="container mx-auto px-6 relative z-10">
        <AnimatedSectionHeader title={t("experience.title")} />
        <div className="relative">
          <div className="hidden md:block absolute top-8 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-teal-500/30 to-transparent" aria-hidden="true" />
          <motion.div
            className="space-y-12 md:space-y-0"
            initial={shouldReduceMotion ? { opacity: 1 } : "hidden"}
            whileInView={shouldReduceMotion ? undefined : "show"}
            viewport={shouldReduceMotion ? undefined : { once: true, margin: "-50px" }}
            transition={shouldReduceMotion ? { duration: 0 } : { staggerChildren: 0.2 }}
          >
            {experiences.map((exp, index) => (
              <motion.div
                key={index}
                className="relative md:flex md:items-center"
                variants={item}
              >
                <div className="hidden md:flex md:w-1/2 md:justify-end md:pr-12">
                  <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-8 rounded-xl shadow-lg ring-1 ring-gray-200/50 dark:ring-gray-700/50 max-w-lg w-full">
                    <h3 className="text-2xl font-semibold mb-2 dark:text-white flex items-center">
                      <Briefcase className="w-5 h-5 me-2 text-teal-500" />
                      {exp.company}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-4 flex items-center">
                      <MapPin className="w-4 h-4 me-2" />
                      {exp.location}
                    </p>
                    <p className="text-gray-600 dark:text-gray-300 mb-4 flex items-center">
                      <Calendar className="w-4 h-4 me-2" />
                      {exp.period}
                    </p>
                    <p className="text-xl font-medium mb-4 dark:text-gray-200 flex items-center">
                      <Briefcase className="w-5 h-5 me-2 text-teal-500" />
                      {exp.role}
                    </p>
                    <ul className="list-none space-y-2">
                      {exp.responsibilities.map((resp, idx) => (
                        <li key={idx} className="text-gray-700 dark:text-gray-300 flex items-start">
                          <span className="text-teal-500 me-2">&#8226;</span>
                          {resp}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                <div className="hidden md:flex md:w-0 md:justify-center">
                  <div className="w-4 h-4 rounded-full bg-teal-500 ring-4 ring-teal-500/20 relative z-10" aria-hidden="true" />
                </div>
                <div className="hidden md:block md:w-1/2 md:pl-12" />
                <div className="md:hidden bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-8 rounded-xl shadow-lg ring-1 ring-gray-200/50 dark:ring-gray-700/50">
                  <h3 className="text-2xl font-semibold mb-2 dark:text-white flex items-center">
                    <Briefcase className="w-5 h-5 me-2 text-teal-500" />
                    {exp.company}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-4 flex items-center">
                    <MapPin className="w-4 h-4 me-2" />
                    {exp.location}
                  </p>
                  <p className="text-gray-600 dark:text-gray-300 mb-4 flex items-center">
                    <Calendar className="w-4 h-4 me-2" />
                    {exp.period}
                  </p>
                  <p className="text-xl font-medium mb-4 dark:text-gray-200 flex items-center">
                    <Briefcase className="w-5 h-5 me-2 text-teal-500" />
                    {exp.role}
                  </p>
                  <ul className="list-none space-y-2">
                    {exp.responsibilities.map((resp, idx) => (
                      <li key={idx} className="text-gray-700 dark:text-gray-300 flex items-start">
                        <span className="text-teal-500 me-2">&#8226;</span>
                        {resp}
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default memo(ExperienceComponent)