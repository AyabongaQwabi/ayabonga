# APD-State Engine — reference

## `docs/system/drift-report.md` template

```markdown
# Drift report

**Generated:** ISO-8601 datetime  
**Scope:** Repository root + `docs/` + `docs/system/project-state.json`

## Executive summary

- Undocumented code areas: N
- Missing implementations (docs without code): M
- Schema / contract drift: K

## Code → docs (undocumented or outdated)

| Path / artifact | Observed reality | Doc gap |
|-----------------|------------------|---------|
| … | … | … |

## Docs → code (missing implementation)

| Doc reference | Expected | Code status |
|---------------|----------|-------------|
| … | … | Absent / partial |

## Schema & API drift

| Area | Docs say | Code / migrations say |
|------|----------|-------------------------|
| … | … | … |

## Recommended actions

1. … (doc update | ADR | ticket — **no code in state-engine pass**)
```

## `apps` status semantics (suggested JSON)

| Status | Meaning |
|--------|---------|
| `not-started` | Planned in docs; no app folder or empty scaffold |
| `planning` | Specs/prompts; minimal or no implementation |
| `in-progress` | Active development; partial feature coverage |
| `implemented` | MVP baseline in code matches documented core |
| `drifted` | Known contradiction until ADR or fix |

## Name normalization

When `docs/planning/drivers` maps to `apps/driver_app`, record the pair in the drift report **mapping table** so future scans stay consistent.

## Pairing with other skills

- **`apd-resume`:** structure recovery; run before state engine if folders were messy.
- **`apd`:** greenfield generation; not invoked by state engine.
