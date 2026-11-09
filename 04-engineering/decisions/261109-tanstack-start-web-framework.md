# TanStack Start as the web framework

- **Date:** 2026-11-09
- **Status:** Accepted

## Context

Pokapu needs a web framework for its user-facing application. It's written in TypeScript on Node.js (`261109-typescript-on-node-js.md`).

The framework must:

- self-host as a single Node.js process or container, with no dependence on a particular commercial host (Decommodification, Radical Self-reliance);
- be well supported and approachable for volunteer contributors;
- handle both server rendering and interactive UI for organisers and volunteers;
- leave room for the plugin architecture, which is still an open decision for the architect (`../../02-product/decisions/261109-plugin-system.md`).

Alternatives considered:

- **React Router v7**: also host-agnostic and Vite-based. It was a close second.
- **Next.js**: the largest community, but its features and documentation lean towards one commercial host.
- **SvelteKit**: lightweight, but a smaller pool of contributors and component libraries.
- **A separate API and SPA**: a clear API boundary, but two things to build and deploy.

## Decision

Pokapu's web application uses **TanStack Start** with **React**.

- Builds use Vite, through TanStack Start's Vite plugin.
- Production builds target a plain Node.js server using Nitro's Node output, run with `node .output/server/index.mjs`. Host-specific adapters are optional and must never be required to run Pokapu.
- Server logic is written as TanStack Start server functions and server routes.

## Consequences

- Routing, URL search params and server function inputs and outputs are type-safe end to end, which suits a strict TypeScript codebase.
- Self-hosting comes down to a Node.js process, which is easy to package as a container. Nitro also allows other hosts without changing application code.
- The Node.js build target must stay supported in CI, so self-hosting can't quietly break.
- TanStack Start is younger and has a smaller community than Next.js. Contributors may find fewer examples, and we should keep framework-specific code at the edges where we can.
- Organisation scoping must be enforced on the server, in server functions, server routes and the data layer, never only in the client. Engineering standards for this still need to be written.
- The plugin architecture must decide how plugins add routes, server functions and UI to a TanStack Start app. That's for the architect to design.
