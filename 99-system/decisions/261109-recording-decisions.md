# Recording decisions

- **Date:** 2026-11-09
- **Status:** Accepted

## Context

Pokapu uses its numbered top-level directories as living documentation. Decisions that stay implicit in code, chat, or memory are hard to find, question, or revisit later, especially for volunteers who join after the decision was made.

## Decision

Every new decision MUST be recorded as a Markdown file in the relevant `decisions/` directory:

- `02-product/decisions/` for product decisions
- `03-design/decisions/` for design decisions
- `04-engineering/decisions/` for engineering decisions, including stack choices
- `99-system/decisions/` for decisions about how the project itself is run and documented

Files are named `YYMMDD-slugified-title.md`, using the date the decision was made. For example, this record is `261109-recording-decisions.md`.

## Consequences

- Decisions are discoverable in one predictable place per discipline.
- The date prefix sorts records chronologically within each directory.
- Contributors (human or agent) must write a record whenever they make a significant decision, not just change the code.
