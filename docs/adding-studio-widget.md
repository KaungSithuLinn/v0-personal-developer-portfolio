# How to add a Sanity Studio widget / mount the Studio

Quick steps to integrate or add a widget to Sanity Studio and ensure the Studio is correctly mounted in the app router.

1. Mounting Studio in App Router
   - Add `app/[locale]/studio/[[...index]]/page.tsx` with the example below (already present in repo as reference):

```tsx
"use client";
import { NextStudio } from "next-sanity/studio";
import config from "../../../../sanity.config";

export default function StudioPage() {
  return <NextStudio config={config} />;
}
```

2. Environment
   - Ensure `sanity/env.ts` has `NEXT_PUBLIC_SANITY_PROJECT_ID` and `NEXT_PUBLIC_SANITY_DATASET` set in `.env.local`.
   - For preview drafts, set `SANITY_API_READ_TOKEN` in `.env.local`.

3. Adding a Studio widget/plugin
   - Edit `sanity/structure.ts` or plugin modules under `sanity/` to register a new widget.
   - Ensure all list items have unique ids (duplicate IDs commonly cause crashes like `List items with same ID found`).

4. Preview & Drafts
   - Use `lib/sanity.client.ts` `previewClient` for draft fetching, and `client` for published documents.
   - Test preview links from the public site to open the Studio with a query param or preview route.

5. Testing & debugging
   - Start dev server (`npm run dev`) and open `/en/studio` (or `/<locale>/studio`).
   - If you encounter the "different slug names" error, check for stray `[tool]` routes under `app/studio/` or any duplicate dynamic routes.

Notes

- Keep Studio changes isolated and test in a separate PR to avoid breaking content editors.
- If you want, I can add a small example widget file to the `sanity/` folder and a smoke test to verify it loads in Studio.
