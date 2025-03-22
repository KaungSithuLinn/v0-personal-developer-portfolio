"use client"

import { useState } from "react"
import { GraduationCap, Calendar, Award, BookOpen, ExternalLink, Check } from "lucide-react"
import Image from "next/image"
import AnimatedSectionHeader from "./AnimatedSectionHeader"
import { motion } from "framer-motion"

export default function Education() {
  const [expandedCert, setExpandedCert] = useState<number | null>(null)

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
      title: "The Fundamentals of Digital Marketing",
      issuer: "Google Digital Garage",
      date: "April 3, 2023",
      image: "/images/digitalgarage_certificate.jpg",
      verificationUrl: "https://learndigital.withgoogle.com/link/1qsdpcedm9s",
      certId: "FMA TTQ H4J",
      description:
        "Comprehensive certification covering digital marketing fundamentals, including search engine optimization, social media marketing, and analytics.",
    },
    {
      title: "Bachelor of Information Technology",
      issuer: "James Cook University Singapore",
      date: "February 2024",
      description:
        "Degree certification in Information Technology with focus on software development and system design.",
    },
    {
      title: "Google Data Analytics",
      issuer: "Google",
      date: "2023",
      description:
        "Professional certification covering data analysis, visualization, and interpretation using Google's analytics tools.",
    },
  ]

  const toggleCertificate = (index: number) => {
    if (expandedCert === index) {
      setExpandedCert(null)
    } else {
      setExpandedCert(index)
    }
  }

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
            <div className="space-y-6">
              {certifications.map((cert, index) => (
                <div
                  key={index}
                  className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden transition-all duration-300"
                >
                  <div
                    className="p-4 bg-gray-50 dark:bg-gray-800 cursor-pointer flex justify-between items-center"
                    onClick={() => toggleCertificate(index)}
                  >
                    <div>
                      <h4 className="font-medium dark:text-white text-lg">{cert.title}</h4>
                      <div className="flex items-center text-gray-600 dark:text-gray-400 text-sm mt-1">
                        <span>{cert.issuer}</span>
                        <span className="mx-2">•</span>
                        <span>{cert.date}</span>
                      </div>
                    </div>
                    <button
                      className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                      aria-label={
                        expandedCert === index ? "Collapse certificate details" : "Expand certificate details"
                      }
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className={`h-5 w-5 transition-transform duration-300 ${expandedCert === index ? "transform rotate-180" : ""}`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                  </div>

                  <div
                    className={`overflow-hidden transition-all duration-300 ${
                      expandedCert === index ? "max-h-[2000px]" : "max-h-0"
                    }`}
                  >
                    <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                      <p className="text-gray-700 dark:text-gray-300 mb-4">{cert.description}</p>

                      {cert.image && (
                        <div className="mb-4">
                          <div className="relative w-full h-[400px] rounded-lg overflow-hidden shadow-md mb-4">
                            <Image
                              src={cert.image || "/placeholder.svg"}
                              alt={`${cert.title} Certificate`}
                              fill
                              className="object-contain"
                            />
                          </div>

                          {cert.verificationUrl && cert.certId && (
                            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                              <h5 className="font-medium text-blue-700 dark:text-blue-300 mb-2 flex items-center">
                                <Check className="w-4 h-4 mr-2" /> Verification Details
                              </h5>
                              <p className="text-gray-700 dark:text-gray-300 mb-2">
                                Verify the authenticity of this certificate at:
                                <a
                                  href={cert.verificationUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-blue-600 dark:text-blue-400 ml-1 inline-flex items-center hover:underline"
                                >
                                  {cert.verificationUrl.replace("https://", "")}
                                  <ExternalLink className="w-3 h-3 ml-1" />
                                </a>
                              </p>
                              <p className="text-gray-700 dark:text-gray-300">
                                Certificate ID:{" "}
                                <span className="font-mono bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded text-sm">
                                  {cert.certId}
                                </span>
                              </p>
                            </div>
                          )}
                        </div>
                      )}

                      <div className="flex justify-end">
                        {cert.verificationUrl && (
                          <a
                            href={cert.verificationUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:underline"
                          >
                            Verify Certificate <ExternalLink className="w-4 h-4 ml-1" />
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
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

