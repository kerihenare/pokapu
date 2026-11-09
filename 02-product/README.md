# Product

What Pokapu does, who it's for, and the requirements that shape it.

## Decisions

Product decisions are recorded in [`decisions/`](decisions/). Each record explains the context, what was decided, and its consequences. Requirements set here often leave the "how" open for an engineering decision in [`04-engineering/decisions/`](../04-engineering/decisions/).

Accepted so far:

- [Multi-tenancy with Organisations](decisions/261109-multi-tenancy-with-organisations.md): one deployment hosts many Organisations, each with its own isolated data.
- [Plugin system](decisions/261109-plugin-system.md): functionality can be added without changing the core, and plugins are enabled per Organisation.

## Recording a decision

Follow [Recording decisions](../99-system/decisions/261109-recording-decisions.md). Name the file `YYMMDD-slugified-title.md` using the date the decision was made.
