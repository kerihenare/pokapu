# Engineering

How Pokapu is built.

## Contents

- [Decisions](decisions/): engineering decision records, including stack and architecture choices.
- [Source](source/): application source code.

## Status

Pokapu is in its scaffolding stage. The core stack has been chosen, but there's no application code yet:

- [TypeScript on Node.js](decisions/261109-typescript-on-node-js.md)
- [TanStack Start as the web framework](decisions/261109-tanstack-start-web-framework.md)
- [PostgreSQL as the database](decisions/261109-postgresql-database.md)
- [pnpm workspaces](decisions/261109-pnpm-workspaces.md)
- [Drizzle ORM and SQL migrations](decisions/261109-drizzle-orm-and-sql-migrations.md)
- [Oxlint and oxfmt for linting and formatting](decisions/261109-oxlint-and-oxfmt.md)
- [Testing with Vitest and Playwright](decisions/261109-testing-with-vitest-and-playwright.md)
- [GitHub Actions for CI](decisions/261109-github-actions-ci.md)

Tooling hasn't been scaffolded yet. Releases and deployment are still undecided. Record each choice in [`decisions/`](decisions/) when it's made.

## Open decisions

Two accepted product decisions need engineering counterparts:

- **Tenant isolation**: how Organisations' data is kept apart, for example a shared schema with a tenant key, a schema per tenant, or a database per tenant. See [Multi-tenancy with Organisations](../02-product/decisions/261109-multi-tenancy-with-organisations.md).
- **Plugin architecture**: extension points, API surface, packaging, distribution, sandboxing and trust, versioning, and whether plugins run in-process. See [Plugin system](../02-product/decisions/261109-plugin-system.md).

Every feature must be Organisation-scoped from the start. A leak of data across Organisations is a serious defect.

## Recording a decision

Follow [Recording decisions](../99-system/decisions/261109-recording-decisions.md). Name the file `YYMMDD-slugified-title.md` using the date the decision was made.
