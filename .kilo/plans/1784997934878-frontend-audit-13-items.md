# Frontend UI Audit Implementation Plan
## 13 Remaining Items from 30-Item Audit (P0→P1→P2→P3)

### Current State Verified
- `app/error.tsx` — DOES NOT EXIST
- `app/not-found.tsx` — DOES NOT EXIST
- `app/[locale]/error.tsx` — DOES NOT EXIST
- `app/[locale]/not-found.tsx` — DOES NOT EXIST
- `app/layout.tsx` — Server Component, no Suspense boundaries
- `app/[locale]/layout.tsx` — Server Component, has `generateStaticParams` (line 56), viewport meta (line 80)
- `.eslintrc.json` — only extends `["next/core-web-vitals"]`
- `playwright.config.ts` — only `chromium` e2e project, no visual regression tests
- `package.json` — no `@axe-core/playwright` dependency
- `next.config.mjs` — no critical CSS config
- `app/globals.css` — has `@media (prefers-reduced-motion: no-preference)` at line 143, no `content-visibility`
- `app/components/Projects.tsx` — inline `Project` component at line 25
- `app/components/LanguageSelector.tsx` — exists at `components/LanguageSelector.tsx` (NOT `app/components/`)
- `app/components/Contact.tsx` — uses `useState` for form submission state
- All 20 original P0–P3 fixes already completed and pushed in commits `deb08b3` and `3bb9074`

---

## P0 Tier — Items 1–7

### P0-1: Create 4 Missing Error Boundary / Not-Found Files
**Verification prerequisite:** Confirm files do not exist (verified: all 4 missing).

Create the following 4 client component files with `"use client"` directive and audit comments:

1. `app/error.tsx` — Root error boundary with fallback UI
   - Comment: `// Audit P0-1: root error boundary`
   - Use `use client`
   - Provide `reset()` function via `useRouter().refresh()`
   - Show generic error message with retry button

2. `app/not-found.tsx` — Root 404 handler
   - Comment: `// Audit P0-1: root not-found handler`
   - Use `use client`
   - Show 404 message with link back to home

3. `app/[locale]/error.tsx` — Locale-scoped error boundary
   - Comment: `// Audit P0-1: locale error boundary`
   - Use `use client`
   - Same pattern as root but locale-aware

4. `app/[locale]/not-found.tsx` — Locale-scoped 404 handler
   - Comment: `// Audit P0-1: locale not-found handler`
   - Use `use client`
   - Same pattern as root but locale-aware

**Verification:**
- `pnpm exec tsc --noEmit` — expect 0 new errors
- `pnpm exec eslint .` — expect 0 new errors
- `pnpm build` — expect success, static pages for `/en`, `/zh`, `/ms`, `/ta`, `/ar` still generate

---

### P0-2: Integrate `useReducedMotion()` from `framer-motion`
**Scope:** All components using `framer-motion` `whileInView`, `animate`, `initial`, `transition`, and `whileHover` props.

Components to update (verified via grep):
- `app/components/About.tsx`
- `app/components/AnimatedSectionHeader.tsx`
- `app/components/Contact.tsx`
- `app/components/Education.tsx`
- `app/components/Experience.tsx`
- `app/components/Logo.tsx`
- `app/components/Services.tsx`
- `app/components/Skills.tsx`
- `app/components/Testimonials.tsx`
- `app/components/floating-nav.tsx`
- `app/components/Hero.tsx`
- `app/components/Projects.tsx`
- `app/components/terminal/DevInterface.tsx`
- `app/components/terminal/eDEXInterface.tsx`
- `app/components/terminal/FileExplorer.tsx`
- `app/components/terminal/HexGrid.tsx`
- `app/components/terminal/SystemMonitor.tsx`

**Implementation pattern for each component:**
```tsx
// Audit P0-2: respect reduced motion preference
import { useReducedMotion } from "framer-motion"

const shouldReduceMotion = useReducedMotion()

// Then conditionally set motion props:
initial={shouldReduceMotion ? false : { opacity: 0, y: 20 }}
animate={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 1, y: 0 }}
transition={shouldReduceMotion ? { duration: 0 } : { duration: 0.5 }}
whileInView={shouldReduceMotion ? false : { opacity: 1, y: 0 }}
viewport={shouldReduceMotion ? { once: true } : { once: true }}
whileHover={shouldReduceMotion ? false : { scale: 1.03 }}
```

