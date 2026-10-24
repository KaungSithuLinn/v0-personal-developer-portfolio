"use client"

import { useState, useTransition, useRef, useEffect } from "react"
import { motion } from "framer-motion"
import { useReducedMotion } from "framer-motion"
import { Mail, MapPin } from "lucide-react"
import AnimatedSectionHeader from "./AnimatedSectionHeader"
import { useTranslation } from "@/context/language-utils"
import { useI18nForm } from "@/hooks/use-i18n-form"
import { useLanguageAnimation } from "@/hooks/use-language-animation"
import { memo } from "react"

const ContactComponent = () => {
  const { t, isRTL: _isRTL } = useTranslation()
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle")
  const [isSubmitting, startTransition] = useTransition()
  const [consent, setConsent] = useState(false)
  const shouldReduceMotion = useReducedMotion()
  const statusRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (submitStatus !== "idle" && statusRef.current) {
      statusRef.current.focus()
    }
  }, [submitStatus])

  const animation = useLanguageAnimation({}) as unknown as { initial: any; animate: any; transition: any }

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
      if (hasErrors || !consent) {
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
          setConsent(false)
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
      className="py-20 section-bg transition-colors duration-300"
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
            <h3 className="text-2xl font-semibold mb-4 text-foreground">{t("contact.info")}</h3>
            
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-full bg-primary/10 text-primary">
                <Mail size={24} aria-hidden="true" />
              </div>
              <div>
                <h4 className="font-medium text-foreground">{t("contact.email")}</h4>
                <a
                  href="mailto:kaungthu.sithu97@gmail.com"
                  className="text-muted-foreground hover:text-primary transition-colors min-h-[44px] inline-flex items-center"
                >
                  kaungthu.sithu97@gmail.com
                </a>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="p-3 rounded-full bg-primary/10 text-primary">
                <MapPin size={24} aria-hidden="true" />
              </div>
              <div>
                <h4 className="font-medium text-foreground">{t("contact.address")}</h4>
                <p className="text-muted-foreground">Singapore</p>
              </div>
            </div>

            <div className="mt-8">
              <h4 className="text-xl font-semibold mb-2 text-foreground">{t("contact.connect")}</h4>
              <p className="text-muted-foreground">{t("contact.connect.desc")}</p>
            </div>
          </motion.div>

          <motion.form
            className="space-y-6"
            onSubmit={handleSubmit}
            initial={shouldReduceMotion ? animation.initial : animation.initial}
            animate={shouldReduceMotion ? animation.animate : animation.animate}
            transition={shouldReduceMotion ? { duration: 0 } : { ...(animation.transition || {}), delay: 0.2 }}
            noValidate
          >
            <div>
              <label htmlFor="name" className="block text-sm font-medium mb-2 text-foreground">
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
                className={`w-full px-4 py-2 rounded-lg border bg-background text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background transition-colors min-h-[44px] ${errors.name ? "border-destructive" : "border-border"}`}
                aria-invalid={!!errors.name}
                aria-describedby={errors.name ? "name-error" : undefined}
              />
              {errors.name && <p id="name-error" className="text-destructive text-sm mt-1">{errors.name}</p>}
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-2 text-foreground">
                {t("contact.form.email")}
              </label>
              <input
                type="email"
                id="email"
                name="email"
                autoComplete="email"
                spellCheck={false}
                inputMode="email"
                onChange={(e) => handleChange(e)}
                onBlur={(e) => handleBlur(e)}
                className={`w-full px-4 py-2 rounded-lg border bg-background text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background transition-colors min-h-[44px] ${errors.email ? "border-destructive" : "border-border"}`}
                aria-invalid={!!errors.email}
                aria-describedby={errors.email ? "email-error" : undefined}
              />
              {errors.email && <p id="email-error" className="text-destructive text-sm mt-1">{errors.email}</p>}
            </div>

            <div>
              <label htmlFor="subject" className="block text-sm font-medium mb-2 text-foreground">
                {t("contact.form.subject")}
              </label>
              <input
                type="text"
                id="subject"
                autoComplete="off"
                onChange={(e) => handleChange(e)}
                onBlur={(e) => handleBlur(e)}
                name="subject"
                className={`w-full px-4 py-2 rounded-lg border bg-background text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background transition-colors min-h-[44px] ${errors.subject ? "border-destructive" : "border-border"}`}
                aria-invalid={!!errors.subject}
                aria-describedby={errors.subject ? "subject-error" : undefined}
              />
              {errors.subject && <p id="subject-error" className="text-destructive text-sm mt-1">{errors.subject}</p>}
            </div>

            <div>
              <label htmlFor="message" className="block text-sm font-medium mb-2 text-foreground">
                {t("contact.form.message")}
              </label>
              <textarea
                id="message"
                name="message"
                rows={5}
                onChange={(e) => handleChange(e)}
                onBlur={(e) => handleBlur(e)}
                className={`w-full px-4 py-2 rounded-lg border bg-background text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background transition-colors resize-y ${errors.message ? "border-destructive" : "border-border"}`}
                aria-invalid={!!errors.message}
                aria-describedby={errors.message ? "message-error" : undefined}
              />
              {errors.message && <p id="message-error" className="text-destructive text-sm mt-1">{errors.message}</p>}
            </div>

            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                id="consent"
                checked={consent}
                onChange={(e) => setConsent(e.target.checked)}
                className="mt-1 min-w-[20px] min-h-[20px] rounded border-border text-primary focus-visible:ring-ring focus-visible:ring-offset-2"
                required
              />
              <label htmlFor="consent" className="text-sm text-muted-foreground">
                {t("contact.form.consent")}
              </label>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-primary text-primary-foreground px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed min-h-[44px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              {isSubmitting ? t("contact.form.sending") : t("contact.form.submit")}
            </button>

            <div
              ref={statusRef}
              tabIndex={-1}
              aria-live="polite"
              aria-atomic="true"
              className="sr-only"
            >
              {submitStatus === "success" && t("contact.form.success")}
              {submitStatus === "error" && t("contact.form.error")}
            </div>

            {submitStatus === "success" && (
              <div className="p-4 bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-200 rounded-lg" role="status">
                {t("contact.form.success")}
              </div>
            )}
            {submitStatus === "error" && (
              <div className="p-4 bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-200 rounded-lg" role="alert">
                {t("contact.form.error")}
              </div>
            )}
          </motion.form>
        </div>
      </div>
    </section>
  )
}

export default memo(ContactComponent)
