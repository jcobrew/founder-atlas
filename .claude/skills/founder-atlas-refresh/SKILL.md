---
name: 0rbital-data-review
description: >-
  Refresh the Orbital co-living program dataset. Use when asked to update, refresh,
  re-verify, or add to the founder co-living data (src/data/programs-data.json) —
  whether run interactively or from a scheduled routine. Gathers via web research,
  verifies, dedupes against existing entries, edits the JSON, and opens a DRAFT PR.
  Never pushes data straight to the live site.
---

# Orbital — co-living data refresh

You are maintaining the data behind a public, auto-deploying map of **co-living founder
programs** — founder residencies and hacker/founder houses where people live and build
together for a fixed term. The JSON file is the **single source of truth** and Vercel
deploys `master` on push — so a bad entry is live immediately. Your job is to gather and
curate carefully, then **open a draft PR for human review**. Do not push data to
`master`.

This skill encodes the *steady-state refresh* process. Big discovery passes, taxonomy
changes, and judgment-heavy curation are done interactively (in Cowork), and any new
rules learned there should be folded back into this file.

## Scope — co-living only

Orbital is scoped to **co-living founder programs**. Every record in the dataset is a
live-in / residential cohort. Concretely, a program belongs here **only if** it is:

- `canonicalType: "founder-residency"` — a live-in / relocation cohort built around
  focus; you move into a house/campus for a fixed term, **or**
- `canonicalType: "hacker-house"` — a shared house / coliving organized around a tech
  scene; the value is builder density (often pay-rent), **or**
- any program with `format: "live-in"` (a residential cohort that lives together).

**Everything else is out of scope and must NOT be added:** commute-in accelerators,
pre-accelerators, founder fellowships, government grants, startup visas, co-founder
matching / online communities, startup campuses, incubators, studios. Those program
types were removed from the dataset when Orbital narrowed to co-living. A great program
that isn't residential is still out of scope — **flag it, don't add it.**

> The test for inclusion is **"a selective founder cohort that lives together for a
> fixed term."** Not "has a building," not "is a good program." Generic / nomad
> co-living (pay-by-the-month housing open to anyone), pure co-working, one-off retreats,
> and online communities are all out (see `program-liveness-audit` for the fuller
> out-of-scope list).

## The dataset (one file)

- `src/data/programs-data.json` — **every** co-living founder program in a single
  top-level `programs` array.

> **There is no residential vs traditional split.** The old two-file model
> (`startup-programs-data.json` / `traditional-programs-data.json`) is **retired**, and
> the dataset no longer carries non-co-living records at all. (`dataset` survives only
> as a derived back-compat value — always `"residential"` now — in the legacy
> `/api/programs.json` shim; never set it by hand.)

The "lives in a house / must relocate" quality is expressed **on the record itself**:
`format: "live-in"` (or `"relocation"`) plus `housing` in `supportModes`.

## Step 1 — confirm it's co-living, then pick the `canonicalType`

The **first question** when adding (or re-checking) a program is: *is this a residential
cohort that lives together?* If not, stop — it's out of scope. If yes, pick its
`canonicalType`, the canonical machine ID from
[`src/data/taxonomy.ts`](../../../src/data/taxonomy.ts) (`programType` dimension),
documented in [`docs/program-taxonomy.md`](../../../docs/program-taxonomy.md). Only two
in-scope values:

| `canonicalType` | Use it when… |
| --- | --- |
| `founder-residency` | Live-in / relocation cohort built around focus — you move into a house/campus for a fixed term (HF0, The Residency, Neo). |
| `hacker-house` | Shared house / coliving organized around a tech scene; the value is builder density, often pay-rent (AGI House, STAK, Foundry). |

**How to choose:**

- **Curated, focus-first, you move in for a fixed cohort → `founder-residency`** (with
  `format: "live-in"` and `housing` in `supportModes`).
- **Shared house, pay-rent, network/scene-first → `hacker-house`** (`housing` in
  `supportModes`, usually `format: "live-in"`, `costFundingModel: "fee"`).
- **Borderline** (e.g. a residency with a small cheque, or a house that also runs a
  cohort program): pick the *primary* co-living type and capture the nuance in `format`
  and `notes` — do not reach for a non-co-living type. If you genuinely can't tell
  whether it's even co-living, **flag it in the PR** rather than adding it.

