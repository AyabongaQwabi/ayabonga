---
name: apd-market-execute
description: Executes and maintains all user-facing communication — UX copy, onboarding, landing pages, CTAs, dashboards, notifications, emails, empty/success/error states, app store and promo text — from docs/system/market, audience and positioning files, docs/planning PRDs and flows, live UI code, and docs/system/project-state.json. Classifies existing copy, fixes weak or technical phrasing, enforces cross-app consistency, writes copy drift to docs/system/market/drift-report.md, and updates project-state without blindly overwriting strong copy. Use when generating or refining product messaging, marketing strings, microcopy, notification/email copy, or when the user mentions APD-Market-Execute, market execution, copy drift, messaging alignment, or canonical copy files under docs/system/market.
---

# APD-Market-Execute — UX Copy & Communication Execution

## Purpose

Generate, refine, update, and maintain **user-facing language** across the platform — grounded in **APD-Market** docs and **implementation reality**, not generic slogans.

---

## Core principle

Every string must feel **intentional, human, emotionally aligned, and product-focused**.

Communicate: **value, momentum, clarity, trust, simplicity** — not architecture, backends, or internal workflows.

**Authoritative voice rules:** `docs/system/market/voice-guidelines.md` (read and follow; this skill adds **how to execute** in code and state).

---

## Primary inputs (read in order for the task scope)

| Input | Path / target |
|-------|----------------|
| Market system | `docs/system/market/` — `voice-guidelines.md`, `positioning.md`, `<app>-audience.md`, `<app>-copy.md` |
| Planning | `docs/planning/` — PRDs, business rules, user flows, app technical docs |
| Codebase | UI where copy lives: components, pages, layouts, forms, toasts, email templates, push payload text |
| State | `docs/system/project-state.json` — phase, app status, what is “done” vs in progress |

---

## Execution scope

| Mode | Scope |
|------|--------|
| **Full** | All apps — align terminology and tone where shared |
| **Single app** | `docs/planning/<app-name>/` + `docs/system/market/<app>-*.md` |
| **Partial** | Named surfaces: landing sections, one flow, CTAs, empty states, notifications |

---

## Rules

**Outcome-first:** Say what the user **gets** or **does next** — not how the platform processes data.

**Emotional alignment:** Match **audience** motivations, trust level, and urgency from `<app>-audience.md`.

**Context-aware tone:**

| Context | Tone |
|---------|------|
| Onboarding | Welcoming, guiding |
| Dashboard | Calm, focused, low noise |
| Success | Encouraging, clear |
| Empty state | Motivating + **next action** |
| Error | Reassuring + **what to do** — no blame |
| Landing / marketing | Persuasive, benefit-led |

---

## Before writing: existing copy analysis

Scan relevant UI, emails, and notification code for current strings. Classify each cluster:

| Label | Meaning |
|-------|---------|
| **STRONG** | Clear, on-voice, audience-aware — **preserve** |
| **USABLE** | Minor tighten only |
| **WEAK** | Vague, passive, or low clarity — **rewrite** |
| **TECHNICAL** | Jargon, APIs, system terms — **replace** |
| **DUPLICATE** | Same idea repeated — **consolidate** |
| **INCONSISTENT** | Same concept, different words — **align** to canonical terms in `<app>-copy.md` |

**Replace** when: robotic/AI tone, jargon, generic SaaS filler, system-centric or passive default copy.

**Preserve** when: already effective and aligned — do not churn for style points.

---

## Surface-specific execution

**CTAs:** Primary/secondary/retention/upgrade — action-led, rewarding, human (avoid default Submit/Continue/Process where alternatives fit).

**Landing:** Lead with **emotional outcome** and value; no feature dumps; speak to user goals.

**Dashboards:** Minimal wording; reduce cognitive load; support progression without noise.

**Empty states:** Guide **next step** and motivate — e.g. prefer “Add your first vehicle and start accepting trips” over “No vehicles found.”

**Errors:** Plain language; optional secondary reference ID — never lead with “Database request failed.”

**Notifications (push / in-app / email):** Human, non-spammy, reinforce value; consistent naming with in-app UI.

---

## Cross-app consistency

Keep terminology and emotional positioning aligned with `positioning.md` and per-app audience docs. Flag contradictions between apps (same entity named three ways).

---

## Copy drift

When implemented UI copy **diverges** from market rules (tone leak, jargon, inconsistent CTAs):

1. Prefer updating **code** and/or **`docs/system/market/<app>-copy.md`** to match decisions.  
2. Record issues and resolutions in **`docs/system/market/drift-report.md`** (create or append — date + app + area + before/after or rule reference).

Do **not** use the general `docs/system/drift-report.md` for **copy-only** drift unless the project already conflates them; this skill’s default is **`docs/system/market/drift-report.md`**.

---

## State-aware execution

Use `project-state.json` to see which apps are active and what is already shipped. **Do not** regenerate “finalized” messaging systems from scratch; **extend** and **fix weak** areas. Avoid duplicating full onboarding copy sets if they already exist unless the user requests a full refresh.

---

## Messaging completion (record in `notes` or app-specific fields)

Per app communication maturity:

`NOT_STARTED` → `FOUNDATION_COMPLETE` → `UX_COPY_COMPLETE` → `MARKETING_COMPLETE` → `SYSTEM_ALIGNED`

Base classification on **what exists in repo + market docs**, not hopes.

---

## Outputs

| Output | Location |
|--------|----------|
| Canonical copy tables / rules | `docs/system/market/<app-name>-copy.md` |
| Landing / flow-specific drafts | As edits to components **and** summaries in copy doc when canonical |
| Copy drift log | `docs/system/market/drift-report.md` |
| State touch | `docs/system/project-state.json` when milestones or blockers change |

---

## Non-destructive guardrails

- Do **not** overwrite approved or **STRONG** copy without explicit instruction  
- Do **not** strip emotionally aligned lines for generic replacements  
- Do **not** introduce robotic AI phrasing or architecture explanations in UX  

---

## Philosophy

Act as a **product communication strategist** inside the lifecycle: refine, align, humanize, and calibrate — **not** a one-shot generic copy generator.

---

## Coordination

- **`apd-market`:** doctrine and paths under `docs/system/market/`  
- **`apd-execute`:** large implementation orchestration — use Market-Execute when the **deliverable is primarily strings and messaging systems**
