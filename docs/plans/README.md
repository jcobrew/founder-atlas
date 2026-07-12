# 0rbital improvement plans — session playbook

Three independent execution plans, each sized for one autonomous Claude
session. Each plan file contains its mission, file ownership, measurable
goals, a verification harness, an iteration loop, an acceptance checklist,
and a paste-ready kickoff prompt.

| Plan | Workstream | Branch | Owns |
| --- | --- | --- | --- |
| [01](01-visual-design-system.md) | Visual design pass, all non-globe pages | `claude/plan-01-visual-design` | tokens, nav, countries, program pages, saved, submit, story |
| [02](02-explore-filter-ux.md) | Explore & filter experience | `claude/plan-02-explore-ux` | explore page, filter/results/card/drawer components, filter store |
| [03](03-newsletter-buttondown.md) | Newsletter signup (Buttondown, pluggable) | `claude/plan-03-newsletter` | newsletter config/component, new site footer, placements |

## How to run a session

1. Start a new Claude session on `jcobrew/orbital` (claude.ai/code, or the
   desktop/CLI on a local clone).
2. Paste the plan's **kickoff prompt** (bottom of each plan file) as the first
   message. That's all the session needs — the plan file is the brief.
3. Review the resulting draft PR on its Vercel preview URL; comment on the PR
   or in the session to iterate; merge when satisfied.

## Recommended order

Run **01 → 02 → 03**, each branched from the then-current `master`, merging
between runs. They are written to be parallel-safe via file ownership
(overlaps: 02/03 both lightly touch `explore.astro`; 03 touches
`Base.astro`), so parallel execution works if you accept small merge
conflicts at the end — sequential is simply calmer.

If a plan's assumptions have drifted by the time you run it (files renamed,
another plan already shipped a shared piece like the logo monogram fallback),
the session should trust the code over the plan, say so in its PR, and keep
the plan's goals rather than its letter.

## Shared conventions (all sessions)

**Branch & PR.** Work on the plan's designated branch. Commit per completed
slice with descriptive messages; push regularly (work in these containers is
lost when the session is reclaimed); finish with ONE draft PR per plan.
Include before/after screenshots — attach or link them; the ticked acceptance
checklist; and any deferrals or shared-file edits flagged for merge ordering.

**Harness.** Everything runs locally, no external services needed:

```bash
npm install            # once
npm run dev            # http://localhost:4321 (leave running)
node scripts/snap.mjs  # screenshot loop: all key routes, desktop + mobile → .snap/
npm test               # vitest suite (110+ tests)
npx astro check        # types
npm run build          # must stay green
```

`scripts/snap.mjs` takes route arguments (`node scripts/snap.mjs /explore`),
honors `OUT=` for separate before/after folders, and works in Claude Code web
containers out of the box (global Playwright + `/opt/pw-browsers`). For
interaction states (open dropdown, filled form, drawer open), write a small
Playwright script against the same global install and snap after interacting.

**The loop.** Small slices. After every slice: snap → actually look at the
images → self-critique against the plan's goals → tests/check → commit. Do
not batch five slices and verify at the end. Before the PR: full-route snap
sweep, `npm test`, `npx astro check`, `npm run build`.

**Design language.** Black terminal aesthetic: `#000` background, Space
Grotesk display, Inter body, JetBrains Mono chrome, pill controls,
sharp 3px panels, status colors as the only functional color
(`src/lib/status.ts`). Tokens in `src/styles/global.css` (`@theme`). The
story page (`/story`) is the current visual high-water mark — match its
rhythm. No component libraries, no new fonts, no light mode.

**Hard guardrails (every session).**

- Never modify the globe: `src/islands/GlobeView.tsx`, `src/pages/index.astro`,
  `src/lib/asciiGlobe.ts`, `src/lib/globeJitter.ts`.
- Never change data (`src/data/*.json`) or the machine-readable surface:
  `/api/programs.json` & `/api/countries.json` shapes, `llms.txt`, the
  documented URL query grammar (`?q,model,country,status,sort,dir`) — extend,
  don't break. `tests/exports.test.ts` and `tests/routes.test.ts` guard this.
- No new runtime dependencies without a strong reason stated in the PR; no
  third-party scripts, fonts, or CSS at runtime (the site is fully
  self-hosted by design — keep it that way).
- Accessibility floor: labeled inputs, visible focus states, ≥40px touch
  targets, no horizontal scroll at 390px.
- Don't rewrite product copy wholesale; the voice is deliberate. Adjust only
  where a change you're making requires it.
- Leave the test suite green. If a test blocks a legitimate change, change
  the test in the same commit with a one-line justification.

**Reporting.** End with: PR link, what shipped vs deferred, screenshots, and
anything the next plan should know (a sentence or two in the PR description
under "Notes for other sessions").
