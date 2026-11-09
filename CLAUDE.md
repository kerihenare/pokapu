# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project status

Pokapu is an open-source platform (Apache 2.0, see `LICENSE.md`) to help volunteers organise and deliver events, with a focus on Burning Man regional burns. The repo is in its **pre-code scaffolding stage**: there is no application code, build, lint, or test tooling yet. The only manifest is `04-engineering/source/package.json` (`@pokapu/source`, private, ESM via `"type": "module"`, no scripts or dependencies). No framework, package manager, or runtime version has been chosen or recorded. The root `.gitignore` is the standard Node template, but that isn't a recorded decision. Don't assume frameworks or commands. Check the manifest first, and update this file once tooling exists.

## Repository layout

The top-level directories are numbered by discipline and act as the project's living documentation:

- `01-organisation/`: why Pokapu exists (`purpose.md`) and its values (`values.md`, an interpretation of the 10 Principles of Burning Man). Product, design, and engineering decisions should be consistent with these.
- `02-product/decisions/`, `03-design/decisions/`, `04-engineering/decisions/`: decision records for each discipline. They're empty for now (`.gitkeep` only). Record significant decisions here, in the relevant discipline's folder, rather than leaving them implicit in code. Stack choices, such as a framework, package manager, or monorepo tooling, belong in `04-engineering/decisions/`.
- `04-engineering/source/`: where application source code lives. Run package commands from this directory, not from the repo root.
- `99-system/`: tools, templates, and documentation for running the repository itself. Its `decisions/` folder holds records about how the project is run and documented, such as `261109-recording-decisions.md`.

## Claude configuration

- `.claude/agents/` defines role-based subagents: `architect`, `designer`, `engineer`, `lead-engineer`, `product-manager`, `project-manager`. Right now each file contains only a `name` in its frontmatter, with no description, tools, or prompt. Flesh them out before relying on them for delegation.
- `.claude/skills/` exists but is empty.

## Conventions

- Every new decision MUST be recorded in the relevant discipline's `decisions/` directory, never left implicit. Name the file `YYMMDD-slugified-title.md`, using the date the decision was made (e.g. `261109-recording-decisions.md`). Follow that record's structure: an H1 title, `**Date:**` (YYYY-MM-DD) and `**Status:**` bullets, then `## Context`, `## Decision`, and `## Consequences` sections.
- Use British/NZ English spelling in docs ("organisation", "licence"), matching the existing content.
- `README.md` still has placeholder sections (Project Status, Getting Started, Licence). The Licence placeholder is out of date: `LICENSE.md` is already Apache 2.0.

## Agent skills

### Issue tracker

Issues are tracked in GitHub Issues (`kerihenare/pokapu`) via the `gh` CLI. See `99-system/agents/issue-tracker.md`.

### Triage labels

Default vocabulary: `needs-triage`, `needs-info`, `ready-for-agent`, `ready-for-human`, `wontfix`. See `99-system/agents/triage-labels.md`.

### Domain docs

Single-context: root `GLOSSARY.md`, with decision records in each discipline's `decisions/` folder (no `docs/adr/`). `GLOSSARY.md` doesn't exist yet. `/domain-modeling` creates it once terms are actually resolved, so don't flag its absence or create it in advance. Before working in an area, read its decision records, and say so explicitly if your work contradicts one rather than silently overriding it. See `99-system/agents/domain.md`.