## Entry schema

Each program is an object in the top-level `programs` array of
`src/data/programs-data.json`. Copy an existing entry as a template.

### Canonical fields (set these first)

```json
{
  "canonicalType": "founder-residency",
  "supportModes": ["housing", "structure", "community", "funding"],
  "format": "live-in"
}
```

- `canonicalType` — one canonical `programType` ID (see Step 1).
- `supportModes` — array of `supportMode` IDs describing what the program concretely
  provides: `funding`, `housing`, `workspace`, `mentorship`, `investor-access`,
  `demo-day`, `visa-support`, `community`, `co-founder-matching`, `structure` (MVP);
  `customers`, `compute-credits`, `lab-access`, `legal-admin` (future).
- `format` — one of `in-person` | `remote` | `hybrid` | `live-in` | `relocation`.
  `live-in` / `relocation` express the old "residential" quality.
- `intakeMethod`, `intakeFrequency`, `costFundingModel` — optional canonical IDs from
  the same taxonomy (`rolling` / `cohort-application` / …; `equity` /
  `equity-free-grant` / `stipend` / `fee` / `free` / `mixed` / …). Fill when verifiable.

### Identity + display fields

```json
{
  "name": "Program Name",
  "type": "Hacker House / Coliving",
  "city": "San Francisco",
  "country": "USA",
  "lat": 37.8065,
  "lng": -122.429,
  "focus": "AI, hardware, robotics",
  "operator": "Who runs it",
  "stage": "Pre-seed / very early",
  "status": "rolling",
  "status_detail": "Recruiting status + key terms (equity, $, cohort length).",
  "domain": "example.com",
  "url": "https://example.com/apply",
  "highlight": "One memorable line about the program"
}
```

> **`type` is now a human-readable label, not the category.** It still renders in the
> UI, but it no longer decides anything. The category is `canonicalType`. Keep `type`
> short and descriptive (e.g. `"Hacker House / Coliving"`, `"Pre-seed Accelerator"`)
> and let `canonicalType` carry the machine meaning.

`status` must be one of (see `meta.status_legend` in the JSON / `src/lib/status.ts`):
`open`, `coming-soon`, `running`, `closed`. (The old 6-value vocabulary —
`rolling`/`closing-soon`/`opening-soon` — is retired; rolling intake is captured by
`intakeMethod: "rolling"` + `status: "open"`.)

### `lifecycle` — a separate axis from `status`

```json
{
  "lifecycle": "active",
  "lifecycleEvidence": "…dated evidence, required when not active…",
  "lifecycleCheckedAt": "2026-08-04"
}
```

`lifecycle` (`active` | `dormant` | `defunct`, see `src/lib/lifecycle.ts`) answers
"is anyone still running this?" — **not** "are applications open?". Keep them
apart:

- A healthy program between cohorts is `status: "closed"` + `lifecycle: "active"`.
  This is normal and common. Never demote `lifecycle` because a window shut.
- Only `active` records appear on the map, `/explore` and `/dashboard`. Non-active
  ones keep their page and link, and surface at `/archive` as case studies.
- **Every new program you add is `lifecycle: "active"`** — if it isn't active,
  it isn't a discovery, it's an archive entry, and that's the liveness skill's call.
- Changing a `lifecycle` is **`program-liveness-audit`'s job, not this skill's.**
  If a refresh turns up a program that looks dead, flag it in the PR body and let
  the audit make the call with evidence.

### Provenance (required on every add or change)

Whenever you add a record or change a fact, supply provenance:

- `sourceUrls`: array of URLs used to verify this entry (≥1, primary source preferred).
- `lastVerified`: ISO date you confirmed it (e.g. `"2026-06-12"`).
- `verificationStatus`: `verified` | `needs-review` | `unverified`.

### Founder-facing fields the UI renders (field-by-field playbook)

The card and detail drawer/full page render a "Quick facts" grid from the fields below.
The grid is **hide-when-empty** — a fact only shows when the value exists, and the
"Needs verification" panel reports what's missing — so a blank field means the program
simply shows *less*, not "Unknown". On **every add and every refresh**, look for each
field on the program's own site (about / apply / FAQ / pricing pages) and fill what a
**primary source** states. Never guess; if it isn't public, leave it unset.

