"use client"

import * as React from "react"
import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { useReducedMotion } from "framer-motion"
import { Cpu, HardDrive, Activity, Clock, Zap, X } from "lucide-react"
import { useMounted } from "@/lib/use-mounted"
import { useTranslation } from "@/context/language-utils"

// Audit P0-2: respect reduced motion preference

type Skill = {
  name: string
  level: number
  category: string
}

const skills: Skill[] = [
  { name: "JavaScript", level: 85, category: "Frontend" },
  { name: "HTML/CSS", level: 90, category: "Frontend" },
  { name: "React", level: 80, category: "Frontend" },
  { name: "Python", level: 75, category: "Backend" },
  { name: "Java", level: 70, category: "Backend" },
  { name: "C++", level: 65, category: "Backend" },
  { name: ".NET", level: 80, category: "Backend" },
  { name: "SQL", level: 85, category: "Database" },
  { name: "Machine Learning", level: 70, category: "AI/ML" },
  { name: "Deep Learning", level: 65, category: "AI/ML" },
]

export default function SystemMonitor({ onClose }: { onClose: () => void }): React.ReactElement | null {
  const [date, setDate] = useState<Date>(new Date())
  const [cpuUsage, setCpuUsage] = useState<number>(0)
  const [memoryUsage, setMemoryUsage] = useState<number>(0)
  const [networkActivity, setNetworkActivity] = useState<number>(0)
  const [isVisible, setIsVisible] = useState(true)
  const mounted = useMounted()
  const { t, language, isRTL } = useTranslation()
  const shouldReduceMotion = useReducedMotion()

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting)
      },
      { threshold: 0.1 }
    )

    const currentElement = document.querySelector('.monitor-window')
    if (currentElement) {
      observer.observe(currentElement)
    }

    return () => {
      observer.disconnect()
    }
  }, [])

  useEffect(() => {
    if (!isVisible) return

    const timer = setInterval(() => {
      setDate(new Date())
    }, 1000)

    // Simulate system activity
    const activityInterval = setInterval(() => {
      setCpuUsage(Math.floor(Math.random() * 40) + 30) // 30-70%
      setMemoryUsage(Math.floor(Math.random() * 30) + 40) // 40-70%
      setNetworkActivity(Math.floor(Math.random() * 100)) // 0-100 KB/s
    }, 2000)

    return () => {
      clearInterval(timer)
      clearInterval(activityInterval)
    }
  }, [isVisible])

  if (!mounted) return null

  return (
    <motion.div
      initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0 }}
      animate={shouldReduceMotion ? { opacity: 1 } : { opacity: 1 }}
      className="monitor-window bg-gradient-to-br from-slate-900/90 to-[#0a1628]/50 backdrop-blur-sm border border-teal-500/30 rounded-lg p-4 shadow-lg shadow-teal-500/10"
    >
      {/* Close button */}
      <button
        onClick={onClose}
        className={`${isRTL ? "absolute top-2 left-2" : "absolute top-2 right-2"} text-gray-400 hover:text-white transition-colors`}
        aria-label="Close System Monitor"
      >
        <X size={16} />
      </button>

      <div className="grid grid-cols-1 gap-4">
        {/* System Stats */}
        <div className="space-y-4">
          <h3 className="text-teal-400 font-mono text-lg border-b border-teal-500/30 pb-2">
            {t("systemMonitor.title")}
          </h3>

          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center">
              <Clock className="text-teal-400 me-2" size={18} />
              <span className="text-gray-300 font-mono">{t("systemMonitor.systemTime")}</span>
            </div>
              <span className="text-teal-400 font-mono">
              {date.toLocaleTimeString(language === "en" ? "en-US" : language)} -{" "}
              {date.toLocaleDateString(language === "en" ? "en-US" : language)}
            </span>
          </div>

          {/* Stats Grid */}
          <div className="grid sm:grid-cols-2 gap-4">
              {/* CPU Usage */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Cpu className="text-teal-500 me-2" size={18} />
                    <span className="text-gray-300 font-mono">{t("systemMonitor.cpuUsage")}</span>
                  </div>
                  <span className="text-teal-500 font-mono">{cpuUsage}%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2.5" role="progressbar" aria-valuenow={cpuUsage} aria-valuemin={0} aria-valuemax={100} aria-label="CPU usage">
                  <motion.div
                  className="bg-teal-500 h-2.5 rounded-full"
                  initial={shouldReduceMotion ? { width: `${cpuUsage}%` } : { width: 0 }}
                  animate={shouldReduceMotion ? { width: `${cpuUsage}%` } : { width: `${cpuUsage}%` }}
                  transition={shouldReduceMotion ? { duration: 0 } : { duration: 0.5 }}
                />
              </div>
            </div>

              {/* Memory Usage */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <HardDrive className="text-teal-500 me-2" size={18} />
                    <span className="text-gray-300 font-mono">{t("systemMonitor.memoryUsage")}</span>
                  </div>
                  <span className="text-teal-500 font-mono">{memoryUsage}%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2.5" role="progressbar" aria-valuenow={memoryUsage} aria-valuemin={0} aria-valuemax={100} aria-label="Memory usage">
                  <motion.div
                  className="bg-teal-500 h-2.5 rounded-full"
                  initial={shouldReduceMotion ? { width: `${memoryUsage}%` } : { width: 0 }}
                  animate={shouldReduceMotion ? { width: `${memoryUsage}%` } : { width: `${memoryUsage}%` }}
                  transition={shouldReduceMotion ? { duration: 0 } : { duration: 0.5 }}
                />
              </div>
            </div>

            {/* Network Activity */}
            <div className="space-y-2 sm:col-span-2">
              <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Activity className="text-teal-500 me-2" size={18} />
                    <span className="text-gray-300 font-mono">{t("systemMonitor.networkActivity")}</span>
                  </div>
                  <span className="text-teal-500 font-mono">{networkActivity} KB/s</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2.5" role="progressbar" aria-valuenow={networkActivity} aria-valuemin={0} aria-valuemax={100} aria-label="Network activity">
                  <motion.div
                  className="bg-teal-500 h-2.5 rounded-full"
                  initial={shouldReduceMotion ? { width: `${networkActivity}%` } : { width: 0 }}
                  animate={shouldReduceMotion ? { width: `${networkActivity}%` } : { width: `${networkActivity}%` }}
                  transition={shouldReduceMotion ? { duration: 0 } : { duration: 0.5 }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Skills Monitor */}
        <div className="space-y-4 mt-6">
          <h3 className="text-teal-400 font-mono text-lg border-b border-teal-500/30 pb-2">
            {t("systemMonitor.skillsMonitor")}
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {skills.slice(0, 6).map((skill, index) => (
              <div key={index} className="space-y-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Zap className="text-teal-400 me-2" size={14} />
                    <span className="text-gray-300 font-mono text-sm">{skill.name}</span>
                  </div>
                  <span className="text-teal-400 font-mono text-sm">{skill.level}%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-1.5">
                  <motion.div
                    className={`h-1.5 rounded-full ${
                      skill.category === "Frontend"
                        ? "bg-teal-500"
                        : skill.category === "Backend"
                          ? "bg-teal-500"
                          : skill.category === "Database"
                            ? "bg-teal-500"
                            : "bg-teal-600"
                    }`}
                    initial={shouldReduceMotion ? { width: `${skill.level}%` } : { width: 0 }}
                    animate={shouldReduceMotion ? { width: `${skill.level}%` } : { width: `${skill.level}%` }}
                    transition={shouldReduceMotion ? { duration: 0 } : { duration: 0.8, delay: index * 0.1 }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  )
}
