"use client"

import { motion } from "framer-motion"
import { useReducedMotion } from "framer-motion"
import { Quote } from "lucide-react"
import { useState, memo } from "react"
import AnimatedSectionHeader from "./AnimatedSectionHeader"
import { useTranslation } from "@/context/language-utils"

const TestimonialsComponent = () => {
  const [activeIndex, setActiveIndex] = useState(0)
  const { t, isRTL } = useTranslation()
  const shouldReduceMotion = useReducedMotion()

  const testimonials = [
    {
      quote:
        "Kaung's expertise in developing our POS system transformed our business operations. His attention to detail and problem-solving skills are exceptional.",
      name: "Sarah Chen",
      title: "Operations Manager, RetailTech Solutions",
      initials: "SC",
      gradient: "from-teal-400 to-cyan-500",
    },
    {
      quote:
        "Working with Kaung on our fraud detection system was a game-changer. His deep understanding of behavioral biometrics and machine learning delivered results beyond our expectations.",
      name: "Michael Rodriguez",
      title: "CTO, SecureFinance",
      initials: "MR",
      gradient: "from-blue-400 to-teal-500",
    },
    {
      quote:
        "Kaung's ability to translate complex technical requirements into user-friendly solutions is remarkable. His work on our network infrastructure significantly improved our system stability.",
      name: "Priya Sharma",
      title: "IT Director, Global Connect",
      initials: "PS",
      gradient: "from-cyan-400 to-blue-500",
    },
  ]

  const nextTestimonial = () => {
    setActiveIndex((prevIndex) => (prevIndex + 1) % testimonials.length)
  }

  const prevTestimonial = () => {
    setActiveIndex((prevIndex) => (prevIndex - 1 + testimonials.length) % testimonials.length)
  }

  return (
    <section
      id="testimonials"
      className="py-20 section-bg transition-colors duration-300 overflow-hidden relative"
    >
      <div className="absolute inset-0 glow-teal opacity-20" aria-hidden="true" />
      <div className="container mx-auto px-6 relative z-10">
        <AnimatedSectionHeader title={t("testimonials.title")} />

        <div className="max-w-4xl mx-auto">
          <div className="relative">
            <motion.div
              key={activeIndex}
              initial={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              animate={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 1, y: 0 }}
              exit={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: -20 }}
              transition={shouldReduceMotion ? { duration: 0 } : { duration: 0.5 }}
              className="card-glass p-8 md:p-12 rounded-xl shadow-xl"
            >
              <div className={`absolute -top-6 ${isRTL ? "right-10" : "left-10"} text-teal-500 dark:text-teal-400`}>
                <Quote size={48} />
              </div>

              <div aria-live="polite" aria-atomic="true">
                <blockquote className="text-xl md:text-2xl text-foreground dark:text-foreground italic mt-6 mb-8">
                  {testimonials[activeIndex].quote}
                </blockquote>
              </div>

              <div className="flex items-center">
                <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${testimonials[activeIndex].gradient} flex items-center justify-center me-4 shadow-lg`}>
                  <span className="text-xl font-bold text-white">{testimonials[activeIndex].initials}</span>
                </div>
                <div>
                  <p className="font-semibold text-lg text-foreground">
                    {testimonials[activeIndex].name}
                  </p>
                  <p className="text-muted-foreground">{testimonials[activeIndex].title}</p>
                </div>
              </div>
            </motion.div>

            <div className="flex justify-center mt-8 gap-4">
              <button
                onClick={prevTestimonial}
                className="p-2 rounded-full card-glass shadow-md hover:bg-accent transition-colors duration-300"
                aria-label={t("testimonials.prev")}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-primary dark:text-primary"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>

              <div className="flex gap-2">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveIndex(index)}
                    className={`min-w-[44px] min-h-[44px] flex items-center justify-center w-3 h-3 rounded-full transition-colors duration-300 ${
                      index === activeIndex
                        ? "bg-primary dark:bg-primary"
                        : "bg-muted-foreground/30 dark:bg-muted-foreground/30 hover:bg-primary/60 dark:hover:bg-primary/60"
                    }`}
                    aria-label={t("testimonials.goto", { number: index + 1, total: testimonials.length })}
                    aria-current={index === activeIndex ? "true" : "false"}
                  />
                ))}
              </div>

              <button
                onClick={nextTestimonial}
                className="p-2 rounded-full card-glass shadow-md hover:bg-accent transition-colors duration-300"
                aria-label={t("testimonials.next")}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-primary dark:text-primary"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default memo(TestimonialsComponent)