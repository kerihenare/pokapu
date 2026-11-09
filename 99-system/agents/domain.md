# Domain Docs

How the engineering skills should consume this repo's domain documentation when exploring the codebase.

## Before exploring, read these

- **`GLOSSARY.md`** at the repo root.
- **`01-organisation/purpose.md` and `01-organisation/values.md`**: product, design, and engineering choices should be consistent with these.
- **Decision records** (this repo's ADRs), split by discipline. Read those that touch the area you're about to work in:
  - `02-product/decisions/`
  - `03-design/decisions/`
  - `04-engineering/decisions/` (stack and architecture choices)
  - `99-system/decisions/` (how the repo itself is run and documented)

If any of these don't exist or are empty, **proceed silently**. Don't flag their absence; don't suggest creating them upfront. The `/domain-modeling` skill creates them lazily when terms or decisions actually get resolved.

## File structure

```
/
├── GLOSSARY.md
├── 01-organisation/
├── 02-product/decisions/
├── 03-design/decisions/
├── 04-engineering/
│   ├── decisions/
│   └── source/            ← application code
└── 99-system/decisions/
```

## Recording decisions

Where a skill says "write an ADR", write a decision record instead, in the relevant discipline's `decisions/` folder:

- Filename `YYMMDD-slugified-title.md`, dated the day the decision was made (no sequential numbering).
- Structure as in `99-system/decisions/261109-recording-decisions.md`: H1 title, `**Date:**` (YYYY-MM-DD) and `**Status:**` bullets, then `## Context`, `## Decision`, `## Consequences`.
- British/NZ English spelling.

## Use the glossary's vocabulary

When your output names a domain concept (in an issue title, a refactor proposal, a hypothesis, a test name), use the term as defined in `GLOSSARY.md`. Don't drift to synonyms the glossary explicitly avoids.

If the concept you need isn't in the glossary yet, that's a signal: either you're inventing language the project doesn't use (reconsider) or there's a real gap (note it for `/domain-modeling`).

## Flag decision conflicts

If your output contradicts an existing decision record, surface it explicitly rather than silently overriding:

> _Contradicts `04-engineering/decisions/261201-postgres-for-storage.md`, but worth reopening because…_
