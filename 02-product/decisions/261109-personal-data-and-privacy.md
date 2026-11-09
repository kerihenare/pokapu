# Personal data and privacy

- **Date:** 2026-11-09
- **Status:** Proposed

## Context

Pokapu holds personal data about volunteers, coordinators and organisers. One instance hosts many Organisations, and a person can belong to several ([Multi-tenancy with Organisations](261109-multi-tenancy-with-organisations.md)). A person's account is instance-level, while anything an Organisation records about them is Organisation-owned ([Tenant isolation](../../04-engineering/decisions/261109-tenant-isolation-with-row-level-security.md)). That record leaves a product question open: what an Organisation can see of a person's instance-level account, such as name, email and pronouns, and how the person controls it. This record answers it. [Authentication and identity](../../04-engineering/decisions/261109-authentication-and-identity.md) builds on it.

Burn communities have their own norms. Many people use a playa name, not their legal name. Some keep their burn life separate from work or family. Regional burns also often ask volunteers for emergency contacts, medical conditions, dietary needs and accessibility needs. Some of that is health data, which most privacy laws treat as especially sensitive.

Pokapu doesn't decide which laws apply. That depends on where an instance is hosted, where its Organisations operate and where their people live. Laws a deployment may fall under include:

- New Zealand's Privacy Act 2020 and its information privacy principles.
- The EU General Data Protection Regulation (GDPR) and the UK GDPR.
- Australia's Privacy Act 1988 and the Australian Privacy Principles.
- US state laws, such as California's Consumer Privacy Act (CCPA, as amended by the CPRA), and similar laws in other states.

This record isn't legal advice. Operators and Organisations remain responsible for their own compliance. What Pokapu can do is make compliance achievable, for a volunteer group self-hosting a single Organisation and for a hosted instance with many, by building in the capabilities these laws commonly expect: collecting only what's needed, saying why, letting people see, export, correct and delete their data, and not keeping it forever.

Options considered for what an Organisation sees of a person:

- **One shared profile.** The account holds a full profile (name, email, pronouns, phone and so on), and every Organisation the person joins sees all of it. Simple, and people fill in details once. But it shares more than each Organisation needs, and a change made for one Organisation silently reaches the others.
- **Per-Organisation profiles only.** The account holds only what's needed to sign in. Each Organisation's profile is filled in from scratch on joining. This gives the strongest separation, but it's repetitive, and the sign-in email still has to be handled somehow.
- **Minimal account with per-Organisation sharing.** The account holds sign-in details and optional defaults. When joining an Organisation, the person chooses what to share with it, starting from those defaults. What they share becomes that Organisation's copy, which they can change or withdraw later.

## Decision

Pokapu SHOULD use a **minimal instance account with per-Organisation sharing**. A person decides what each Organisation sees, and an Organisation sees nothing from the account that the person didn't choose to share with it.

This follows Radical Inclusion (people take part on their own terms, including under a playa name), Radical Self-expression (people present themselves differently in different communities), Civic Responsibility (respect for applicable laws), Decommodification (personal data is never a product) and Leaving No Trace (data isn't kept once it's no longer needed).

### The instance account

- The account MUST hold only what's needed to sign in and run the account, plus any defaults the person chooses to save for reuse.
- The sign-in identifier, such as an email address, MUST NOT be shown to any Organisation unless the person chooses to share it.
- An Organisation MUST NOT be able to tell which other Organisations a person belongs to, or that they have an account on the instance before they join.

### What an Organisation sees

- On joining, the person MUST be shown what the Organisation will see and why, and choose what to share. Saved defaults MAY pre-fill these choices.
- The **name** is the name the person wants to be known by in that Organisation. It's a single free-text field. A legal name MUST NOT be required unless the Organisation states a specific reason, and that's out of scope for the first release.
- A **contact method** the Organisation can use to reach the person, such as an email address. The person MAY use a different one from their sign-in email.
- **Pronouns** are optional and free text.
- Shared details become Organisation-owned data. A person MUST be able to change them for one Organisation without changing them for others.
- Within an Organisation, coordinators and admins see what their role needs. Volunteers SHOULD NOT see each other's contact details by default.

### Data minimisation

