# First release scope

- **Date:** 2026-11-09
- **Status:** Proposed

## Context

Pokapu has a stack, tooling and a tenant isolation model, but no features. Engineering can't build, and design can't start, until we say which problem comes first and for whom. Without that, the first features will be chosen by whatever is easiest to build, not by what volunteers need.

**Who it's for.** We assume the first users are the volunteer coordinators of one regional burn: the people who recruit volunteers, split them into teams and make sure every shift is covered. This is an assumption, not research. We should test it by talking to coordinators from at least one regional burn before the first release is accepted. Volunteers who sign up for shifts are the second group, and they will far outnumber coordinators.

**The problem.** Regional burns run on volunteer shifts: gate, greeters, rangers, sanctuary, build and strike crews, and more. Coordinators typically juggle spreadsheets, forms, group chats and email to find out who is doing what and when. Gaps are found late, often on site. Volunteers can't easily see what's needed, sign up themselves or check their own commitments. This is the administrative overhead the root `README.md` says Pokapu aims to reduce.

**Constraints.** The first release MUST be Organisation-scoped from the start ([Multi-tenancy with Organisations](261109-multi-tenancy-with-organisations.md)). It handles personal data, so it follows [Personal data and privacy](261109-personal-data-and-privacy.md). Its interface follows [Internationalisation](261109-internationalisation.md). It shouldn't depend on the plugin architecture, which isn't designed yet ([Plugin system](261109-plugin-system.md)).

Options considered:

- **Volunteer rostering (teams and shifts).** Coordinators define teams and shifts for an event. Volunteers sign up for shifts. Coordinators see coverage and gaps. This is the most common, most painful and most repeated job at a regional burn, and it's needed every year. It exercises the core model (Organisations, people, membership, roles, events) that every later feature needs. Risk: rostering tools exist, so Pokapu must be simpler or fairer to be worth switching to.
- **Event information hub.** A place for an Organisation to publish event information: dates, location, what to bring, principles, FAQs. Easy to build, but a website or shared document already does this well. It doesn't touch the hard parts of the model (membership, roles, personal data), so it would teach us little and defer the real risks.
- **Team and role directory.** Who leads which team, how to reach them, and who belongs where. Useful, but on its own it's a contact list. Coordinators would still need another tool for the work itself. It's better as part of rostering, since shifts belong to teams.
- **Volunteer intake only.** A sign-up form that collects volunteers' interests and availability. It replaces a form tool, but stops before the part that hurts (matching people to shifts and seeing gaps), and it collects personal data without yet giving volunteers much back.

## Decision

The first release SHOULD focus on **volunteer rostering for a single Organisation's events**: coordinators organise teams and shifts, and volunteers sign up for them. It includes the minimum team directory that rostering needs.

This serves Immediacy (less admin, more time on the real event), Participation (volunteers choose their own shifts instead of being assigned by spreadsheet) and Radical Inclusion (one accessible tool instead of a chain of logins and chats).

### Roles

- **Organisation admin:** manages the Organisation, its events, its teams and who coordinates them.
- **Team coordinator:** manages the shifts and volunteers of the teams they coordinate.
- **Volunteer:** a member of the Organisation who signs up for shifts.

A person MAY hold different roles in different Organisations, and MAY coordinate more than one team.

### In scope

- Creating an Organisation on an instance, and inviting people to it.
- A person joining an Organisation through an invitation, using their instance account ([Authentication and identity](../../04-engineering/decisions/261109-authentication-and-identity.md)).
- Events within an Organisation, each with a name, dates and a time zone. An Organisation can have more than one event, for example this year's and next year's burn.
- Teams within an event, each with a description and one or more coordinators.
- Shifts within a team, each with a start, an end, a description and the number of volunteers needed.
- Volunteers browsing open shifts, signing up and withdrawing, within limits the coordinator sets (for example, a cut-off before the shift starts).
- A volunteer's own view of their upcoming shifts.
- A coordinator's view of coverage: which shifts are full, which have gaps, and who is on each.
- Coordinators adding a volunteer to a shift, or removing one.
- Exporting a team's roster as a printable view and a CSV file, because connectivity on site is often poor.

### Out of scope

- Ticketing, payments and fundraising.
- Messaging, email broadcasts and chat. The release relies on email only where sign-in or invitations need it.
- Automatic shift reminders. This is an open question below.
- Offline or native mobile apps. The web interface MUST work on a phone browser.
- Sensitive personal data, such as emergency contacts and medical or dietary information. See [Personal data and privacy](261109-personal-data-and-privacy.md).
- Skills, qualifications or training records that gate shifts.
- A public event information hub, art grants, camp placement and site maps.
- Anything visible across Organisations, such as shared volunteer pools.
- Plugins and plugin extension points.
- Content translation. Organisations write their own content in their own language.

### Acceptance criteria

- An Organisation admin can create an event with a time zone, add a team, assign a coordinator and invite volunteers, without help from the instance operator.
- A coordinator can create a shift that needs a set number of volunteers, and the coverage view shows it as open until that many have signed up.
- A volunteer can find open shifts for an event, sign up, see the shift in their own list, and withdraw before the cut-off.
- A volunteer can't sign up for a full shift, or for two shifts that overlap.
- Every shift time is shown with an unambiguous date and its event's time zone, including shifts that cross midnight or a daylight saving change.
- A coordinator can export their team's roster as CSV and print it.
- A coordinator of one team can't change another team's shifts unless they coordinate that team too.
- A person who belongs to two Organisations sees each Organisation's events, teams and shifts only within that Organisation, and nothing in one Organisation reveals that they belong to the other. Automated tests prove this, as the [tenant isolation record](../../04-engineering/decisions/261109-tenant-isolation-with-row-level-security.md) requires.
- A volunteer can export, and delete, the data the Organisation holds about them, as set out in [Personal data and privacy](261109-personal-data-and-privacy.md).
- Every flow above passes the automated WCAG 2.2 A/AA checks and works with a keyboard and on a phone-sized screen.

## Consequences

- The first data model covers Organisations, people, membership, roles, events, teams and shifts. Every later feature builds on it, so it needs careful review against the tenant isolation rules.
- Design work in `03-design/` (currently empty) should start here: the volunteer sign-up flow, the coordinator coverage view, wireframes for both, and the first style guide and design system components they need.
- Engineering can turn the acceptance criteria into issues once this record is accepted.
- Leaving messaging, reminders and sensitive data out keeps the release small, but coordinators will still need other tools for those. Some regional burns may not switch until reminders exist.
- Building rostering into the core, not a plugin, sets a precedent: things nearly every regional burn needs belong in the core. Group-specific variations, such as a particular ticketing provider, belong in plugins.
- If the assumption about first users turns out to be wrong, this record should be revisited before engineering starts, not after.

## Open questions

- **Product:** confirm the first users by talking to coordinators from at least one regional burn, and check that rostering is their biggest pain.
- **Product:** should automatic shift reminders (email or calendar files) be in the first release? Volunteers missing shifts is a real cost, but reminders add email delivery to the scope.
- **Product:** can volunteers swap shifts with each other, or only withdraw and sign up again?
- **Product:** how do people join an Organisation: only by invitation, or also through an open sign-up link the Organisation shares?
- **Product and architecture:** what instance operators can do when creating Organisations and supporting them, as raised in the tenant isolation record.
- **Design:** the volunteer sign-up flow and coordinator coverage view, including how time zones and overnight shifts are shown.
- **Lead engineer:** how the printable roster and CSV export are produced, and whether they need any special handling for offline use.
