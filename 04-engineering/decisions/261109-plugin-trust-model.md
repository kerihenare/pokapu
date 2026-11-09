# Plugin trust model

- **Date:** 2026-11-09
- **Status:** Proposed

## Context

Pokapu must have plugins that third parties can build (`../../02-product/decisions/261109-plugin-system.md`). Plugins are installed, enabled and configured per instance. Every Organisation on the instance shares them. A plugin acting for one Organisation must never reach another Organisation's data.

Tenant isolation uses one shared schema with forced row-level security (RLS) (`261109-tenant-isolation-with-row-level-security.md`). That record is plain about its limit: **RLS stops mistakes, not hostile code.** Any code that can run SQL on the application role's connection can call `set_config('app.organisation_id', …, true)` and switch Organisation. In-process code can also do anything the Node.js process can. It can read the database credentials from the environment, open its own connection, read sign-in data, and act as any signed-in person. RLS can't help with any of that.

So the real question is what a plugin is trusted with, and what enforces that trust. This record answers that question. It resolves the "Architecture" open question in the tenant isolation record. It doesn't design the whole plugin architecture.

Things that shape the answer:

- **Shared hosted instances.** Many small regional burns will share one hosted instance (`../../02-product/decisions/261109-multi-tenancy-with-organisations.md`). A plugin installed there sees every Organisation on it. The operator, not each Organisation, chooses the plugins.
- **Volunteer self-hosters.** Many groups will run their own instance on a small server. Each extra service, container or runtime adds work for them (Radical Self-reliance, Leaving No Trace).
- **Plugin authors.** Plugins should be easy to write in TypeScript, the same language as the core (`261109-typescript-on-node-js.md`). A plugin system nobody can build for fails Communal Effort and Participation.
- **Browser code.** Plugins will want to add UI. Plugin code that runs in Pokapu's own pages runs with the signed-in person's session. It can act as that person in every Organisation they belong to. Server-side isolation doesn't cover this.
- **Data a plugin is given.** No design stops a plugin from keeping or sending on data the core gives it. Isolation can limit what a plugin can _ask for_. It can't limit what the plugin does with what it receives. Only vetting, scoped capabilities and operator control (for example network egress rules) reduce that.

Options considered:

- **(a) In-process, trusted plugins only.** Plugins are npm packages loaded into the core's Node.js process. They get a typed plugin API, but nothing enforces it.
  - _Security:_ none against hostile code. Installing a plugin means trusting it with every Organisation's data, every account and the database credentials. The only control is the operator's vetting. A compromised dependency of a plugin is as dangerous as a malicious plugin.
  - _Author experience:_ the best. Plain TypeScript, direct function calls, shared types, easy debugging, and routes and React components added the same way the core adds them.
  - _Operational cost:_ the lowest. One process, nothing extra to run.
  - _Shared hosted instances:_ only plugins the operator would accept as core code, reviewed to the same standard.
- **(b) Sandboxed in-process.** Plugins run in the core's process, but inside a sandbox that only exposes the plugin API.
  - _Node.js permission model_ (`--permission`): stable, but it applies to the whole process, so it can't separate a plugin from the core. Node's documentation describes it as a "seat belt" for trusted code, not a boundary against malicious code. It doesn't fit.
  - _`node:vm`:_ Node's documentation says it isn't a security mechanism. It doesn't fit.
  - _V8 isolates_ (for example `isolated-vm`): real memory separation and CPU limits. It's a native addon, so it's tied to Node.js versions and harder to install. It's maintained by a small team, and its maintainers have described it as in maintenance mode. Every value crossing the boundary has to be copied, so the API needs careful design.
  - _Hardened JavaScript_ (SES / Endo, LavaMoat): object-capability confinement inside one JavaScript realm. Promising, but it freezes shared built-ins, many npm packages and frameworks don't work under it, and the whole core would have to run under `lockdown`.
  - _WebAssembly components_ (WASI 0.2, run through tools such as `jco` or Extism): the strongest in-process isolation in principle. A plugin can only call what the host passes in. But TypeScript plugins have to bundle a JavaScript engine into the component, which makes each plugin several megabytes, slower to start and harder to debug. Async support (WASI 0.3) was still settling at the time of writing.
  - _Security:_ good with WebAssembly or isolates, if the bridge is right. Weak with the others. Every option still shares the process, so a sandbox escape is total compromise, and memory and CPU limits are only partial.
  - _Author experience:_ noticeably worse. Restricted runtimes, no normal npm dependencies in some, and no way to ship React components from inside the sandbox.
  - _Operational cost:_ moderate. One process, but native addons or WebAssembly toolchains for authors and operators.
  - _Shared hosted instances:_ possibly safe for server logic, once the tools are proven. None of them solves plugin UI.
