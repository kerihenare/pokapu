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

Each record has a **Status**, one of:

- **Proposed:** under discussion and not yet agreed.
- **Accepted:** agreed and in effect.
- **Rejected:** considered and not adopted. The record stays as a note of why.
- **Superseded:** replaced by a later record. The status links to it, e.g. `Superseded by 270115-new-title.md`.

A record can be edited in place to refine or amend it while it stays in effect, such as clarifying its scope or changing a detail. When a decision is reversed or replaced outright, write a new record and mark the old one Superseded.

## Consequences

- Decisions are discoverable in one predictable place per discipline.
- The date prefix sorts records chronologically within each directory.
- Contributors (human or agent) must write a record whenever they make a significant decision, not just change the code.
- Amending a record in place keeps one current source of truth, but the record's history lives in git, not in the file.
