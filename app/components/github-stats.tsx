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
  if (!stats) return <p className="text-sm text-muted-foreground">Loading GitHub stats...</p>

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
