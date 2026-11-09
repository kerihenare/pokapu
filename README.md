# Pokapu

**Open-source tools for volunteer-run events**

Pokapu is an open-source platform designed to help volunteers organise, coordinate, and deliver events, with a particular focus on Burning Man regional burns.

## Why Pokapu?

Volunteer-run events depend on people working together, often across different teams, locations, and time zones.

Organising these events can be complicated. Information gets scattered, communication becomes fragmented, and volunteers spend valuable time managing processes instead of creating experiences.

Pokapu aims to make that easier.

By providing a shared platform for event organisation, we hope to reduce administrative overhead, improve collaboration, and help volunteers focus on what matters most: bringing their communities together.

## Who is Pokapu for?

Pokapu is being developed for volunteer-led events and the communities behind them.

While our primary focus is Burning Man regional burns, we hope the platform will be useful to other community-driven events and organisations.

## Open Source

We believe the tools that support communities should belong to the communities that use them.

That's why Pokapu is open-source.

We want people to be able to use, understand, improve, and adapt the platform to suit their own needs. By developing openly, we can share knowledge, avoid duplicating effort, and build something that benefits everyone.

## Our Principles

Pokapu is guided by the [10 Principles of Burning Man](https://burningman.org/about/10-principles/).

These principles influence how we develop the platform, work together, and support the communities we serve.

## Getting Involved

Pokapu is a community-driven project, and contributions of all kinds are welcome.

You don't need to be a developer to contribute. We welcome ideas, feedback, documentation, testing, design, and code.

As the project develops, we'll document how to contribute and participate in its direction.

## Project Status

Pokapu is in its early planning stage. There's no application code yet.

So far we've set out why Pokapu exists and the values that guide it, and made the first product decisions:

- **Multi-tenancy:** one deployment of Pokapu can host many Organisations, each with its own isolated data.
- **Plugins:** functionality can be added without changing the core, and plugins are enabled per Pokapu instance, shared by all its Organisations.

Next, we'll make the engineering decisions that follow from these, including the technology stack. Progress is tracked in [GitHub Issues](https://github.com/kerihenare/pokapu/issues).

## Getting Started

There's nothing to install yet. Installation, development environment, and self-hosting instructions will be added once the technology stack has been chosen.

In the meantime, the repository itself is a good place to start. Its numbered directories are the project's living documentation:

| Directory | Contents |
| --- | --- |
| [`01-organisation/`](01-organisation/) | Why Pokapu exists, and its values |
| [`02-product/`](02-product/) | Product decisions and requirements |
| [`03-design/`](03-design/) | Brand, style, wireframes, and design decisions |
| [`04-engineering/`](04-engineering/) | Engineering decisions and source code |
| [`99-system/`](99-system/) | How the repository itself is run |

Every significant decision is recorded in the relevant `decisions/` directory. See [Recording decisions](99-system/decisions/261109-recording-decisions.md).

## Licence

Pokapu is licensed under the [Apache License 2.0](LICENSE.md).
