/**
 * This script helps generate a proper package-lock.json file
 * Run it with: node scripts/generate-lock-file.js
 */

const { execSync } = require("child_process")
const fs = require("fs")
const path = require("path")

console.log("Generating package-lock.json file...")

try {
  // Create .npmrc file with legacy-peer-deps
  const npmrcContent = "legacy-peer-deps=true\npackage-lock=true\n"
  fs.writeFileSync(".npmrc", npmrcContent)
  console.log("Created temporary .npmrc file")

  // Run npm install to generate package-lock.json
  console.log("Running npm install...")
  execSync("npm install", { stdio: "inherit" })

  console.log("\nPackage lock file generated successfully!")
  console.log("\nNext steps:")
  console.log("1. Commit the updated package-lock.json file")
  console.log("2. Push the changes to your repository")
  console.log("3. Your GitHub Actions workflow should now run successfully")
} catch (error) {
  console.error("Error generating package-lock.json:", error.message)
  process.exit(1)
}
