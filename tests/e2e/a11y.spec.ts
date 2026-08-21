import { test, expect } from "@playwright/test"
import AxeBuilder from "@axe-core/playwright"

// Audit P1-12: configured axe-core Playwright accessibility tests

test.describe("Accessibility", () => {
  test("home page has no detectable a11y violations", async ({ page }) => {
    await page.goto("/en")
    await expect(page.locator("#contact")).toBeVisible()

    const results = await new AxeBuilder({ page }).analyze()
    expect(results.violations).toEqual([])
  })

  test("contact form is accessible", async ({ page }) => {
    await page.goto("/en")
    await expect(page.locator("#contact")).toBeVisible()

    const contactSection = page.locator("#contact")
    await expect(contactSection).toBeVisible()

    const results = await new AxeBuilder({ page }).include("#contact").analyze()
    expect(results.violations).toEqual([])
  })
})
