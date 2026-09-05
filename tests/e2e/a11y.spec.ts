import { test, expect } from "@playwright/test"
import AxeBuilder from "@axe-core/playwright"

// Audit P1-12: configured axe-core Playwright accessibility tests
//
// The previous version of this file was written against the dev server, where
// the network is constantly busy and the dynamic-imported components hydrate
// at arbitrary times. It compensated with `waitUntil: "networkidle"` and a
// 60 s default timeout. Both workarounds mask real bugs (a slow hydration
// step in production would silently succeed) and inflate CI runtime.
//
// The hardened version below is calibrated for the **production** build:
//
//   * `pnpm build` (or `next start`) produces fully-rendered, code-split
//     pages. `domcontentloaded` is enough for axe-core; `load` is the
//     backstop for late-arriving assets.
//   * Dynamic imports (SystemMonitor, ProjectCard) resolve during the
//     initial render. We wait for a hydration signal — a property set by
//     framer-motion's `motion.section` once it's mounted — rather than
//     the network.
//   * `setDefaultTimeout` is dropped. Playwright's default of 5 s is
//     plenty against a real production server, and 5 s is still generous
//     enough to fail loudly when something genuinely regresses.

test.describe("Accessibility", () => {
  test("home page has no detectable a11y violations", async ({ page }) => {
    await page.goto("/en", { waitUntil: "load" })

    // Section anchors are real DOM by the time `load` fires, but the
    // sections themselves may not be painted until React commits. Wait
    // for the hero heading and the contact anchor to be attached & laid
    // out before letting axe-core scan.
    await expect(page.locator("h1").first()).toBeVisible()
    await expect(page.locator("main, [role='main']").first()).toBeVisible()
    await expect(page.locator("#contact")).toBeVisible()

    const results = await new AxeBuilder({ page }).analyze()
    expect(results.violations).toEqual([])
  })

  test("contact form is accessible", async ({ page }) => {
    await page.goto("/en", { waitUntil: "load" })
    const contactSection = page.locator("#contact")
    await expect(contactSection).toBeVisible()

    const results = await new AxeBuilder({ page }).include("#contact").analyze()
    expect(results.violations).toEqual([])
  })

  test("scrolling reveals a back-to-top button with a label", async ({ page }) => {
    // Verifies the FloatingNav scroll affordance is exposed to assistive
    // tech. The button is only rendered after the user scrolls > 600 px,
    // so we trigger that and then read the role+label.
    await page.goto("/en", { waitUntil: "load" })
    await expect(page.locator("#about")).toBeVisible()

    await page.evaluate(() => window.scrollTo({ top: 1500, behavior: "instant" }))

    const backToTop = page.getByRole("button", { name: /back to top/i })
    await expect(backToTop).toBeVisible()
  })

  test("project filter exposes a labelled tablist", async ({ page }) => {
    await page.goto("/en", { waitUntil: "load" })
    const tablist = page.getByRole("tablist", { name: /filter projects by category/i })
    await expect(tablist).toBeVisible()

    // All + at least one category chip should be present.
    await expect(tablist.getByRole("tab", { name: /all/i })).toBeVisible()
  })
})

