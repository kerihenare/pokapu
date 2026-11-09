# Tenant isolation with a shared schema and row-level security

- **Date:** 2026-11-09
- **Status:** Proposed

## Context

One Pokapu deployment hosts many tenants, called Organisations. Each Organisation's data is isolated by default, a person can belong to several Organisations, and a leak across Organisations is a serious defect (`../../02-product/decisions/261109-multi-tenancy-with-organisations.md`). Plugins are installed per instance, shared by every Organisation on it, can be built by third parties, and must respect the same isolation (`../../02-product/decisions/261109-plugin-system.md`).

The stack is PostgreSQL 17+ (`261109-postgresql-database.md`), accessed through Drizzle ORM with committed SQL migrations (`261109-drizzle-orm-and-sql-migrations.md`). Isolation must be proven by tests against real PostgreSQL (`261109-testing-with-vitest-and-playwright.md`).

The goal is a design where a cross-Organisation leak is hard to write, not just discouraged. It should also be something a volunteer group can understand, run and upgrade on modest hardware (Radical Self-reliance, Leaving No Trace).

Options considered:

- **Shared schema, application-level scoping only.** Every Organisation-owned table has an `organisation_id` column and every query filters on it. This is simple and cheap, but a single forgotten `where` clause leaks data, and nothing in the database catches it.
- **Shared schema with row-level security (RLS).** As above, but PostgreSQL also enforces the filter through policies tied to a per-transaction setting. A forgotten filter returns no rows instead of another Organisation's rows.
- **Schema per Organisation.** Each Organisation gets its own PostgreSQL schema, selected with `search_path`. Isolation is strong, but every migration runs once per Organisation, so upgrades get slower and riskier as an instance grows. Drizzle and drizzle-kit assume a fixed schema. With connection pooling, a `search_path` left over from a previous request is its own leak risk. People who belong to several Organisations, and anything instance-wide, need a shared schema anyway. Thousands of schemas also bloat the system catalogue.
- **Database per Organisation.** This gives the strongest isolation, but needs a connection pool and a migration run per Organisation, plus provisioning every time an Organisation is created. That works against hosting many small regional burns cheaply on one deployment, which is the reason multi-tenancy exists. A group that needs this level of separation can already run its own instance.

## Decision

Pokapu uses **one shared PostgreSQL schema**. Every Organisation-owned row carries an **`organisation_id`**, and isolation is enforced by **row-level security**, with application-level scoping on top.

### Organisation-owned tables

- Every Organisation-owned table has `organisation_id uuid not null` referencing `organisations`, with `on delete cascade` so an Organisation's data can be removed as a whole.
- RLS is **enabled and forced** (`force row level security`) on every Organisation-owned table, so the policy also applies to the table owner.
- Each table has one standard policy, defined in the Drizzle schema with `pgPolicy`, covering every command (`using` and `with check`):

  ```sql
  organisation_id = (select nullif(current_setting('app.organisation_id', true), '')::uuid)
  ```

  If no Organisation is set, the setting is null or empty, the comparison is null, and the query sees no rows and can't write any. Isolation fails closed. The `nullif` handles the empty string PostgreSQL returns once a transaction-local setting has been reset. The `select` wrapper lets PostgreSQL evaluate the setting once per query instead of once per row.
- Indexes and primary or unique keys on Organisation-owned tables lead with `organisation_id`.
- **Foreign keys between Organisation-owned tables are composite**: `(organisation_id, parent_id)` references `(organisation_id, id)`. PostgreSQL checks foreign keys without applying RLS, so a single-column foreign key would let a row in one Organisation point at a row in another.
- **Unique constraints on Organisation data include `organisation_id`.** Uniqueness checks also ignore RLS, so an instance-wide unique constraint would reveal whether a value exists in another Organisation.
- Views over Organisation-owned tables use `security_invoker = true`. Other views run as their owner, which skips RLS. `security definer` functions are not used on Organisation-owned data.

### Database roles

- **Owner role** (for example `pokapu_owner`): owns the schema and runs migrations. The application never connects with it at request time.
- **Application role** (for example `pokapu_app`): used for all request handling. It doesn't own any tables, isn't a superuser and doesn't have `BYPASSRLS`.
- Superusers and roles with `BYPASSRLS` skip every policy. Deployment documentation and the self-hosting setup must make sure the application never connects as one, and Pokapu should refuse to start if it does.

### Request scoping

