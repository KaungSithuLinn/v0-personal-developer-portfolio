"use client"

import { useState, useMemo, type ReactElement } from "react"
import { Brain, Shield, LineChart, X, FileText } from "lucide-react"
import AnimatedSectionHeader from "./AnimatedSectionHeader"
import { useTranslation } from "@/context/language-utils"
import ProjectCard from "./ProjectCard"
import { motion, useReducedMotion } from "framer-motion"
import { memo } from "react"

type Project = {
  title: string
  period: string
  link: string
  github?: string
  category: "research" | "ml" | "security"
  icon: ReactElement
  description: string
  achievements: string[]
  caseStudy: {
    challenge: string
    approach: string
    results: string
    technologies: string[]
  }
  thumbnail: string
}

function ProjectsComponent() {
  const { t, isRTL } = useTranslation()
  const shouldReduceMotion = useReducedMotion()
  const [activeFilter, setActiveFilter] = useState<"all" | "research" | "ml" | "security">("all")

  const projects: Project[] = useMemo(
    () => [
      {
        title: "Mouse Dynamics for Online Assessment Fraud Detection",
        period: "May 2024 - Nov 2024",
        link: "https://drive.google.com/drive/folders/1JKdj1e25EfPqS-CrV7MjFFVXa8l-GItE",
        github: undefined,
        category: "security",
        icon: <Shield className="w-10 h-10 text-teal-600 dark:text-teal-400" />,
        description:
          "Developed a machine learning model to detect fraudulent behavior during online assessments using mouse dynamics as a behavioral biometric.",
        achievements: [
          "Analyzed mouse movement and click patterns to create user profiles and identify anomalies indicative of fraud",
          "Implemented feature selection techniques and evaluated multiple machine learning models, achieving high accuracy in fraud detection",
          "Identified key mouse dynamics features that are most discriminative for user authentication",
        ],
        caseStudy: {
          challenge:
            "Educational institutions faced increasing incidents of cheating in online assessments, with traditional proctoring methods proving insufficient for detecting sophisticated fraud techniques.",
          approach:
            "Developed a non-intrusive behavioral biometric system that analyzes mouse movement patterns to identify anomalous behavior without compromising user privacy or requiring additional hardware.",
          results:
            "The system achieved 92% accuracy in detecting fraudulent behavior with a false positive rate of only 3%, significantly improving assessment integrity while maintaining a positive user experience.",
          technologies: ["Python", "TensorFlow", "Scikit-learn", "Data Visualization", "Statistical Analysis"],
        },
        thumbnail: "/images/projects/mouse-dynamics-fraud-detection.svg",
      },
      {
        title: "Mouse Dynamics Biometric Fraud Detection System using Deep Learning",
        period: "May 2024 - Nov 2024",
        link: "https://drive.google.com/drive/folders/1SKbM027E4zU-2a9kLFBKcUMcd9hGhhJ",
        github: undefined,
        category: "ml",
        icon: <Brain className="w-10 h-10 text-teal-600 dark:text-teal-400" />,
        description:
          "Developed a fraud detection system using mouse dynamics and deep learning to enhance the security of online assessments.",
        achievements: [
          "Implemented data preprocessing pipelines achieving 100% data usability",
          "Engineered 12 optimized feature sets using advanced selection methods",
          "Developed and tested multiple deep learning models (ANN, LSTM, LSTM-CNN, LSTM-Transformer)",
          "Built data visualization tools to monitor system performance",
          "Exceeded project goals, achieving 95% detection accuracy and a false negative rate below 5%",
        ],
        caseStudy: {
          challenge:
            "Existing fraud detection systems struggled with real-time analysis and had high computational requirements, making them impractical for widespread implementation.",
          approach:
            "Leveraged deep learning architectures to create a lightweight, efficient system capable of real-time analysis with minimal computational overhead, focusing on optimizing both accuracy and performance.",
          results:
            "The system processed user behavior in real-time with a latency of less than 200ms, while maintaining 95% detection accuracy and reducing computational requirements by 60% compared to previous solutions.",
          technologies: [
            "Deep Learning",
            "LSTM",
            "CNN",
            "Transformer Models",
            "Real-time Processing",
            "JavaScript",
            "Python",
          ],
        },
        thumbnail: "/images/projects/deep-learning-biometrics.svg",
      },
      {
        title: "Continuous Authentication with Behavioral Biometrics",
        period: "May 2024 - Nov 2024",
        link: "https://drive.google.com/drive/folders/1JKdj1e25EfPqS-CrV7MjFFVXa8l-GItE",
        github: undefined,
        category: "research",
        icon: <LineChart className="w-10 h-10 text-teal-600 dark:text-teal-400" />,
        description:
          "Conducted a literature review on the use of behavioral biometrics, specifically mouse dynamics and keystroke analysis, for continuous user authentication.",
        achievements: [
          "Researched current methods, challenges, and potential improvements in the field",
          "Identified key research gaps and proposed a novel authentication method using real-time behavioral biometric information security (RBBIS)",
          "Developed a research framework and work plan for implementing and evaluating the proposed method",
        ],
        caseStudy: {
          challenge:
            "Traditional authentication methods rely on one-time verification, creating security vulnerabilities once a user is logged in, while continuous methods often create friction in the user experience.",
          approach:
            "Developed a framework for passive, continuous authentication that monitors behavioral patterns in the background without interrupting the user's workflow, adapting to changing user behavior over time.",
          results:
            "The proposed framework demonstrated the potential to reduce unauthorized access incidents by up to 87% in simulated environments, while maintaining a seamless user experience with no additional authentication prompts.",
          technologies: [
            "Behavioral Analysis",
            "Pattern Recognition",
            "Statistical Modeling",
            "User Experience Design",
            "Security Protocols",
          ],
        },
        thumbnail: "/images/projects/continuous-authentication.svg",
      },
    ],
    [],
  )

  const filters: Array<{ id: "all" | "research" | "ml" | "security"; label: string; icon: React.ReactNode }> = [
    { id: "all", label: t("projects.filter.all"), icon: <X className="w-3.5 h-3.5" /> },
    { id: "research", label: t("projects.filter.research"), icon: <FileText className="w-3.5 h-3.5" /> },
    { id: "ml", label: t("projects.filter.ml"), icon: <Brain className="w-3.5 h-3.5" /> },
    { id: "security", label: t("projects.filter.security"), icon: <Shield className="w-3.5 h-3.5" /> },
  ]

  const visibleProjects = useMemo(
    () => (activeFilter === "all" ? projects : projects.filter((p) => p.category === activeFilter)),
    [activeFilter, projects],
  )

  return (
    <section
      id="projects"
      className="py-20 bg-gradient-to-br from-slate-50 to-white dark:from-background dark:to-[#0a1628] transition-colors duration-300 overflow-hidden relative"
    >
      <div className="absolute inset-0 glow-teal opacity-20" aria-hidden="true" />
      <div className={`absolute top-0 ${isRTL ? "right-0" : "left-0"} w-64 h-64 -mt-32 ${isRTL ? "-mr-32" : "-ml-32"} glow-navy opacity-40`} aria-hidden="true" />
      <div className="container mx-auto px-6 relative z-10">
        <AnimatedSectionHeader title={t("projects.title")} />

        <div
          role="tablist"
          aria-label={t("projects.filter.label")}
          className="flex flex-wrap justify-center gap-2 mb-12"
        >
          {filters.map((filter) => {
            const isActive = activeFilter === filter.id
            return (
              <motion.button
                key={filter.id}
                role="tab"
                aria-selected={isActive}
                aria-controls="projects-list"
                onClick={() => setActiveFilter(filter.id)}
                whileHover={shouldReduceMotion ? undefined : { y: -1 }}
                whileTap={shouldReduceMotion ? undefined : { scale: 0.97 }}
                className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium border transition-colors duration-200 ${
                  isActive
                    ? "bg-teal-700 text-white border-teal-700 dark:bg-teal-400 dark:text-slate-900 dark:border-teal-400"
                    : "bg-white/60 dark:bg-slate-800/60 text-slate-700 dark:text-slate-200 border-slate-300 dark:border-slate-600 hover:border-teal-500 dark:hover:border-teal-400"
                }`}
              >
                {filter.icon}
                {filter.label}
              </motion.button>
            )
          })}
        </div>

        <div id="projects-list" role="tabpanel" className="space-y-12">
          {visibleProjects.map((project, index) => (
            <ProjectCard key={`${project.title}-${index}`} project={project} index={index} />
          ))}
        </div>

        {visibleProjects.length === 0 && (
          <p className="text-center text-slate-500 dark:text-slate-400 py-12">
            {t("projects.empty")}
          </p>
        )}
      </div>
    </section>
  )
}

export default memo(ProjectsComponent)