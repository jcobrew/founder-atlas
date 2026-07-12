# Plan 02 — Explore & filter experience

> Execution plan for one autonomous Claude session. Read `docs/plans/README.md`
> first for the shared conventions (branch, harness, loop, guardrails) — this
> file only adds what is specific to this workstream.

## Mission

Make `/explore` the best founder-program discovery surface on the web: fast to
scan, obvious to filter, great on a phone, and shareable at every state. The
explore page is the main product surface after the globe — treat it like one.

## Files you own

- `src/pages/explore.astro`
- `src/components/FilterSidebar.tsx` (misnamed — it renders the top filter row
  in `variant="dashboard"` mode; also used by `/dashboard`, keep both working)
- `src/components/ExploreResults.tsx`
- `src/components/ProgramCard.tsx`
- `src/components/CheckboxDropdown.tsx`
- `src/components/ProgramDetailDrawer.tsx` (opened from cards via View details)
- `src/stores/filters.ts`, `src/lib/filter.ts` (behavior contract below)

Do **not** touch the globe files or the pages owned by Plan 01 (countries,
saved, submit, story, program pages, SiteNav, global tokens). If a change you
want requires a shared-file edit (e.g. `global.css`), keep it additive and
minimal, and flag it in the PR description for merge-order attention.

## Behavior contract (must keep working)

- URL grammar is public API, documented in llms.txt and README:
  `?q=<text>&model=<co-living|co-working|both>&country=<country>&status=<status>&sort=<field>&dir=-1`.
  Filters must keep initializing from the URL (`initFiltersFromURL`) and
  writing back to it (Copy link must reproduce state). Extend the grammar if
  you add filters; never break existing params — `tests/routes.test.ts` and
  `tests/exports.test.ts` guard some of this.
- `/dashboard` reuses `FilterSidebar`; it must remain functional (snap it
  after every FilterSidebar change).
- Saved/bookmark buttons, Apply/Visit CTAs, and the detail drawer must keep
  their current behaviors (tracker integration in `src/lib/tracker.ts`).

## Survey findings to address (from screenshots, 2026-07-12)

1. **One undifferentiated toolbar**: real filters (Sector, Country, Workspace,
   Funding), status chips, and power-user tools (Copy link, Export, API,
   Agents) all sit in one row with equal weight. Filtering should be primary;
   tools belong in a quieter cluster.
2. **No active-filter feedback**: applied filters are invisible outside the
   dropdowns — no removable chips, no "clear all", result count is a whisper
   ("39 of 39 programs").
3. **No user-facing sort** on explore (sort exists in the URL grammar and
   dashboard table headers only).
4. **Cards**: blank logo circles (dead weight); location truncated
   mid-word ("San Franc…"); tag chips (stage/housing/funding) compete with
   status pill; CTA inconsistency (Apply vs Visit) is data-driven but visually
   unexplained; no keyboard focus ring on the card itself.
5. **Mobile**: the filter stack pushes the first card below the fold; no
   sticky access to search/filters while scrolling; status chips wrap awkwardly.
6. **Empty state**: filtering to zero results shows nothing helpful — needs a
   "no matches, loosen X / clear all" state.
