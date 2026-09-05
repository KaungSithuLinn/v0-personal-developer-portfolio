#!/usr/bin/env node
/**
 * Run the Playwright suite against the production deployment on Vercel.
 * Sets BASE_URL so the config skips the local webServer, then forwards
 * any extra CLI args to `playwright test`.
 */

import { spawn } from "node:child_process"
import process from "node:process"

const env = {
  ...process.env,
  BASE_URL: "https://v0-personal-developer-portfolio-psi-blush.vercel.app",
}

const child = spawn("npx", ["--no-install", "playwright", "test", ...process.argv.slice(2)], {
  stdio: "inherit",
  env,
  shell: process.platform === "win32",
})

child.on("exit", (code) => process.exit(code ?? 1))
