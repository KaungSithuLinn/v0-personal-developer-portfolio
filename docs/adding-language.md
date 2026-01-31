# How to add a new language (checklist)

This checklist contains the minimum, repo-specific steps to add a new language to this project.

1. Add the locale to `config/language.config.ts`:
   - Add to `SUPPORTED_LANGUAGES`.
   - Add `LANGUAGE_NAMES[lang]`, `LANGUAGE_REGIONS[lang]`, `FONT_FAMILIES[lang]`, and `TEXT_DIRECTION[lang]`.
   - Verify `getLanguageConfig(lang)` returns the correct `dir` and `fontFamily`.

2. Provide translations:
   - Update `context/translations.ts` with the new locale keys and translated strings.
   - If adding many page strings, prefer grouping them by feature (e.g., `hero`, `projects`).

3. Add fonts (if needed):
   - If the language requires a different Google font, add it in `app/layout.tsx` using the Next font helpers and expose it as a CSS variable (e.g., `--font-noto-xxx`).
   - Add the variable to `FONT_FAMILIES` so Locale layout picks it up automatically.

4. Sanity content & schemas:
   - If content needs localization, check your Sanity schemas in `sanity/schemaTypes/` and update them to support the new language (e.g., add localized fields or references).
   - Ensure the Studio can surface content for the new language (structure logic may need updates).

5. Static params & pages:
   - `app/[locale]/layout.tsx` already uses `generateStaticParams()` from `i18n.locales`. No change usually required, but verify the new locale appears in `/en`-prefixed routes.

6. RTL/Direction:
   - If the language is RTL, add it to `RTL_LANGUAGES` or set `TEXT_DIRECTION[lang] = 'rtl'`.
   - Test `HtmlAttributeManager` sets `dir` correctly for server-side renders.

7. Tests & validation:
   - Run `npm run lint`.
   - Start the dev server (`npm run dev`) and visit `/<new-locale>`.
   - Check: `lang` attribute, `dir` attribute, correct font, and translations.

8. Sanity preview (optional):
   - If you need preview drafts for this locale, ensure `SANITY_API_READ_TOKEN` is present in `.env.local` and that `previewClient` is used for preview routes.

Notes

- Prefer small, focused PRs: add the minimal configuration first (config + translations), then address fonts or Sanity changes separately.
- If you need an example, copy the keys for `zh` or `ar` as a template.

---

If you'd like, I can also create a PR template or small test harness for verifying language additions automatically.
