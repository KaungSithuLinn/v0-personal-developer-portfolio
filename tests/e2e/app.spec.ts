import { test, expect } from "@playwright/test"

test.describe("Locale routing", () => {
  test("root redirects to detected locale", async ({ page }) => {
    const response = await page.goto("/")
    expect(response?.status()).toBe(200)
    await page.waitForURL(/\/\w{2}(\/|$)/)
    expect(page.url()).toMatch(/\/\w{2}(\/|$)/)
  })

  test("/en renders home page with key sections", async ({ page }) => {
    await page.goto("/en")
    await expect(page.locator("#about")).toBeVisible()
    await expect(page.locator("#projects")).toBeVisible()
    await expect(page.locator("#contact")).toBeVisible()
  })

  test("contact form validates required fields", async ({ page }) => {
    await page.goto("/en")

    // Scope to <main> so the locator is unambiguous: some pages (e.g.
    // when framer-motion's whileInView render pass produces a hidden
    // duplicate node above the fold) have two elements with id="contact"
    // and a strict-mode locator fails. The contact section is always
    // inside the <main> landmark.
    const contactSection = page.locator("main #contact")
    await expect(contactSection).toBeAttached()

    // The privacy-consent checkbox gates the submit button. Enable
    // the form by checking it first; the test then exercises the
    // native HTML5 required-field validation when submit is clicked.
    await contactSection.locator('input[name="consent"]').check()

    const submitButton = contactSection.locator('button[type="submit"]')
    await submitButton.click()

    const invalidInput = contactSection.locator("input:invalid, textarea:invalid")
    const count = await invalidInput.count()
    expect(count).toBeGreaterThan(0)
  })
})
