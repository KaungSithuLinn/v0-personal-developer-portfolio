import { NextResponse } from "next/server"

export async function GET() {
  try {
    const response = await fetch("https://api.github.com/users/KaungSithuLinn", {
      next: { revalidate: 3600 },
      headers: { Accept: "application/vnd.github+json" },
    })

    if (!response.ok) {
      return NextResponse.json({ error: "Unable to fetch GitHub stats" }, { status: 502 })
    }

    const data = (await response.json()) as {
      followers?: number
      public_repos?: number
      following?: number
    }

    return NextResponse.json({
      followers: data.followers ?? 0,
      publicRepos: data.public_repos ?? 0,
      following: data.following ?? 0,
    })
  } catch {
    return NextResponse.json({ error: "Unable to fetch GitHub stats" }, { status: 502 })
  }
}
