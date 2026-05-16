---
name: apd-state-engine
description: Scans repo root and docs/, compares implementation to APD planning, detects drift, updates docs/system/project-state.json and docs/system/project-summary.md, and writes docs/system/drift-report.md—without generating or deleting product code. Use when syncing code and docs, after merges, for drift audit, health report, project-state refresh, or when the user says APD state engine, doc drift, or code-docs sync.
---

# APD-State Engine — Code ↔ docs synchronization

## When this skill applies

Run when you need **reconciliation** between:

- **Code** (implementation reality under repo root, excluding treating `docs/` as code)
- **`docs/`** (planning + system specifications)
- **`docs/system/project-state.json`** (execution memory)

Use after significant implementation, doc edits, or on a schedule. Pairs with **`apd`** / **`apd-resume`** for layout; this skill focuses on **detecting mismatch** and **updating state + documentation**, not greenfield planning.

## Core principle

> Code is execution. Docs are intent. State reconciles both.

If they diverge: **document** the gap, **update** state and/or docs (or flag for human decision). **Never** silently assume intent.

## Hard prohibitions

- Do **not** generate, delete, or mass-rewrite **application code** (including migrations, APIs, UI) as part of this skill.
- Do **not** delete working code or overwrite implementation “to match docs.”
- Do **not** invent features in docs without evidence from code or an explicit human note (ADR / ticket).

Allowed: edits under **`docs/`** only, plus **`docs/system/project-state.json`**.

## Input sources (mandatory)

1. **Codebase** — `apps/`, `packages/`, `supabase/`, configs, CI, deployment files (whole repo except do not confuse `docs/` for implementation).
2. **`docs/`** — `docs/planning/`, `docs/system/`, per-app `planning/` + `prompts/`.
3. **`docs/system/project-state.json`** — current phase, apps, completed/pending.

## App mapping (discovery)

Infer **logical apps** from:

- Folders like `apps/<name>_app`, `apps/<name>/`, `packages/<shared>`
- `docs/planning/<app>/` (folder name = app slug; normalize `drivers` → `driver_app` if repo uses `_app` suffix in code—**record mapping** in drift report when names differ)

For each app found in **either** code or docs:

| Question | Action |
|----------|--------|
| Docs exist, no code | Classify **`not-started`** (or keep `planning` if only specs); list under **missing implementation** in drift report |
| Code exists, docs thin/missing | Classify **`in-progress`** or **`drifted`**; propose doc updates (technical-implementation, data model) — **update docs**, do not write code |
| Code + docs aligned | **`implemented`** or **`in-progress`** by feature depth |
| Code contradicts docs | **`drifted`**; detail in drift report; prefer ADR or explicit doc fix |

### Suggested `apps.<key>` status strings

Use lowercase values consistent with the repo (extend only if needed):

- `not-started` — docs only, no `apps/` target
- `planning` — specs exist, scaffold minimal or absent
- `in-progress` — substantial code, incomplete vs PRD
- `implemented` — baseline matches documented scope (still may have open gaps)
- `drifted` — **requires reconciliation** (doc wrong vs code wrong undecided)

If the repo forbids `drifted`, encode drift only in **`docs/system/drift-report.md`** and keep `in-progress` in JSON until resolved.

## Execution cycle (strict order)

1. **Scan codebase** — list apps, stacks (pubspec, package.json), Supabase migrations presence, notable routes/features (high level).
2. **Scan docs** — inventory `docs/planning/*/planning/*.md`, platform files, `shared-services.md`, `schema-gap-analysis.md`.
3. **Map** — table: app | code path | doc path | match? |
4. **Compare** — schema names vs `data-model-and-app-entities.md`; env vars vs deployment docs; auth pattern vs technical foundation.
5. **Detect drift** — populate `drift-report.md` (template in [reference.md](reference.md)).
6. **Update `project-state.json`** — `lastUpdated`, `apps`, `pending`/`completed` keys as appropriate; short `notes`.
7. **Update `project-summary.md`** — snapshot paragraph, app table, open drift count.
8. **Doc auto-heal (optional, evidence-based)** — append or edit planning docs **only** when code proves structure (e.g. “Admin uses Next 15 per `apps/admin_app/package.json`”). Mark **Low confidence** sections explicitly.

## Drift report

Write or replace **`docs/system/drift-report.md`** each run (or append dated section if history preferred—pick one per repo and state it in `project-summary.md`).

Minimum sections:

- **Summary** — counts: undocumented modules, missing implementations, schema mismatches
- **Undocumented code** — paths + one-line purpose
- **Missing in code** — doc claims without code anchor
- **Schema / API drift** — migration vs `data-model` doc bullets
- **Recommended next actions** — doc edits vs implementation tickets (no code in this skill)

## Docs → code validation

If docs describe tables, RPCs, or screens **not** present in code or migrations:

- Add item to **`docs/planning/schema-gap-analysis.md`** (planning section) **or** drift report under **missing implementation**
- Set / keep app status **`planning`** or **`in-progress`**
- **Do not** implement the feature here

## Code → docs validation

If code introduces apps, routes, tables, or services **not** reflected in planning:

- Update **`docs/planning/shared-services.md`** if shared boundary changed
- Update app **`technical-implementation.md`** or **`data-model-and-app-entities.md`** with factual deltas + “Source: codebase scan `<date>`”
- If architectural, add **`docs/planning/adrs/NNN-*.md`**

## Outputs checklist

- [ ] `docs/system/drift-report.md` reflects current scan
- [ ] `docs/system/project-state.json` `lastUpdated` and `apps` match discovery
- [ ] `docs/system/project-summary.md` mentions drift status or “no drift detected”
- [ ] No changes outside `docs/` and the two JSON/markdown state files above (unless repo policy allows `project-summary` only—still docs tree)

## Philosophy

- **Code** shows what runs.
- **Docs** capture what should run and why.
- **State** is the honest bridge—may lag; this skill closes the lag **in documentation and metadata only**.

## Additional resources

- Drift report template & status model: [reference.md](reference.md)
