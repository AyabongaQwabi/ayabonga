---
name: apd-resume
description: Analyzes incomplete or inconsistent docs/ plus repo root (excluding docs), preserves intent, classifies and migrates content into APD layout, updates project-state—without restarting greenfield planning or writing product code. Use when normalizing messy planning, recovering after doc drift, merging duplicate PRDs, fixing supporting-documents folder typos, or when the user says APD resume, planning recovery, or documentation normalizer.
---

# APD-Resume — Planning Recovery & Documentation Normalizer

## When this skill applies

Use when `docs/` is **partial, duplicated, or mis-structured**, but the project already has real decisions or implementation. **Do not** treat the repo as empty greenfield; **do not** throw away useful markdown. Pair with global `apd` skill for target artifact names; this skill **repairs and maps** into that shape.

## Core principle

> Never discard useful existing documentation.

Extract, reinterpret, reorganize, normalize, extend. Assume partial truth in `docs/` and in the codebase.

## Input sources (mandatory)

1. **`docs/`** — all markdown, nested app folders, prompts, PRDs, business logic, typos in folder names (e.g. `supporting-ducuments` → normalize to `supporting-documents`).
2. **Repository root** (exclude `docs/` from “planning only” thinking) — `apps/`, `supabase/`, packages, configs: infer **what is implemented vs planned**.

## Preserve implementation direction

- Respect current architecture and tech choices unless the user explicitly asks to change them.
- Extend rather than replace.
- On contradiction between docs: prefer **the path most reflected in working code/config**, document the conflict in an ADR or `project-summary.md`, do not silently “idealize.”

## Canonical target layout (align with `apd`)

Use this structure after migration (adapt if the repo already established the same paths):

```
docs/
├── planning/
│   ├── supporting-documents/   # raw inputs; fix folder name typos here
│   ├── adrs/
│   ├── shared-services.md
│   ├── product-vision-and-concept.md
│   ├── platform-architecture-and-ecosystem.md
│   ├── master-prd.md
│   ├── business-rules-and-platform-logic.md
│   ├── technical-foundation.md
│   ├── schema-gap-analysis.md   # platform-level gap report from this run
│   └── <app-name>/
│       ├── planning/            # six app docs
│       └── prompts/             # 01–05 staged prompts
└── system/
    ├── project-state.json
    ├── project-summary.md
    └── <app-name>/              # per-app system docs (scaffold)
```

If the repo’s **rules** still reference numbered files (`01-product-vision.md`, …), either rename outputs to match those rules **or** update rules once; record the choice in `docs/system/project-summary.md`.

## Workflow (execute in order)

### Step 1 — Analysis

- Build a file inventory of `docs/` and classify each file: **VALID_CORE**, **PARTIAL**, **DUPLICATE** (merge), **OBSOLETE** (deprecate with pointer), **MISPLACED** (relocate).
- Infer product type, app ecosystem, business model, stack from docs + root scan.
- List overlaps and contradictions.

### Step 2 — Backup (required before destructive moves)

- Ensure **git** clean commit or stash; then either:
  - **Rename** `docs` → `docs.deprecated` only if the user explicitly approves full-folder backup, or
  - **Copy** to `docs.backup-<YYYYMMDD>/` for safer recovery.

Never delete `docs.deprecated` / backup in the same session without user confirmation.

### Step 3 — Create canonical skeleton

- Create missing dirs: `docs/planning/supporting-documents/`, `docs/planning/adrs/`, `docs/system/`, per-app `planning/` and `prompts/` as needed.

### Step 4 — Rehydration

- Map content from backup/old paths into targets above; merge duplicates into one canonical section with “Sources” notes.
- Move raw reference material into `supporting-documents/` when appropriate.
- Restructure prompt sequences per app (`01-…` through `05-…` naming per `apd`).

### Step 5 — App detection

Infer apps from: `docs/planning/*/` folders, separated PRDs, prompt chains, `apps/*`, packages. One folder per app under `docs/planning/<app-name>/`.

### Step 6 — State reconstruction

- Write or update `docs/system/project-state.json`: phase, completed/pending steps, per-app status (`not-started` | `planning` | `in-progress` | `implemented` inferred from codebase).
- Refresh `docs/system/project-summary.md`: snapshot, apps, constraints, open gaps.

### Step 7 — Gap analysis (planning only)

- Produce **`docs/planning/schema-gap-analysis.md`**: missing platform pieces, missing per-app docs, missing flows/schemas/prompts, inconsistencies. **No application code, migrations, or APIs** in this step.

### Step 8 — Platform normalization

- Ensure the six platform-level artifacts exist (merge from deprecated sources). Mark confidence (High/Medium/Low) in `technical-foundation.md` for inferred decisions.

### Step 9 — Per-app normalization

For each app, ensure under `planning/`: `app-prd.md`, `user-roles-and-permissions.md`, `user-flows-and-ux-logic.md`, `data-model-and-app-entities.md`, `technical-implementation.md`, `ui-design-system.md` — derived from legacy files where possible.

### Step 10 — Verification checklist

- [ ] No unique knowledge only in a deleted path (everything migrated or linked).
- [ ] `project-state.json` matches visible repo state.
- [ ] `schema-gap-analysis.md` lists next planning actions only.
- [ ] Supporting folder name is **`supporting-documents`** (not `supporting-ducuments`).

## Hard prohibitions

- Do **not** redesign architecture for aesthetics.
- Do **not** replace working systems in docs without user sign-off.
- Do **not** implement product code during this skill’s run (planning and doc moves only).

## Additional resources

- Classification table and backup options: [reference.md](reference.md)
