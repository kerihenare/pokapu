# Contributing to Pokapu

Kia ora, and thanks for your interest in Pokapu. It's built by volunteers for volunteers, and all kinds of contributions are welcome, not just code.

By taking part, you agree to follow our [Code of Conduct](CODE_OF_CONDUCT.md).

## Ways to help

- **Share ideas and experience.** If you've helped run a regional burn or another volunteer-run event, your knowledge of what's hard is the most useful thing you can give. [Open an idea](https://github.com/kerihenare/pokapu/issues/new/choose).
- **Report bugs** with the bug form on the same page.
- **Improve the docs.** The numbered directories are the project's living documentation, starting with [why Pokapu exists](01-organisation/purpose.md) and [our values](01-organisation/values.md).
- **Design** flows, wireframes and the style guide in [`03-design/`](03-design/).
- **Write code** in [`04-engineering/source/`](04-engineering/source/).
- **Review** open pull requests and **discuss** the open decisions in each discipline's README.

**Security vulnerabilities** must be reported privately, never in a public issue. See [SECURITY.md](SECURITY.md).

## How work is organised

- Work is tracked in [GitHub Issues](https://github.com/kerihenare/pokapu/issues). New issues are labelled `needs-triage` until a maintainer reviews them. The labels are described in [triage labels](99-system/agents/triage-labels.md).
- Significant decisions are written down as decision records in the relevant discipline's `decisions/` folder, not left implicit in code or chat. See [Recording decisions](99-system/decisions/261109-recording-decisions.md). If your change makes or changes a decision, add or update a record in the same pull request.
- Before you start on something sizeable, comment on its issue (or open one) so we can agree the approach first.

## Contributing code

1. Set up the toolchain by following [`04-engineering/source/README.md`](04-engineering/source/README.md).
2. Create a branch from `main`. Changes reach `main` only through pull requests.
3. Make your change, with tests. Run package commands from `04-engineering/source/`.
4. Run `pnpm check` (format, lint, typecheck and tests). If you changed pages, also run `pnpm test:e2e`.
5. Open a pull request and fill in the template. CI must pass before it can be merged.

Things every change must respect:

- **Organisation isolation.** One deployment hosts many Organisations (tenants), and a leak of data between them is a serious defect. Every feature is Organisation-scoped from the start. New Organisation-owned tables follow the rules in [tenant isolation](04-engineering/decisions/261109-tenant-isolation-with-row-level-security.md), and features that touch Organisation-owned data include tests showing one Organisation can't reach another's data.
- **Accessibility.** Pokapu targets WCAG 2.2 AA. Pages covered by end-to-end tests also run automated accessibility checks.
- **The accepted stack.** It's recorded in [`04-engineering/decisions/`](04-engineering/decisions/). Propose a new record rather than quietly introducing a different tool.

## Writing style

Docs use British/NZ English spelling ("organisation", "licence"). Keep sentences short and plain: many readers aren't native English speakers or developers.

## Licence

Pokapu is licensed under the [Apache License 2.0](LICENSE.md). Contributions you make are licensed under the same terms.