The percentages below are the **measured ceilings from the 2026-07 full enrichment
pass** (all 39 programs researched) — they tell you how hard to push per field:

**Tier 1 — nearly always published (fill on every record):**

- `intakeMethod` (~80% gettable): the apply page/CTA wording states it — "rolling" /
  "applications open anytime" → `rolling`; dated batches ("Cohort 2 opens Sept") →
  `cohort-application`. Renders as the "Applications" fact.
- `providesHousing` (~70%): stated on the homepage — housing *is* the product. `true`
  for almost every co-living record; set it every time.
- `format`: living-model badge (`live-in` / `relocation` / `hybrid`) — inferable from
  the site's whole premise; don't leave `unknown` on a co-living record.

**Tier 2 — usually published for cohort programs (~50%):**

- `providesWorkspace`: stated when it exists (desks / build floor / lab); silence ≠ no.
- `cohortSize`: houses love this number — "10 teams", "16 fellows", "40 spots",
  "14 bedrooms". Free text.
- `durationWeeksMin/Max`: cohort programs state it ("8-week residency", "90 days");
  **open-ended pay-rent coliving has no duration — that's structurally N/A, leave unset.**

**Tier 3 — published only where applicable (~10–35%; fill when it exists, never chase
where it can't):**

- `cost`: pay-rent houses publish pricing pages (e.g. `"$1,890–$2,090/mo"`); funded
  programs → record what's covered (e.g. `"Free — housing, meals covered + stipend"`).
  Curated networks (The Residency, Arrayah) often deliberately don't publish pricing —
  note it and move on.
- `equityTaken`: **an explicit "no equity" statement is data — record `"None"`.**
  (Pluto, Arrayah, Hacker Residency Group all advertise it.)
- `fundingAmount`: only investment-type programs have one (HF0 `"$1M uncapped SAFE"`,
  Neo, The Bridge). **Structurally N/A for pay-rent houses — do not chase it there.**

**Secondary — opportunistic only (low ceiling ~25%; sites describe audiences in prose
that rarely maps to the enums; the UI falls back to free-text `stage`/`focus`):**

- `stageFit`: array from `pre-idea, idea, pre-product, mvp, pre-seed, seed, series-a-plus, repeat-founder, student, researcher`
- `founderFit`: array from `first-time-founder, solo-founder, technical-builder, domain-expert, repeat-founder, student-founder, researcher, international-founder, relocating-founder, fundraising-soon, needs-focus, needs-community, needs-customers, needs-capital` (drives the "Best for" line)
- `sectorFocus`: array of sector tags (e.g. `["AI","robotics"]`) — fill when the house
  states a theme (AI house, biotech lab, deep tech); skip for generalist houses.
- `intakeFrequency`, `nextCohortStart`, `applyUrl`,
  `providesFunding`/`providesMentorship`/`providesInvestorAccess`/`providesDemoDay`.
- `xUrl` / `linkedinUrl`: official social URLs (full URLs, not handles). Prefer the
  program's own X account / LinkedIn company page; the main organizer's account is an
  acceptable fallback when the program has none — say so in `notes`. Grab them from
  the site footer/header while you're already there; never guess a handle.

**Research tips learned the hard way:**

- FAQ accordions (e.g. Forge) hide their answers from fetched HTML — the questions
  appear but not the answers. Check a rendered page, socials, or press instead of
  concluding "not stated".
- Thin/JS-shell sites (Neo, V2, Bili) publish almost nothing — corroborate via the
  program's own newsletter/blog or reputable press (TechCrunch etc.), cited in
  `sourceUrls`.
- Multi-house networks (The Residency, Arrayah, Forge) publish network-wide facts on
  the parent site — apply them to each house record, then layer per-house specifics.

> **Do not add `applicationDeadline`.** It changes constantly, is unverifiable at rest,
> and the UI no longer renders it — put timing context in `status_detail` instead.

Coordinates: `lat`/`lng` are decimal degrees for the program's city/building. Use a
known landmark or the operator's stated location; do not invent precise rooftop
coordinates. A city-center coordinate is fine — the UI jitters overlapping pins.

## Process

1. **Read `src/data/programs-data.json`** and build a mental index of existing `name` +
   `domain` values. `name` is the dedup key (networks share domains).
2. **Research.** Check program websites and social handles first; corroborate with the
   source list below and fresh web search. Prefer primary sources (the program's own
   site / X) over aggregators.
3. **Refresh existing entries.** For each program, re-verify `status` / `status_detail`
   (cohorts open/close often) and fix anything stale. Bump `lastVerified` when you
   re-confirm. **Backfill the UI fields** (previous section, tiers 1→3): while you're
   on the site, fill any blank `intakeMethod`, `providesHousing`, `format`,
   `providesWorkspace`, `cohortSize`, `durationWeeks*`, and — where applicable —
   `cost`/`equityTaken`/`fundingAmount` that a primary source states. A refresh that
   only bumps the date and leaves Tier-1 fields blank is a missed opportunity.
4. **Add clearly-verified new co-living programs**, using the schema — confirm it's
   residential (Step 1) first, then `canonicalType`.
   - Skip anything you cannot corroborate on the program's own site or two independent
     sources, and anything that isn't a live-in / residential cohort.
   - De-dupe on `name`. A shared `domain` is only a *signal*: multi-house networks
     (The Residency, Forge, Arrayah) legitimately share one domain across per-house
     records — confirm it's a distinct house before treating it as a duplicate.
   - Fill the UI fields above at add time, not "later" — later never comes.
5. **Flag, don't guess.** Anything uncertain — unverifiable existence, ambiguous
   `canonicalType`, missing coordinates, suspected duplicate — goes in the **PR body as
   a checklist**, not silently into the data. (Precedent: "Threshold (UK)" was kept out
   / clearly labelled because it had no verifiable public presence.)
6. **Validate** the JSON parses and the schema is intact (see Validation).
7. **Open a draft PR** (see Output).

## Scope guardrails (important for unattended runs)

- **PR-gated, never direct to `master`.** Always open a *draft* PR.
- **Refresh + verified additions only.** Do not restructure the taxonomy, rename
  fields, remove programs in bulk, add new `canonicalType` IDs, or re-broaden the scope
  beyond co-living. Those are interactive decisions — surface them in the PR body instead.
- **Co-living only.** Never add an accelerator, fellowship, grant, visa, co-founder
  community, or any non-residential program, even a famous one. It will be filtered out
  of scope and just clutter the dataset.
- **When in doubt, flag it.** A short PR with a few solid updates and a list of "needs
  human review" items is the success case. A large diff full of low-confidence
  additions is a failure.
- **Cite sources** for every new program and every status change, in the PR body.

## Validation

Before opening the PR:

```bash
# The dataset must be valid JSON
python3 -c "import json; json.load(open('src/data/programs-data.json'))"

# Spot-check: every program has the required keys (incl. canonical + provenance)
python3 - <<'PY'
import json
req = {"name","type","canonicalType","supportModes","url","city","country",
       "lat","lng","status","sourceUrls","lastVerified","verificationStatus",
       "lifecycle"}
progs = json.load(open("src/data/programs-data.json"))["programs"]
bad = [p.get("name","?") for p in progs if not req <= set(p)]
print("src/data/programs-data.json", len(progs), "programs",
      "— missing required keys:", bad or "none")

# Every non-active record must justify itself with dated evidence.
unjustified = [p["name"] for p in progs
               if p.get("lifecycle","active") != "active"
               and not (p.get("lifecycleEvidence") and p.get("lifecycleCheckedAt"))]
print("archived without evidence:", unjustified or "none")

# Statuses and lifecycles must stay inside their vocabularies.
bad_status = [p["name"] for p in progs
              if p["status"] not in {"open","coming-soon","running","closed"}]
bad_life = [p["name"] for p in progs
            if p.get("lifecycle","active") not in {"active","dormant","defunct"}]
print("bad status:", bad_status or "none", "| bad lifecycle:", bad_life or "none")
PY
```

The repo's own suite covers the same ground — run it too:

```bash
npm test          # includes tests/lifecycle.test.ts + tests/socialPulse.test.ts
npm run build
npx astro check
```

Optionally update `meta.compiled` (the date) when you change data.

## Output: the draft PR

Commit to the working branch and open a **draft** PR. Body template:

```
## Orbital data refresh — <date>

### Updated (<n>)
- <Program> — <what changed> — <source URL>

### Added (<n>)
- <Program> (<canonicalType>) — <source URL>

### Needs human review
- [ ] <uncertain item + why>

Dataset remains the source of truth; merging triggers a Vercel deploy.
```

Keep the PR focused; if a change is large or judgment-heavy, describe it in "Needs
human review" rather than committing it.

## Trusted sources (co-living; extend as you learn)

- Residency / hacker-house sites: hf0.com, agihouse.ai, livetheresidency.com,
  forgeresidency.com, arrayah.city, neo.com, buildclub.ai — plus each program's own
  site + LinkedIn/X for cohort activity.
- The Residency publishes its full house network on its homes page — pull from there
  rather than memory, as it changes.
- News / context (never the sole source, never the program `url`): Sifted, TechCrunch,
  SF Standard, Capital Brief.

> Old non-co-living seed sites (f.inc, southparkcommons.com, government/visa programs,
> accelerator directories) were dropped when the scope narrowed — don't re-add programs
> from them.

## Known watch-items (check each run)

- **Threshold (UK)** — was an unverified placeholder; de-flag only with a real source.
- **Forge Cohort 3** — the site lists it as "Ithaca, in development" with **no city**.
  The old Dubai record is a guess and is flagged `needs-review`; rename or retire it
  only once a city is actually announced. Cohort 2 moved **Bali → Goa** (11 Oct –
  1 Nov 2026) — check the cohorts page each run, this roster moves.
- **Arrayah Melbourne & Brisbane** — still "launching soon"; catch first cohorts.
  Arrayah also opened a **Perth** house ("Lighthouse") that is **not yet in the
  dataset** — verify and add.
- **Roving residencies** (Pluto, The Residency themed houses) — a house wrapping ≠ the
  program dying; look for the next cohort/city before changing `status`.
- **The Residency network vs. its houses** — the network application and a house's
  own intake are different things. Bangalore (residencyblr.com) runs its own rolling
  form and stays `open` when the network's window is shut. Don't blanket-apply.
- **Seasonal programs** (Yale Hacker House, SILTA, Focal) — they close annually
  and reopen. Record the *next* window in `status_detail`; never treat the gap as death.

## Verified windows to re-check (as of 2026-08-04)

These carry dates that will expire — they're the first things to re-verify:

| Program | What to check |
| --- | --- |
| The Bridge (EF) | Fall '26 applications closed 30 Aug 2026 → did a new window open? |
| FR8 | Cohort 2.f ran 24 Aug – 21 Nov 2026 → should flip `running`, then `closed` |
| The Founding Co. | Cohort I (90 days from 3 Jul) ends ~1 Oct 2026 → leaves `running` |
| Forge Goa | Cohort 02 ends 1 Nov 2026 → then Cohort 03 |
| SILTA | Spring '27 applications open October 2026 |
| Focal | Applications open October 2026, residency January 2027 |
| HF0 | Batches start 13 Sep 2026 and 4 Jan 2027 |
</content>
</invoke>

## How the three Orbital data skills fit together

They run in this order and must not do each other's jobs:

| Skill | Question | Writes |
| --- | --- | --- |
| **`program-social-pulse`** | When did each program last post? | Nothing — a dated evidence report |
| **`program-liveness-audit`** | Are the listed programs still alive? Is what we say about them true? | `status`, `status_detail`, `lifecycle`, `url`/`domain` fixes |
| **`founder-atlas-refresh`** | What co-living programs are we missing, and what fields are blank? | New records, field enrichment |

Rules of the road:
- Discovery belongs to **`founder-atlas-refresh`** only. If an audit spots a
  missing program, note it for that skill — don't add it.
- `lifecycle` changes belong to **`program-liveness-audit`** only. If a refresh
  spots a program that looks dead, flag it in the PR body — don't archive it.
- Both write through a **human-gated draft PR**; neither pushes to `master`.
