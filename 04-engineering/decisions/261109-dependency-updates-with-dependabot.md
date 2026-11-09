# Dependency updates with Dependabot

- **Date:** 2026-11-09
- **Status:** Accepted

## Context

Pokapu's dependencies are declared in `04-engineering/source/package.json` files, mostly with `^` ranges that the committed lockfile freezes. Some tools are pinned exactly on purpose (`typescript`, `oxfmt`, `nitro`, `playwright` and `@playwright/test`). CI's third-party actions are pinned to full commit SHAs (`261109-github-actions-ci.md`). Pins protect against supply-chain attacks but never move on their own, so without help, dependencies and actions fall behind on fixes, including security fixes.

Pokapu is run by volunteers, so keeping up should take as little manual effort as possible.

Options considered:

- **Manual updates.** Free and simple, but they get forgotten, which is the problem this record exists to solve.
- **Renovate.** Very configurable, can bump `.node-version` and `packageManager`, and can raise vulnerability updates from OSV data. It needs a third-party app installed on the repository, and its configuration is larger.
- **Dependabot.** Built into GitHub, with no app to install and a small configuration file. It supports pnpm workspaces and updates SHA-pinned actions along with their version comments.

pnpm 12 writes `pnpm-lock.yaml` as two YAML documents when the pnpm version is pinned, which Pokapu does through `packageManager`. Dependabot version updates work with this format, but GitHub's dependency graph can't read it. So Dependabot alerts and Dependabot security updates aren't available for Pokapu's npm dependencies.

## Decision

Pokapu uses **Dependabot** for version updates, configured in `.github/dependabot.yml`:

- npm dependencies in `04-engineering/source` and GitHub Actions are checked weekly.
- Minor and patch updates are grouped into one pull request. Major updates get their own pull requests.
- `playwright` and `@playwright/test` are always updated together, because the test runner and the browsers must stay on the same version.
- Exactly pinned dependencies still get pull requests. Pinning means updates are deliberate, not that they never happen.
- New releases wait 7 days (`cooldown`) before Dependabot proposes them. That leaves time for a compromised or broken release to be caught and pulled.

To cover the missing alerts, CI runs **`pnpm audit`** (the `audit` script, `--audit-level high`) on every pull request and push to `main`. It fails when a dependency has a high or critical advisory.

Dependabot updates go through the same required CI checks as any other pull request.

## Consequences

- Dependencies and action pins stay current with little effort, and every update is a reviewable pull request.
- Dependabot doesn't bump `.node-version` or the pnpm version in `packageManager`. Those stay manual, alongside the Node.js release schedule.
- Without Dependabot alerts, a new advisory only shows up when CI next runs. A quiet repository could miss one for a while. If that becomes a problem, add a scheduled CI run, or revisit Renovate.
- `pnpm audit` depends on the npm registry's advisory service, so an outage there can fail CI. In that case, rerun the job.
- If GitHub's dependency graph starts supporting pnpm 12's lockfile format, turn on Dependabot alerts and security updates, and consider dropping the CI audit.
