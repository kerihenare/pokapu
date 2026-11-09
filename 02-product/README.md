# Product

What Pokapu does, who it's for, and the requirements that shape it.

## Decisions

Product decisions are recorded in [`decisions/`](decisions/). Each record explains the context, what was decided, and its consequences. Requirements set here often leave the "how" open for an engineering decision in [`04-engineering/decisions/`](../04-engineering/decisions/).

Accepted so far:

- [Multi-tenancy with Organisations](decisions/261109-multi-tenancy-with-organisations.md): one deployment hosts many Organisations, each with its own isolated data.
- [Plugin system](decisions/261109-plugin-system.md): functionality can be added without changing the core, and plugins are enabled per Pokapu instance, shared by all its Organisations.

## Open decisions

These are drafted as Proposed records, with options and a recommendation, and are waiting to be accepted or changed:

- [First release scope](decisions/261109-first-release-scope.md): the first problem Pokapu solves, and for whom.
- [Personal data and privacy](decisions/261109-personal-data-and-privacy.md): what an Organisation can see of a person's account, and how people control their data.
- [Internationalisation](decisions/261109-internationalisation.md): languages, translation, and locale-aware dates, times and time zones.

Design has no decision records yet. The first release scope will drive the first design work in [`03-design/`](../03-design/).

## Recording a decision

Follow [Recording decisions](../99-system/decisions/261109-recording-decisions.md). Name the file `YYMMDD-slugified-title.md` using the date the decision was made.
