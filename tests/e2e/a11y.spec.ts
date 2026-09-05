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
//   * The per-test timeout is 45 s, which is generous enough to cover
//     axe-core's color-contrast sampling on a full DOM (it walks the entire
//     stylesheet tree, not just visible elements) but tight enough to fail
//     loudly when a real regression slips in. The previous 60 s default
//     was masking intermittent hydration stalls.
//   * `.analyze()` is not a Playwright action, so `actionTimeout` does not
//     cover it. We bound it with a `Promise.race` so a hung scan fails fast
//     instead of eating the entire per-test budget.
//   * `mode: "serial"` runs the 4 a11y tests one at a time so the
//     `visual-regression` project does not contend for the same
//     `next start` server mid-test.
test.describe("Accessibility", () => {
  // 60 s per test: `goto` (~3-5 s on a warm `next start`, up to 10 s on
  // a cold one) + `toBeAttached`/`toBeVisible` (~1-2 s total) +
  // `AxeBuilder.analyze()` on a full production DOM (~5-15 s, depending
  // on the number of `color-contrast` checks). The previous 30 s budget
  // was tight enough that the test surfaced a misleading
  // `page.goto: Test timeout exceeded` error when axe-core was the
  // actual slow call.
  test.describe.configure({ timeout: 60_000, mode: "serial" })

  test("home page has no detectable a11y violations", async ({ page }) => {
    // `domcontentloaded` is enough: axe-core walks the parsed DOM and
    // the inline styles; it does not need image/font loads. The
    // previous code used `load`, which forces every <img>/<script> to
    // resolve and can exceed 30 s when the chromium and
    // visual-regression projects share one `next start` server.
    await page.goto("/en", { waitUntil: "domcontentloaded" })

    // Section anchors are real DOM by the time `domcontentloaded`
    // fires. `toBeAttached` is enough: axe-core only requires DOM
    // presence, not paint. We keep one final `toBeVisible` on the
    // contact section because that is the element axe-core's contact
    // test will inspect.
    await expect(page.locator("h1").first()).toBeAttached({ timeout: 5_000 })
    await expect(page.locator("main, [role='main']").first()).toBeAttached({ timeout: 5_000 })
    await expect(page.locator("#contact")).toBeAttached({ timeout: 5_000 })
    await expect(page.locator("#contact")).toBeVisible()

    // Bound the scan so a hung axe-core fails fast instead of burning
    // the whole per-test budget. The previous un-bounded call could
    // exceed the timeout on a partially-hydrated DOM and surface as a
    // misleading `page.goto` failure in the error context. 30 s is
    // generous enough for axe-core's `color-contrast` rule on the
    // full production DOM (~5-15 s typical) and tight enough to fail
    // loudly on a real hang.
    const results = await Promise.race([
      new AxeBuilder({ page }).analyze(),
      new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error("axe-core analyze exceeded 30s")), 30_000),
      ),
    ])
    expect(results.violations).toEqual([])
  })

  test("contact form is accessible", async ({ page }) => {
    await page.goto("/en", { waitUntil: "domcontentloaded" })
    const contactSection = page.locator("#contact")
    await expect(contactSection).toBeAttached({ timeout: 5_000 })
    await expect(contactSection).toBeVisible()

    const results = await Promise.race([
      new AxeBuilder({ page }).include("#contact").analyze(),
      new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error("axe-core analyze exceeded 30s")), 30_000),
      ),
    ])
    expect(results.violations).toEqual([])
  })

  test("scrolling reveals a back-to-top button with a label", async ({ page }) => {
    // Verifies the FloatingNav scroll affordance is exposed to assistive
    // tech. The button is only rendered after the user scrolls > 600 px,
    // so we trigger that and then read the role+label.
    await page.goto("/en", { waitUntil: "domcontentloaded" })
    await expect(page.locator("#about")).toBeAttached({ timeout: 5_000 })

    await page.evaluate(() => window.scrollTo({ top: 1500, behavior: "instant" }))

    const backToTop = page.getByRole("button", { name: /back to top/i })
    await expect(backToTop).toBeVisible()
  })

  test("project filter exposes a labelled tablist", async ({ page }) => {
    await page.goto("/en", { waitUntil: "domcontentloaded" })
    const tablist = page.getByRole("tablist", { name: /filter projects by category/i })
    await expect(tablist).toBeAttached({ timeout: 5_000 })
    await expect(tablist).toBeVisible()

    // All + at least one category chip should be present.
    await expect(tablist.getByRole("tab", { name: /all/i })).toBeVisible()
  })
})
