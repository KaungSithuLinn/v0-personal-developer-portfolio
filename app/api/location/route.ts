import { NextResponse } from "next/server"

const CACHE_HEADERS = {
  "Cache-Control": "public, s-maxage=600, stale-while-revalidate=3600",
} as const

export async function GET() {
  try {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 3000)
    const response = await fetch("https://ipgeolocationapi.io/api/v1/ip", {
      next: { revalidate: 600 },
      signal: controller.signal,
    }).finally(() => clearTimeout(timeout))

    if (!response.ok) {
      return NextResponse.json({ city: "your area", country: "" }, { status: 200, headers: CACHE_HEADERS })
    }

    const data = (await response.json()) as { city?: string; country?: string }
    return NextResponse.json(
      {
        city: data.city || "your area",
        country: data.country || "",
      },
      { headers: CACHE_HEADERS },
    )
  } catch {
    return NextResponse.json({ city: "your area", country: "" }, { status: 200, headers: CACHE_HEADERS })
  }
}
