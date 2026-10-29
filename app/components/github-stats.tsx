"use client"

import { useEffect, useState } from "react"

type GitHubStats = {
  followers: number
  publicRepos: number
  following: number
}

export function GitHubStats() {
  const [stats, setStats] = useState<GitHubStats | null>(null)
  const [error, setError] = useState(false)

  useEffect(() => {
    let active = true

    fetch("/api/github")
      .then((response) => response.json())
      .then((data: GitHubStats | { error: string }) => {
        if (!active) return
        if ("error" in data) {
          setError(true)
          return
        }
        setStats(data)
      })
      .catch(() => {
        if (active) setError(true)
      })

    return () => {
      active = false
    }
  }, [])

  if (error) return null
  if (!stats) {
    return (
      <div
        className="grid grid-cols-3 gap-4 text-center"
        aria-busy="true"
        aria-live="polite"
      >
        <span className="sr-only">Loading GitHub stats</span>
        {[0, 1, 2].map((item) => (
          <div key={item} aria-hidden="true">
            <p className="font-mono text-2xl font-semibold text-muted-foreground/40">---</p>
            <p className="mt-1 h-3 animate-pulse rounded bg-muted/30" />
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-3 gap-4 text-center">
      <div>
        <p className="text-2xl font-semibold">{stats.followers}</p>
        <p className="text-xs text-muted-foreground">Followers</p>
      </div>
      <div>
        <p className="text-2xl font-semibold">{stats.publicRepos}</p>
        <p className="text-xs text-muted-foreground">Repositories</p>
      </div>
      <div>
        <p className="text-2xl font-semibold">{stats.following}</p>
        <p className="text-xs text-muted-foreground">Following</p>
      </div>
    </div>
  )
}
