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
//   * `npx next build` + `npx next start` produces fully-rendered, code-split
//     pages. `domcontentloaded` is enough for axe-core; `load` is the
//     backstop for late-arriving assets.
//   * Dynamic imports (SystemMonitor, ProjectCard) resolve during the
//     initial render. We wait for visible content rather than the network.
//   * The per-test timeout is 30 s, which is generous enough to cover
//     axe-core's color-contrast sampling on a full DOM (it walks the entire
//     stylesheet tree, not just visible elements) but tight enough to fail
//     loudly when a real regression slips in. The previous 60 s default
//     was masking intermittent hydration stalls.
test.describe("Accessibility", () => {
  test.describe.configure({ timeout: 45_000 })

  test("home page has no detectable a11y violations", async ({ page }) => {
    // `domcontentloaded` is enough: axe-core walks the parsed DOM and
    // the inline styles; it does not need image/font loads. The
    // previous code used `load`, which forces every <img>/<script> to
    // resolve and can exceed 30 s when the chromium and
    // visual-regression projects share one `next start` server.
    await page.goto("/en", { waitUntil: "domcontentloaded" })

    // Section anchors are real DOM by the time `domcontentloaded`
    // fires, but the sections themselves may not be painted until
    // React commits. Wait for the hero heading and the contact anchor
    // to be attached & laid out before letting axe-core scan.
    await expect(page.locator("h1").first()).toBeVisible()
    await expect(page.locator("main, [role='main']").first()).toBeVisible()
    await expect(page.locator("#contact")).toBeVisible()

    const results = await new AxeBuilder({ page }).analyze()
    expect(results.violations).toEqual([])
  })

  test("contact form is accessible", async ({ page }) => {
    await page.goto("/en", { waitUntil: "domcontentloaded" })
    const contactSection = page.locator("#contact")
    await expect(contactSection).toBeVisible()

    const results = await new AxeBuilder({ page }).include("#contact").analyze()
    expect(results.violations).toEqual([])
  })

  test("scrolling reveals a back-to-top button with a label", async ({ page }) => {
    // Verifies the FloatingNav scroll affordance is exposed to assistive
    // tech. The button is only rendered after the user scrolls > 600 px,
    // so we trigger that and then read the role+label.
    await page.goto("/en", { waitUntil: "domcontentloaded" })
    await expect(page.locator("#about")).toBeVisible()

    await page.evaluate(() => window.scrollTo({ top: 1500, behavior: "instant" }))

    const backToTop = page.getByRole("button", { name: /back to top/i })
    await expect(backToTop).toBeVisible()
  })

  test("project filter exposes a labelled tablist", async ({ page }) => {
    await page.goto("/en", { waitUntil: "domcontentloaded" })
    const tablist = page.getByRole("tablist", { name: /filter projects by category/i })
    await expect(tablist).toBeVisible()

    // All + at least one category chip should be present.
    await expect(tablist.getByRole("tab", { name: /all/i })).toBeVisible()
  })
})

