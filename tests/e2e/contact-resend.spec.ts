import { test, expect } from "@playwright/test"

/**
 * End-to-end test for the Resend integration behind the contact form.
 *
 * This spec is intentionally opt-in. Running it submits a real email via
 * the live production deployment, which:
 *   - hits the per-IP rate limit (3/minute), so back-to-back CI runs will
 *     see 429s;
 *   - delivers a real message to the contact inbox.
 *
 * Activate locally with:
 *   E2E_CONTACT_LIVE=1 npx playwright test contact-resend.spec.ts
 *
 * Activate in CI by setting the same variable as a GitHub Actions secret
 * (do not commit a real value) and wiring it into a dedicated workflow.
 *
 * When the `RESEND_TEST_API_KEY` env var is also present, the suite
 * additionally asserts that the message appears in the Resend API's
 * outbound list within 30 seconds, giving us a strong delivery signal
 * without needing IMAP access to the contact mailbox.
 */

const isLive = process.env.E2E_CONTACT_LIVE === "1"
// Run a unique, traceable subject so we can find the email in Resend.
const subject = `[E2E] contact form test ${new Date().toISOString()}`
// Run on the live Vercel deployment regardless of BASE_URL. The
// production build is the only place we can verify the real Resend
// integration.
const baseURL = "https://v0-personal-developer-portfolio-psi-blush.vercel.app"

test.describe("Contact form Resend integration", () => {
  test.skip(!isLive, "Set E2E_CONTACT_LIVE=1 to exercise the live Resend path")

  test("submits a real message and the API returns success", async () => {
    // Match the same-origin check the route enforces (origin must equal
    // the request host, which here is the Vercel deployment).
    const res = await fetch(`${baseURL}/api/contact`, {
      method: "POST",
      headers: { Origin: baseURL },
      body: new URLSearchParams({
        name: "E2E Bot",
        email: "e2e-bot@example.com",
        subject,
        message: "This is a synthetic E2E submission from the contact-resend spec.",
      }),
    })

    // 429 is a legitimate outcome when the per-IP rate limit (3/min)
    // is already exhausted by sibling tests. Reschedule via the
    // cron-driven workflow rather than racing in parallel.
    const text = await res.text()
    expect([200, 429]).toContain(res.status)
    if (res.status === 429) {
      test.skip(true, "Per-IP rate limit reached; defer to the next scheduled run")
    }
    const body = JSON.parse(text)
    expect(body.message).toBe("Message sent successfully")
  })

  test("the sent message appears in the Resend API", async () => {
    test.skip(
      !process.env.RESEND_TEST_API_KEY,
      "RESEND_TEST_API_KEY not set; skipping delivery verification",
    )

    const apiKey = process.env.RESEND_TEST_API_KEY!
    // The Resend list endpoint exposes created_at + subject so we can
    // assert our synthetic subject appears within a few seconds of
    // submission. We retry for up to 30s because the contact-form
    // submit above runs immediately before this test.
    const deadline = Date.now() + 30_000
    let found = false
    let lastBody: unknown = null

    while (Date.now() < deadline && !found) {
      const r = await fetch("https://api.resend.com/emails?limit=20", {
        headers: { Authorization: `Bearer ${apiKey}` },
      })
      if (r.ok) {
        const data = (await r.json()) as { data?: Array<{ subject?: string }> }
        lastBody = data
        found = (data.data ?? []).some((e) => e.subject === subject)
        if (found) break
      }
      await new Promise((resolve) => setTimeout(resolve, 2_000))
    }

    expect(
      found,
      `Resend did not surface subject "${subject}" within 30s. Last response: ${JSON.stringify(lastBody)}`,
    ).toBe(true)
  })
})
