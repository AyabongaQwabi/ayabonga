# Ayabonga Qwabi — Writing & Brand Rules

## Voice

Direct. Technical without being academic. Personal without being casual. Never corporate.

---

## Strict Anti-AI Writing Rules

These are hard rules. Every agent working on this codebase must follow them without exception.

### 1. NO Em Dashes (—)

Never use the em dash character (—) in **any** user-facing content:
- Blog post frontmatter (title, excerpt)
- Blog post body text
- Component copy (App.tsx, page files, TSX)
- Site config strings (site-config.ts)
- Data files (pseo-pages.json, comparisons.json)

**Allowed alternatives:**
- Comma: `"I build apps, platforms, and AI tools without the overhead."`
- Parentheses: `"apps (platforms, AI tools)"`
- Period + new sentence: `"This is fact. That is opinion."`
- Colon (for lists/clarifications): `"Here's what works: fast builds, clean APIs."`

**Numeric ranges (en dash) are fine:** `15–20 iterations`, `R5–6 billion` ✓

### 2. NO Colon Title Structures

Never write blog post titles in the format `"Main Concept: Subtitle That Explains It"`.

**Bad:**
```
title: "The Hidden Cost of Junior-Built MVPs: Why Your 'Cheap' Build is Killing Your Startup"
title: "Vibe Coding Workflow: Documentation-First AI Builds with Cursor"
```

**Good:**
```
title: "Junior-Built MVPs are Quietly Killing Startups"
title: "Documentation-First AI Builds with Cursor, Grok and PRDs"
```

Fold the subtitle into a natural descriptive phrase. If it doesn't fit, cut it.

### 3. NO AI Clichés

Never use:
- "Hot take:" (or "Hot take —")
- "Result?" as a one-word lead-in
- "No fluff." or "No fluff —"
- "Delve into"
- "Unlock" (as a metaphor for features)
- "Empower" / "empowering"
- "Elevate"
- "Dynamic landscape" / "fast-paced environment"
- "Shouting into the void"
- "No X. No Y. Just Z." (forced rule-of-three)

**Replace with direct, specific statements.** If you wouldn't say it out loud to a colleague, don't write it.

### 4. NO Forced Sass

Avoid performative directness that reads like an AI mimicking human personality:
- "Here's the brutal truth:"
- "Let's be real:"
- "I'll be honest with you:"
- "Spoiler:"

These signal low confidence. State the claim directly and let the content prove it.

---

## Typography Rules

- **Apostrophes in generated content:** Use curly/smart quotes (`'`) or straight quotes (`'`). Both are fine. Never mix within a file.
- **Bullet lists:** Keep parallel structure. Don't mix clauses and sentences in the same list.
- **Section headers:** Informative, not clever. Avoid puns that don't travel.

---

## Content Structure Rules

- **Blog titles:** Max 10 words. No internal colons. No em dashes.
- **Excerpts:** One or two sentences. Describes the value, not the topic.
- **CTAs:** Specific and honest. Never "unlock," never "transform."
- **LinkedIn/social copy:** Keep the thread format but remove all em dashes and AI buzzwords before publishing.

---

## Stack Reference

- Framework: Vite + React + TypeScript
- Styling: Tailwind CSS via design tokens in `src/index.css`
- Content: Markdown files in `src/content/blog/`
- Data: `src/data/pseo-pages.json`, `src/data/blog-posts.ts`
- Config: `src/lib/site-config.ts`
