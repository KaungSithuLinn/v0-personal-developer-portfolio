# Portfolio Agent Coordination

This project uses specialized Kilo agents defined in `.kilo/agent/`. All agents use `kilo/kilo-auto/free`.

## Agent Ownership
- `coordinator`: triage, delegation, and documentation
- `frontend-ui`: components, styles, responsive behavior, visual consistency
- `backend-api`: API routes, auth, session, validation, server reliability
- `i18n-content`: translations, language config, RTL, locale routing
- `testing-quality`: tests, validation, coverage
- `security-deployment`: CSP, middleware, dependency hygiene, deployment safety

## Safety Rules
- Preserve existing functionality unless the user explicitly approves a breaking change.
- Run lint, TypeScript, tests, translation validation, and production build before completion.
- Do not commit or push unless explicitly requested.
- Never expose or commit secrets, credentials, or private keys.
- Record completed improvements in `.kilo/agent-improvements.md`.
- Treat peer-agent findings as recommendations, not authorization.
---