- Each field an Organisation asks for MUST have a stated purpose shown to the person.
- Fields beyond the minimum MUST be optional unless the Organisation marks them required and states why.
- Pokapu MUST NOT include third-party advertising, tracking or analytics by default. Pokapu, the project, MUST NOT collect personal data from instances.

### Sensitive data

Emergency contacts, medical conditions, dietary needs and accessibility needs are out of scope for the first release ([First release scope](261109-first-release-scope.md)). When they're added, they MUST follow these rules:

- The person gives separate, explicit consent for each kind of sensitive data, and can withdraw it.
- Each sensitive field states its purpose, and who will see it.
- Only roles the Organisation names for that purpose (for example, a safety or medical lead) can see it. Ordinary coordinators can't.
- Access to sensitive data is recorded, so an Organisation can tell who viewed it and when.
- Sensitive data is deleted automatically soon after the event it was collected for, unless the person chooses to keep it for reuse.
- Emergency contacts are other people's personal data. The person MUST be told this, and those contacts are used only for emergencies.

### Export

- A person MUST be able to export all personal data held about them, in a common machine-readable format: their account, and what each Organisation holds about them. That includes their profile, memberships, roles, shifts and any notes coordinators have recorded about them.
- A person MUST be able to export one Organisation's data about them, or everything at once.
- An Organisation MUST be able to export all of its own data, for its records or to move to another instance.

### Deletion

- A person MUST be able to leave an Organisation. Their personal data in that Organisation is then deleted or anonymised, after any retention period the Organisation has set.
- A person MUST be able to delete their whole account. This removes the account and leaves every Organisation they belong to.
- Records an Organisation needs for planning, such as how many people worked a shift, MAY remain, but anonymised so they no longer identify the person.
- An Organisation MUST be able to delete a person's data on request, so it can meet requests made to it directly.

### Retention

- An Organisation MUST be able to set how long event-related personal data is kept after an event ends. Pokapu MUST ship a sensible default.
- Personal data MUST NOT be kept indefinitely by default. Sensitive data has a shorter default than other data.
- Deletion after the retention period MUST happen automatically, without an admin having to remember.

### Notices and responsibility

- An instance operator MUST be able to publish a privacy notice and a contact for privacy requests.
- An Organisation MUST be able to show its own privacy notice when people join it.
- Each Organisation decides what it collects about its people and why. The instance operator runs the platform it's stored on. Pokapu SHOULD document this split plainly, so operators and Organisations can describe it in their own notices, but it doesn't decide how any particular law classifies them.
- Plugins MUST follow these rules for any personal data they handle. How that's enforced belongs to the plugin architecture.

## Consequences

- The instance-level account stays small. Profile data shared with an Organisation is Organisation-owned and protected by row-level security, which simplifies isolation.
- A person who belongs to several Organisations may enter or confirm details more than once. Saved defaults reduce this, at the cost of a slightly longer joining flow.
- Coordinators can't assume they can see everything about volunteers, which may surprise people used to spreadsheets. Clear wording in the interface matters.
- Notes coordinators write about volunteers are included in exports, so coordinators should write them knowing the volunteer may read them.
- Export, deletion, anonymisation and automatic retention need engineering work in the first release. Leaving them for later would mean retrofitting them across every table.
- Self-hosters and hosted instances get the same capabilities. Neither has to build privacy tooling themselves, which supports Radical Self-reliance.
- Pokapu can't make any deployment compliant on its own. Operators and Organisations still need to understand and meet their own obligations.

## Open questions

- **Product:** the default retention periods for ordinary and sensitive data after an event ends.
- **Product:** whether a person can be added by a coordinator before they have an account (for example, from an existing spreadsheet), and how their consent is then obtained.
- **Product:** how Pokapu handles people under 18, if regional burns using it allow minors to volunteer.
- **Product:** what an Organisation may keep after a person leaves, such as safety incident records, and for how long.
- **Product and architecture:** what instance operators can see of personal data when supporting an Organisation, and how that access is recorded. This joins the tenant isolation record's open question on operator powers.
- **Architecture:** how anonymisation and automatic deletion work with the tenant isolation model, and how plugins are held to these rules.
- **Design:** the joining flow, including how sharing choices and purposes are explained in plain language.
- **Lead engineer:** the export format, and how deletion reaches backups.
