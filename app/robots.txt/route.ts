// Audit P3-14: robots.txt route handler
import { MetadataRoute } from "next"

export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://example.com"

  const robots: MetadataRoute.Robots = {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/"],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  }

  const rules = robots.rules as { userAgent: string; allow?: string; disallow?: string[] }[]
  const rule = rules[0]
  const text = `User-agent: ${rule.userAgent}
Allow: ${rule.allow}
Disallow: ${rule.disallow?.join(", ")}
Sitemap: ${robots.sitemap}`

  return new Response(text, {
    headers: {
      "Content-Type": "text/plain",
    },
  })
}
