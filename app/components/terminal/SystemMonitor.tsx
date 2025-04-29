"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Cpu, HardDrive, Activity, Clock, Zap } from "lucide-react"
import { useMounted } from "@/lib/use-mounted"

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

export default function SystemMonitor(): JSX.Element | null {
  const [date, setDate] = useState<Date>(new Date())
  const [cpuUsage, setCpuUsage] = useState<number>(0)
  const [memoryUsage, setMemoryUsage] = useState<number>(0)
  const [networkActivity, setNetworkActivity] = useState<number>(0)
  const mounted = useMounted()

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
      className="bg-gray-900/90 backdrop-blur-sm border border-cyan-500/30 rounded-lg p-4 shadow-lg shadow-cyan-500/10"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* System Stats */}
        <div className="space-y-4">
          <h3 className="text-cyan-400 font-mono text-lg border-b border-cyan-500/30 pb-2">System Monitor</h3>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Clock className="text-green-400 mr-2" size={18} />
              <span className="text-gray-300 font-mono">System Time</span>
            </div>
            <span className="text-green-400 font-mono">
              {date.toLocaleTimeString()} - {date.toLocaleDateString()}
            </span>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Cpu className="text-yellow-400 mr-2" size={18} />
                <span className="text-gray-300 font-mono">CPU Usage</span>
              </div>
              <span className="text-yellow-400 font-mono">{cpuUsage}%</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <motion.div
                className="bg-yellow-400 h-2 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${cpuUsage}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <HardDrive className="text-blue-400 mr-2" size={18} />
                <span className="text-gray-300 font-mono">Memory Usage</span>
              </div>
              <span className="text-blue-400 font-mono">{memoryUsage}%</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <motion.div
                className="bg-blue-400 h-2 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${memoryUsage}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Activity className="text-purple-400 mr-2" size={18} />
                <span className="text-gray-300 font-mono">Network Activity</span>
              </div>
              <span className="text-purple-400 font-mono">{networkActivity} KB/s</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <motion.div
                className="bg-purple-400 h-2 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${networkActivity}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </div>
        </div>

        {/* Skills Monitor */}
        <div className="space-y-4">
          <h3 className="text-cyan-400 font-mono text-lg border-b border-cyan-500/30 pb-2">Skills Monitor</h3>

          <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
            {skills.map((skill, index) => (
              <div key={index} className="space-y-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Zap className="text-cyan-400 mr-2" size={14} />
                    <span className="text-gray-300 font-mono text-sm">{skill.name}</span>
                  </div>
                  <span className="text-cyan-400 font-mono text-sm">{skill.level}%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-1.5">
                  <motion.div
                    className={`h-1.5 rounded-full ${
                      skill.category === "Frontend"
                        ? "bg-yellow-400"
                        : skill.category === "Backend"
                          ? "bg-green-400"
                          : skill.category === "Database"
                            ? "bg-blue-400"
                            : "bg-purple-400"
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
