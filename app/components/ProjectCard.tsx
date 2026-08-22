"use client"

import { motion } from "framer-motion"
import { useReducedMotion } from "framer-motion"
import { ExternalLink, ChevronDown, ChevronUp } from "lucide-react"
import { useState, type ReactElement, memo } from "react"
import { useTranslation } from "@/context/language-utils"

interface ProjectProps {
  title: string
  period: string
  link: string
  icon: ReactElement
  description: string
  achievements: string[]
  thumbnail?: string
  caseStudy?: {
    challenge: string
    approach: string
    results: string
    technologies: string[]
  }
}

const ProjectCard = memo(function ProjectCard({ project, index }: { project: ProjectProps; index: number }) {
  const [expanded, setExpanded] = useState(false)
  const { t } = useTranslation()
  const shouldReduceMotion = useReducedMotion()

  return (
    <motion.div
      initial={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      animate={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 1, y: 0 }}
      transition={shouldReduceMotion ? { duration: 0 } : { duration: 0.5, delay: index * 0.2 }}
      className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl shadow-lg hover:shadow-2xl ring-1 ring-gray-200/50 dark:ring-gray-700/50 hover:ring-teal-500/30 transition-all duration-300 relative overflow-hidden"
    >
      {project.thumbnail && (
        <div
          className="w-full h-48 sm:h-64 bg-cover bg-center"
          style={{ backgroundImage: `url(${project.thumbnail})` }}
          role="img"
          aria-label={`${project.title} thumbnail`}
        />
      )}
      <div className="p-8">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="md:w-1/6 flex justify-center">
            <div className="p-4 bg-teal-50 dark:bg-teal-900/30 rounded-full">{project.icon}</div>
          </div>
          <div className="md:w-5/6">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
              <h3 className="text-2xl font-semibold dark:text-white">{project.title}</h3>
              <p className="text-gray-600 dark:text-gray-400">{project.period}</p>
            </div>
            <p className="text-gray-700 dark:text-gray-300 mb-4">{project.description}</p>
            <h4 className="font-semibold text-lg mb-2 dark:text-gray-200">{t("projects.achievements")}:</h4>
            <ul className="list-none space-y-2 mb-4">
              {project.achievements.map((achievement, idx) => (
                <li key={idx} className="text-gray-700 dark:text-gray-300 flex items-start">
                  <span className="text-teal-500 me-2">&#8226;</span>
                  {achievement}
                </li>
              ))}
            </ul>

            <div className="flex items-center justify-between">
              <a
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center text-teal-600 dark:text-teal-400 hover:underline"
              >
                {t("projects.viewProject")} <ExternalLink className="w-4 h-4 ms-1" />
              </a>

              {project.caseStudy && (
                <button
                  onClick={() => setExpanded(!expanded)}
                  className="flex items-center gap-1 text-gray-600 dark:text-gray-400 hover:text-teal-600 dark:hover:text-teal-400 transition-colors"
                  aria-expanded={expanded}
                  aria-controls={`case-study-${index}`}
                >
                  {expanded ? t("projects.hideCase") : t("projects.viewCase")}
                  {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
              )}
            </div>
          </div>
        </div>

        {project.caseStudy && (
          <motion.div
            id={`case-study-${index}`}
            initial={shouldReduceMotion ? { height: "auto", opacity: 1 } : { height: 0, opacity: 0 }}
            animate={{
              height: expanded ? "auto" : 0,
              opacity: expanded ? 1 : 0,
            }}
            transition={shouldReduceMotion ? { duration: 0 } : { duration: 0.3 }}
            className="overflow-hidden mt-6"
          >
            <div className="border-t border-gray-200 dark:border-gray-700 pt-6 mt-2">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h5 className="font-semibold text-gray-900 dark:text-white mb-2">{t("projects.challenge")}</h5>
                  <p className="text-gray-700 dark:text-gray-300">{project.caseStudy.challenge}</p>
                </div>
                <div>
                  <h5 className="font-semibold text-gray-900 dark:text-white mb-2">{t("projects.approach")}</h5>
                  <p className="text-gray-700 dark:text-gray-300">{project.caseStudy.approach}</p>
                </div>
                <div>
                  <h5 className="font-semibold text-gray-900 dark:text-white mb-2">{t("projects.results")}</h5>
                  <p className="text-gray-700 dark:text-gray-300">{project.caseStudy.results}</p>
                </div>
                <div>
                  <h5 className="font-semibold text-gray-900 dark:text-white mb-2">{t("projects.technologies")}</h5>
                  <div className="flex flex-wrap gap-2">
                    {project.caseStudy.technologies.map((tech, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 bg-teal-100 dark:bg-teal-900/30 text-teal-800 dark:text-teal-300 rounded-full text-sm"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  )
})

export default ProjectCard