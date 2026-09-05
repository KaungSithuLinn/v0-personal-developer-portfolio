import { defineConfig, devices } from "@playwright/test"

// Audit P1-11: added Playwright visual regression project

// Selection order for the local web server:
//   1. CI always builds + starts the production server for stability.
//   2. Locally, default to the production server (faster hydration, no
//      HMR overhead, identical to the deployed Vercel build). Override
//      with PLAYWRIGHT_USE_DEV=1 to fall back to the dev server.
const useProdServer = !process.env.PLAYWRIGHT_USE_DEV

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: "html",
  use: {
    baseURL: process.env.BASE_URL || "http://localhost:3000",
    trace: "on-first-retry",
    // Per the a11y.spec.ts doc comment, the suite is calibrated for the
    // production build. We keep these tight enough that a real
    // regression surfaces quickly, but loose enough to absorb the
    // cold-start cost when the `next start` server is hit by the
    // chromium and visual-regression projects in parallel.
    navigationTimeout: 30_000,
    actionTimeout: 15_000,
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
    {
      name: "visual-regression",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
  webServer: process.env.BASE_URL
    ? undefined
    : useProdServer
      ? {
          // `next start` is not a package script here, but the binary is
          // resolvable through node_modules/.bin and pnpm's PATH. We
          // shell out via npx for portability across package managers
          // and the global PATH in CI.
          command: "npx next start -p 3000",
          url: "http://localhost:3000",
          reuseExistingServer: !process.env.CI,
          timeout: 120_000,
        }
      : {
          command: "npx next dev -p 3000",
          url: "http://localhost:3000",
          reuseExistingServer: !process.env.CI,
          timeout: 120_000,
        },
})
