"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

// Define supported languages
export type Language = "en" | "zh" | "ms" | "ta"

// Define the context type
type LanguageContextType = {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string) => string
}

// Create the context with default values
const LanguageContext = createContext<LanguageContextType>({
  language: "en",
  setLanguage: () => {},
  t: (key) => key,
})

// Translation data for all supported languages
const translations = {
  en: {
    // Common
    "common.language": "Language",
    "common.english": "English",
    "common.chinese": "中文",
    "common.malay": "Bahasa Melayu",
    "common.tamil": "தமிழ்",

    // System Monitor
    "systemMonitor.title": "System Monitor",
    "systemMonitor.systemTime": "System Time",
    "systemMonitor.cpuUsage": "CPU Usage",
    "systemMonitor.memoryUsage": "Memory Usage",
    "systemMonitor.networkActivity": "Network Activity",
    "systemMonitor.skillsMonitor": "Skills Monitor",
    "systemMonitor.show": "Show Interface",
    "systemMonitor.hide": "Hide Interface",

    // Terminal
    "terminal.title": "KSL DevConsole",
    "terminal.welcome": "Welcome to Kaung Sithu Linn's portfolio. Type 'help' to see available commands.",
    "terminal.help": "Available commands",
    "terminal.about": "About",
    "terminal.skills": "Skills",
    "terminal.projects": "Projects",
    "terminal.contact": "Contact",
    "terminal.experience": "Experience",
    "terminal.education": "Education",

    // File Explorer
    "fileExplorer.title": "Portfolio Explorer",
  },
  zh: {
    // Common
    "common.language": "语言",
    "common.english": "English",
    "common.chinese": "中文",
    "common.malay": "Bahasa Melayu",
    "common.tamil": "தமிழ்",

    // System Monitor
    "systemMonitor.title": "系统监控",
    "systemMonitor.systemTime": "系统时间",
    "systemMonitor.cpuUsage": "CPU 使用率",
    "systemMonitor.memoryUsage": "内存使用率",
    "systemMonitor.networkActivity": "网络活动",
    "systemMonitor.skillsMonitor": "技能监控",
    "systemMonitor.show": "显示界面",
    "systemMonitor.hide": "隐藏界面",

    // Terminal
    "terminal.title": "KSL 开发控制台",
    "terminal.welcome": "欢迎来到 Kaung Sithu Linn 的作品集。输入 'help' 查看可用命令。",
    "terminal.help": "可用命令",
    "terminal.about": "关于",
    "terminal.skills": "技能",
    "terminal.projects": "项目",
    "terminal.contact": "联系",
    "terminal.experience": "经验",
    "terminal.education": "教育",

    // File Explorer
    "fileExplorer.title": "作品集浏览器",
  },
  ms: {
    // Common
    "common.language": "Bahasa",
    "common.english": "English",
    "common.chinese": "中文",
    "common.malay": "Bahasa Melayu",
    "common.tamil": "தமிழ்",

    // System Monitor
    "systemMonitor.title": "Pemantau Sistem",
    "systemMonitor.systemTime": "Masa Sistem",
    "systemMonitor.cpuUsage": "Penggunaan CPU",
    "systemMonitor.memoryUsage": "Penggunaan Memori",
    "systemMonitor.networkActivity": "Aktiviti Rangkaian",
    "systemMonitor.skillsMonitor": "Pemantau Kemahiran",
    "systemMonitor.show": "Tunjukkan Antara Muka",
    "systemMonitor.hide": "Sembunyikan Antara Muka",

    // Terminal
    "terminal.title": "Konsol Pembangun KSL",
    "terminal.welcome": "Selamat datang ke portfolio Kaung Sithu Linn. Taip 'help' untuk melihat arahan yang tersedia.",
    "terminal.help": "Arahan tersedia",
    "terminal.about": "Tentang",
    "terminal.skills": "Kemahiran",
    "terminal.projects": "Projek",
    "terminal.contact": "Hubungi",
    "terminal.experience": "Pengalaman",
    "terminal.education": "Pendidikan",

    // File Explorer
    "fileExplorer.title": "Penjelajah Portfolio",
  },
  ta: {
    // Common
    "common.language": "மொழி",
    "common.english": "English",
    "common.chinese": "中文",
    "common.malay": "Bahasa Melayu",
    "common.tamil": "தமிழ்",

    // System Monitor
    "systemMonitor.title": "கணினி கண்காணிப்பு",
    "systemMonitor.systemTime": "கணினி நேரம்",
    "systemMonitor.cpuUsage": "CPU பயன்பாடு",
    "systemMonitor.memoryUsage": "நினைவக பயன்பாடு",
    "systemMonitor.networkActivity": "வலையமைப்பு செயல்பாடு",
    "systemMonitor.skillsMonitor": "திறன் கண்காணிப்பு",
    "systemMonitor.show": "இடைமுகத்தைக் காட்டு",
    "systemMonitor.hide": "இடைமுகத்தை மறை",

    // Terminal
    "terminal.title": "KSL மேம்பாட்டு கன்சோல்",
    "terminal.welcome":
      "Kaung Sithu Linn இன் போர்ட்ஃபோலியோவிற்கு வரவேற்கிறோம். கிடைக்கும் கட்டளைகளைப் பார்க்க 'help' என்று தட்டச்சு செய்யவும்.",
    "terminal.help": "கிடைக்கும் கட்டளைகள்",
    "terminal.about": "பற்றி",
    "terminal.skills": "திறன்கள்",
    "terminal.projects": "திட்டங்கள்",
    "terminal.contact": "தொடர்பு",
    "terminal.experience": "அனுபவம்",
    "terminal.education": "கல்வி",

    // File Explorer
    "fileExplorer.title": "போர்ட்ஃபோலியோ எக்ஸ்ப்ளோரர்",
  },
}

// Provider component
interface LanguageProviderProps {
  children: ReactNode
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  // Initialize with browser language or default to English
  const [language, setLanguage] = useState<Language>("en")

  // Load saved language preference from localStorage on mount
  useEffect(() => {
    const savedLanguage = localStorage.getItem("language") as Language
    if (savedLanguage && Object.keys(translations).includes(savedLanguage)) {
      setLanguage(savedLanguage)
    } else {
      // Try to detect browser language
      const browserLang = navigator.language.split("-")[0]
      if (browserLang === "zh" || browserLang === "ms" || browserLang === "ta") {
        setLanguage(browserLang as Language)
      }
    }
  }, [])

  // Save language preference to localStorage when it changes
  useEffect(() => {
    localStorage.setItem("language", language)
    // Update HTML lang attribute
    document.documentElement.lang = language
  }, [language])

  // Translation function
  const t = (key: string): string => {
    const langData = translations[language] || translations.en
    return langData[key as keyof typeof langData] || key
  }

  return <LanguageContext.Provider value={{ language, setLanguage, t }}>{children}</LanguageContext.Provider>
}

// Custom hook for using the language context
export const useTranslation = () => useContext(LanguageContext)
