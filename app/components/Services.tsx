"use client"

import { motion } from "framer-motion"
import { useReducedMotion } from "framer-motion"
import { Code, Layout, Server, Smartphone } from "lucide-react"
import Image from "next/image"
import { useTranslation } from "@/context/language-utils"
import { memo } from "react"

// Audit P0-2: respect reduced motion preference

// Audit P0-5: memoized presentational component

const ServicesComponent = () => {
  const { t, isRTL } = useTranslation()
  const shouldReduceMotion = useReducedMotion()

  const services = [
    {
      icon: <Layout className="w-12 h-12 text-blue-500" />,
      title: t("services.web"),
      description: t("services.web.desc"),
    },
    {
      icon: <Server className="w-12 h-12 text-green-500" />,
      title: t("services.backend"),
      description: t("services.backend.desc"),
    },
    {
      icon: <Code className="w-12 h-12 text-purple-500" />,
      title: t("services.api"),
      description: t("services.api.desc"),
    },
    {
      icon: <Smartphone className="w-12 h-12 text-yellow-500" />,
      title: t("services.responsive"),
      description: t("services.responsive.desc"),
    },
  ]

  const item = {
    hidden: { opacity: 0, y: 50 },
    show: { opacity: 1, y: 0 },
  }

  return (
    <section
      id="services"
      className="py-20 bg-gradient-to-br from-indigo-50 to-blue-100 dark:from-gray-900 dark:to-blue-900 transition-colors duration-300 overflow-hidden relative"
    >
      <div className="container mx-auto px-6 relative z-10">
        <motion.h2
          className="text-4xl font-bold mb-12 text-center dark:text-white"
          initial={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={shouldReduceMotion ? undefined : { once: true, margin: "-50px" }}
          transition={shouldReduceMotion ? { duration: 0 } : { duration: 0.5 }}
        >
          {t("services.title")}
        </motion.h2>
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-8"
          initial={shouldReduceMotion ? { opacity: 1 } : "hidden"}
          whileInView={shouldReduceMotion ? undefined : "show"}
          viewport={shouldReduceMotion ? undefined : { once: true, margin: "-50px" }}
          transition={shouldReduceMotion ? { duration: 0 } : { staggerChildren: 0.1 }}
        >
          {services.map((service, index) => (
            <motion.div
              key={index}
              className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md hover:shadow-xl ring-1 ring-gray-200/50 dark:ring-gray-700/50 hover:ring-blue-500/30 transition-all duration-300"
              variants={item}
              whileHover={shouldReduceMotion ? undefined : { scale: 1.03 }}
            >
              <div className="flex items-center mb-4">
                {service.icon}
                <h3 className="text-2xl font-semibold ms-4 dark:text-white">{service.title}</h3>
              </div>
              <p className="text-gray-600 dark:text-gray-300">{service.description}</p>
            </motion.div>
            ))}
          </motion.div>
        </div>
      <div className={`absolute top-0 ${isRTL ? "right-0" : "left-0"} w-64 h-64 -mt-32 ${isRTL ? "-mr-32" : "-ml-32"} opacity-20`}>
        <Image src="/placeholder.svg?height=256&width=256" alt="Decorative background" width={256} height={256} />
      </div>
    </section>
  )
}

// Audit P0-5: memoized presentational component

export default memo(ServicesComponent)