- **(c) Out-of-process plugins over a narrow API.** Each plugin runs as its own process or container. The core calls it (webhooks or RPC over HTTP) and it calls back to a plugin API. The core holds the only database connection and scopes every call.
  - _Security:_ strong for what a plugin can reach. A plugin never sees database credentials, sessions or the core's memory. It can only call the plugin API, and the core decides the Organisation for every call. It still keeps whatever data it's given. Real separation needs the plugin process to run as a different OS user or in its own container, without the core's secrets and without network access to PostgreSQL.
  - _Author experience:_ fair. Any language works, and TypeScript authors get a typed client. Authors handle network failures, retries and request signing. Local development needs the core and the plugin running together. UI needs its own answer (see Decision).
  - _Operational cost:_ higher. Each plugin is another thing to run, update and monitor. Docker Compose keeps it manageable, but it's more memory and more moving parts for a volunteer on a small server.
  - _Shared hosted instances:_ the safest option. The operator still approves what each plugin can access, because the plugin sees data from every Organisation it's called for.
- **(d) Staged hybrid.** Define one narrow plugin API first. Run it in-process for plugins the operator fully trusts, and add an out-of-process transport for everything else. Both use the same API, so a plugin can move from one to the other.
  - _Security:_ the same as (a) for trusted plugins and (c) for untrusted ones. The risk is that operators treat "trusted" loosely. The trust level has to be explicit and visible.
  - _Author experience:_ in-process is easy for first-party and operator-written plugins. Third-party authors get the out-of-process path once it exists.
  - _Operational cost:_ self-hosters only run extra services for the third-party plugins they choose. A single-Organisation instance can keep everything in one process.
  - _Shared hosted instances:_ in-process plugins only if reviewed like core code. Everything else out-of-process.

## Decision

We recommend **(d), a staged hybrid with two explicit trust levels behind one narrow plugin API**. Sandboxed in-process plugins (b) aren't adopted now. WebAssembly components are worth revisiting once TypeScript guests are practical (see Open questions).

### Trust levels

- **Trusted (in-process).** The plugin runs inside the core's process. Installing it means trusting it with every Organisation's data, every account and the instance's secrets. The plugin API is a contract for well-behaved code, not a boundary. Vetting by the operator is the only control, and Pokapu says so plainly in its documentation and admin UI. This level is for first-party plugins maintained with the core, and for an operator's own code.
- **Untrusted (out-of-process).** The plugin runs as a separate process, as a different OS user or in its own container. It has no database credentials, no session secrets and no network route to PostgreSQL. It talks to the core only through the plugin API over HTTP, with signed requests. This is the level for third-party plugins.
- An operator chooses the level when installing a plugin. A plugin built for the out-of-process level can be run in-process by an operator who trusts it, but not the other way around.

### Staging

1. Build the plugin API and the in-process transport first, for first-party plugins. This proves the extension points cheaply.
2. Build the out-of-process transport before any third-party plugin is recommended for a shared hosted instance.
3. Until step 2 lands, a shared hosted instance runs only trusted plugins reviewed to the standard of core code. A self-hosted instance may install third-party plugins in-process, and documentation must explain that this trusts the plugin with all its data and all its people's accounts.

### What plugins never get

- **Plugins never get a raw database connection, a connection string, or any handle that can run arbitrary SQL.** This holds at both trust levels. At the trusted level it's a rule of the API. At the untrusted level it's enforced by the process boundary.
- Plugins never get the session, cookies or sign-in data of a person, and never call `set_config` or set the Organisation themselves.
- Plugins never get instance-level data beyond their own configuration: not the accounts table, other plugins' data or instance settings.

### The API surface plugins get

Every call is made in an Organisation context the core has set (see below). The plugin API offers:

- **Events.** The core tells the plugin about things that happen in an Organisation (for example, a shift being created). Each event carries the Organisation, and only the data the plugin's capabilities allow.
- **Organisation-scoped data access.** Typed operations on core entities, limited by **capabilities** the plugin declares and the operator approves at install time (for example, "read events" or "read volunteers' display names"). The core runs each operation in a scoped transaction for the Organisation in context.
- **Plugin storage.** A plugin's own Organisation-owned data, stored by the core under the same rules as any other Organisation-owned table (`organisation_id`, forced RLS, the standard policy and the CI check). The plugin reaches it only through the API. How plugins declare and migrate that storage is a follow-up.
- **Core services.** Sending notifications or email through the core, so they're rate-limited, logged and use the instance's settings.
- **Instance configuration.** Read access to the plugin's own instance-level configuration only.

When a person triggers the call, the plugin acts on their behalf. What it can do is the overlap of its approved capabilities and that person's permissions in the Organisation. When the core triggers the call (an event or a scheduled job), the plugin acts as itself, limited by its capabilities.

