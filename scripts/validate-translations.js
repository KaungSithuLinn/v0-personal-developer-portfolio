const fs = require('fs')
const path = require('path')

const translationsDir = path.join(__dirname, '..', 'context', 'translations')
const files = fs.readdirSync(translationsDir).filter(f => f.endsWith('.ts') && f !== 'index.ts')

const locales = ['en', 'zh', 'ms', 'ta', 'ar']

function extractLocaleObject(content, locale) {
  const marker = new RegExp(`\\n\\s*${locale}\\s*:\\s*\\{`).exec(content)
  if (!marker) return null
  let i = marker.index + marker[0].length
  let depth = 1
  const start = i
  while (i < content.length && depth > 0) {
    const ch = content[i]
    if (ch === '"' || ch === "'" || ch === '`') {
      const quote = ch
      i++
      while (i < content.length && content[i] !== quote) {
        if (content[i] === '\\') i++
        i++
      }
    } else if (ch === '{') {
      depth++
    } else if (ch === '}') {
      depth--
      if (depth === 0) return content.slice(start, i)
    }
    i++
  }
  return null
}

function extractKeys(block) {
  const keys = new Set()
  const keyRegex = /"((?:[^"\\]|\\.)+)"\s*:/g
  let m
  while ((m = keyRegex.exec(block)) !== null) {
    if (!locales.includes(m[1])) keys.add(m[1])
  }
  return keys
}

let hasErrors = false

for (const file of files) {
  const filePath = path.join(translationsDir, file)
  const content = fs.readFileSync(filePath, 'utf-8')

  const referenceKeys = extractKeys(extractLocaleObject(content, 'en'))
  if (referenceKeys.size === 0) {
    console.error(`[${file}] No English keys found — file may be malformed`)
    hasErrors = true
    continue
  }

  for (const locale of locales.slice(1)) {
    const block = extractLocaleObject(content, locale)
    if (block === null) {
      console.error(`[${file}] Locale "${locale}" section not found`)
      hasErrors = true
      continue
    }

    const keys = extractKeys(block)
    const missing = [...referenceKeys].filter(k => !keys.has(k))
    const extra = [...keys].filter(k => !referenceKeys.has(k))

    if (missing.length > 0) {
      console.error(`[${file}] Missing ${missing.length} key(s) in "${locale}":`)
      missing.forEach(k => console.error(`  - ${k}`))
      hasErrors = true
    }
    if (extra.length > 0) {
      console.error(`[${file}] Extra ${extra.length} key(s) in "${locale}":`)
      extra.forEach(k => console.error(`  + ${k}`))
      hasErrors = true
    }
  }
}

if (hasErrors) {
  console.error('\n✖ Translation key parity validation failed.')
  process.exit(1)
}
console.log(`✔ Translation key parity validated: ${files.length} files × ${locales.length} locales`)
process.exit(0)
