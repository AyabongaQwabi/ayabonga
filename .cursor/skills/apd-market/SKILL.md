---
name: apd-market
description: Defines system-wide voice, UX writing, marketing direction, and user-facing language for all apps. Enforces outcome-first, human, non-technical copy across landing pages, onboarding, dashboards, notifications, emails, errors, empty states, forms, CTAs, and microcopy. Use when writing or reviewing user-facing text, empty states, errors, CTAs, onboarding strings, marketing copy, app descriptions, or when the user mentions APD-Market, voice and tone, UX writing, positioning, audience docs, or docs/system/market.
---

# APD-Market — System Voice & UX Communication

## Role

APD-Market governs **all** user-facing language in this monorepo. It ensures copy feels human, clear, emotionally aligned, action-driven, and non-technical.

**Docs hierarchy**: Align with `docs/planning/` and platform truth; **market artifacts** live under `docs/system/market/` (create or update these when defining voice for an app).

---

## Core principle

> The system communicates **outcomes**, not systems.

Prioritize in order:

1. User benefit  
2. Emotional clarity  
3. Action clarity  
4. System detail — only when necessary  

Users should feel **guided**, not processed. The product does not explain its architecture to end users.

---

## Authoritative files (create/maintain)

| Artifact | Path |
|----------|------|
| Global voice & tone | `docs/system/market/voice-guidelines.md` |
| Positioning | `docs/system/market/positioning.md` |
| Per-app audience | `docs/system/market/<app-name>-audience.md` |
| Per-app copy spec | `docs/system/market/<app-name>-copy.md` |

`<app-name>` matches planning folders (e.g. `rider_app`, `driver_app`, `admin`).

**Audience doc** should cover: target user types, motivations, pain points, emotional drivers, expectations, language accessibility level.

**App copy doc** should cover: onboarding strings, CTAs, errors, success messages, empty states, microcopy rules.

---

## Global voice rules

- Human-first language; sound like a helpful person, not a system  
- No backend or infrastructure terms in UI  
- No robotic or “AI assistant” phrasing  
- Focus on benefits and what happens next  

---

## Contextual tone

| Context | Tone |
|---------|------|
| Onboarding | Welcoming, simple, guiding |
| Errors | Calm, reassuring, solution-focused |
| Success | Positive, reinforcing |
| Dashboards | Minimal, clear |
| Marketing | Persuasive, emotional |

---

## UX writing patterns

**Outcome language**

- Bad: “Manage driver onboarding workflow”  
- Good: “Get on the road and start earning”

**Human framing**

- Bad: “System completed processing request”  
- Good: “You’re all set”

**Action clarity**

- Bad: “Vehicle module”  
- Good: “Add your vehicle”

---

## CTAs

**Avoid:** Submit, Continue, Process, Execute (default — use sparingly and only when context demands).

**Prefer:** Get started, Join now, Start earning, Finish setup, Go live, and other benefit-led verbs.

---

## Errors

- No jargon (no codes like “API 500” as the primary message)  
- No blame  
- State what happened in plain language + **clear next action**

Example: “Something went wrong. Please try again.” (plus recovery path when known.)

---

## Anti-patterns (reject or rewrite)

- Technical explanations in UI  
- Architecture or “how it works internally” in user copy  
- Generic SaaS filler (“leverage,” “synergy,” “solution”)  
- Passive or vague lines that don’t tell the user what to do next  

---

## Agent workflow (when writing UI or marketing copy)

1. Read `docs/system/market/voice-guidelines.md` and `positioning.md` if they exist.  
2. Read `docs/system/market/<app>-audience.md` for the current app.  
3. Prefer extending `docs/system/market/<app>-copy.md` with canonical strings rather than scattering one-off wording.  
4. Apply the copy hierarchy: benefit → emotion → action → system detail.  
5. Match tone to context using the table above.  

If market docs are missing for an app, **draft minimal audience + copy stubs** in `docs/system/market/` using planning PRDs as source material — do not invent product claims that contradict `docs/planning/`.

---

## Philosophy (one line)

Communicate value, clarity, emotion, and action — never the system’s self-description.
