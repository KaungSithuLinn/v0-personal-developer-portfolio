// Pre-warm the `next start` server before any test runs.
//
// Playwright's `webServer` readiness probe only confirms the server is
// listening, not that any route is JIT-warm. The first request to a
// route pays the per-route compilation cost (6-12 s on a cold build).
// When the chromium and visual-regression projects run in parallel
// against the same `next start` instance, those cold requests stack
// and the per-test `page.goto` 30 s timeout can fire even though the
// page is fully rendered by the time the error is reported.
//
// Fetching each anchor once here costs ~3 s total and removes the
// cold-start race for the first real test in the suite. The probe
// uses a hard `AbortSignal.timeout` so a hung warmup fails the
// playwright run fast instead of stalling.
async function globalSetup(): Promise<void> {
  const base = process.env.BASE_URL ?? "http://localhost:3000"
  const paths = ["/en", "/en#contact", "/en#projects"] as const
  for (const path of paths) {
    const res = await fetch(base + path, {
      signal: AbortSignal.timeout(15_000),
      redirect: "follow",
    })
    if (!res.ok) {
      throw new Error(`globalSetup warmup failed: ${path} -> ${res.status}`)
    }
  }
}

export default globalSetup
