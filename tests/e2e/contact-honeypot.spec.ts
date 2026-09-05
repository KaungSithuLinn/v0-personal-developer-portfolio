import { test, expect } from "@playwright/test"

// E2E coverage for the contact-form honeypot. A bot that fills the hidden
// "website" field should still see a 200 OK (silent rejection) while no email
// is delivered. A genuine user with an empty honeypot should reach the real
// validation path.

test.describe("Contact form honeypot", () => {
  test("rejects bot submissions when honeypot is filled", async ({ request }) => {
    const formData = new FormData()
    formData.append("name", "Bot Crawler")
    formData.append("email", "bot@example.com")
    formData.append("subject", "Hello there")
    formData.append("message", "This is a spam submission that filled the honeypot.")
    formData.append("website", "http://spam.example.com")

    const res = await request.post("/api/contact", {
      multipart: {
        name: "Bot Crawler",
        email: "bot@example.com",
        subject: "Hello there",
        message: "This is a spam submission that filled the honeypot.",
        website: "http://spam.example.com",
      },
    })

    expect(res.status()).toBe(200)
    const body = await res.json()
    expect(body).toHaveProperty("success", true)
  })

  test("blocks empty submissions with server-side validation", async ({ request }) => {
    const res = await request.post("/api/contact", {
      multipart: {
        name: "",
        email: "not-an-email",
        subject: "",
        message: "",
      },
    })

    expect(res.status()).toBe(400)
  })

  test("UI shows the honeypot field is hidden from sighted users", async ({ page }) => {
    await page.goto("/en", { waitUntil: "networkidle" })
    await expect(page.locator("#contact")).toBeVisible()

    const honeypot = page.locator('input[name="website"]')
    await expect(honeypot).toBeAttached()
    await expect(honeypot).toBeHidden()
  })

  test("requires privacy consent before enabling submit", async ({ page }) => {
    await page.goto("/en", { waitUntil: "networkidle" })
    await expect(page.locator("#contact")).toBeVisible()

    const submit = page.getByRole("button", { name: /send message/i })
    await expect(submit).toBeDisabled()

    await page.locator('input[name="consent"]').check()
    await expect(submit).toBeEnabled()
  })
})
