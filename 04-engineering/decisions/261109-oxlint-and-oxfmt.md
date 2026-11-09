# Oxlint and oxfmt for linting and formatting

- **Date:** 2026-11-09
- **Status:** Accepted

## Context

Pokapu is written in strict TypeScript with React (`261109-typescript-on-node-js.md`, `261109-tanstack-start-web-framework.md`). We need a linter and a formatter that volunteers can run quickly and get consistent results from.

Two needs stand out:

- **Type-aware rules.** Rules such as `no-floating-promises` and `no-misused-promises` catch mistakes like forgetting to `await` work inside an Organisation-scoped transaction. In a multi-tenant system those mistakes can cause data leaks between Organisations (`../../02-product/decisions/261109-multi-tenancy-with-organisations.md`).
- **Accessibility rules.** Radical Inclusion means the UI must be accessible, and `jsx-a11y` rules catch common problems early.

At the time of writing, TypeScript 7.0, the native Go compiler, is the current release. typescript-eslint only supports TypeScript below 6.1, so using ESLint's type-aware rules would hold us on TypeScript 6.0. Oxlint's type-aware mode is built on typescript-go and requires TypeScript 7.

Alternatives considered:

- **Oxlint with Prettier**: the same linter, with a stable formatter.
- **Biome**: one tool for both linting and formatting, but its type-aware checks use its own inference and cover fewer cases.
- **ESLint with Prettier**: the largest plugin ecosystem, but it would pin TypeScript to 6.0, and type-aware linting is slow.

## Decision

- **Oxlint** is Pokapu's linter, with type-aware linting enabled (`options.typeAware` in the root config, through `oxlint-tsgolint`). The `typescript`, `react`, `jsx-a11y` and `import` rule sets are enabled.
- **oxfmt** is Pokapu's formatter.
- Pokapu uses **TypeScript 7**. This amends `261109-typescript-on-node-js.md`.
- Configuration lives once, at the root of `04-engineering/source/`, and applies to every app and lib. Packages only override it when they have a specific, documented reason.
- oxfmt is pre-1.0, so its version is pinned exactly. Upgrades are their own change, and any reformatting they cause is committed separately from other work.
- Lint and format checks must pass in CI once CI exists.

## Consequences

- One toolchain from the Oxc project is fast enough to run on every save and every commit, even with type-aware rules.
- Oxlint uses ESLint rule names, so contributors' existing knowledge and documentation still apply.
- TypeScript 7 removes some legacy `tsconfig` options (for example `baseUrl`). Our `tsconfig` files must avoid options that were deprecated in 6.0 or removed in 7.0.
- Oxlint doesn't run every ESLint plugin. If we need a rule it lacks, we either write an Oxlint JS plugin or go without. Adding ESLint alongside Oxlint would need a new decision.
- oxfmt's output may change before 1.0, which can cause reformatting changes when we upgrade it. Pinning the version keeps those changes deliberate.
- Editor setup (the Oxc VS Code extension or the LSP) should be documented in `04-engineering/source/README.md` once the tools are installed.
