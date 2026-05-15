---
name: cursor-skill-stack-router
description: >-
  Routes software tasks to multiple Cursor personal skills under ~/.cursor/skills,
  enforces reading at least three SKILL.md files before substantive implementation,
  lists skills by domain in copy-paste markdown (use @absolute/path/SKILL.md in Cursor),
  and requires a final "Skills used" name-only footer. Use whenever the user asks which
  skills to load, wants a skill bundle for HTML/CSS/React/Next/mobile/Supabase/git/docs
  workflows, says "stack skills", "multi skill", "minimum skills", "which skills for this
  task", or wants the assistant to combine several skills instead of one. Also use when
  the user wants a catalog of ~/.cursor/skills filtered by keyword or task type—even if
  they do not say "router" or "stack".
disable-model-invocation: false
---

# Cursor skill stack router

## What this skill cannot do (platform limits)

Cursor does not offer a guaranteed hook that runs **after every user prompt** for arbitrary skills. This file shapes **model behavior** when the skill is loaded: it cannot hard-enforce token limits or force the IDE to attach files. For the closest always-on behavior, add a short **User rule** or **project rule** that says: when doing implementation work, follow `cursor-skill-stack-router` and end with **Skills used**. Optional: use [Cursor hooks](https://cursor.com/docs) if you want automation around events (separate from skills).

## Goals

1. **Catalog / filter**: When the user asks for skills of a type, produce markdown listing **≥3** matching skills when the inventory allows it, each line ready for Cursor attachment using `` `@ABSOLUTE_PATH/SKILL.md` `` (leading `@` is the copy-paste token in chat; the path itself is an absolute filesystem path starting with `/`).
2. **Pre-flight bundle**: For the current task, infer the domain (e.g. HTML, Next.js, RN, Supabase). Read `references/skill-domains.md`. Propose **at least three** concrete `SKILL.md` paths from `~/.cursor/skills/` (or run `scripts/list_cursor_skills.py` with `--filter` keywords) before writing or editing substantial code.
3. **Execution rule**: Before implementation, **read** (via the Read tool) **at least three** distinct `SKILL.md` files from the chosen set and follow their instructions. If fewer than three clearly apply, still read three by adding adjacent skills from the same domain table row or from the **General quality** pool in `references/skill-domains.md` so the minimum is met without inventing new skills.
4. **Closing audit**: In the **final** assistant message for the task, append a section exactly like:

```markdown
## Skills used
- <frontmatter name or folder name>
- <name>
- <name>
```

List **only** names (one per line under the heading). Do **not** add reasons, paths, or prose after the list.

## Markdown output format (catalog)

When listing skills for the user, use this pattern (replace `HOME` with the actual home directory resolved on the machine, e.g. output of tilde expansion):

```markdown
## Suggested attachments (copy into Cursor)
- `@HOME/.cursor/skills/<folder>/SKILL.md` — **<skill-name>**
- `@HOME/.cursor/skills/<folder>/SKILL.md` — **<skill-name>**
- `@HOME/.cursor/skills/<folder>/SKILL.md` — **<skill-name>**
```

Always include **at least three** bullets when `~/.cursor/skills` contains enough folders.

## Optional: refresh the inventory

From this skill directory:

```bash
python3 scripts/list_cursor_skills.py --markdown --filter YOUR_KEYWORD
```

Use keywords from the user request (e.g. `react`, `html`, `supabase`, `expo`).

## When the user only wants names (no @ paths)

Still output **≥3** skills when possible; you may omit paths but must still satisfy the **Skills used** footer at the end of the task with **names only**.

## Conflicts with other instructions

If another message says "use only one skill," prefer the **higher-priority** system or user instruction—but still append **Skills used** listing what was actually read.
