"use client"

import { motion } from "framer-motion"
import { ExternalLink, Brain, Shield, LineChart, ChevronDown, ChevronUp } from "lucide-react"
import Image from "next/image"
import AnimatedSectionHeader from "./AnimatedSectionHeader"
import { useState } from "react"

interface ProjectProps {
  title: string
  period: string
  link: string
  icon: JSX.Element
  description: string
  achievements: string[]
  caseStudy?: {
    challenge: string
    approach: string
    results: string
    technologies: string[]
  }
}

const Project = ({ project, index }: { project: ProjectProps; index: number }) => {
  const [expanded, setExpanded] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.2 }}
      className="bg-white dark:bg-gray-800 rounded-xl shadow-lg transition-all duration-300 hover:shadow-2xl relative overflow-hidden"
    >
      <div className="p-8">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="md:w-1/6 flex justify-center">
            <div className="p-4 bg-indigo-50 dark:bg-indigo-900/30 rounded-full">{project.icon}</div>
          </div>
          <div className="md:w-5/6">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
              <h3 className="text-2xl font-semibold dark:text-white">{project.title}</h3>
              <p className="text-gray-600 dark:text-gray-400">{project.period}</p>
            </div>
            <p className="text-gray-700 dark:text-gray-300 mb-4">{project.description}</p>
            <h4 className="font-semibold text-lg mb-2 dark:text-gray-200">Key Achievements:</h4>
            <ul className="list-none space-y-2 mb-4">
              {project.achievements.map((achievement, idx) => (
                <li key={idx} className="text-gray-700 dark:text-gray-300 flex items-start">
                  <span className="text-blue-500 mr-2">•</span>
                  {achievement}
                </li>
              ))}
            </ul>

            <div className="flex items-center justify-between">
              <a
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:underline"
              >
                View Project <ExternalLink className="w-4 h-4 ml-1" />
              </a>

              {project.caseStudy && (
                <button
                  onClick={() => setExpanded(!expanded)}
                  className="flex items-center gap-1 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                  aria-expanded={expanded}
                  aria-controls={`case-study-${index}`}
                >
                  {expanded ? "Hide Case Study" : "View Case Study"}
                  {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
              )}
            </div>
          </div>
        </div>

        {project.caseStudy && (
          <motion.div
            id={`case-study-${index}`}
            initial={{ height: 0, opacity: 0 }}
            animate={{
              height: expanded ? "auto" : 0,
              opacity: expanded ? 1 : 0,
            }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden mt-6"
          >
            <div className="border-t border-gray-200 dark:border-gray-700 pt-6 mt-2">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h5 className="font-semibold text-gray-900 dark:text-white mb-2">Challenge</h5>
                  <p className="text-gray-700 dark:text-gray-300">{project.caseStudy.challenge}</p>
                </div>
                <div>
                  <h5 className="font-semibold text-gray-900 dark:text-white mb-2">Approach</h5>
                  <p className="text-gray-700 dark:text-gray-300">{project.caseStudy.approach}</p>
                </div>
                <div>
                  <h5 className="font-semibold text-gray-900 dark:text-white mb-2">Results</h5>
                  <p className="text-gray-700 dark:text-gray-300">{project.caseStudy.results}</p>
                </div>
                <div>
                  <h5 className="font-semibold text-gray-900 dark:text-white mb-2">Technologies Used</h5>
                  <div className="flex flex-wrap gap-2">
                    {project.caseStudy.technologies.map((tech, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded-full text-sm"
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
}

export default function Projects() {
  const projects = [
    {
      title: "Mouse Dynamics for Online Assessment Fraud Detection",
      period: "May 2024 - Nov 2024",
      link: "https://drive.google.com/drive/folders/1JKdj1e25EfPqS-CrV7MjFFVXa8l-GItE",
      icon: <Shield className="w-10 h-10 text-blue-500" />,
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
    },
    {
      title: "Mouse Dynamics Biometric Fraud Detection System using Deep Learning",
      period: "May 2024 - Nov 2024",
      link: "https://drive.google.com/drive/folders/1SKbM027E4zU-2a9kLFBKcUMcd9hGhhJ",
      icon: <Brain className="w-10 h-10 text-purple-500" />,
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
    },
    {
      title: "Continuous Authentication with Behavioral Biometrics",
      period: "May 2024 - Nov 2024",
      link: "https://drive.google.com/drive/folders/1JKdj1e25EfPqS-CrV7MjFFVXa8l-GItE",
      icon: <LineChart className="w-10 h-10 text-green-500" />,
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
    },
  ]

  return (
    <section
      id="projects"
      className="py-20 bg-gradient-to-br from-indigo-50 to-purple-100 dark:from-gray-900 dark:to-purple-900 transition-colors duration-300 overflow-hidden relative"
    >
      <div className="container mx-auto px-6 relative z-10">
        <AnimatedSectionHeader title="Featured Projects" />
        <div className="space-y-12">
          {projects.map((project, index) => (
            <Project key={index} project={project} index={index} />
          ))}
        </div>
      </div>
      <div className="absolute top-0 left-0 w-64 h-64 -mt-32 -ml-32 opacity-20">
        <Image src="/placeholder.svg?height=256&width=256" alt="Decorative background" width={256} height={256} />
      </div>
    </section>
  )
}
