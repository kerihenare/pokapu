# Engineering

How Pokapu is built.

## Contents

- [Decisions](decisions/): engineering decision records, including stack and architecture choices.
- [Source](source/): application source code.

## Status

Pokapu is in its scaffolding stage. The core stack has been chosen:

- [TypeScript on Node.js](decisions/261109-typescript-on-node-js.md)
- [TanStack Start as the web framework](decisions/261109-tanstack-start-web-framework.md)
- [PostgreSQL as the database](decisions/261109-postgresql-database.md)
- [pnpm workspaces](decisions/261109-pnpm-workspaces.md)
- [Drizzle ORM and SQL migrations](decisions/261109-drizzle-orm-and-sql-migrations.md)
- [Oxlint and oxfmt for linting and formatting](decisions/261109-oxlint-and-oxfmt.md)
- [Testing with Vitest and Playwright](decisions/261109-testing-with-vitest-and-playwright.md)
- [GitHub Actions for CI](decisions/261109-github-actions-ci.md)

Tenant isolation uses [a shared schema with row-level security](decisions/261109-tenant-isolation-with-row-level-security.md).

Formatting, linting, type-checking, tests and CI are set up in [`source/`](source/), with a placeholder web app. Database tooling is next, now that tenant isolation is decided. Releases and deployment are still undecided. Record each choice in [`decisions/`](decisions/) when it's made.

## Open decisions

One accepted product decision still needs an engineering counterpart:

- **Plugin architecture**: extension points, API surface, packaging, distribution, sandboxing and trust, versioning, and whether plugins run in-process. See [Plugin system](../02-product/decisions/261109-plugin-system.md).

Every feature must be Organisation-scoped from the start. A leak of data across Organisations is a serious defect.

## Recording a decision

Follow [Recording decisions](../99-system/decisions/261109-recording-decisions.md). Name the file `YYMMDD-slugified-title.md` using the date the decision was made.
