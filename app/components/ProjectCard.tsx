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
      className="card-glass rounded-xl shadow-lg hover:shadow-2xl hover:border-primary/30 transition-all duration-300 relative overflow-hidden"
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
                <div className="p-4 bg-accent rounded-full">{project.icon}</div>
              </div>
              <div className="md:w-5/6">
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
                  <h3 className="text-2xl font-semibold text-foreground">{project.title}</h3>
                  <p className="text-muted-foreground">{project.period}</p>
                </div>
                <p className="text-foreground dark:text-foreground mb-4">{project.description}</p>
                <h4 className="font-semibold text-lg mb-2 text-foreground">{t("projects.achievements")}:</h4>
                <ul className="list-none space-y-2 mb-4">
                  {project.achievements.map((achievement, idx) => (
                    <li key={idx} className="text-foreground dark:text-foreground flex items-start">
                      <span className="text-primary me-2">&#8226;</span>
                      {achievement}
                    </li>
                  ))}
                </ul>

                <div className="flex items-center justify-between">
                  <a
                    href={project.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-primary dark:text-primary hover:underline"
                  >
                    {t("projects.viewProject")} <ExternalLink className="w-4 h-4 ms-1" />
                  </a>

                  {project.caseStudy && (
                    <button
                      onClick={() => setExpanded(!expanded)}
                      className="flex items-center gap-1 text-muted-foreground hover:text-primary dark:hover:text-primary transition-colors"
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
            <div className="border-t border-border pt-6 mt-2">
               <div className="grid md:grid-cols-2 gap-6">
                 <div>
                   <h5 className="font-semibold text-foreground mb-2">{t("projects.challenge")}</h5>
                   <p className="text-foreground dark:text-foreground">{project.caseStudy.challenge}</p>
                 </div>
                 <div>
                   <h5 className="font-semibold text-foreground mb-2">{t("projects.approach")}</h5>
                   <p className="text-foreground dark:text-foreground">{project.caseStudy.approach}</p>
                 </div>
                 <div>
                   <h5 className="font-semibold text-foreground mb-2">{t("projects.results")}</h5>
                   <p className="text-foreground dark:text-foreground">{project.caseStudy.results}</p>
                 </div>
                 <div>
                   <h5 className="font-semibold text-foreground mb-2">{t("projects.technologies")}</h5>
                   <div className="flex flex-wrap gap-2">
                     {project.caseStudy.technologies.map((tech, idx) => (
                       <span
                         key={idx}
                         className="px-3 py-1 bg-accent text-primary dark:text-primary-foreground rounded-full text-sm"
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