---
name: apd
description: Ingests materials from docs/planning/supporting-documents/, produces platform and per-app planning docs, ADRs, shared-services registry, project-state.json, project-summary.md, staged prompt chains, and docs/system scaffolding—without generating application code until architecture checkpoints pass. Use when initializing multi-app planning, running a full architecture-first workflow, "software factory blueprint", or when the user requests structured decomposition before implementation.
---

# APD (Aya's Planning Documentation) system.

## When this skill applies

Use for **greenfield or replanning** when the goal is a complete, multi-application specification and execution-ready prompts. **Do not** write app code, migrations, APIs, or UI until the gated phases in [Execution gates](#execution-gates) are satisfied.

## Repository layout (this project)

- **Inputs**: `docs/planning/supporting-documents/` (PDF, DOCX, `.md`, images, raw notes)
- **Platform outputs**: `docs/planning/`
- **App outputs**: `docs/planning/<app-name>/planning/` (six documents) and `docs/planning/<app-name>/prompts/` (numbered prompts)
- **System / AI memory**: `docs/system/` (per-app subfolders + shared files below)

This matches `.cursor/rules/project-planning-rules.mdc`. If a path conflicts, **prefer this skill’s artifact list** but **keep** the `planning/` subfolder under each app.

## Phase 0 — Structure

1. Ensure directories exist:
   - `docs/planning/supporting-documents/`
   - `docs/planning/adrs/`
   - `docs/system/`
2. If `supporting-documents/` has files: **read and synthesize all** before drafting platform docs. Cite which files informed each section.

## Phase 1 — Platform documentation (`docs/planning/`)

Create or update:

| File                                     | Purpose                                                                                                                                            |
| ---------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| `product-vision-and-concept.md`          | Problem, users, motivation, long-term vision, success definition — _what and why_                                                                  |
| `platform-architecture-and-ecosystem.md` | All apps/modules, responsibilities, interactions, shared services — _what exists and how it interacts_                                             |
| `master-prd.md`                          | Global/MVP scope, shared features, priorities, platform constraints — **no** app-specific screens/logic                                            |
| `business-rules-and-platform-logic.md`   | Cross-app workflows, payments/subscriptions, permissions, state machines, security, edge cases                                                     |
| `technical-foundation.md`                | Stack, **DB choice + justification**, auth, hosting, API style, CI/CD, environments; each major decision tagged **High / Medium / Low** confidence |
| `shared-services.md`                     | Registry: auth, payments, notifications, storage, analytics, etc.; avoids duplicate backends per app                                               |

**ADRs** (`docs/planning/adrs/`): numbered `NNN-short-title.md` — context, options, decision, reasoning, consequences (see [reference.md](reference.md)).

## Phase 2 — System state & bootstrap context

| File                             | Purpose                                                                                                      |
| -------------------------------- | ------------------------------------------------------------------------------------------------------------ |
| `docs/system/project-state.json` | Phase, completed/pending steps, per-app status                                                               |
| `docs/system/project-summary.md` | Compressed overview: architecture snapshot, app list, constraints, decisions, stack — for future AI sessions |

Update `project-state.json` after each major phase. Schemas and examples: [reference.md](reference.md).

## Phase 3 — Application decomposition

For each app in `platform-architecture-and-ecosystem.md`:

1. Create `docs/planning/<app-name>/planning/` with:
   - `app-prd.md`
   - `user-roles-and-permissions.md`
   - `user-flows-and-ux-logic.md`
   - `data-model-and-app-entities.md`
   - `technical-implementation.md`
   - `ui-design-system.md`

2. Enforce **dependency awareness**: reuse shared services from `shared-services.md`; one auth strategy; one primary datastore pattern unless ADR documents an exception; consistent API conventions.

## Phase 4 — Prompt chains (per app)

Under `docs/planning/<app-name>/prompts/`:

| File                                  | Focus                                     |
| ------------------------------------- | ----------------------------------------- |
| `01-foundation-setup.md`              | Project init, dependencies, env config    |
| `02-data-and-authentication-layer.md` | Schema, migrations/init, auth wiring      |
| `03-core-features.md`                 | Domain logic, APIs, services              |
| `04-ui-and-ux-implementation.md`      | Components, pages, routing, state         |
| `05-testing-and-deployment.md`        | Tests, verification, deploy, environments |

Prompts must state that downstream steps assume prior prompts completed and that implementation follows `docs/` as source of truth.

## Phase 5 — System documentation layer (per app)

Scaffold `docs/system/<app-name>/` with placeholders or initial content for:

- API documentation
- Deployment guide
- User guide (non-technical + technical where useful)
- Architecture breakdown
- Troubleshooting

**During planning-focused runs**, these may be outlines; full content can be expanded after implementation. Do not invent APIs that contradict planning docs.

## Execution gates

### Prohibited until ALL of the following exist and are internally consistent

- `platform-architecture-and-ecosystem.md`
- `master-prd.md`
- `technical-foundation.md`
- `shared-services.md` (or explicit embedded section in architecture doc if repo chooses to merge—then note in `project-summary.md`)

**Never** before gates: application source code, DB migrations, API routes/handlers, UI components, Edge Functions/CF workers for product features.

### Human approval checkpoints

After delivering each of the following, **stop and request explicit user approval** before continuing:

1. `product-vision-and-concept.md`
2. `platform-architecture-and-ecosystem.md`
3. `master-prd.md`
4. Complete app list and decomposition (all apps identified + folder plan)

If the user waives checkpoints, record that waiver in the next ADR or in `project-summary.md` under "Process notes".

## Design philosophy

- Determinism over improvisation; structure over speed; traceability over convenience
- Modular multi-app architecture; shared services over duplication
- Every **Medium/Low** confidence technical choice: label explicitly and prefer ADR when choice affects multiple apps

## Verification before claiming done

- [ ] All platform files present (including `shared-services.md`, ADRs for major forks)
- [ ] `project-state.json` and `project-summary.md` updated
- [ ] Each app: six planning docs + five prompts
- [ ] `docs/system/<app-name>/` scaffolded
- [ ] No application code was added while violating [Execution gates](#execution-gates)

## Additional resources

- Templates: [reference.md](reference.md)
