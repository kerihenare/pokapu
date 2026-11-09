# Testing with Vitest and Playwright

- **Date:** 2026-11-09
- **Status:** Accepted

## Context

Pokapu needs a testing approach before application code is written.

- The web app uses TanStack Start, which is built on Vite (`261109-tanstack-start-web-framework.md`), and the code is TypeScript 7 (`261109-typescript-on-node-js.md`).
- Data access uses Drizzle on PostgreSQL. The minimum supported version is 17, and we develop against 18 (`261109-drizzle-orm-and-sql-migrations.md`).
- A leak of data between Organisations is a serious defect (`../../02-product/decisions/261109-multi-tenancy-with-organisations.md`). Isolation has to be proven by tests against the same database behaviour as production, including roles and, if adopted, row-level security. A mocked or emulated database can't prove it.
- Radical Inclusion means the UI must be accessible, and automated checks catch many common problems before a person has to.

Alternatives considered:

- **Node's built-in test runner**: no dependencies, but no Vite integration and weak support for React components.
- **Jest**: familiar, but needs a second TypeScript/ESM transform alongside Vite.
- **PGlite**: an in-process WASM PostgreSQL. Fast and needs no Docker, but it's single-connection, its role and RLS behaviour doesn't match production, and its versions lag upstream.
- **Deferring E2E tests, or checking accessibility only by hand.**

## Decision

### Unit and integration tests

- **Vitest** runs unit and integration tests, sharing the Vite configuration of the app or lib under test.
- Pure logic is tested in Node. React components are tested in a real browser with **Vitest Browser Mode** using its Playwright provider, not a simulated DOM such as jsdom.
- Test files sit next to the code they test, as `*.test.ts` or `*.test.tsx`.

### Database tests

- Integration tests run against **real PostgreSQL**. Locally, **Testcontainers** (`@testcontainers/postgresql`) starts it, which needs Docker or a compatible runtime. In CI, a service container provides it.
- The test database is set up by applying the committed migrations, the same way production is, never with `drizzle-kit push`.
- Each test is isolated, either inside a transaction that's rolled back or in its own database cloned from a migrated template. The engineers implementing it choose the mechanism.
- The data layer runs against every supported PostgreSQL major version, currently **17 and 18**.
- **Organisation isolation tests are mandatory.** Any feature that stores or reads Organisation-owned data must include tests showing that one Organisation can't read or change another's data. Once the architect decides the isolation strategy, the shared helpers for these tests will be written alongside it.

### End-to-end and accessibility tests

- **Playwright** runs end-to-end tests against a production build of the app (the Node server output), in Chromium, Firefox and WebKit.
- **axe-core** (`@axe-core/playwright`) checks every page that's covered by an end-to-end test. Violations at WCAG 2.2 level A and AA fail the test.
- End-to-end tests live in their own package under `apps/`, next to the app they test.

## Consequences

- Testing uses two tools, Vitest and Playwright, which share one browser engine install.
- Isolation and migrations are tested against real PostgreSQL, so passing tests mean something for production and for self-hosters.
- Contributors need Docker, or a compatible runtime, to run database tests locally. Pure unit tests still run without it.
- Running the database tests against two PostgreSQL versions makes CI slower. That's the cost of supporting PostgreSQL 17 and later.
- Automated accessibility checks catch only part of WCAG. Manual review and the designer's accessibility guidance are still needed.
- Exact versions, the coverage tool, coverage thresholds and test-data factories are left to the engineers scaffolding the tooling, within the limits of this record.
