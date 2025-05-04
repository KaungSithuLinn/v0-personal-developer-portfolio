"use client"

import * as React from "react"
import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Cpu, HardDrive, Activity, Clock, Zap, X } from "lucide-react"
import { useMounted } from "@/lib/use-mounted"
import { useTranslation } from "@/context/language-context"

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
  const mounted = useMounted()
  const { t, language } = useTranslation()

  useEffect(() => {
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
  }, [])

  if (!mounted) return null

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="monitor-window bg-gradient-to-br from-gray-900/90 to-blue-900/50 backdrop-blur-sm border border-blue-500/30 rounded-lg p-4 shadow-lg shadow-blue-500/10"
    >
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-2 right-2 text-gray-400 hover:text-white transition-colors"
        aria-label="Close System Monitor"
      >
        <X size={16} />
      </button>

      <div className="grid grid-cols-1 gap-4">
        {/* System Stats */}
        <div className="space-y-4">
          <h3 className="text-blue-400 font-mono text-lg border-b border-blue-500/30 pb-2">
            {t("systemMonitor.title")}
          </h3>

          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center">
              <Clock className="text-blue-400 mr-2" size={18} />
              <span className="text-gray-300 font-mono">{t("systemMonitor.systemTime")}</span>
            </div>
            <span className="text-blue-400 font-mono">
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
                  <Cpu className="text-blue-500 mr-2" size={18} />
                  <span className="text-gray-300 font-mono">{t("systemMonitor.cpuUsage")}</span>
                </div>
                <span className="text-blue-500 font-mono">{cpuUsage}%</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2.5">
                <motion.div
                  className="bg-blue-500 h-2.5 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${cpuUsage}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
            </div>

            {/* Memory Usage */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <HardDrive className="text-indigo-500 mr-2" size={18} />
                  <span className="text-gray-300 font-mono">{t("systemMonitor.memoryUsage")}</span>
                </div>
                <span className="text-indigo-500 font-mono">{memoryUsage}%</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2.5">
                <motion.div
                  className="bg-indigo-500 h-2.5 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${memoryUsage}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
            </div>

            {/* Network Activity */}
            <div className="space-y-2 sm:col-span-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Activity className="text-purple-500 mr-2" size={18} />
                  <span className="text-gray-300 font-mono">{t("systemMonitor.networkActivity")}</span>
                </div>
                <span className="text-purple-500 font-mono">{networkActivity} KB/s</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2.5">
                <motion.div
                  className="bg-purple-500 h-2.5 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${networkActivity}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Skills Monitor */}
        <div className="space-y-4 mt-6">
          <h3 className="text-blue-400 font-mono text-lg border-b border-blue-500/30 pb-2">
            {t("systemMonitor.skillsMonitor")}
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {skills.slice(0, 6).map((skill, index) => (
              <div key={index} className="space-y-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Zap className="text-blue-400 mr-2" size={14} />
                    <span className="text-gray-300 font-mono text-sm">{skill.name}</span>
                  </div>
                  <span className="text-blue-400 font-mono text-sm">{skill.level}%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-1.5">
                  <motion.div
                    className={`h-1.5 rounded-full ${
                      skill.category === "Frontend"
                        ? "bg-blue-500"
                        : skill.category === "Backend"
                          ? "bg-indigo-500"
                          : skill.category === "Database"
                            ? "bg-purple-500"
                            : "bg-blue-600"
                    }`}
                    initial={{ width: 0 }}
                    animate={{ width: `${skill.level}%` }}
                    transition={{ duration: 0.8, delay: index * 0.1 }}
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
