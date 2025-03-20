"use client"

import { GraduationCap, Calendar, Award, BookOpen } from "lucide-react"
import Image from "next/image"
import AnimatedSectionHeader from "./AnimatedSectionHeader"
import { motion } from "framer-motion"

export default function Education() {
  const education = [
    {
      degree: "Master of Information Technology (Business Informatics)",
      institution: "James Cook University Singapore",
      period: "Mar 2024 – Apr 2025",
      achievements: [
        "Specializing in data analytics and business intelligence",
        "Conducting research in behavioral biometrics and fraud detection",
        "Developing advanced machine learning models for security applications",
      ],
    },
    {
      degree: "Bachelor of Information Technology",
      institution: "James Cook University Singapore",
      period: "Nov 2022 – Feb 2024",
      achievements: [
        "Focused on software development and system design",
        "Completed projects in user interface design and application development",
        "Gained expertise in multiple programming languages and frameworks",
      ],
    },
    {
      degree: "Higher National Diploma of Software Engineering (Level 5)",
      institution: "INET IT ACADEMY",
      period: "Mar 2018 – Oct 2022",
      achievements: [
        "Developed foundational knowledge in software engineering principles",
        "Completed practical projects in application development",
        "Learned system analysis and design methodologies",
      ],
    },
  ]

  const certifications = [
    {
      title: "Bachelor of Information Technology",
      issuer: "James Cook University Singapore",
    },
    {
      title: "Google Data Analytics",
      issuer: "Google",
    },
  ]

  return (
    <section
      id="education"
      className="py-20 bg-gradient-to-br from-indigo-50 to-purple-100 dark:from-gray-900 dark:to-purple-900 transition-colors duration-300 overflow-hidden relative"
    >
      <div className="container mx-auto px-6 relative z-10">
        <AnimatedSectionHeader title="Education & Certifications" />
        <div className="max-w-4xl mx-auto">
          <div className="space-y-8 mb-16">
            {education.map((edu, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg transition-all duration-300 hover:shadow-2xl relative overflow-hidden"
              >
                <div className="absolute top-0 left-0 w-32 h-32 bg-purple-200 dark:bg-purple-700 rounded-br-full z-0 opacity-50"></div>
                <div className="relative z-10">
                  <h3 className="text-2xl font-semibold mb-2 dark:text-white flex items-center">
                    <GraduationCap className="w-6 h-6 mr-2" />
                    {edu.degree}
                  </h3>
                  <p className="text-xl text-gray-600 dark:text-gray-300 mb-4">{edu.institution}</p>
                  <p className="text-gray-600 dark:text-gray-300 mb-4 flex items-center">
                    <Calendar className="w-4 h-4 mr-2" />
                    {edu.period}
                  </p>
                  <h4 className="text-lg font-medium mb-2 dark:text-gray-200 flex items-center">
                    <Award className="w-5 h-5 mr-2" />
                    Key Achievements:
                  </h4>
                  <ul className="list-disc list-inside space-y-2">
                    {edu.achievements.map((achievement, idx) => (
                      <li key={idx} className="text-gray-700 dark:text-gray-300">
                        {achievement}
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg"
          >
            <h3 className="text-2xl font-semibold mb-6 dark:text-white flex items-center">
              <BookOpen className="w-6 h-6 mr-2" />
              Certifications
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {certifications.map((cert, index) => (
                <div key={index} className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                  <h4 className="font-medium dark:text-white">{cert.title}</h4>
                  <p className="text-gray-600 dark:text-gray-400">{cert.issuer}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
      <div className="absolute top-0 left-0 w-64 h-64 -mt-32 -ml-32 opacity-20">
        <Image src="/placeholder.svg?height=256&width=256" alt="Decorative background" width={256} height={256} />
      </div>
    </section>
  )
}

