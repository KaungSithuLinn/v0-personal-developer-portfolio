"use client"

import { useState, useEffect, useRef, useCallback, useSyncExternalStore } from "react"
import { motion, AnimatePresence, useReducedMotion } from "framer-motion"
import { Globe, Check } from "lucide-react"
import { useTranslation, type Language } from "@/context/language-utils"
import { useRouter, usePathname } from "next/navigation"
import { SUPPORTED_LANGUAGES } from "@/config/language.config"

export default function LanguageSelector() {
  const [isOpen, setIsOpen] = useState(false)
  const { language, setLanguage, t, languageName, isRTL } = useTranslation()
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  )
  const router = useRouter()
  const pathname = usePathname()
  const triggerRef = useRef<HTMLButtonElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)
  const itemRefs = useRef<Array<HTMLButtonElement | null>>([])
  const shouldReduceMotion = useReducedMotion()

  const languages = SUPPORTED_LANGUAGES

  useEffect(() => {
    if (!isOpen) return

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node
      if (!containerRef.current?.contains(target)) {
        const focusWasInMenu = menuRef.current?.contains(document.activeElement) ?? false
        setIsOpen(false)
        if (focusWasInMenu) {
          triggerRef.current?.focus()
        }
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isOpen])

  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (event: KeyboardEvent) => {
      const currentIndex = itemRefs.current.findIndex((item) => item === document.activeElement)

      if (event.key === "Escape") {
        event.preventDefault()
        setIsOpen(false)
        triggerRef.current?.focus()
        return
      }

      if (languages.length === 0) return

      if (event.key === "ArrowDown") {
        event.preventDefault()
        const nextIndex = currentIndex < 0 ? 0 : (currentIndex + 1) % languages.length
        itemRefs.current[nextIndex]?.focus()
      } else if (event.key === "ArrowUp") {
        event.preventDefault()
        const previousIndex =
          currentIndex < 0
            ? languages.length - 1
            : (currentIndex - 1 + languages.length) % languages.length
        itemRefs.current[previousIndex]?.focus()
      } else if (event.key === "Home") {
        event.preventDefault()
        itemRefs.current[0]?.focus()
      } else if (event.key === "End") {
        event.preventDefault()
        itemRefs.current[languages.length - 1]?.focus()
      }
    }

    const menu = menuRef.current
    menu?.addEventListener("keydown", handleKeyDown)
    return () => {
      menu?.removeEventListener("keydown", handleKeyDown)
    }
  }, [isOpen, languages])

  useEffect(() => {
    if (!isOpen) return

    const activeIndex = Math.max(0, languages.indexOf(language))
    const frame = requestAnimationFrame(() => {
      itemRefs.current[activeIndex]?.focus()
    })

    return () => cancelAnimationFrame(frame)
  }, [isOpen, language, languages])

  const handleLanguageChange = useCallback(
    (lang: Language) => {
      if (lang === language) {
        setIsOpen(false)
        triggerRef.current?.focus()
        return
      }

      setLanguage(lang)

      const segments = pathname.split("/")
      segments[1] = lang
      const newPath = `${segments.join("/")}${window.location.search}${window.location.hash}`

      router.push(newPath)
      setIsOpen(false)
      triggerRef.current?.focus()
    },
    [language, pathname, router, setLanguage],
  )

  const toggleMenu = useCallback(() => {
    setIsOpen((open) => !open)
  }, [])

  if (!mounted) return null

  const menuAnimation = shouldReduceMotion
    ? {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 0 },
        transition: { duration: 0.12 },
      }
    : {
        initial: { opacity: 0, y: -10, x: isRTL ? 10 : -10 },
        animate: { opacity: 1, y: 0, x: 0 },
        exit: { opacity: 0, y: -10, x: isRTL ? 10 : -10 },
        transition: { duration: 0.2, ease: [0.22, 1, 0.36, 1] as const },
      }

  return (
    <div ref={containerRef} className="relative language-selector" dir="auto">
      <motion.button
        ref={triggerRef}
        id="language-selector-trigger"
        className="fixed top-4 sm:top-24 start-4 sm:start-6 z-50 min-w-[44px] min-h-[44px] p-2 sm:p-3 rounded-full bg-gradient-to-r from-teal-600 to-[#0a1628] text-white shadow-lg hover:from-teal-700 hover:to-[#0a1628] transition-colors duration-200 border border-teal-500/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        onClick={toggleMenu}
        whileHover={shouldReduceMotion ? undefined : { scale: 1.05 }}
        whileTap={shouldReduceMotion ? undefined : { scale: 0.95 }}
        aria-label={t("common.language")}
        aria-expanded={isOpen}
        aria-haspopup="menu"
        aria-controls="language-selector-menu"
      >
        <Globe size={18} className="sm:size-6" aria-hidden="true" />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={menuRef}
            id="language-selector-menu"
            initial={menuAnimation.initial}
            animate={menuAnimation.animate}
            exit={menuAnimation.exit}
            transition={menuAnimation.transition}
            className="fixed top-20 sm:top-28 start-4 sm:start-6 z-50 bg-surface-glass backdrop-blur-md border border-surface-glass-border rounded-lg shadow-xl overflow-hidden language-selector max-w-[90vw] sm:max-w-[280px]"
            role="menu"
            aria-labelledby="language-selector-trigger"
          >
            <div className="p-2 min-w-[160px]">
              <h3 className="text-primary font-medium text-sm border-b border-border pb-1 mb-2">
                {t("common.language")}
              </h3>
              <div className="space-y-1" role="group">
                {languages.map((lang, index) => (
                  <button
                    key={lang}
                    ref={(node) => {
                      itemRefs.current[index] = node
                    }}
                    onClick={() => handleLanguageChange(lang)}
                    className={`flex items-center w-full px-3 py-2.5 min-h-[44px] rounded-md text-start text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background ${
                      language === lang
                        ? "bg-primary/10 text-primary"
                        : "hover:bg-accent text-foreground"
                    }`}
                    dir={lang === "ar" ? "rtl" : "ltr"}
                    lang={lang}
                    role="menuitem"
                    tabIndex={lang === language ? 0 : -1}
                    aria-current={language === lang ? "true" : undefined}
                  >
                    {language === lang ? (
                      <Check size={14} className="ms-2 text-primary" aria-hidden="true" />
                    ) : (
                      <span className="w-[14px] ms-2" aria-hidden="true" />
                    )}
                    {languageName(lang)}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
