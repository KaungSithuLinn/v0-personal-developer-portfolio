"use client"

import { useState } from "react"
import { motion, TargetAndTransition } from "framer-motion"
import { Mail, Phone, MapPin } from "lucide-react"
import AnimatedSectionHeader from "./AnimatedSectionHeader"
import { useTranslation } from "@/context/language-utils"
import { useI18nForm } from "@/hooks/use-i18n-form"
import { useLanguageAnimation } from "@/hooks/use-language-animation"

interface AnimationConfig {
  direction?: 'x' | 'y'; // Ensure 'direction' is part of the type
  initial?: TargetAndTransition;
  animate?: TargetAndTransition;
  transition?: object;
}

// Remove duplicate interface and use AnimationConfig instead

export default function Contact() {
  const { t, isRTL } = useTranslation()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle")
  
  const animation = useLanguageAnimation({}) as unknown as { initial: TargetAndTransition; animate: TargetAndTransition; transition: object }
  
  const { handleChange, handleBlur, errors, validateField } = useI18nForm({
    customFields: {
      name: { required: true, minLength: 2 },
      email: { required: true, pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ },
      subject: { required: true, minLength: 5 },
      message: { required: true, minLength: 10 },
    },
  } as any) // Cast to 'any' if the type cannot be modified

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus("idle")

    const form = e.currentTarget
    const formData = new FormData(form)
    const data = Object.fromEntries(formData)

    // Validate all fields
    const validations = {
      name: validateField("name"),
      email: validateField("email"),
      subject: validateField("subject"),
      message: validateField("message"),
    }

    // Check if there are any validation errors
    const hasErrors = Object.values(validations).some((result) => Array.isArray(result))
    if (hasErrors) {
      setSubmitStatus("error")
      setIsSubmitting(false)
      return
    }

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        body: formData,
      })

      if (response.ok) {
        setSubmitStatus("success")
        form.reset()
      } else {
        setSubmitStatus("error")
      }
    } catch (error) {
      setSubmitStatus("error")
    }

    setIsSubmitting(false)
  }

  return (
    <section
      id="contact"
      className="py-20 bg-gradient-to-br from-indigo-50 to-blue-100 dark:from-gray-900 dark:to-blue-900 transition-colors duration-300"
    >
      <div className="container mx-auto px-6">
        <AnimatedSectionHeader title={t("contact.title")} />

        <div className={`grid grid-cols-1 md:grid-cols-2 gap-12 max-w-4xl mx-auto ${isRTL ? "md:flex-row-reverse" : ""}`}>
          {/* Contact Information */}
          <motion.div
            className="space-y-6"
            initial={animation.initial}
            animate={animation.animate}
            transition={animation.transition}
          >
            <h3 className="text-2xl font-semibold mb-4 dark:text-white">{t("contact.info")}</h3>
            
            <div className={`flex items-center gap-4 ${isRTL ? "flex-row-reverse" : ""}`}>
              <div className="p-3 rounded-full bg-blue-500/10 text-blue-500">
                <Mail size={24} />
              </div>
              <div>
                <h4 className="font-medium dark:text-gray-200">{t("contact.email")}</h4>
                <a
                  href="mailto:your.email@example.com"
                  className="text-gray-600 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400"
                >
                  your.email@example.com
                </a>
              </div>
            </div>

            <div className={`flex items-center gap-4 ${isRTL ? "flex-row-reverse" : ""}`}>
              <div className="p-3 rounded-full bg-green-500/10 text-green-500">
                <Phone size={24} />
              </div>
              <div>
                <h4 className="font-medium dark:text-gray-200">{t("contact.phone")}</h4>
                <a
                  href="tel:+1234567890"
                  className="text-gray-600 dark:text-gray-400 hover:text-green-500 dark:hover:text-green-400"
                >
                  +1 (234) 567-890
                </a>
              </div>
            </div>

            <div className={`flex items-center gap-4 ${isRTL ? "flex-row-reverse" : ""}`}>
              <div className="p-3 rounded-full bg-purple-500/10 text-purple-500">
                <MapPin size={24} />
              </div>
              <div>
                <h4 className="font-medium dark:text-gray-200">{t("contact.address")}</h4>
                <p className="text-gray-600 dark:text-gray-400">Singapore</p>
              </div>
            </div>

            <div className={`mt-8 ${isRTL ? "text-right" : ""}`}>
              <h4 className="text-xl font-semibold mb-2 dark:text-white">{t("contact.connect")}</h4>
              <p className="text-gray-600 dark:text-gray-400">{t("contact.connect.desc")}</p>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.form
            className="space-y-6"
            onSubmit={handleSubmit}
            initial={animation.initial}
            animate={animation.animate}
            transition={{ ...(animation.transition || {}), delay: 0.2 }}
          >
            <div>
              <label htmlFor="name" className="block text-sm font-medium mb-2 dark:text-white">
                {t("contact.form.name")}
              </label>
              <input
                type="text"
                id="name"
                name="name"
                required
                onChange={(e) => handleChange(e)}
                onBlur={(e) => handleBlur(e)}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-colors"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-2 dark:text-white">
                {t("contact.form.email")}
              </label>
              <input
                type="email"
                id="email"
                name="email"
                onChange={(e) => handleChange(e)}
                onBlur={(e) => handleBlur(e)}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-colors"
              />
            </div>

            <div>
              <label htmlFor="subject" className="block text-sm font-medium mb-2 dark:text-white">
                {t("contact.form.subject")}
              </label>
              <input
                type="text"
                id="subject"
                onChange={(e) => handleChange(e)}
                onBlur={(e) => handleBlur(e)}
                name="subject"
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-colors"
              />
            </div>

            <div>
              <label htmlFor="message" className="block text-sm font-medium mb-2 dark:text-white">
                {t("contact.form.message")}
              </label>
              <textarea
                id="message"
                name="message"
                rows={4}
                required
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-colors"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full py-3 px-6 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors ${
                isSubmitting ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {isSubmitting ? t("contact.form.sending") : t("contact.form.send")}
            </button>

            {submitStatus === "success" && (
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-green-500 dark:text-green-400 text-center"
              >
                {t("contact.form.success")}
              </motion.p>
            )}

            {submitStatus === "error" && (
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-red-500 dark:text-red-400 text-center"
              >
                {t("contact.form.error")}
              </motion.p>
            )}
          </motion.form>
        </div>
      </div>
    </section>
  )
}
