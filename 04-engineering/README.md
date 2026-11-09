# Engineering

How Pokapu is built.

## Contents

- [Decisions](decisions/): engineering decision records, including stack and architecture choices.
- [Source](source/): application source code.

## Status

Pokapu is in its scaffolding stage. There's no application code yet, and no framework, package manager, runtime, or monorepo tooling has been chosen. Each of these choices should be recorded in [`decisions/`](decisions/) when it's made.

## Open decisions

Two accepted product decisions need engineering counterparts:

- **Tenant isolation**: how Organisations' data is kept apart, for example a shared schema with a tenant key, a schema per tenant, or a database per tenant. See [Multi-tenancy with Organisations](../02-product/decisions/261109-multi-tenancy-with-organisations.md).
- **Plugin architecture**: extension points, API surface, packaging, distribution, sandboxing and trust, versioning, and whether plugins run in-process. See [Plugin system](../02-product/decisions/261109-plugin-system.md).

Every feature must be Organisation-scoped from the start. A leak of data across Organisations is a serious defect.

## Recording a decision

Follow [Recording decisions](../99-system/decisions/261109-recording-decisions.md). Name the file `YYMMDD-slugified-title.md` using the date the decision was made.