- Data access goes through a **scoped transaction**. It opens a transaction, sets the Organisation for that transaction only, and passes the query handle to the caller:

  ```sql
  select set_config('app.organisation_id', $1, true);
  ```

  The setting is local to the transaction (the third argument is `true`), so it's discarded when the transaction ends and can't leak to the next request on the same pooled connection.
- The Organisation comes from the authenticated request: the route plus a check that the current person is a member of that Organisation. It never comes from a value the client sends straight to the query.
- Application code still filters on `organisation_id` explicitly. RLS is the safety net, not the only check.
- Raw, unscoped database access isn't exported to features or plugins. The lead engineer should set the exact pattern (a helper, module boundaries, and a lint rule if one is practical) as an engineering standard.

### Instance-level data

Some data isn't owned by a single Organisation. That includes the `organisations` table itself, people's accounts and sign-in data, and instance settings, which covers plugin installation and configuration because plugins are configured per instance.

- Instance-level tables don't have `organisation_id` and aren't covered by the Organisation policy. They're accessed only through a small, named module for instance-level operations, such as signing in or listing the Organisations a person belongs to. That module is reviewed with extra care.
- A person's **account** (identity and sign-in) is instance-level. Anything an Organisation records about a person (their membership, roles, shifts and notes) is Organisation-owned and covered by RLS.
- Cross-Organisation background work, such as sending reminders for every Organisation, loops over Organisations and opens a separate scoped transaction for each one. No job queries several Organisations at once.

### Enforcement in CI

- A database check (part of the migration check) fails if any table in the application schema lacks RLS enabled and forced (`relrowsecurity` and `relforcerowsecurity` in `pg_class`) and isn't on an explicit, reviewed list of instance-level tables.
- Shared test helpers create two Organisations and assert that each one can't read, change or reference the other's data through the application role. They run against real PostgreSQL, as `261109-testing-with-vitest-and-playwright.md` requires. They're written alongside the database tooling.

### Plugins

- Plugin tables follow the same rules. Organisation-owned plugin data has `organisation_id`, forced RLS and the standard policy, and the CI check covers it. How plugins ship their tables and migrations is part of the plugin architecture.
- Plugins get scoped transactions, not raw connections.
- **RLS doesn't protect against hostile code.** It stops mistakes such as a forgotten filter, but code that can run arbitrary SQL on the application role's connection can call `set_config` itself and switch Organisation. Isolation from malicious or compromised plugin code has to come from the plugin architecture (for example, what API surface plugins get, whether they run in-process, and the trust model), not from this record.

## Consequences

- A forgotten filter returns nothing instead of leaking another Organisation's data, and a missing Organisation context fails closed.
- There's one schema and one migration run for every instance, however many Organisations it hosts, which keeps self-hosted upgrades simple. A self-hosted single-Organisation instance uses exactly the same model.
- Drizzle can express the policies and roles (`pgPolicy`, `pgRole`) in the schema, and the transaction wrapper anticipated in `261109-drizzle-orm-and-sql-migrations.md` becomes the standard way to reach Organisation data.
- Every Organisation-owned table carries an extra column, composite keys and an index prefix. That's a small storage and modelling cost.
- Contributors have to know the RLS pitfalls this record lists: foreign keys, unique constraints, views and `security definer` functions. Reviewers check new tables against them, and the CI check catches the most common mistake, a table without RLS.
- Operators must run Pokapu with two database roles and never as a superuser. The self-hosting setup (for example Docker Compose) must create them.
- Exporting or deleting a single Organisation's data works through `organisation_id`. Moving one Organisation to its own instance would need an export and import tool, which isn't designed yet.
- If a single Organisation ever outgrows a shared instance, the answer is a dedicated instance, not a different isolation model.
- Database tooling (Drizzle, Testcontainers, the migration check and the PostgreSQL 17/18 matrix) can now be set up once this record is accepted.

## Open questions

- **Product:** what an Organisation can see of a person's instance-level account (for example name, email and pronouns) and how a person controls that. This shapes which personal data is instance-level and which is per Organisation.
- **Product and architecture:** instance operators' powers, such as creating and deleting Organisations or supporting an Organisation. These need a separate, audited path. It could use the owner role or a dedicated maintenance role, but must never be the application role's normal request handling.
- **Lead engineer:** the scoped transaction helper's API, how unscoped access is restricted (module boundaries, a lint rule or both), and the exact form of the CI check.
- **Architecture:** the plugin architecture must explain how plugins are kept from bypassing isolation, given that RLS alone doesn't stop hostile in-process code.
