"use client"

import { useState, type ReactElement, type ReactNode } from "react"
import { motion } from "framer-motion"
import { useReducedMotion } from "framer-motion"
import { Folder, ChevronRight, ChevronDown, Code, FileText, ImageIcon, Database } from "lucide-react"
import { useMounted } from "@/lib/use-mounted"
import { useTranslation } from "@/context/language-utils"

// Audit P0-2: respect reduced motion preference

type FileItem = {
  name: string
  type: "file" | "folder"
  icon?: ReactNode
  children?: FileItem[]
  description?: string
}

const fileSystem: FileItem[] = [
  {
    name: "Projects",
    type: "folder",
    icon: <Folder className="text-teal-400" size={18} />,
    children: [
      {
        name: "Mouse Dynamics Fraud Detection",
        type: "folder",
        icon: <Folder className="text-teal-400" size={18} />,
        children: [
          {
            name: "main.py",
            type: "file",
            icon: <Code className="text-teal-400" size={18} />,
            description: "Main Python script for the fraud detection system",
          },
          {
            name: "model.h5",
            type: "file",
            icon: <Database className="text-teal-500" size={18} />,
            description: "Trained machine learning model",
          },
          {
            name: "README.md",
            type: "file",
            icon: <FileText className="text-teal-400" size={18} />,
            description: "Project documentation",
          },
        ],
      },
      {
        name: "Continuous Authentication",
        type: "folder",
        icon: <Folder className="text-teal-400" size={18} />,
        children: [
          {
            name: "auth_system.py",
            type: "file",
            icon: <Code className="text-teal-400" size={18} />,
            description: "Authentication system implementation",
          },
          {
            name: "research_paper.pdf",
            type: "file",
            icon: <FileText className="text-teal-500" size={18} />,
            description: "Research paper on behavioral biometrics",
          },
        ],
      },
    ],
  },
  {
    name: "Resume",
    type: "folder",
    icon: <Folder className="text-teal-400" size={18} />,
    children: [
      {
        name: "KaungSithuLinn_Resume.pdf",
        type: "file",
        icon: <FileText className="text-teal-500" size={18} />,
        description: "Current professional resume",
      },
      {
        name: "profile_photo.jpg",
        type: "file",
        icon: <ImageIcon className="text-teal-400" size={18} />,
        description: "Professional headshot",
      },
    ],
  },
  {
    name: "Certificates",
    type: "folder",
    icon: <Folder className="text-teal-400" size={18} />,
    children: [
      {
        name: "Bachelor_of_IT.pdf",
        type: "file",
        icon: <FileText className="text-teal-500" size={18} />,
        description: "Bachelor of Information Technology degree certificate",
      },
      {
        name: "Google_Digital_Marketing.pdf",
        type: "file",
        icon: <FileText className="text-teal-500" size={18} />,
        description: "Google Digital Marketing certification",
      },
    ],
  },
]

interface FileItemProps {
  item: FileItem
  level: number
}

function FileItemComponent({ item, level }: FileItemProps): ReactElement {
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [isHovered, setIsHovered] = useState<boolean>(false)
  const shouldReduceMotion = useReducedMotion()

  const toggleOpen = (): void => {
    if (item.type === "folder") {
      setIsOpen(!isOpen)
    }
  }

  return (
    <div>
      <button
        className={`flex items-center py-1 px-2 rounded-md w-full text-start ${
          isHovered ? "bg-teal-900/40" : "bg-transparent"
        } transition-colors`}
        style={{ paddingInlineStart: `${level * 16}px` }}
        onClick={toggleOpen}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault()
            toggleOpen()
          }
        }}
      >
        {item.type === "folder" ? (
          <div className="me-1">{isOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}</div>
        ) : (
          <div className="w-4 me-1"></div>
        )}
        <div className="me-2">{item.icon}</div>
        <span className="text-slate-300 font-mono text-sm">{item.name}</span>
      </button>

      {isHovered && item.description && (
        <motion.div
          initial={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 5 }}
          animate={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 1, y: 0 }}
          className="ms-12 text-xs text-slate-400 font-mono"
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

export default function FileExplorer(): ReactElement | null {
  const mounted = useMounted()
  const { t } = useTranslation()
  const shouldReduceMotion = useReducedMotion()

  if (!mounted) return null

  return (
    <motion.div
      initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0 }}
      animate={shouldReduceMotion ? { opacity: 1 } : { opacity: 1 }}
      className="bg-gradient-to-br from-slate-900/90 to-[#0a1628]/50 backdrop-blur-sm border border-teal-500/30 rounded-lg p-4 shadow-lg shadow-teal-500/10 h-full overflow-y-auto"
    >
      <h3 className="text-teal-400 font-mono text-lg border-b border-teal-500/30 pb-2 mb-4">
        {t("fileExplorer.title")}
      </h3>
      <div className="space-y-1">
        {fileSystem.map((item, index) => (
          <FileItemComponent key={index} item={item} level={0} />
        ))}
      </div>
    </motion.div>
  )
}
