# Plan 01 — Visual design pass on everything except the globe

> Execution plan for one autonomous Claude session. Read `docs/plans/README.md`
> first for the shared conventions (branch, harness, loop, guardrails) — this
> file only adds what is specific to this workstream.

## Mission

Raise the visual quality and consistency of every non-globe surface —
navigation, countries, country detail, program detail pages, saved, submit,
story — while keeping 0rbital's existing identity: black "terminal" palette,
Space Grotesk display type, pill-shaped controls, sharp 3px panels, mono
chrome accents. This is a refinement pass, not a rebrand.

**Do not touch the globe** (`src/islands/GlobeView.tsx`, `src/pages/index.astro`,
`src/lib/asciiGlobe.ts`, `src/lib/globeJitter.ts`) and **do not restructure the
explore page** (`src/pages/explore.astro`, `FilterSidebar.tsx`,
`ExploreResults.tsx`, `ProgramCard.tsx`, `CheckboxDropdown.tsx`) — a separate
session owns explore (Plan 02). You may read those files to keep the shared
visual language coherent, but changes to them belong to Plan 02.

## Design tokens & building blocks (current state)

- Tokens live in `src/styles/global.css` under `@theme` (Tailwind v4):
  `--color-bg0/panel/line/line2/text/muted/a1/a2`, `--font-display/sans/mono`,
  radius locked to 3px for surfaces + `--radius-pill` for controls.
- Status colors are the lone functional color exception (`src/lib/status.ts`):
  green open, purple coming-soon, pink running, gray closed.
- Shared chrome: `SiteNav.tsx` (one header across all views), `Base.astro`
  layout, `OrbitalLogo`, `StatusBadge.tsx`.
- There is **no site footer** — Plan 03 (newsletter) introduces one; if you
  run before Plan 03, leave footer creation to it.

## Survey findings to address (from screenshots, 2026-07-12)

1. **Countries index** (`/countries`, `countries.astro`): text-heavy cards with
   mid-sentence `…` truncation; "Business source" secondary button has near-zero
   visual value next to "View country"; card internals (flag, count, bullets,
   buttons) lack rhythm.
2. **Country detail** (`/country/[slug]`): decent structure (Start here cards,
   city chips, program rows) but program rows are visually flat — no status
   context, no hover affordance; "Back to the globe" reads as the only exit.
3. **Program detail pages** (`/programs/[slug]`): good bones (quick facts grid,
   needs-verification panel, notes, sources) but weak hierarchy: sources are
   raw URLs, the empty logo circle wastes the hero, section headings all same
   weight, no visual separation rhythm between sections.
4. **Saved** (`/saved`): serviceable; empty state is decent copy-wise but
   visually bare (one lonely dot); the tracker stages (Interested → Applied →
   Decision) deserve clearer visual presence when populated.
5. **Submit** (`/submit`): long undifferentiated field list; group into
   fieldsets (Identity / Location / Practical tradeoffs / Sources), make
   optionality obvious, and make the "opens a prefilled GitHub issue" flow
   legible before the user hits submit.
6. **Story** (`/story`): strongest page visually (hero + dashed separators);
   use it as the reference rhythm for the rest.
7. **Nav** (`SiteNav.tsx`): right-side links are small; the saved bookmark icon
   is unlabeled; active-state treatment inconsistent between icon toggles and
   text links.
8. **Cross-cutting**: empty logo circles appear wherever a program logo is
   missing (use a deterministic monogram/glyph fallback instead); focus states
   exist but are inconsistent; heading sizes jump between pages
   (24px explore vs larger story hero) without a scale.

## Goals (measurable)

- G1. A documented type + spacing scale (extend the `@theme` block; comment it)
  applied consistently: every page's h1/h2/body/label sizes come from the scale.
- G2. Every survey finding above addressed or explicitly deferred with a reason,
  recorded in the PR description.
