# Plugin system

- **Date:** 2026-11-09
- **Status:** Accepted

## Context

Events and the groups that run them vary widely: ticketing, volunteer rostering, art grants, camp placement, safety, and local legal requirements all differ between regional burns. A single fixed feature set can't serve every group well. Building every group's specific needs into the core would make it large and hard to maintain.

Pokapu's values call for people and communities to adapt tools to their own needs (Radical Self-expression), build on each other's work (Communal Effort, Gifting), and develop their own capabilities (Radical Self-reliance).

## Decision

Pokapu MUST have a plugin system, so functionality can be added without changing the core platform.

- Plugins extend Pokapu with new or alternative functionality.
- Plugins MUST be enabled and configured per Organisation (see `261109-multi-tenancy-with-organisations.md`). One Organisation's plugin choices don't affect another's.
- Plugins MUST respect Organisation isolation. A plugin acting for one Organisation can't access another Organisation's data.
- Third parties, not just core maintainers, MUST be able to build plugins.

This record sets the product requirement only. The plugin architecture is an engineering decision that belongs in `04-engineering/decisions/`. That includes extension points, the API surface, packaging, distribution, sandboxing and trust, versioning, and whether plugins run in-process.

## Consequences

- The core can stay small and focused. Group-specific needs can live in plugins.
- The community can build and share plugins, which spreads the work of maintaining Pokapu.
- The core needs stable, documented extension points. Changing them becomes a compatibility concern for plugin authors.
- Running third-party code raises security and trust questions, especially on shared multi-tenant deployments. The engineering design must answer them.
- Deciding whether a feature belongs in the core or in a plugin becomes an ongoing product question.
