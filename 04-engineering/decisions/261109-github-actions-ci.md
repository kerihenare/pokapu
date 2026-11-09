# GitHub Actions for CI

- **Date:** 2026-11-09
- **Status:** Accepted

## Context

Pokapu's code is hosted publicly on GitHub (`kerihenare/pokapu`), and issues are tracked there too. Contributions will come from volunteers and third parties, so every pull request needs the same automated checks before it's reviewed. Those checks are linting and formatting (`261109-oxlint-and-oxfmt.md`), type checking, tests including Organisation isolation tests (`261109-testing-with-vitest-and-playwright.md`), and migration checks (`261109-drizzle-orm-and-sql-migrations.md`).

Alternatives considered:

- **Forgejo or Codeberg Actions**: non-commercial community infrastructure that fits Decommodification well, but the code is on GitHub, so we'd have to mirror the repository or move it.
- **Deferring CI**: there's no code yet, but setting up the checks before the first app means they're never retrofitted.

## Decision

Pokapu uses **GitHub Actions** for CI.

- Workflows run on every pull request and on every push to `main`.
- CI must pass before a pull request is merged. These checks are required:
  - install with a frozen lockfile (`pnpm install --frozen-lockfile`);
  - check formatting with oxfmt and lint with Oxlint (type-aware);
  - type-check with TypeScript;
  - run Vitest unit and integration tests, with the database tests repeated against each supported PostgreSQL major version, currently 17 and 18;
  - check migrations: the committed migrations apply cleanly to an empty database, and the schema has no changes waiting to be turned into a migration;
  - build the app and run Playwright end-to-end and accessibility tests against that build.
- The Node.js version comes from `04-engineering/source/.node-version`, and the pnpm version from `packageManager`, so CI matches local development.
- Workflows are hardened against supply-chain attacks:
  - third-party actions are pinned to a full commit SHA;
  - `GITHUB_TOKEN` gets read-only permissions by default, raised per job only when needed;
  - workflows triggered by pull requests from forks never receive secrets.
- Workflows stick to plain YAML and widely used actions. Logic lives in `package.json` scripts, not in workflow files, so it can be ported to Forgejo Actions or run locally.

## Consequences

- Every contribution gets the same checks, including isolation and accessibility tests, before a person reviews it.
- Public repositories get Actions minutes free, so CI costs the project nothing for now.
- Pokapu depends on GitHub, a commercial provider, for CI. Keeping logic in package scripts and workflows compatible with Forgejo limits that dependency (Decommodification).
- Running database tests against two PostgreSQL versions and end-to-end tests in three browsers makes CI slower. If it gets too slow, CI can be split into parallel jobs or the browser matrix limited for pull requests, as an amendment to this record.
- Releases, container image publishing and deployment aren't covered here. They need their own decision.