- G3. Logo fallback: no empty gray circles anywhere; deterministic monogram
  (program initial on a subtle ring) when no logo file exists.
- G4. Keyboard/focus: visible focus ring on every interactive element,
  consistent style, verified by tabbing through each page.
- G5. Mobile (390px): no horizontal scroll on any page; tap targets ≥ 40px;
  verified via mobile snaps.
- G6. All existing tests green, `npx astro check` clean, build passes.

## Non-goals

- No rebrand, no light mode, no new fonts, no component library.
- No copy rewrites beyond what a visual change requires.
- No changes to data, API endpoints, llms.txt, or URL grammar.
- No explore/globe changes (other sessions own those).

## Suggested order of work

1. Tokens first: extend `@theme` with the type scale + spacing decisions.
2. Shared chrome: SiteNav polish, StatusBadge, logo-fallback component.
3. Program detail pages (highest traffic after explore).
4. Countries index + country detail.
5. Submit form grouping.
6. Saved (incl. populated tracker state — save a few programs in the browser
   via the bookmark buttons to see it).
7. Final consistency sweep across all snaps.

## Harness (this plan's specifics)

- Snap loop: `node scripts/snap.mjs` covers all relevant routes by default.
  For the populated saved state, drive it with Playwright (click bookmark
  buttons on /explore, then snap /saved).
- Relevant tests: `tests/ui.test.ts`, `tests/routes.test.ts`,
  `tests/scopeCopy.test.ts` are the ones your changes could break.
- Reference screenshots: run the snap loop once on your branch **before any
  change** and keep the folder (`OUT=.snap-before node scripts/snap.mjs`) so
  the PR can show before/after honestly.

## The loop

Work in slices of one page or one shared component. Per slice:

1. Change → snap affected routes (both widths) → **look at the images**.
2. Self-critique against the goals: rhythm, hierarchy, consistency with the
   story page's language, focus states, mobile fit.
3. Iterate until the slice passes, then `npm test && npx astro check`.
4. Commit with a message naming the slice ("countries: card rhythm + CTA
   hierarchy"). Push at least once per completed slice.
5. Every ~3 slices, re-snap **all** routes to catch cross-page drift.

Stop when goals G1–G6 all pass, or after any slice if remaining findings are
genuinely better deferred — record deferrals in the PR description.

## Acceptance checklist (copy into PR description and tick)

- [ ] Type/spacing scale documented in `global.css` and used on every page
- [ ] Program pages: hierarchy pass (hero, quick facts, sources as titled links)
- [ ] Countries: card rhythm, truncation fixed, CTA hierarchy
- [ ] Country detail: program rows carry status + hover affordance
- [ ] Submit: grouped fieldsets, optionality legible, GitHub-issue flow explained
- [ ] Saved: empty + populated states both designed
- [ ] Nav: labeled saved link, consistent active states, ≥40px touch targets
- [ ] Logo monogram fallback everywhere a logo can be missing
- [ ] Focus ring audit passed (tab through every page)
- [ ] Mobile 390px: no horizontal scroll anywhere
- [ ] `npm test`, `npx astro check`, `npm run build` all green
- [ ] Before/after screenshots for each changed page in the PR

## Kickoff prompt (paste into a fresh session on jcobrew/orbital)

```
Read docs/plans/README.md and docs/plans/01-visual-design-system.md, then
execute Plan 01 end to end on branch claude/plan-01-visual-design. Work
autonomously through the plan's loop: snap screenshots before starting, then
slice by slice (tokens → shared chrome → program pages → countries → submit →
saved), verifying each slice visually at both widths and with the test suite
before committing. Never touch the globe or the explore-page components listed
as out of scope. When the acceptance checklist passes, push, open a draft PR
titled "Visual design pass: non-globe surfaces (Plan 01)" with before/after
screenshots per page and any deferrals listed, and report back with the PR
link and a summary of what changed visually.
```
