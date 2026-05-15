# Reference — templates & schemas

## project-state.json (minimal schema)

```json
{
  "phase": "planning | decomposition | prompts | system-docs | implementation-ready",
  "completed": ["string"],
  "pending": ["string"],
  "apps": {
    "customer-app": "not-started | planning | prompts | ready"
  },
  "lastUpdated": "ISO-8601 date"
}
```

Example:

```json
{
  "phase": "planning",
  "completed": ["folder-structure", "ingest-supporting-docs"],
  "pending": ["master-prd", "technical-foundation", "shared-services"],
  "apps": {
    "customer-app": "not-started",
    "admin-dashboard": "not-started"
  },
  "lastUpdated": "2026-05-07"
}
```

## project-summary.md (suggested headings)

1. One-paragraph mission
2. Architecture snapshot (diagram description or bullet graph)
3. Applications table (name, role, primary users)
4. Shared services (link to `shared-services.md`)
5. Non-negotiables / constraints
6. Stack summary (link to `technical-foundation.md`)
7. Open questions / Low-confidence items

## ADR file template

Filename: `docs/planning/adrs/001-use-supabase.md`

```markdown
# ADR 001: [Title]

## Status
Proposed | Accepted | Superseded by ADR 00X

## Context
What forces the decision?

## Options
1. ...
2. ...

## Decision
Chosen option and scope.

## Consequences
Positive, negative, follow-ups.

## Confidence
High | Medium | Low
```

## Decision confidence (technical-foundation.md)

For each major choice (database, auth, hosting, API style):

- **High**: Stated in supporting docs or industry default with no conflict
- **Medium**: Inferred from partial inputs; reversible
- **Low**: Assumption; requires validation or spike; consider ADR

## Supporting document ingestion

When citing inputs at the end of a platform doc section:

`Sources: supporting-documents/brief.md, supporting-documents/wireframes.png`