### How Organisation context reaches a plugin

The core sets the Organisation. The plugin never chooses it.

- **Requests from a person.** The core resolves the Organisation from the route and checks membership, as the tenant isolation record requires. It opens the scoped transaction and then calls the plugin.
- **Events.** The core takes the Organisation from the row that caused the event.
- **Scheduled work.** The core loops over Organisations and calls the plugin once per Organisation, as the tenant isolation record requires for background work. A plugin can't run one job across several Organisations.
- **In-process transport.** The plugin receives a context object already bound to one Organisation, one acting person or none, and the approved capabilities. It has no method to change the Organisation.
- **Out-of-process transport.** Each call from the core includes a short-lived token bound to the plugin, the Organisation, the acting person (if any) and the capabilities. The plugin presents it when it calls back. The core takes the Organisation **only from the token**. It rejects any call without a valid token, and ignores or rejects any Organisation the plugin sends as a parameter.
- **Calls from outside** (for example a payment provider's webhook meant for a plugin). These arrive at a core route that identifies the Organisation, and the core then calls the plugin as above. The exact shape is a follow-up.

### Plugin UI

- First-party (trusted) plugins can add routes and React components in the main app, the same way the core does.
- Third-party (untrusted) plugins must not run their own JavaScript in Pokapu's origin, because it would run with the signed-in person's session across all their Organisations. Their UI comes either from components the core renders from a description the plugin sends, or from a sandboxed frame on a separate origin that talks to the core through the plugin API. Choosing between these is a follow-up, with Design.

### Out of scope

This record sets the trust model only. These are follow-ups for the full plugin architecture, to be recorded separately:

- **Extension point catalogue:** which events, data operations, routes and UI slots exist.
- **Packaging:** what a plugin is on disk or in a registry, and how it declares its capabilities, storage and UI.
- **Distribution:** where plugins are published and found, and whether they're signed.
- **Versioning:** how the plugin API is versioned and how compatibility is checked.
- **Plugin storage and migrations:** how plugin tables are declared, migrated by the owner role and removed.
- **The out-of-process protocol:** transport, request signing, token format, retries, timeouts and failure handling.
- **Plugin UI mechanism:** declarative components or sandboxed frames.
- **Audit:** what plugin activity is logged and who can see it.

## Consequences

- The tenant isolation record's "Architecture" open question is answered: plugins are kept from bypassing isolation by never getting raw database access, and, for untrusted plugins, by a process boundary. RLS stays the safety net for mistakes, not the defence against hostile code.
- Trust is explicit. Operators see a plugin's trust level and capabilities before enabling it. That's honest about risk (Civic Responsibility) and leaves the choice with the people running the instance (Radical Self-reliance).
- First-party plugins and a self-hoster's own code stay cheap to build and run in one process (Leaving No Trace). Self-hosters only run extra containers for the third-party plugins they choose.
- Shared hosted instances can offer third-party plugins without trusting them with every Organisation's data, once the out-of-process transport exists. Until then they're limited to reviewed first-party plugins. That's a real limit on what groups without their own server can use (Radical Inclusion).
- Third-party authors face more work than in-process plugins would need: network calls, tokens, and UI through a constrained mechanism. A typed TypeScript client and a local development setup are needed to keep it approachable (Communal Effort, Participation).
- A plugin still keeps whatever data it's given. Capabilities should be narrow, and operators of shared instances still need to vet plugins and consider network egress rules.
- The plugin API has to be designed so that both transports can implement it. That rules out passing live objects such as query builders or database handles across it, even in-process.
- Organisations can't choose which plugins see their data, because plugins are configured per instance (`../../02-product/decisions/261109-plugin-system.md`). This record doesn't change that.

## Open questions

- **Product:** should Organisations at least be able to see which plugins on their instance can access their data, and with which capabilities? Should a shared instance publish this?
- **Product:** is it acceptable that, until the out-of-process transport exists, shared hosted instances can only offer first-party plugins?
- **Architecture:** the extension point catalogue, packaging, distribution, versioning, plugin storage and migrations, and the out-of-process protocol, as listed under "Out of scope".
- **Architecture and Design:** how third-party plugins provide UI: declarative components rendered by the core, or sandboxed frames on a separate origin.
- **Architecture:** revisit sandboxed in-process WebAssembly components once TypeScript plugins can be built as components with reasonable size, speed and async support. They could lower the operational cost of untrusted plugins.
- **Lead engineer:** how the self-hosting setup runs out-of-process plugins (for example one container per plugin in Docker Compose), keeps them off the database network and away from the core's secrets, and how the trusted-level API is kept free of raw database access in code review and lint rules.
