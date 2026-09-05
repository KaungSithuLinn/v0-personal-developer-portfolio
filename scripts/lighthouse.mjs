#!/usr/bin/env node
/**
 * Run Lighthouse CI for both desktop and mobile presets against the
 * production deployment. The two configs (`lighthouserc.json` for desktop,
 * `lighthouserc.mobile.json` for mobile) are kept separate so their
 * thresholds can differ — mobile has tighter LCP/CLS/TBT caps.
 *
 * Exits non-zero on the first failing run. Run with `--no-assert` to skip
 * the assertion phase when you only want raw scores.
 */

import { spawn } from "node:child_process"
import process from "node:process"

const targets = [
  { config: "lighthouserc.json", label: "desktop" },
  { config: "lighthouserc.mobile.json", label: "mobile" },
]

const skipAssert = process.argv.includes("--no-assert")

function run(label, args) {
  return new Promise((resolve, reject) => {
    console.log(`\n→ Lighthouse CI: ${label}`)
    const child = spawn("npx", ["--no-install", "lhci", "autorun", ...args], {
      stdio: "inherit",
      shell: process.platform === "win32",
    })
    child.on("exit", (code) =>
      code === 0 ? resolve() : reject(new Error(`lhci ${label} exited with code ${code}`))
    )
  })
}

;(async () => {
  for (const { config, label } of targets) {
    const args = ["--config=./" + config]
    if (skipAssert) args.push("--assert.assertMatrix=") // empty matrix skips assertions
    try {
      await run(label, args)
    } catch (err) {
      console.error(`\n✗ ${label} run failed:`, err.message)
      process.exit(1)
    }
  }
  console.log("\n✓ Lighthouse CI: desktop + mobile both passed")
})()