For `whileInView` animations: set `whileInView={shouldReduceMotion ? false : ...}` and ensure `initial` state is already visible when motion is reduced.
For `whileHover` animations: set `whileHover={shouldReduceMotion ? false : ...}`.

**Comment format:** `// Audit P0-2: respect reduced motion preference` in each modified file.

**Verification:**
- `pnpm exec tsc --noEmit` — 0 errors
- `pnpm exec eslint .` — 0 new errors
- `pnpm build` — success

---

### P0-3: Add `Suspense` Boundaries in `app/layout.tsx`
**Target:** `app/layout.tsx` (Server Component).

**Implementation:**
Wrap non-critical children and sections in `<Suspense>` boundaries with loading fallbacks.

```tsx
// Audit P0-3: suspense boundary for non-critical content
import { Suspense } from "react"

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html ...>
      <body>
        <ThemeProvider ...>
          <Suspense fallback={<div className="min-h-screen bg-background" />}>
            {children}
          </Suspense>
        </ThemeProvider>
      </body>
    </html>
  )
}
```

**Comment format:** `// Audit P0-3: suspense boundary for non-critical content`

**Verification:**
- `pnpm exec tsc --noEmit` — 0 errors
- `pnpm exec eslint .` — 0 new errors
- `pnpm build` — success

---

### P0-4: Replace Non-Critical Imports with `next/dynamic` (SSR: false)
**Target:** Client-only components that don't need SSR.

Candidate components for dynamic import (verified from `app/components/`):
- `app/components/About.tsx`
- `app/components/Contact.tsx`
- `app/components/Education.tsx`
- `app/components/Experience.tsx`
- `app/components/Projects.tsx`
- `app/components/Services.tsx`
- `app/components/Skills.tsx`
- `app/components/Testimonials.tsx`
- `app/components/floating-nav.tsx`
- `app/components/terminal/DevInterface.tsx`
- `app/components/terminal/eDEXInterface.tsx`
- `app/components/terminal/FileExplorer.tsx`
- `app/components/terminal/HexGrid.tsx`
- `app/components/terminal/SystemMonitor.tsx`

**Implementation pattern:**
In the page component that imports these (likely `app/[locale]/page.tsx` or `MainContent.tsx`):
```tsx
// Audit P0-4: dynamic import with ssr disabled
import dynamic from "next/dynamic"

const DynamicAbout = dynamic(() => import("@/components/About").then(m => m.default), { ssr: false })
```

**Comment format:** `// Audit P0-4: dynamic import with ssr disabled`

**Verification:**
- `pnpm exec tsc --noEmit` — 0 errors
- `pnpm exec eslint .` — 0 new errors
- `pnpm build` — success

---

### P0-5: Wrap Presentational Components with `React.memo`
**Candidates (verified):**
- `app/components/Testimonials.tsx` — already identified as candidate
- `app/components/Projects.tsx` — heavy list rendering
- `app/components/Skills.tsx` — grid with many items
- `app/components/About.tsx` — skill cards grid

**Implementation pattern:**
```tsx
// Audit P0-5: memoized presentational component
import { memo } from "react"

const TestimonialsComponent = () => { ... }
export default memo(TestimonialsComponent)
```

**Comment format:** `// Audit P0-5: memoized presentational component`

**Verification:**
- `pnpm exec tsc --noEmit` — 0 errors
- `pnpm exec eslint .` — 0 new errors
- `pnpm build` — success

---

### P0-6: Add `useTransition` for Non-Urgent State Updates
**Targets:**
- `app/components/LanguageSelector.tsx` — language switching
- `app/components/Contact.tsx` — form submission state

