"use client"

import { motion } from "framer-motion"
import { Code, Database, Server, Globe, Brain, TrendingUp } from "lucide-react"
import Image from "next/image"

export default function About() {
  const skills = [
    {
      icon: <Code className="w-8 h-8 text-blue-500" />,
      title: "Frontend",
      description: "JavaScript, HTML5, CSS, UI Design",
    },
    {
      icon: <Server className="w-8 h-8 text-green-500" />,
      title: "Backend",
      description: "Python, Java, C++, .NET",
    },
    {
      icon: <Database className="w-8 h-8 text-purple-500" />,
      title: "Database",
      description: "SQL, Data Management",
    },
    {
      icon: <Brain className="w-8 h-8 text-yellow-500" />,
      title: "AI/ML",
      description: "Behavioral Biometrics, Deep Learning",
    },
    {
      icon: <TrendingUp className="w-8 h-8 text-red-500" />,
      title: "Digital Marketing",
      description: "SEO, Analytics, Content Strategy",
    },
    {
      icon: <Globe className="w-8 h-8 text-indigo-500" />,
      title: "Languages",
      description: "English, Burmese, Chinese, Japanese",
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
          About Me
        </motion.h2>
        <div className="flex flex-col md:flex-row items-center justify-between">
          <motion.div
            className="md:w-1/2 mb-8 md:mb-0"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <p className="text-xl text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
              As a passionate Software Developer based in Singapore, I specialize in developing robust applications with
              a focus on user experience and system optimization. With over 4 years at eVolva Software House, I've
              transformed business operations through innovative POS systems and network solutions.
            </p>
            <p className="text-xl text-gray-700 dark:text-gray-300 leading-relaxed">
              My recent research focuses on cutting-edge behavioral biometrics and fraud detection using machine
              learning. I'm also certified in digital marketing fundamentals, allowing me to bridge technical
              development with effective market strategies. I'm currently pursuing my Master's in Information Technology
              with a Business Informatics major at James Cook University Singapore, where I continue to expand my
              expertise in data analytics and AI applications.
            </p>

            <motion.div
              className="mt-8 p-4 border-l-4 border-blue-500 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-400 rounded"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <p className="italic text-gray-700 dark:text-gray-300">
                "I believe in creating technology that not only solves problems but enhances human experiences. My goal
                is to build secure, efficient, and user-friendly solutions that make a real difference."
              </p>
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
        <Image src="/placeholder.svg?height=256&width=256" alt="Decorative background" width={256} height={256} />
      </div>
    </section>
  )
}

