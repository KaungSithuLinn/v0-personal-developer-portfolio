"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Folder, ChevronRight, ChevronDown, Code, FileText, ImageIcon, Database } from "lucide-react"
import { useMounted } from "@/lib/use-mounted"
import type React from "react"

type FileItem = {
  name: string
  type: "file" | "folder"
  icon?: React.ReactNode
  children?: FileItem[]
  description?: string
}

const fileSystem: FileItem[] = [
  {
    name: "Projects",
    type: "folder",
    icon: <Folder className="text-yellow-400" size={18} />,
    children: [
      {
        name: "Mouse Dynamics Fraud Detection",
        type: "folder",
        icon: <Folder className="text-yellow-400" size={18} />,
        children: [
          {
            name: "main.py",
            type: "file",
            icon: <Code className="text-blue-400" size={18} />,
            description: "Main Python script for the fraud detection system",
          },
          {
            name: "model.h5",
            type: "file",
            icon: <Database className="text-purple-400" size={18} />,
            description: "Trained machine learning model",
          },
          {
            name: "README.md",
            type: "file",
            icon: <FileText className="text-green-400" size={18} />,
            description: "Project documentation",
          },
        ],
      },
      {
        name: "Continuous Authentication",
        type: "folder",
        icon: <Folder className="text-yellow-400" size={18} />,
        children: [
          {
            name: "auth_system.py",
            type: "file",
            icon: <Code className="text-blue-400" size={18} />,
            description: "Authentication system implementation",
          },
          {
            name: "research_paper.pdf",
            type: "file",
            icon: <FileText className="text-red-400" size={18} />,
            description: "Research paper on behavioral biometrics",
          },
        ],
      },
    ],
  },
  {
    name: "Resume",
    type: "folder",
    icon: <Folder className="text-yellow-400" size={18} />,
    children: [
      {
        name: "KaungSithuLinn_Resume.pdf",
        type: "file",
        icon: <FileText className="text-red-400" size={18} />,
        description: "Current professional resume",
      },
      {
        name: "profile_photo.jpg",
        type: "file",
        icon: <ImageIcon className="text-green-400" size={18} />,
        description: "Professional headshot",
      },
    ],
  },
  {
    name: "Certificates",
    type: "folder",
    icon: <Folder className="text-yellow-400" size={18} />,
    children: [
      {
        name: "Bachelor_of_IT.pdf",
        type: "file",
        icon: <FileText className="text-red-400" size={18} />,
        description: "Bachelor of Information Technology degree certificate",
      },
      {
        name: "Google_Digital_Marketing.pdf",
        type: "file",
        icon: <FileText className="text-red-400" size={18} />,
        description: "Google Digital Marketing certification",
      },
    ],
  },
]

interface FileItemProps {
  item: FileItem
  level: number
}

function FileItemComponent({ item, level }: FileItemProps): JSX.Element {
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [isHovered, setIsHovered] = useState<boolean>(false)

  const toggleOpen = (): void => {
    if (item.type === "folder") {
      setIsOpen(!isOpen)
    }
  }

  return (
    <div>
      <div
        className={`flex items-center py-1 px-2 rounded-md ${
          isHovered ? "bg-gray-800" : "bg-transparent"
        } transition-colors cursor-pointer`}
        style={{ paddingLeft: `${level * 16}px` }}
        onClick={toggleOpen}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {item.type === "folder" ? (
          <div className="mr-1">{isOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}</div>
        ) : (
          <div className="w-4 mr-1"></div>
        )}
        <div className="mr-2">{item.icon}</div>
        <span className="text-gray-300 font-mono text-sm">{item.name}</span>
      </div>

      {isHovered && item.description && (
        <motion.div
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          className="ml-12 text-xs text-gray-400 font-mono"
        >
          {item.description}
        </motion.div>
      )}

      {isOpen && item.children && (
        <div>
          {item.children.map((child, index) => (
            <FileItemComponent key={index} item={child} level={level + 1} />
          ))}
        </div>
      )}
    </div>
  )
}

export default function FileExplorer(): JSX.Element | null {
  const mounted = useMounted()

  if (!mounted) return null

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-gray-900/90 backdrop-blur-sm border border-cyan-500/30 rounded-lg p-4 shadow-lg shadow-cyan-500/10 h-full overflow-y-auto"
    >
      <h3 className="text-cyan-400 font-mono text-lg border-b border-cyan-500/30 pb-2 mb-4">Portfolio Explorer</h3>
      <div className="space-y-1">
        {fileSystem.map((item, index) => (
          <FileItemComponent key={index} item={item} level={0} />
        ))}
      </div>
    </motion.div>
  )
}