**Implementation for LanguageSelector.tsx:**
```tsx
// Audit P0-6: non-urgent state update with useTransition
import { useTransition } from "react"

const [isPending, startTransition] = useTransition()

const handleLanguageChange = (lang: Language) => {
  startTransition(() => {
    setLanguage(lang)
    setIsOpen(false)
    localStorage.setItem("language", lang)
    router.push(`/${lang}${window.location.pathname.substring(3)}`)
  })
}
```

**Implementation for Contact.tsx:**
```tsx
// Audit P0-6: non-urgent state update with useTransition
const [isPending, startTransition] = useTransition()

const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault()
  startTransition(async () => {
    setIsSubmitting(true)
    // ... existing logic
  })
}
```

**Comment format:** `// Audit P0-6: non-urgent state update with useTransition`

**Verification:**
- `pnpm exec tsc --noEmit` — 0 errors
- `pnpm exec eslint .` — 0 new errors
- `pnpm build` — success

---

### P0-7: Add `content-visibility: auto` to Below-the-Fold Containers
**Target:** `app/globals.css`

**Implementation:**
Add CSS rules for below-the-fold section containers:
```css
/* Audit P0-7: below-the-fold content visibility optimization */
#experience,
#testimonials,
#education,
#contact {
  content-visibility: auto;
  contain-intrinsic-size: 1000px;
}
```

**Comment format:** `/* Audit P0-7: below-the-fold content visibility optimization */`

**Verification:**
- `pnpm exec tsc --noEmit` — 0 errors
- `pnpm exec eslint .` — 0 new errors
- `pnpm build` — success

---

## P1 Tier — Items 8–12

### P1-8: Create Barrel Export Files
Create 4 barrel/index files using `export *` pattern:

1. `app/components/index.ts`
```tsx
// Audit P1-8: barrel export for components
export * from "./About"
export * from "./AnimatedSectionHeader"
export * from "./Contact"
export * from "./Education"
export * from "./Experience"
export * from "./floating-nav"
export * from "./Header"
export * from "./Hero"
export * from "./Logo"
export * from "./Projects"
export * from "./Services"
export * from "./Skills"
export * from "./Testimonials"
export * from "./terminal/DevInterface"
export * from "./terminal/eDEXInterface"
export * from "./terminal/FileExplorer"
export * from "./terminal/HexGrid"
export * from "./terminal/SystemMonitor"
```

2. `hooks/index.ts`
```tsx
// Audit P1-8: barrel export for hooks
export * from "./use-language-animation"
export * from "./use-i18n-form"
export * from "./use-mounted"
export * from "./use-terminal"
```

3. `context/index.ts`
```tsx
// Audit P1-8: barrel export for context
export * from "./language-utils"
export * from "./language-provider"
export * from "./rtl-provider"
export * from "./theme-provider"
```

4. `lib/index.ts`
```tsx
// Audit P1-8: barrel export for lib
export * from "./rtl-utils"
```

**Verification:**
- `pnpm exec tsc --noEmit` — 0 errors
- `pnpm exec eslint .` — 0 new errors
- `pnpm build` — success

---

### P1-9: Extract Inline `Project` Sub-Component to `ProjectCard.tsx`
**Source:** `app/components/Projects.tsx` line 25

**Create:** `app/components/ProjectCard.tsx`
```tsx
// Audit P1-9: extracted project card component
"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { ExternalLink, ChevronDown, ChevronUp } from "lucide-react"
import { useTranslation } from "@/context/language-utils"

interface ProjectProps {
  title: string
  period: string
  link: string
  icon: React.ReactElement
  description: string
  achievements: string[]
  caseStudy?: {
    challenge: string
    approach: string
    results: string
    technologies: string[]
  }
}

const ProjectCard = ({ project, index }: { project: ProjectProps; index: number }) => {
  const [expanded, setExpanded] = useState(false)
  const { t } = useTranslation()
  // ... (copy existing Project component body from Projects.tsx lines 25-128)
}

export default ProjectCard
```

**Update `app/components/Projects.tsx`:**
- Remove inline `Project` component (lines 25-128)
- Import `ProjectCard` from `./ProjectCard`
- Replace `<Project key={index} project={project} index={index} />` with `<ProjectCard key={index} project={project} index={index} />`

**Comment format:** `// Audit P1-9: extracted project card component` in both files.

