# Plan 03 — Newsletter signup (Buttondown, pluggable)

> Execution plan for one autonomous Claude session. Read `docs/plans/README.md`
> first for the shared conventions (branch, harness, loop, guardrails) — this
> file only adds what is specific to this workstream.

## Mission

Give 0rbital a way to keep founders informed about new residencies and
developments in the field: an email newsletter signup, wired for Buttondown,
that ships **fully built but dormant** until the owner creates the Buttondown
account and drops in the username. This is the "accounts" decision resolved:
newsletter-first, no login, site stays static (decided 2026-07-12; login
accounts are explicitly out of scope).

## Architecture decisions (already made — do not relitigate)

- **Provider: Buttondown.** Signup works as a plain HTML form POST to
  `https://buttondown.com/api/emails/embed-subscribe/<username>` with an
  `email` field — no API key in the repo, no server needed. Verify the exact
  current endpoint/field names against Buttondown's embedding docs at build
  time if network access allows; otherwise use the above (their stable embed
  contract for years).
- **Single config point.** `src/config/newsletter.ts` exporting something like
  `{ username: import.meta.env.PUBLIC_BUTTONDOWN_USERNAME ?? '', title, blurb }`.
  Flipping the feature on = setting one env var in Vercel (or one constant) +
  redeploy. No other file should hard-code the provider.
- **Dormant state is a feature.** While unconfigured, the signup UI still
  renders (so its design can be reviewed on previews) but the submit is
  replaced by a clear "Signups open soon" affordance — never a form that
  silently posts nowhere. Gate: `username === ''`.
- **No tracking, no third-party JS.** The form is plain HTML; Buttondown's
  hosted confirmation page handles the double-opt-in.

## What to build

1. **`NewsletterSignup` component** (Astro component preferred — zero JS
   needed for the configured state; a tiny inline script may handle the
   dormant state message). Props for `variant`: `card` (boxed, for page
   placements) and `bare` (for the footer). Design language: match the
   terminal aesthetic — mono label, pill input + button, one-line value prop:
   what they get (new residencies, application windows opening, field notes)
   and how often. Include the legal courtesy line (unsubscribe anytime).
2. **`SiteFooter` component** — the site currently has none. Minimal, quiet:
   newsletter (bare variant) + nav echoes (Explore, Countries, Submit, Story,
   Dashboard, API/llms.txt for agents) + GitHub repo link. Add to `Base.astro`
   for content pages; **exclude fullscreen pages** (`Base` has a `fullscreen`
   prop — the globe keeps zero chrome).
3. **Placements** (start with these, judge on the snaps):
   - Footer on all non-fullscreen pages (the default vehicle).
   - A `card` placement at the end of the explore results list ("Tracking 39
     programs — get new ones in your inbox").
   - A `card` placement on `/story` after the "Why it exists" section.
   - Optional: `/saved` under the tracker — a natural "stay informed" moment.
4. **Docs**: README section "Newsletter" — how to create the Buttondown
   account, set `PUBLIC_BUTTONDOWN_USERNAME` in Vercel, and verify the form
   end-to-end (subscribe with a real address, confirm the double-opt-in email
   arrives).
5. **Tests**: unit-test the config gate (dormant vs configured rendering) the
   same way existing component logic is tested (see `tests/ui.test.ts` for
   patterns); add a routes test that the footer appears on content pages and
   not on `/`.

## Goals (measurable)

- G1. With `PUBLIC_BUTTONDOWN_USERNAME=demo npm run build`, the built HTML
  contains a form posting to the Buttondown embed URL with the email field;
  without the env var, the built HTML contains the dormant state and **no
  form action**.
- G2. Footer on every non-fullscreen page; globe page byte-identical in
  chrome (no footer, no layout shift).
- G3. Signup UI passes the design bar at both widths in all placements
  (snap loop), consistent with the site's visual language.
- G4. Keyboard + screen-reader clean: label on the input, submit reachable,
  dormant state announced (aria-live not required — static text is fine).
- G5. All tests green, astro check clean, build passes.

## Non-goals

- No login/auth, no user database, no cookies, no localStorage for this.
- No newsletter content pipeline (that's an editorial/ops question; the
  existing `founder-atlas-refresh` skill could feed it later).
- No popup/interstitial. Placements are in-flow only.
- No other providers, no provider abstraction layer beyond the single config
  file (YAGNI — the config point already isolates the choice).

## Suggested order of work

1. Config module + `NewsletterSignup` (both variants, both states) — iterate
   on it standalone on a scratch page or directly in the story placement.
2. `SiteFooter` + `Base.astro` integration (mind the `fullscreen` prop).
3. Remaining placements (explore end-of-list, saved).
4. Env-gate verification (G1) both ways, tests, docs.

## Harness (this plan's specifics)

- Snap loop: `node scripts/snap.mjs /story /explore /saved /countries` —
  footer shows on all; plus `/` to prove the globe is chrome-free.
- Build-gate check (G1):
  `PUBLIC_BUTTONDOWN_USERNAME=demo npm run build && grep -r "embed-subscribe/demo" dist/ | head`
  then `npm run build && ! grep -r "embed-subscribe" dist/`.
- Coordination: this plan touches `Base.astro` and adds an explore placement
  (one component mount at the end of `ExploreResults` or below it in
  `explore.astro`). If Plans 01/02 are in flight, keep these edits minimal and
  additive; note them in the PR for merge ordering.

## The loop

Per slice: change → snap affected placements (both widths, both config
states — use `PUBLIC_BUTTONDOWN_USERNAME=demo npm run dev` for the configured
state) → look → refine → `npm test && npx astro check` → commit → push. The
dormant state is the one that ships live, so design it as carefully as the
active one.

## Acceptance checklist (copy into PR description and tick)

- [ ] `src/config/newsletter.ts` is the single config point (env-driven)
- [ ] `NewsletterSignup` card + bare variants, configured + dormant states
- [ ] `SiteFooter` on all non-fullscreen pages; globe page has no footer
- [ ] Placements: footer, explore end-of-list, story; (saved optional)
- [ ] G1 build-gate verified in both directions (paste the grep output in PR)
- [ ] A11y: labeled input, keyboard path, sensible dormant-state text
- [ ] README "Newsletter" section: account setup → env var → e2e verification
- [ ] Tests for the config gate + footer presence; suite green; build clean
- [ ] Screenshots of every placement, both states, both widths in the PR

## Kickoff prompt (paste into a fresh session on jcobrew/orbital)

```
Read docs/plans/README.md and docs/plans/03-newsletter-buttondown.md, then
execute Plan 03 end to end on branch claude/plan-03-newsletter. Work
autonomously through the plan's loop: build the pluggable Buttondown signup
(config module, NewsletterSignup card/bare variants with configured + dormant
states, SiteFooter, placements on footer/explore/story), verifying each slice
visually at both widths in both config states, proving the env build-gate in
both directions, and keeping the globe page chrome-free. When the acceptance
checklist passes, push, open a draft PR titled "Newsletter signup, Buttondown-
ready (Plan 03)" with screenshots of every placement/state and report back
with the PR link and what the owner must do to activate signups.
```
