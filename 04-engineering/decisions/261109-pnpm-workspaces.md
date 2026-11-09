# pnpm workspaces

- **Date:** 2026-11-09
- **Status:** Accepted

## Context

Source in `04-engineering/source/` is split into `apps/` and `libs/` packages (for example `@pokapu/design-system`). We need a package manager, and a way for these packages to depend on each other.

Plugins will eventually be packages too, possibly built by third parties (`../../02-product/decisions/261109-plugin-system.md`). A package that silently relies on a dependency it never declared works in development and then breaks for other users.

Alternatives considered:

- **npm workspaces**: no extra tool to install, but slower installs, and its flat `node_modules` lets packages use undeclared dependencies.
- **Bun workspaces**: only sensible with the Bun runtime, which we didn't choose (`261109-typescript-on-node-js.md`).

## Decision

- Pokapu uses **pnpm** as its package manager. The version is pinned with the `packageManager` field in `04-engineering/source/package.json`, which Corepack can enforce.
- `04-engineering/source/` is a **pnpm workspace** containing `apps/*` and `libs/*`, as declared in `pnpm-workspace.yaml`.
- Internal packages depend on each other using the `workspace:` protocol.
- Task orchestration (for example Turborepo or Nx) isn't adopted for now. We'll revisit it if builds across packages become slow or hard to coordinate.

## Consequences

- pnpm's strict `node_modules` layout catches undeclared dependencies early, in apps, libs and plugins alike.
- Installs are fast and share a single content-addressed store, which is kinder to volunteers' machines and to CI.
- Contributors need pnpm, which they can get through Corepack, which ships with Node.js, or with a standalone install. `04-engineering/source/README.md` must explain this.
- All package commands run from `04-engineering/source/`, not the repository root.
