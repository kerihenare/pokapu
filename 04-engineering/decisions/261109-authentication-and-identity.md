# Authentication and identity

- **Date:** 2026-11-09
- **Status:** Proposed

## Context

Every Organisation-scoped request starts with knowing who the person is. The tenant isolation record depends on it: the Organisation for a request comes from the route plus a check that the current person is a member (`261109-tenant-isolation-with-row-level-security.md`). Nothing records how people sign in yet.

What's already decided:

- A person's **account** (identity and sign-in) is **instance-level**. It has no `organisation_id` and lives in instance-level tables, reached only through the small, reviewed module for instance-level operations.
- A person's **membership** of an Organisation, and anything an Organisation records about them, is **Organisation-owned** and covered by RLS.
- A person may belong to several Organisations (`../../02-product/decisions/261109-multi-tenancy-with-organisations.md`). One account works across all of them.
- The stack is TanStack Start on Node.js, with Drizzle and PostgreSQL (`261109-tanstack-start-web-framework.md`, `261109-drizzle-orm-and-sql-migrations.md`).
- Plugins never get people's sessions or sign-in data (`261109-plugin-trust-model.md`, Proposed).

What an account holds, and what Organisations see of it, is a product question being drafted in parallel in [`../../02-product/decisions/261109-personal-data-and-privacy.md`](../../02-product/decisions/261109-personal-data-and-privacy.md). This record depends on it in places, listed under Consequences.

The people signing in matter most:

- Volunteers are often non-technical. Many only use a phone. Some share devices at a volunteer desk.
- Connectivity at event sites is poor. Email can arrive minutes late, and many people may share one internet connection, so they appear as one IP address.
- Signing in must not need a particular app, a commercial account or a smartphone (Radical Inclusion, Decommodification).
- A volunteer group must be able to run sign-in without another service to host (Radical Self-reliance, Leaving No Trace).

Options considered for **sign-in methods**:

- **Email one-time code and magic link.** One email holds both a short code and a link. No password to forget. The code still works when the link opens in a different browser, which is common when phone email apps use their own browser, or when the email is read on another device. It needs working email delivery, which every instance must configure. It's only as secure as the person's email account.
- **Passwords.** Familiar, and they work without email. But people reuse them, so a breach elsewhere becomes a breach here, and they need hashing, breach checks and a reset flow, which needs email anyway. They add support work for volunteers.
- **Passkeys (WebAuthn).** Phishing-resistant and quick on phones, with no email round trip. Support is good on current phones and browsers, but not universal, and people lose devices. They work best as an addition, not the only method.
- **OIDC and social login.** Convenient for people who already use Google, Apple or similar. A generic OIDC client also lets a self-hoster use their own identity provider. Making a commercial provider required would conflict with Decommodification.
- **An Organisation's own single sign-on.** Lets an Organisation control its people's sign-in. But accounts are instance-level and one account spans several Organisations. Which Organisation's identity provider would govern an account in three Organisations isn't clear. Few regional burns run their own identity provider.

Options considered for **who builds it**:

- **A hosted identity service** (for example Auth0, Clerk or WorkOS). Little code, but every instance would depend on a commercial provider and send people's data to it. That conflicts with Decommodification and Radical Self-reliance.
- **A self-hosted identity provider** (for example Keycloak, Authentik, Zitadel or Ory Kratos). Mature and full-featured, but it's another service, often with its own database, for every self-hoster to run, secure and upgrade. That's heavy for a small group (Leaving No Trace).
- **An authentication library inside the app, storing data in Pokapu's PostgreSQL.** Realistic options for this stack include Better Auth (a TypeScript framework with a Drizzle adapter and plugins for email codes, passkeys and OIDC), Auth.js (whose maintenance passed to the Better Auth team in 2025), or composing smaller, focused libraries such as SimpleWebAuthn for passkeys and `openid-client` or Arctic for OIDC with session code following the Lucia guide (Lucia itself was deprecated as a library in 2025). These need checking for current maturity before choosing.
- **Building everything in-house.** Full control, but cryptographic and protocol details (WebAuthn, OIDC, token handling) are easy to get wrong.

