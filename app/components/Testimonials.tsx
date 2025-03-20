"use client"

import { motion } from "framer-motion"
import { Quote } from "lucide-react"
import { useState } from "react"
import AnimatedSectionHeader from "./AnimatedSectionHeader"

export default function Testimonials() {
  const [activeIndex, setActiveIndex] = useState(0)

  const testimonials = [
    {
      quote:
        "Kaung's expertise in developing our POS system transformed our business operations. His attention to detail and problem-solving skills are exceptional.",
      name: "Sarah Chen",
      title: "Operations Manager, RetailTech Solutions",
      image: "/placeholder.svg?height=80&width=80",
    },
    {
      quote:
        "Working with Kaung on our fraud detection system was a game-changer. His deep understanding of behavioral biometrics and machine learning delivered results beyond our expectations.",
      name: "Michael Rodriguez",
      title: "CTO, SecureFinance",
      image: "/placeholder.svg?height=80&width=80",
    },
    {
      quote:
        "Kaung's ability to translate complex technical requirements into user-friendly solutions is remarkable. His work on our network infrastructure significantly improved our system stability.",
      name: "Priya Sharma",
      title: "IT Director, Global Connect",
      image: "/placeholder.svg?height=80&width=80",
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
      className="py-20 bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900 dark:to-blue-900 transition-colors duration-300 overflow-hidden relative"
    >
      <div className="container mx-auto px-6 relative z-10">
        <AnimatedSectionHeader title="Client Testimonials" />

        <div className="max-w-4xl mx-auto">
          <div className="relative">
            <motion.div
              key={activeIndex}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="bg-white dark:bg-gray-800 p-8 md:p-12 rounded-xl shadow-xl"
            >
              <div className="absolute -top-6 left-10 text-blue-500 dark:text-blue-400">
                <Quote size={48} />
              </div>

              <blockquote className="text-xl md:text-2xl text-gray-700 dark:text-gray-300 italic mt-6 mb-8">
                "{testimonials[activeIndex].quote}"
              </blockquote>

              <div className="flex items-center">
                <div className="w-16 h-16 rounded-full overflow-hidden mr-4">
                  <img
                    src={testimonials[activeIndex].image || "/placeholder.svg"}
                    alt={testimonials[activeIndex].name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <p className="font-semibold text-lg text-gray-900 dark:text-white">
                    {testimonials[activeIndex].name}
                  </p>
                  <p className="text-gray-600 dark:text-gray-400">{testimonials[activeIndex].title}</p>
                </div>
              </div>
            </motion.div>

            <div className="flex justify-center mt-8 space-x-4">
              <button
                onClick={prevTestimonial}
                className="p-2 rounded-full bg-white dark:bg-gray-800 shadow-md hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors duration-300"
                aria-label="Previous testimonial"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-blue-600 dark:text-blue-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>

              <div className="flex space-x-2">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveIndex(index)}
                    className={`w-3 h-3 rounded-full ${
                      index === activeIndex
                        ? "bg-blue-600 dark:bg-blue-400"
                        : "bg-gray-300 dark:bg-gray-600 hover:bg-blue-400 dark:hover:bg-blue-500"
                    } transition-colors duration-300`}
                    aria-label={`Go to testimonial ${index + 1}`}
                    aria-current={index === activeIndex ? "true" : "false"}
                  />
                ))}
              </div>

              <button
                onClick={nextTestimonial}
                className="p-2 rounded-full bg-white dark:bg-gray-800 shadow-md hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors duration-300"
                aria-label="Next testimonial"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-blue-600 dark:text-blue-400"
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

