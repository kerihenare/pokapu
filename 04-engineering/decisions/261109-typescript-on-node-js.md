# TypeScript on Node.js

- **Date:** 2026-11-09
- **Status:** Accepted

## Context

Pokapu needs a language and runtime before any application code can be written. The choice affects who can contribute, how plugins are built, and where Pokapu can be hosted.

- Pokapu is built and maintained by volunteers (Communal Effort, Participation), so the language should be one many people already know.
- Third parties MUST be able to build plugins (`../../02-product/decisions/261109-plugin-system.md`). A typed plugin API makes extension points easier to discover and harder to misuse.
- Self-hosting must stay practical and cheap (Radical Self-reliance, Decommodification), so the runtime should be available on almost any host.
- `04-engineering/source/package.json` is already an ES module package (`"type": "module"`).

Alternatives considered: TypeScript on Bun (fast tooling, but a smaller ecosystem and fewer hosts and volunteers know it), Python with Django (mature, but a second language alongside the frontend), and Elixir with Phoenix (strong for realtime, but a small contributor pool).

## Decision

- Pokapu is written in **TypeScript 7** (the native compiler), in strict mode, as ES modules. The version was set by `261109-oxlint-and-oxfmt.md`.
- The server runtime is **Node.js**, targeting the current Active LTS line, which is **Node.js 26** ("Lithium") at the time of writing.
- When a new Node.js line becomes Active LTS, we move to it during that line's Active LTS window. Updating the pinned version is an amendment to this record, not a new decision.

## Consequences

- Frontend, backend, shared libraries and plugins all use one language, so contributors and plugin authors only need to know TypeScript.
- Plugin extension points can be published as typed interfaces.
- Node.js runs on nearly every host, VPS and container platform, which keeps self-hosting accessible.
- The required Node.js version must be pinned in the source workspace (for example `engines` in `package.json`) and documented in `04-engineering/source/README.md`.
- Linting and formatting use Oxlint and oxfmt (`261109-oxlint-and-oxfmt.md`). TypeScript 7 removes some legacy `tsconfig` options, so `tsconfig` files must avoid them.
- Testing and the shared `tsconfig` setup still need their own decisions.
