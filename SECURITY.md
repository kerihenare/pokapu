# Security policy

Pokapu holds personal information about volunteers, and one deployment can host many Organisations. We take security reports seriously and are grateful for them.

## Supported versions

Pokapu hasn't been released yet. Only the `main` branch is supported, and fixes land there.

## Reporting a vulnerability

**Please don't report vulnerabilities in public issues, pull requests or discussions.**

Report them privately through GitHub:

1. Go to the [Security tab](https://github.com/kerihenare/pokapu/security) of the repository.
2. Choose **Report a vulnerability**, or go straight to [the private reporting form](https://github.com/kerihenare/pokapu/security/advisories/new).

Please include what you found, how to reproduce it, and what an attacker could do with it. A proof of concept helps, but please test only against your own deployment and data.

## What we're most concerned about

Any of these is serious:

- **Data leaking across Organisations**: one Organisation reading, changing or detecting another Organisation's data. We treat this as the most serious kind of defect (see [tenant isolation](04-engineering/decisions/261109-tenant-isolation-with-row-level-security.md)).
- Bypassing authentication, or acting as another person.
- Exposure of personal information.
- A plugin escaping the limits Pokapu places on it.
- Weaknesses in our build, CI or dependency supply chain.

## What to expect

Pokapu is maintained by volunteers, so we can't promise fixed response times. We aim to:

- acknowledge your report within a week;
- keep you informed while we investigate and fix it;
- credit you in the published advisory, unless you'd rather stay anonymous.

Please give us reasonable time to release a fix before you disclose the issue publicly.