7. **Missing discovery affordances** (pick judiciously, don't kitchen-sink):
   result grouping or sort by application deadline/urgency
   (`src/lib/applyUrgency.ts` already computes urgency), "open now" quick
   toggle, count badges inside dropdowns (exists — keep).

## Goals (measurable)

- G1. Filter state is always visible: removable active-filter chips + clear-all
  + prominent result count; Copy link reproduces any state exactly.
- G2. Mobile: first program card visible without scrolling on a 390×844
  viewport (collapsed/sheet filters); search reachable in one tap from any
  scroll position.
- G3. Sort control on explore (at minimum: default relevance, urgency/deadline,
  recently verified, name) wired to the existing `sort`/`dir` URL params.
- G4. Zero-result state designed with actionable recovery.
- G5. Card redesign: no empty logo circles, no mid-word truncation, clear
  primary CTA, visible focus states, status pill remains the strongest signal.
- G6. Tools (Export, API, Agents, Copy link) visually demoted but discoverable.
- G7. `/dashboard` still fully functional; all tests green; build + astro
  check clean.

## Non-goals

- No new data fields (work with what `Program` already has).
- No pagination/virtualization unless scrolling 39+ cards measurably lags.
- No server: everything stays client-side + static.
- No redesign of pages other than explore (drawer polish is in scope; the
  standalone `/programs/[slug]` pages are Plan 01's).

## Suggested order of work

1. Information architecture: split filters vs tools; add active-chip row +
   count + clear-all (desktop first).
2. Mobile filter ergonomics (collapsed bar / bottom sheet, sticky search).
3. Sort control wired to URL.
4. Card redesign (incl. logo monogram fallback if Plan 01 hasn't shipped one
   yet — check `git log` / components before building your own).
5. Empty state.
6. Drawer polish pass.
7. Full sweep: desktop + mobile snaps of every filter permutation that matters,
   dashboard regression snap, URL round-trip checks.

## Harness (this plan's specifics)

- Snap loop: `node scripts/snap.mjs /explore /dashboard` after every slice;
  interact-then-snap flows (open dropdowns, apply filters, zero-result state,
  open drawer, mobile sheet) need a small Playwright script — write one once
  into `.snap-flows.mjs` (gitignored via `.snap*`... add it to `.gitignore` if
  you name it differently) and reuse it all session.
- URL round-trip check (do this after any store/filter change):
  load `/explore?status=open&country=USA&sort=name&dir=-1`, assert the UI
  reflects it, click Copy link, assert clipboard/URL equality.
- Relevant tests: `tests/filter.test.ts`, `tests/routes.test.ts`,
  `tests/exports.test.ts`, `tests/ui.test.ts`, `tests/applyUrgency.test.ts`.
  Add tests for any new filter/sort logic you introduce in `src/lib/`.

## The loop

Per slice: change → snap (desktop + mobile) + interaction flows → look at the
images → self-critique against G1–G7 → `npm test && npx astro check` → commit
→ push. Re-snap `/dashboard` after every `FilterSidebar`/store change, not
just at the end. Before the PR: run the full acceptance checklist, then build.

## Acceptance checklist (copy into PR description and tick)

- [ ] Active-filter chips with removal + clear-all; result count prominent
- [ ] Filters/tools visually separated; tools demoted
- [ ] Sort control on explore, persisted in URL, Copy link round-trips
- [ ] Mobile: first card above the fold; sticky search access; filters usable
      one-handed
- [ ] Zero-result state with recovery actions
- [ ] Cards: monogram fallback, no bad truncation, focus rings, clear CTA
- [ ] Drawer: consistent with card language, keyboard closable, scroll-locked
- [ ] `/explore?q=…&model=…&country=…&status=…&sort=…&dir=…` all still work
- [ ] `/dashboard` regression-checked (snaps + manual filter interaction)
- [ ] `npm test`, `npx astro check`, `npm run build` all green
- [ ] Before/after screenshots (desktop + mobile) in the PR

## Kickoff prompt (paste into a fresh session on jcobrew/orbital)

```
Read docs/plans/README.md and docs/plans/02-explore-filter-ux.md, then execute
Plan 02 end to end on branch claude/plan-02-explore-ux. Work autonomously
through the plan's loop: snap /explore and /dashboard before starting, then
slice by slice (IA split → mobile ergonomics → sort → cards → empty state →
drawer), verifying each slice visually at both widths, exercising the filter
interactions with Playwright, and keeping the URL grammar contract and
/dashboard intact. When the acceptance checklist passes, push, open a draft PR
titled "Explore & filter experience (Plan 02)" with before/after screenshots
and report back with the PR link and a summary.
```
