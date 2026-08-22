"use client"

import { useState, useTransition } from "react"
import { motion, TargetAndTransition } from "framer-motion"
import { useReducedMotion } from "framer-motion"
import { Mail, Phone, MapPin } from "lucide-react"
import AnimatedSectionHeader from "./AnimatedSectionHeader"
import { useTranslation } from "@/context/language-utils"
import { useI18nForm } from "@/hooks/use-i18n-form"
import { useLanguageAnimation } from "@/hooks/use-language-animation"
import { memo } from "react"

const ContactComponent = () => {
  const { t, isRTL: _isRTL } = useTranslation()
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle")
  const [isSubmitting, startTransition] = useTransition()
  const shouldReduceMotion = useReducedMotion()
  
  const animation = useLanguageAnimation({}) as unknown as { initial: TargetAndTransition; animate: TargetAndTransition; transition: object }
  
  const { handleChange, handleBlur, errors, validateField } = useI18nForm({
    customFields: {
      name: { required: true, minLength: 2 },
      email: { required: true, pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ },
      subject: { required: true, minLength: 5 },
      message: { required: true, minLength: 10 },
    },
  } as any)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    startTransition(async () => {
      setSubmitStatus("idle")

      const form = e.currentTarget
      const formData = new FormData(form)

      const validations = {
        name: validateField("name"),
        email: validateField("email"),
        subject: validateField("subject"),
        message: validateField("message"),
      }

      const hasErrors = Object.values(validations).some((result) => Array.isArray(result))
      if (hasErrors) {
        setSubmitStatus("error")
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
      } catch (_error) {
        setSubmitStatus("error")
      }
    })
  }

  return (
    <section
      id="contact"
      className="py-20 bg-gradient-to-br from-slate-50 to-white dark:from-[#070c16] dark:to-[#0a1628] transition-colors duration-300"
    >
      <div className="container mx-auto px-6">
        <AnimatedSectionHeader title={t("contact.title")} />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-4xl mx-auto">
          <motion.div
            className="space-y-6"
            initial={shouldReduceMotion ? animation.initial : animation.initial}
            animate={shouldReduceMotion ? animation.animate : animation.animate}
            transition={shouldReduceMotion ? { duration: 0 } : animation.transition}
          >
            <h3 className="text-2xl font-semibold mb-4 dark:text-white">{t("contact.info")}</h3>
            
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-full bg-teal-500/10 text-teal-600 dark:text-teal-400">
                <Mail size={24} />
              </div>
              <div>
                <h4 className="font-medium dark:text-gray-200">{t("contact.email")}</h4>
                <a
                  href="mailto:kaungthu.sithu97@gmail.com"
                  className="text-gray-600 dark:text-gray-400 hover:text-teal-600 dark:hover:text-teal-400"
                >
                  kaungthu.sithu97@gmail.com
                </a>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="p-3 rounded-full bg-teal-500/10 text-teal-600 dark:text-teal-400">
                <Phone size={24} />
              </div>
              <div>
                <h4 className="font-medium dark:text-gray-200">{t("contact.phone")}</h4>
                <a
                  href="tel:+1234567890"
                  className="text-gray-600 dark:text-gray-400 hover:text-teal-600 dark:hover:text-teal-400"
                >
                  +1 (234) 567-890
                </a>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="p-3 rounded-full bg-teal-500/10 text-teal-600 dark:text-teal-400">
                <MapPin size={24} />
              </div>
              <div>
                <h4 className="font-medium dark:text-gray-200">{t("contact.address")}</h4>
                <p className="text-gray-600 dark:text-gray-400">Singapore</p>
              </div>
            </div>

            <div className="mt-8">
              <h4 className="text-xl font-semibold mb-2 dark:text-white">{t("contact.connect")}</h4>
              <p className="text-gray-600 dark:text-gray-400">{t("contact.connect.desc")}</p>
            </div>
          </motion.div>

          <motion.form
            className="space-y-6"
            onSubmit={handleSubmit}
            initial={shouldReduceMotion ? animation.initial : animation.initial}
            animate={shouldReduceMotion ? animation.animate : animation.animate}
            transition={shouldReduceMotion ? { duration: 0 } : { ...(animation.transition || {}), delay: 0.2 }}
          >
            <div>
              <label htmlFor="name" className="block text-sm font-medium mb-2 dark:text-white">
                {t("contact.form.name")}
              </label>
              <input
                type="text"
                id="name"
                name="name"
                autoComplete="name"
                required
                onChange={(e) => handleChange(e)}
                onBlur={(e) => handleBlur(e)}
                className={`w-full px-4 py-2 rounded-lg border bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-gray-800 focus:border-teal-500 outline-none transition-colors ${errors.name ? "border-red-500 dark:border-red-400" : "border-gray-300 dark:border-gray-600"}`}
                aria-invalid={!!errors.name}
                aria-describedby={errors.name ? "name-error" : undefined}
              />
              {errors.name && <p id="name-error" className="text-red-500 text-sm mt-1">{errors.name}</p>}
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-2 dark:text-white">
                {t("contact.form.email")}
              </label>
              <input
                type="email"
                id="email"
                name="email"
                autoComplete="email"
                onChange={(e) => handleChange(e)}
                onBlur={(e) => handleBlur(e)}
                className={`w-full px-4 py-2 rounded-lg border bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-gray-800 focus:border-teal-500 outline-none transition-colors ${errors.email ? "border-red-500 dark:border-red-400" : "border-gray-300 dark:border-gray-600"}`}
                aria-invalid={!!errors.email}
                aria-describedby={errors.email ? "email-error" : undefined}
              />
              {errors.email && <p id="email-error" className="text-red-500 text-sm mt-1">{errors.email}</p>}
            </div>

            <div>
              <label htmlFor="subject" className="block text-sm font-medium mb-2 dark:text-white">
                {t("contact.form.subject")}
              </label>
              <input
                type="text"
                id="subject"
                autoComplete="subject"
                onChange={(e) => handleChange(e)}
                onBlur={(e) => handleBlur(e)}
                name="subject"
                className={`w-full px-4 py-2 rounded-lg border bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-gray-800 focus:border-teal-500 outline-none transition-colors ${errors.subject ? "border-red-500 dark:border-red-400" : "border-gray-300 dark:border-gray-600"}`}
                aria-invalid={!!errors.subject}
                aria-describedby={errors.subject ? "subject-error" : undefined}
              />
              {errors.subject && <p id="subject-error" className="text-red-500 text-sm mt-1">{errors.subject}</p>}
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
                className={`w-full px-4 py-2 rounded-lg border bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-gray-800 focus:border-teal-500 outline-none transition-colors ${errors.message ? "border-red-500 dark:border-red-400" : "border-gray-300 dark:border-gray-600"}`}
                aria-invalid={!!errors.message}
                aria-describedby={errors.message ? "message-error" : undefined}
              />
              {errors.message && <p id="message-error" className="text-red-500 text-sm mt-1">{errors.message}</p>}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full py-3 px-6 rounded-lg bg-teal-600 text-white font-medium hover:bg-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 transition-colors ${
                isSubmitting ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {isSubmitting ? t("contact.form.sending") : t("contact.form.send")}
            </button>

            {submitStatus === "success" && (
              <motion.p
                initial={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
                animate={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 1, y: 0 }}
                className="text-teal-600 dark:text-teal-400 text-center"
              >
                {t("contact.form.success")}
              </motion.p>
            )}

            {submitStatus === "error" && (
              <motion.p
                initial={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
                animate={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 1, y: 0 }}
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

export default memo(ContactComponent)