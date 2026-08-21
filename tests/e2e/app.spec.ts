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

    const contactSection = page.locator("#contact")
    await expect(contactSection).toBeVisible()

    const submitButton = contactSection.locator('button[type="submit"]')
    await submitButton.click()

    const invalidInput = contactSection.locator("input:invalid, textarea:invalid")
    const count = await invalidInput.count()
    expect(count).toBeGreaterThan(0)
  })
})
