import { NextResponse } from "next/server"

export async function GET() {
  try {
    const response = await fetch("https://ipgeolocationapi.io/api/v1/ip", {
      next: { revalidate: 600 },
    })

    if (!response.ok) {
      return NextResponse.json({ city: "your area", country: "" }, { status: 200 })
    }

    const data = (await response.json()) as { city?: string; country?: string }
    return NextResponse.json({
      city: data.city || "your area",
      country: data.country || "",
    })
  } catch {
    return NextResponse.json({ city: "your area", country: "" }, { status: 200 })
  }
}
