---
description: AI rules derived by SpecStory from the project AI interaction history
globs: *
---

# GitHub Copilot Instructions for Kaung Sithu Linn's Portfolio

Welcome, AI agent! This guide will help you understand the key architectural patterns, conventions, and workflows for this multilingual Next.js 15 portfolio website. The core design principle is **"multilingual-first"**.

## 🏛️ Architecture Overview

This is a highly customized portfolio built with Next.js (App Router), React 19, and Tailwind CSS. Its primary architectural challenge is robust internationalization (i18n) with full Right-to-Left (RTL) language support.

- **Tech Stack**: Next.js 15, React 19, TypeScript, Tailwind CSS, Framer Motion, Radix UI (primitives), Zod (validation), Resend (email). Hosted on Vercel.
- **Critical Files**:
  - `middleware.ts`: The entry point for i18n. It detects the user's locale and redirects to the correct language path (e.g., `/en`, `/ar`).
  - `config/language.config.ts`: The single source of truth for all supported languages and their properties (`dir`, `font`, `expansionRatio`).
  - `app/[locale]/layout.tsx`: The main layout for localized pages. It sets the `dir` attribute, loads language-specific fonts via CSS variables, and provides the translation context.
  - `lib/utils.ts`: Contains the `cn` utility for Tailwind class merging and other shared functions.

---

## 🌍 Internationalization (i18n) & Translations

This is the most critical workflow. Every feature must support all languages and writing directions.

- **Translation Hook**: Use the `useTranslations` hook from `context/language-provider.tsx` to access translations.
  - **Example**: `const { t } = useTranslations();` then use `<h1>{t('page.home.title')}</h1>`.
- **Workflow for Adding New Text**:
  1.  **Define the Key**: Add the new key to the `TranslationKeys` type in `context/translations.ts`. This provides type safety.
  2.  **Add Translations**: Add the key and its translated value to **all** JSON files in `public/locales/{lang}/common.json`.
  3.  **Implement**: Use the `t('your.new.key')` function in your component.
- **RTL Styling**: Always use Tailwind's logical properties for direction-agnostic styling (e.g., `ms-4` instead of `ml-4`, `text-start` instead of `text-left`). The root layout handles the `dir` attribute.

---

## 🎨 Components & Styling

The project follows a structured pattern for creating reusable and feature-specific components.

- **UI Primitives (`components/ui/`)**: These are general-purpose, styled components built on Radix UI primitives (e.g., `button.tsx`, `input.tsx`).
  - **Pattern**: They use `cva` (Class Variance Authority) for defining variants (e.g., `variant`, `size`) and the `cn` utility to merge classes. When creating a new UI component, follow this pattern.
- **Feature Components (`app/components/`)**: These are larger components that compose UI primitives to build features (e.g., `Header`, `Footer`, `DevInterface`).
- **Icons (`app/components/Icon.tsx`)**: Use the custom `<Icon name="..." />` component. To add a new icon, add its SVG path data to the `icons` object in the file.

---

## ⚡ Server Actions

Backend logic is handled exclusively by Next.js Server Actions.

- **Location**: `app/actions/`.
- **Pattern**: Actions should be strongly typed, use `zod` for input validation, and leverage the `withTimeout` utility from `lib/action-utils.ts` to prevent indefinite execution.
- **Example**: `app/actions/contact-actions.ts` is the blueprint for creating new server actions. It validates form data, calls the Resend API, and returns a structured response.

---

## 🚀 Development & Debugging

- **Running the Project**: `npm run dev`
- **Linting**: `npm run lint` to check for code quality and style issues.
- **Environment**: Copy `.env.example` to `.env.local` and add your `RESEND_API_KEY`.
- **RTL Gotcha**: When testing RTL, ensure that flexbox layouts and text alignment behave as expected. Margins, padding, and positioning are common failure points if logical properties are not used.
- **Performance**: Fonts are a key performance factor. They are preloaded in the root layout, and different font subsets are loaded per language via CSS variables to keep the initial payload small.
