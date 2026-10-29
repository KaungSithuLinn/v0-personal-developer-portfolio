"use client"

import { createContext, useContext, useEffect, useState } from "react"

export type User = { id: string; email: string; isAdmin: boolean }

interface AuthContextValue {
  user: User | null
  isLoading: boolean
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue>({
  user: null,
  isLoading: true,
  logout: async () => {},
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let mounted = true
    void (async () => {
      try {
        const res = await fetch("/api/auth/session", { cache: "no-store", credentials: "same-origin" })
        if (res.ok) {
          const data = (await res.json()) as { user: User | null }
          if (mounted) setUser(data.user ?? null)
        } else if (mounted) {
          setUser(null)
        }
      } catch {
        if (mounted) setUser(null)
      } finally {
        if (mounted) setIsLoading(false)
      }
    })()
    return () => {
      mounted = false
    }
  }, [])

  const logout = async () => {
    await fetch("/api/auth/logout", { method: "POST", credentials: "same-origin" })
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
