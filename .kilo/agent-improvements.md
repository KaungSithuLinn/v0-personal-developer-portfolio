# Agent Improvement Log

This file is the shared coordination and improvement record for the portfolio multi-agent system.

## Coordination Protocol
- Coordinator triages work and assigns one primary owner per change.
- Specialists edit only their assigned scope unless the coordinator explicitly expands it.
- Every change must preserve existing behavior and include validation evidence.
- Required validation before completion: `npm.cmd run lint`, `npx.cmd tsc --noEmit`, `npm.cmd run test`, `npm.cmd run validate:translations`, and `npm.cmd run build`.
- Document each completed improvement below with owner, files, rationale, validation, and residual risks.
- Do not commit or push unless the user explicitly requests it.

## Improvement Entry Template

### YYYY-MM-DD - Title
- Owner:
- Scope:
- Files:
- Summary:
- Security impact:
- Validation:
- Residual risks:
- Follow-up:

## Entries

No improvements recorded yet.