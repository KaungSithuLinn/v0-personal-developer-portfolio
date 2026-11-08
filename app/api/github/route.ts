import { NextResponse } from "next/server"

const CACHE_HEADERS = {
  "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
} as const

export async function GET() {
  try {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 5000)
    const response = await fetch("https://api.github.com/users/KaungSithuLinn", {
      next: { revalidate: 3600 },
      headers: { Accept: "application/vnd.github+json", "User-Agent": "portfolio-site" },
      signal: controller.signal,
    }).finally(() => clearTimeout(timeout))

    if (!response.ok) {
      return NextResponse.json({ error: "Unable to fetch GitHub stats" }, { status: 502, headers: CACHE_HEADERS })
    }

    const data = (await response.json()) as {
      followers?: number
      public_repos?: number
      following?: number
    }

    return NextResponse.json(
      {
        followers: data.followers ?? 0,
        publicRepos: data.public_repos ?? 0,
        following: data.following ?? 0,
      },
      { headers: CACHE_HEADERS },
    )
  } catch {
    return NextResponse.json({ error: "Unable to fetch GitHub stats" }, { status: 502, headers: CACHE_HEADERS })
  }
}