**Verification:**
- `pnpm exec tsc --noEmit` — 0 errors
- `pnpm exec eslint .` — 0 new errors
- `pnpm build` — success

---

### P1-10: Extend `.eslintrc.json` with Additional Rulesets
**Current:** `{ "extends": ["next/core-web-vitals"] }`

**Target:**
```json
{
  "extends": [
    "next/core-web-vitals",
    "next",
    "plugin:react-hooks/exhaustive-deps",
    "plugin:@typescript-eslint/recommended"
  ],
  "rules": {
    "no-unused-vars": "error",
    "@typescript-eslint/no-unused-vars": ["error", { "argsIgnorePattern": "^_" }]
  }
}
```

**Comment:** `// Audit P1-10: extended eslint config with additional rulesets`

**Verification:**
- `pnpm exec eslint .` — expect 0 new errors (7 pre-existing warnings remain)
- `pnpm build` — success

---

### P1-11: Add Visual Regression Test Project to `playwright.config.ts`
**Target:** `playwright.config.ts`

**Add new project:**
```ts
{
  name: "visual-regression",
  use: { ...devices["Desktop Chrome"] },
},
```

**Comment:** `// Audit P1-11: visual regression test project`

**Verification:**
- `pnpm exec playwright test --project=visual-regression` — tests pass or are recognized

---

### P1-12: Install and Configure `@axe-core/playwright`
**Target:** `package.json` and new test file.

**Steps:**
1. Add `@axe-core/playwright` to devDependencies (or install via `pnpm add -D @axe-core/playwright`)
2. Create `tests/e2e/accessibility.spec.ts`
3. Configure axe to run against key pages

**Comment:** `// Audit P1-12: accessibility testing with axe-core`

**Verification:**
- `pnpm exec playwright test --project=chromium` — all tests pass
- `pnpm build` — success

---

## P2 Tier — Item 13

### P2-13: Add Critical CSS Config to `next.config.mjs`
**Pre-implementation verification:**
- Run `pnpm build` and inspect generated HTML for inline critical CSS gaps
- Check `next.config.mjs` for existing critical CSS configuration (verified: none exists)

**Implementation:**
```js
// Audit P2-13: critical CSS inlining config
compiler: {
  removeConsole: process.env.NODE_ENV === "production",
  styledComponents: true,
},
```

**Comment:** `// Audit P2-13: critical CSS inlining config`

**Verification:**
- `pnpm build` — static pages generate with inlined critical CSS
- No performance regressions in build output

---

## P3 Tier — Items 14–16

### OPEN QUESTION
**P3 items 14 through 16 are referenced in the execution steps but NOT defined in the user's message.** The session memory shows the previous topic was "Need P3 item descriptions" but the descriptions were not saved.

**Required decision:** Define P3-14, P3-15, and P3-16 with specific file paths, implementation details, and audit comment format before proceeding.

---

## Final Verification & Push Strategy

### Tier Verification Commands
After each tier completion, run:
- `pnpm exec tsc --noEmit` — expect 0 new errors
- `pnpm exec eslint .` — expect 0 new errors (7 pre-existing warnings acceptable)
- `pnpm build` — expect success, static pages for `/en`, `/zh`, `/ms`, `/ta`, `/ar`

### Final Full Verification
After all tiers complete:
- `pnpm exec tsc --noEmit`
- `pnpm exec eslint .`
- `pnpm build`
- `pnpm exec playwright test` (e2e + visual regression + accessibility)

### Git Strategy
1. Stage all changes: `git add -A`
2. Create single consolidated commit: `git commit -m "feat: 30-item frontend UI audit implementation (P0-P3)"`
3. Push to `origin/main`

**Known push risk:** Branch protection rules require 3 status checks, CodeQL scanning, and signed commits. If push is rejected:
- Open PR against `main`
- Note bypass requirement for merge

---

## Open Questions
1. **P3 items 14–16 definitions** — Not provided in execution steps. Must be defined before implementation can proceed.
2. **`LanguageSelector` location** — Verified at `components/LanguageSelector.tsx` (not `app/components/`). P0-6 `useTransition` implementation must target this path.