Options considered for **sessions**:

- **Server-side sessions in PostgreSQL.** An opaque random token in a cookie, and a session row on the server. One indexed lookup per request. A session can be revoked at once, for example when a volunteer loses their phone at an event.
- **JSON Web Tokens (JWTs).** No database lookup, but they can't be revoked before they expire without adding a server-side list, which brings the lookup back. Any membership or Organisation in their claims goes stale. They're a common source of mistakes.

## Decision

We recommend **passwordless sign-in by email, with passkeys as an option, built from a library that runs inside Pokapu and stores everything in Pokapu's PostgreSQL, with server-side sessions.** The **lead engineer chooses the library**, within the constraints below.

### Sign-in methods

- **Email one-time code and magic link** is the method every instance supports. Each sign-in email contains both. Signing up and signing in are the same flow, so the response never reveals whether an account exists.
- **Passkeys** are optional and encouraged. A person can add one after signing in by email, and then sign in without waiting for email.
- **Generic OIDC** is optional and configured per instance by the operator, so a self-hoster can use an identity provider they already run. Social login (for example Google or Apple) is the same mechanism and also optional. Pokapu never requires a commercial provider.
- **Passwords** aren't offered at first. Adding them later is an amendment to this record.
- **An Organisation's own single sign-on** isn't supported for now. If it's needed, it needs a product decision on how it applies to an account that belongs to several Organisations.
- Accounts are identified by a verified email address. Linking an OIDC identity to an existing account requires the person to be signed in, or the provider to confirm the same verified email.

### Library constraints

The lead engineer picks the library or set of libraries and records it in `04-engineering/decisions/`. Whatever is chosen must:

- run inside the Pokapu server, with no extra service to host;
- store its data in Pokapu's PostgreSQL, through Drizzle, with committed SQL migrations;
- keep its tables instance-level and inside the instance-level module;
- not own the Organisation or membership model. If it has an "organisations" feature, Pokapu doesn't use it, because memberships are Organisation-owned and covered by RLS;
- support email codes and links, passkeys and generic OIDC;
- let Pokapu apply its own rate limits and session rules;
- have a licence compatible with Apache 2.0.

### Sessions

- Sessions are **server-side, in PostgreSQL**. The cookie holds an opaque random token. The server stores only a hash of it. The cookie is `HttpOnly`, `Secure` and `SameSite=Lax`. JWTs aren't used for browser sessions.
- Sessions last a long time with a sliding expiry, so volunteers can sign in before an event and stay signed in on site without needing email. They also have an absolute expiry. The exact lengths are for the lead engineer, with Product.
- A person can see their sessions and sign out of any of them. Signing out ends the session on the server.
- The session identifies the person only. **It doesn't store an active Organisation.**

### Choosing the active Organisation per request

The Organisation comes from the route (for example a slug in the URL), not from the session or a value the client sends to a query. That lets someone have different Organisations open in different tabs. For every Organisation-scoped request:

1. The server checks the session cookie and finds the person. No valid session means no Organisation data.
2. The server looks up the Organisation from the route, through the instance-level module.
3. In a single transaction, the server sets `app.person_id` to the person, transaction-local, and checks that a membership exists for that person in that Organisation.
4. Only if the membership exists does it set `app.organisation_id`, transaction-local, and run the request in that scoped transaction.
5. If there's no membership, the request fails closed, with a response that doesn't reveal whether the Organisation exists.

Step 3 needs the membership row to be readable before the Organisation is set. We propose a second, **select-only** RLS policy on the memberships table that lets a person see their own membership rows (`person_id` matches `app.person_id`) in every Organisation. It exposes only membership rows, not other Organisation data, and it also supports "list my Organisations". Policies in PostgreSQL combine with OR, so the standard Organisation policy still covers everything else. **This is an exception to the tenant isolation record's "one standard policy per table" rule.** If accepted, that record should be amended to name it, and the CI check should allow it only on the memberships table.

What a member may do once inside an Organisation (roles and permissions) is a separate authorisation decision.

### Account recovery

