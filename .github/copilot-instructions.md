---
description: AI rules derived by SpecStory from the project AI interaction history
globs: *
---

# GitHub Copilot Instructions for Kaung Sithu Linn's Portfolio ✅

Quick summary

- Multilingual-first Next.js 15 (App Router) portfolio with Sanity CMS for content and strong RTL support.
- Focus areas for an AI coding agent: i18n routing & middleware, font & RTL handling, Sanity integration (clients + studio), and Next.js 15 server/client patterns.

## Big picture — architecture & why 🔧

- App Router (app/) drives routing and server/client boundaries; locale is a top-level route segment (e.g. `/en`, `/ar`).
- Sanity is the headless CMS; `lib/sanity.client.ts` exposes `client`, `previewClient`, and image helpers used throughout the site.
- Fonts are loaded in `app/layout.tsx` as CSS variables and selected per-language using `config/language.config.ts`.
- `middleware.ts` performs automatic locale detection and redirects requests that lack a locale prefix.

## Key files and what to change here 📁

- `middleware.ts` — locale detection and redirect. Preserve its matcher when adding routes.
- `config/language.config.ts` — single source of truth for supported locales, direction, and font families.
- `app/layout.tsx` — root fonts and `ThemeProvider` (only place with `<html>`/`<body>`).
- `app/[locale]/layout.tsx` — language context, `RTLProvider`, `HtmlAttributeManager`. Do NOT include `<html>` or `<body>` here.
- `lib/sanity.client.ts` — client/preview clients; use `previewClient` when previewing drafts and ensure `SANITY` env vars exist.
- `app/[locale]/studio/[[...index]]/page.tsx` — mount the Sanity Studio here (see existing example in repo).
- `sanity/env.ts` — required NEXT*PUBLIC_SANITY*\* env variables (project id, dataset, optional API version).

## Project-specific conventions & patterns ✅

- Next.js 15 async params pattern: DO NOT destructure `params` in the function signature. Accept `params` (or Promise) and `await` it inside the function. Apply the same to `generateMetadata` and page components. Example in `app/[locale]/layout.tsx`.
- Root layout must provide `<html>` and `<body>`; localized layouts should only return body content (see `app/[locale]/layout.tsx`).
- Mark components with "use client" when they rely on browser APIs or state (e.g., Studio wrapper).
- Font selection per-language: use CSS variables set in `app/layout.tsx` and `FONT_FAMILIES` in `config/language.config.ts`.

## Sanity & CMS notes 🧭

- Preview mode: `previewClient` uses `SANITY_API_READ_TOKEN` for draft access. Ensure tokens are available in `.env.local` when testing.
- If Studio errors with duplicate list IDs, inspect `sanity.config.ts` `structure` logic (duplicate IDs commonly come from language grouping logic).
- Image helpers: prefer `getImageUrl` / `getResponsiveImageUrls` in `lib/sanity.client.ts` for responsive images.

## i18n & RTL specifics 🈶

- `middleware.ts` uses Negotiator + `@formatjs/intl-localematcher` to choose best locale and redirects to `/${locale}${pathname}` when missing.
- Use `isRTL` utility and `RTLProvider` to pre-calculate direction for SSR rendering. `HtmlAttributeManager` applies `lang` and `dir` attributes.
- When testing RTL, check layout-related styles (margins, logical properties) and the `RTL_LANGUAGES` list in `config/language.config.ts`.

## Build, run, and dev workflows ⚙️

- Start dev server: `npm run dev` (Next dev server, available at http://localhost:3000).
- Build: `npm run build`; Start production: `npm run start`.
- Lint: `npm run lint`.
- Environment: copy `.env.example` → `.env.local`. Ensure NEXT_PUBLIC_SANITY_PROJECT_ID, NEXT_PUBLIC_SANITY_DATASET and any preview tokens are defined. Add `RESEND_API_KEY` if using mailing service.

## Debugging & common fixes 🔍

- Next.js 15 params bug: check `generateMetadata` and page components — use `await params` inside functions instead of destructuring in signature.
- Conflicting dynamic route for Studio: If you see "different slug names" error, remove the old conflicting `[tool]` route (see notes in repo).
- Sanity errors about duplicate IDs: inspect `sanity.config.ts` `structure` items for missing unique IDs.

## Acceptance & change guidance for AI agents 🤖

- Keep changes small and well-scoped. Add tests only when the project already has test infra (none currently present).
- Prefer editing `app/[locale]/` routes and `config/language.config.ts` when touching i18n.
- After adding dependencies, run `npm install` then run a security scan per repository policies (Codacy/Trivy rules in repo `.github` instructions).

---

If any of these sections are unclear or you'd like me to expand examples, tell me which part to expand and I'll update this file. ✨

## Related checklists & quick references 📚

- `docs/adding-language.md` — Minimal, repo-specific checklist to add a new language (config, fonts, translations, Sanity notes).
- `docs/adding-studio-widget.md` — Steps to mount the Sanity Studio, add small widgets, and common Studio troubleshooting.

---

If you want, I can expand either checklist into a step-by-step PR (examples + smoke tests). Tell me which one to start with.
