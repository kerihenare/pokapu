# PostgreSQL as the database

- **Date:** 2026-11-09
- **Status:** Accepted

## Context

Pokapu needs a primary database. One deployment hosts many Organisations (tenants), and their data must be isolated by default; a cross-Organisation leak is a serious defect (`../../02-product/decisions/261109-multi-tenancy-with-organisations.md`). The isolation strategy is still an open decision for the architect, so the database shouldn't rule any strategy out.

The database must also be open source and easy to run, for both shared hosted instances and self-hosted single-Organisation instances.

Alternatives considered:

- **SQLite**: the simplest to self-host, but a poor fit for a busy shared instance, with no row-level security.
- **MySQL or MariaDB**: widely hosted, but with no row-level security, so isolation would rely entirely on application code.

## Decision

Pokapu uses **PostgreSQL** as its primary database.

The minimum supported major version is 17, and we develop and test against 18. See `261109-drizzle-orm-and-sql-migrations.md`.

## Consequences

- Every candidate isolation strategy stays open: a shared schema with an Organisation key and row-level security, a schema per Organisation, or a database per Organisation.
- Row-level security can enforce Organisation isolation in the database, as well as in application code, if the architect chooses that approach.
- PostgreSQL is open source and offered by almost every host, so both self-hosting and managed hosting are practical.
- Self-hosters need to run a PostgreSQL server, not just a file. A container setup (for example Docker Compose) should be provided to make this easy.
- Data access and migrations use Drizzle ORM with generated SQL migrations (`261109-drizzle-orm-and-sql-migrations.md`).