- Email is the recovery method. Losing a passkey means signing in by email and adding a new one.
- Changing an account's email needs a code sent to the new address, and a notice sent to the old one.
- An Organisation's admins can't change a person's email or sign-in methods. The account is instance-level and may be used in other Organisations, so letting one Organisation change it would let it take over the person's access to the others.
- Recovery for someone who has lost access to their email needs an audited path for the instance operator. That belongs with the instance operator powers still open in the tenant isolation record.

### Rate limiting and abuse

- Codes and links are short-lived (minutes, not hours), single-use, stored hashed, and allow only a few wrong attempts. They stay valid long enough for slow email at event sites.
- Limits apply per email address, per account and per IP address, on both requesting and checking codes. Per-IP limits must be generous, because a whole event site may share one connection. Per-address limits do most of the work, and also stop someone flooding a person's inbox.
- Rate-limit state lives in PostgreSQL. No extra store (such as Redis) is required.
- No third-party CAPTCHA by default. They track people, often fail accessibility and depend on a commercial provider. If one is ever needed, it needs a design decision.
- Sign-in events (success, failure, new device) are logged for the person and the operator. What's kept, and for how long, depends on the personal data record.

### Startup check

- When Pokapu starts, it checks the role it's connected as, using `pg_roles` for `current_user`. It **refuses to start** if the role is a superuser, has `BYPASSRLS`, owns any application table, or can switch (`SET ROLE`) to a role that does. The error message explains how to set up the two roles.
- The same check runs in the test suite against the CI database setup, so it can't quietly stop working.
- This is the check the tenant isolation record asks for. It lives with authentication because it's part of how the application identifies itself to the database.

## Consequences

- Volunteers sign in with only an email address, on any device, with no password or app (Radical Inclusion, Immediacy). Long sessions and passkeys reduce how often poor connectivity gets in the way.
- Every instance needs working outbound email. Self-hosters must configure it, and the setup documentation must make that easy. Without it, nobody can sign in except by OIDC or an existing passkey.
- Sign-in is only as secure as people's email accounts. Passkeys give people a stronger option, and Product may later require them for some roles.
- No extra service is needed for sign-in, and no commercial provider is required (Radical Self-reliance, Decommodification, Leaving No Trace).
- The session lookup and the membership check add a little database work to each request. That's a fair cost for immediate revocation and fail-closed Organisation context.
- The memberships table gets a second RLS policy, which amends the tenant isolation record's rule if accepted.
- Without passwords, people without email access can't sign in at all. Product needs to decide whether that's acceptable.

### Dependencies on the personal data record

This record depends on [`../../02-product/decisions/261109-personal-data-and-privacy.md`](../../02-product/decisions/261109-personal-data-and-privacy.md) for:

- which fields the instance-level account holds beyond a verified email (for example name or pronouns), and which live per Organisation;
- whether Organisations see a member's email address;
- whether profile data from OIDC or social login is imported, and which;
- how long sessions, sign-in logs and IP addresses are kept;
- what deleting an account does to the person's memberships and the records Organisations hold about them;
- how a person an Organisation recorded before they had an account (for example by email) is linked to their account, and with what consent.

## Open questions

- **Product:** are passwordless email and optional passkeys enough, or do some volunteers need passwords, phone numbers or something else because they lack reliable email?
- **Product:** can anyone create an account on an instance, or only by invitation from an Organisation? Is this an instance setting?
- **Product and architecture:** who can recover an account whose email is lost, and how is that audited? This joins the instance operator powers question in the tenant isolation record.
- **Product:** should some roles (for example Organisation admins) be required to use a passkey?
- **Product:** is an Organisation's own single sign-on ever needed, and how would it apply to an account in several Organisations?
- **Lead engineer:** the library choice, session lengths, cookie and CSRF details, and rate-limit values, recorded as an engineering decision.
- **Architecture:** amend the tenant isolation record for the memberships policy exception, once this record is accepted.
- **Architecture:** roles and permissions inside an Organisation, as a separate authorisation record.
- **Design:** the sign-in flow on phones with slow email, shared devices at volunteer desks (including signing out), and how passkeys are offered without confusing people.
