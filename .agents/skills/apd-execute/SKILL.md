---
name: apd-execute
description: Orchestrates APD implementation from planning and codebase reality — full-system, single-app, or partial builds without duplicating existing work. Reads docs/planning, docs/system/project-state.json, drift reports when present, and repo code (excluding docs/) to detect gaps, continue incomplete work, reconcile undocumented code with docs, preserve architecture, and follow ordered prompt chains under docs/planning/<app>/prompts/. Use when implementing features, finishing stalled builds, filling gaps, syncing state after code changes, or when the user mentions APD-Execute, implementation phase, smart build, gap detection, or project-state updates.
---

# APD-Execute — Implementation Orchestrator

## Purpose

Executes the **implementation phase** of an APD-style monorepo: ship or extend code **strictly** from planning truth, current state, and what already exists in the tree.

---

## Core principle

> **Never rebuild what already exists.**

- Detect implementation before writing  
- **Continue** incomplete work — do not restart greenfield unless Recovery mode and the user expects it  
- Reconcile code with `docs/planning/`; **do not** silently contradict PRDs, business rules, or data models  

---

## Primary inputs (read before building)

| Layer | Path |
|-------|------|
| Planning | `docs/planning/` (platform + `docs/planning/<app>/`) |
| State | `docs/system/project-state.json` |
| Drift | `docs/system/drift-report.md` — **if present** |
| Codebase | Project root **excluding** `docs/` — map routes, packages, migrations, configs |

Also re-read app PRDs, user flows, data models, and technical implementation under each active app when touching that app.

---

## Pre-build detection checklist

Scan enough of the repo to classify what exists:

- **Frontend:** routes/pages, layouts, components, state patterns  
- **Backend:** APIs, services, auth integration  
- **Database:** migrations, schema, RLS patterns  
- **Infra:** CI/CD, deploy config, env patterns  

Do **not** assume folders from memory — verify.

---

## Gap detection

| Planned | In codebase | Action |
|---------|-------------|--------|
| yes | no | **build** |
| yes | partial | **continue** |
| yes | complete | **skip** (or doc-only touch-ups) |
| no | yes | **preserve** → analyze → map into planning/state (**do not** delete working code by default) |

---

## Execution modes

| Mode | Behavior |
|------|----------|
| **Safe (default)** | Minimal diff; fill gaps only; preserve behavior and patterns |
| **Expansion** | Extend incomplete systems; tighten consistency with **existing** direction (stack, folders, APIs) |
| **Recovery** | Replace or rebuild **broken or missing** pieces; restore alignment — only with explicit user intent |

---

## Rules

**Build continuation:** If something exists, extend or fix it — do not regenerate the whole app.

**Incremental:** Prefer the smallest change that closes the gap.

**Architecture preservation:** Do not swap stacks, rip out working patterns, or introduce conflicting abstractions **unless the user explicitly asks**.

**Prompt chains:** For apps using staged prompts, execute `docs/planning/<app>/prompts/` **in filename order** unless docs specify otherwise.

**Prompt / step tracking:** Ideal lifecycle per prompt: `NOT_STARTED` → `IN_PROGRESS` → `COMPLETE` or `BLOCKED`. Persist in `docs/system/project-state.json` (extend schema with a `prompts` or per-app map **when** the repo adopts it). Until then, track via `completed` / `pending` / `notes` and explicit prompts lists.

**Drift prevention:** While implementing, validate against product vision, business rules, technical foundation, app PRDs, flows, and data models. If code would **conflict** with docs → **stop**, surface the conflict, reconcile (docs or code per user authority).

**Autonomous polish allowed only when aligned:** naming, reuse, typing, API consistency, folder hygiene — **without** changing product behavior unless requested.

---

## Non-destructive guardrails

- Do **not** blindly overwrite large subsystems  
- Do **not** remove working implementations to “clean up”  
- Do **not** reset databases or wipe migrations  
- Do **not** re-run completed prompts end-to-end without cause  

---

## App completion classification (report in state / notes)

Use one label per app when updating state:

`NOT_STARTED` → `FOUNDATION_COMPLETE` → `CORE_COMPLETE` → `UI_COMPLETE` → `TESTING_COMPLETE` → `DEPLOYMENT_READY`

Define “meaningful implementation” from real files, not from docs alone.

---

## After each execution cycle

Update **`docs/system/project-state.json`**:

- `phase` / `lastUpdated` if milestone shifted  
- `completed` / `pending` / `apps` / `notes`  
- Blockers and unresolved gaps explicitly  

Create or refresh **`docs/system/drift-report.md`** when the workflow tracks drift (optional file — create if the project uses it).

Do **not** claim completion without verification commands appropriate to the stack (build, tests, lint as applicable).

---

## Outputs

- **Code/config/migrations** as needed for the scoped gap  
- **Updated** `project-state.json` (and drift doc when used)  
- **Brief** note of what was verified — not lengthy unsolicited markdown unless the user asked  

---

## Philosophy

Behave as a **persistent engineering orchestrator**: analyze → reconcile → implement minimally → preserve → improve in-direction — **not** a one-shot generator that ignores existing trees.
