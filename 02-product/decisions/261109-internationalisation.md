# Internationalisation

- **Date:** 2026-11-09
- **Status:** Proposed

## Context

Regional burns happen around the world, and the people who volunteer at them speak many languages. Pokapu began in Aotearoa New Zealand. The placeholder app greets people with "Kia ora", but that's a placeholder, not a language decision. Using a few Māori words in an English interface isn't the same as offering the interface in te reo Māori.

Events also cross time zones. Volunteers travel in, coordinators plan from other cities, and some teams meet online before the event. A shift time that's read in the wrong time zone means an empty gate at 3am. Shift times must be unambiguous.

Making an interface translatable is cheap at the start and expensive later, because every hard-coded string, date format and left-to-right layout assumption has to be found and fixed. This is the same reasoning that made multi-tenancy a day-one requirement ([Multi-tenancy with Organisations](261109-multi-tenancy-with-organisations.md)).

Options considered:

- **English only, translate later.** Fastest to start. But retrofitting is slow and error-prone, and it signals that people who don't read English come second, which works against Radical Inclusion.
- **Translatable from the first release, shipped in English.** Every interface string can be translated, and dates, times and numbers follow the reader's locale. Only English ships at first. Other languages arrive as volunteers contribute them.
- **Translatable, shipped in English and te reo Māori.** As above, with te reo Māori as a release requirement. This honours Pokapu's roots, but a good translation needs fluent speakers and care with tikanga. Making it a release blocker would tie the release to people we haven't yet found, and a rushed or machine translation would be disrespectful.
- **Several languages at launch.** Broadest reach, but there's nobody yet to write or maintain the translations, and every interface change would need updating in each language before release.

## Decision

Pokapu's interface MUST be translatable from the first release. It SHOULD ship in English, with te reo Māori as the first additional language we actively seek, but not as a release requirement.

This supports Radical Inclusion (people use Pokapu in their own language), Participation and Communal Effort (anyone fluent can help translate), Gifting (translators' work is credited and shared) and Immediacy (no misread shift times).

### Interface translation

- Every piece of interface text MUST be translatable, including error messages, emails Pokapu sends, accessible labels and exports' column headings.
- Text MUST handle plurals and word order correctly in each language. Sentences MUST NOT be built by joining fragments.
- The source language is English, using the British/NZ spelling of Pokapu's documentation.
- Each person chooses their interface language. An Organisation MAY set a default for its members, and an instance MAY set one for itself.
- Missing translations MUST fall back to English, not show blank or broken text.
- The page language MUST be marked correctly, so screen readers pronounce text properly.

### Content written by Organisations

- Content an Organisation writes, such as event, team and shift descriptions, appears as written. Translating it is out of scope.
- Names are free text in any script, as set out in [Personal data and privacy](261109-personal-data-and-privacy.md). Pokapu MUST NOT assume a first name and last name.
- Lists of people and things SHOULD sort in a way that suits the reader's language.

### Te reo Māori

- Te reo Māori SHOULD be the first language added after English, if fluent speakers want to contribute.
- It MUST be translated or reviewed by fluent speakers, not machine translation alone.
- Pokapu SHOULD seek guidance from Māori on how this is done, including terminology, before announcing the language.
- Until a full translation exists, Pokapu MUST NOT describe itself as available in te reo Māori.

### Translation contributions

- People MUST be able to contribute translations without writing code or using git.
- Each language SHOULD have a reviewer who is fluent, so a second person checks translations before release.
- Pokapu SHOULD keep a shared list of key terms (for example Organisation, shift and coordinator) with notes for translators, so terms stay consistent.
- Translations are released under Pokapu's licence, Apache 2.0. Translators MUST be credited.
- A language is offered to people only once it's complete enough to use. The threshold is an open question.
- Plugins MUST be translatable in the same way as the core.

### Dates, times and time zones

- Every event MUST have a time zone. Shift times are shown in the event's time zone, with the zone clearly labelled.
- If a person's device is in a different time zone from the event, Pokapu MUST make this clear, for example by also showing the time in their own zone. A shift's actual time MUST NOT change depending on where it's viewed.
- Dates MUST be unambiguous. Pokapu MUST NOT use number-only formats like 03/04 that mean different dates in different countries.
- Shifts that cross midnight MUST show both dates. Shifts that cross a daylight saving change MUST show the correct start, end and length.
- Time format (12-hour or 24-hour), first day of the week and number format follow the person's locale.
- Calendar files and exports MUST include the time zone, so times stay correct when imported elsewhere.

### Right-to-left languages

- No right-to-left language ships in the first release. But layouts and design system components MUST work correctly in right-to-left languages such as Arabic and Hebrew, so one can be added without redesign.
- Text in different scripts, including mixed left-to-right and right-to-left text, MUST display correctly in names and content.

The i18n library, message format, translation platform and how all of this is built are engineering decisions for `04-engineering/decisions/`.

## Consequences

- Engineers write every string through the translation mechanism from the start. It's a little slower per feature, but avoids a large retrofit.
- Design must allow for text that's longer or shorter than English, and for right-to-left layouts. That affects the style guide and design system from day one.
- Testing needs to cover more than English, for example with a fake test language that shows untranslated text and stretched layouts. The testing approach belongs to the lead engineer.
- Translation becomes a way to contribute that doesn't need coding, which widens who can take part.
- Every interface change can leave translations out of date. Fallback to English keeps Pokapu usable meanwhile.
- Showing times in two zones adds some visual complexity. Design needs to keep it clear.
- Te reo Māori depends on finding fluent contributors and doing it well, so it may not arrive quickly. That's a better outcome than a poor translation.

## Open questions

- **Product:** how Pokapu approaches te reo Māori respectfully, including whom to ask for guidance and how to work with fluent speakers.
- **Product:** how complete a translation must be before people can choose it.
- **Product:** whether an Organisation can change interface terms for its own members (for example "roster slot" instead of "shift"), and how that works with translations.
- **Design:** how shift times are shown when a person's time zone differs from the event's, and how overnight shifts are shown.
- **Design:** how the style guide and design system handle longer text, right-to-left layouts and different scripts.
- **Lead engineer:** the i18n library, message format, locale data source and translation platform.
- **Lead engineer:** how untranslated strings and right-to-left layouts are tested.
- **Architecture:** how plugins ship and load their translations.
