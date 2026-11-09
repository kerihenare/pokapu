# Multi-tenancy with Organisations

- **Date:** 2026-11-09
- **Status:** Accepted

## Context

Pokapu exists to provide shared infrastructure for volunteers organising events, particularly Burning Man regional burns. There are many regional burns, each run by its own independent group of volunteers. If every group had to deploy and operate its own copy of Pokapu, the platform would only be practical for groups with the technical capacity to run it. That would work against Radical Inclusion and Immediacy.

At the same time, groups are independent of each other. Their people, events, and data are their own, and one group shouldn't be able to see or change another's.

## Decision

Pokapu MUST support multiple tenants on a single deployment. A tenant is called an **Organisation**.

- An Organisation is the boundary for ownership and access. Its data belongs to it and is isolated from other Organisations by default.
- One deployment MUST be able to host many Organisations.
- A person MAY belong to more than one Organisation.

This record sets the product requirement only. How tenants are isolated (for example, a shared schema with a tenant key, a schema per tenant, or a database per tenant) is an engineering decision. It belongs in `04-engineering/decisions/`.

## Consequences

- Groups without technical capacity can use a shared, hosted Pokapu instead of running their own.
- Every feature MUST be designed with Organisation scope in mind from the start. Retrofitting tenancy later is expensive and error-prone.
- Isolation between Organisations is a security and privacy requirement. A leak across Organisations is a serious defect, not a minor bug.
- Self-hosting stays possible, consistent with Radical Self-reliance. A self-hosted deployment may contain only one Organisation.
- "Organisation" now has two meanings in this repo: a tenant, and Pokapu itself (`01-organisation/`). Resolve this in `GLOSSARY.md` once domain terms are being defined.
