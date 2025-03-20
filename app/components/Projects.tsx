"use client"

import { motion } from "framer-motion"
import { ExternalLink, Brain, Shield, LineChart } from "lucide-react"
import Image from "next/image"
import AnimatedSectionHeader from "./AnimatedSectionHeader"

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
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg transition-all duration-300 hover:shadow-2xl relative overflow-hidden"
            >
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
                  <a
                    href={project.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    View Project <ExternalLink className="w-4 h-4 ml-1" />
                  </a>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
      <div className="absolute top-0 left-0 w-64 h-64 -mt-32 -ml-32 opacity-20">
        <Image src="/placeholder.svg?height=256&width=256" alt="Decorative background" width={256} height={256} />
      </div>
    </section>
  )
}

