# APD-Resume — reference

## File classification

| Label | Action |
|-------|--------|
| VALID_CORE | Move or copy verbatim into canonical path; note old path in `project-summary.md` if URL bookmarks matter |
| PARTIAL | Merge into target doc; mark gaps in `schema-gap-analysis.md` |
| DUPLICATE | Merge into single canonical doc; leave stub in deprecated tree pointing to new path if keeping backup |
| OBSOLETE | Do not migrate body; one-line deprecation in gap doc or ADR |
| MISPLACED | Relocate to `planning/`, `supporting-documents/`, or `system/` |

## Backup strategies

1. **Safest**: `cp -R docs docs.backup-$(date +%Y%m%d)` then edit in place inside `docs/`.
2. **Full cutover**: `git mv docs docs.deprecated` then recreate `docs/` — only with explicit user approval and clean git state.

## Platform doc name bridge

Some rules reference:

`01-product-vision.md` … `05-technical-foundation.md`

Global `apd` uses kebab-case names (`product-vision-and-concept.md`, etc.). Pick **one** set per repo and document it in `project-summary.md`.

## `project-state.json` hints

Include keys such as: `phase`, `completed`, `pending`, `apps.<name>`, `lastUpdated`, optional `notes` for contradictions resolved.

## Typos to fix during migration

- `supporting-ducuments` → `supporting-documents`
