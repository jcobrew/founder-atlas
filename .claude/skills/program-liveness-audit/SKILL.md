---
name: program-liveness-audit
description: >-
  Audit whether the founder programs ALREADY listed on Orbital are still alive and
  active. Use when asked to liveness-check, health-check, re-verify, archive dead/
  dormant programs, refresh application status, or find stale entries in the Orbital
  dataset. Checks each program's social activity (via program-social-pulse) and its
  own cohorts/apply page, then sets `status` (application window) and `lifecycle`
  (active/dormant/defunct) with dated evidence — archiving keeps the record and its
  link, it never deletes. Proposes changes via a GitHub issue, or a draft PR when the
  maintainer has asked for the data to be updated. This is NOT the discovery skill —
  it does not look for programs missing from the list (that's founder-atlas-refresh).
---

# Orbital — program liveness audit

You are health-checking the programs **already on Orbital** to catch ones that have
quietly died, gone dormant, moved, or rebranded. The output is a **GitHub issue**
proposing changes — the same public channel the site's `/submit` form uses — so this
skill works for any agent visiting the live site, with or without repo write access.

**Scope — read this twice:**

- ✅ IN scope: "is this listed program still real and active?", dead/dormant detection,
  moved/renamed domains, stale `status`/links on existing entries.
- ❌ OUT of scope: finding *new* programs that should be added, taxonomy changes,
  field enrichment. Discovery/additions belong to the **`founder-atlas-refresh`** skill.
  If you notice a missing program, note it for that skill — don't add it here.

## Where the data is

Enumerate every program from the agent-friendly endpoint (no scraping needed):

- `https://0rbital.app/api/programs.json` → `programs[]`, each with
  `name`, `operator`, `url`, `domain`, `city`, `country`, `status`, `lastVerified`.
- Working in the repo instead? Read `src/data/programs-data.json`.

## The liveness test (run per program, in this priority order)

Freshness on Orbital is about **recent human activity**, not whether a homepage loads.
Weight the signals accordingly:

> **Access reality (verified 2026-08).** LinkedIn returns **HTTP 999** and X
> returns **HTTP 402** to plain automated fetches, so steps 1–2 below often
> cannot be done directly. Run **`program-social-pulse`** first — it reads the X
> API properly and hands you dated recency. If you have no social data, **say so
> in the output** and treat every dormancy call as unconfirmed. Never write "no
> recent activity" when what you mean is "I couldn't check."

1. **Social media — PRIMARY signal.** Check the program's **LinkedIn company page**
   and **X/Twitter** handle, and the **people who run it** (founder/operator named in
   `operator`). Look for posts, cohort announcements, or event activity in the **last
   ~90 days**. Active socials ⇒ the program is alive, *even if its old website is down*.
   - LinkedIn is often the best signal for residencies/hacker houses (cohort recaps,
     "applications open", new-location posts). Check it first.
2. **Official site — and specifically its cohorts/apply page.** Does `url`/`domain`
   resolve? **Is there a cohort dated in the future?** (If yes, stop: the program
   is active.) Is there a recent cohort date, an open application, or a
   current-year copyright? A roving program's site may advertise the *next* city.
3. **Recent web / news / event listings.** Luma event pages, press, founder posts.
   Aggregators and listicles are last-resort and never count as the program's own URL.

### Hard-won caveats (do not skip)

- **A future-dated cohort outranks everything. (The Forge rule, 2026-08.)** The
  audit was opened with "Forge Residency has gone quiet on socials for a month,
  let's close them." Their `/cohorts` page listed Cohort 02 open for
  **11 Oct – 1 Nov 2026**. A program advertising an intake that hasn't happened
  yet is alive, and no amount of social silence changes that. **Check the
  cohorts/apply page before forming any dormancy opinion.**
- **A live program's cohort *roster* rots independently of its liveness.** Forge
  was alive but our records were wrong in a different way: Cohort 2 had moved
  Bali → Goa and Cohort 3's Dubai listing had become an unnamed "Ithaca, in
  development". Ask "is this program alive?" *and* "is what we say about it still
  true?" — they have different answers.
- **Search snippets lag primary sources.** Web search still reported Forge's
  Cohort 2 as "Bali" weeks after the site said Goa. When search and the program's
  own page disagree, **the page wins** — and don't let a stale snippet talk you
  out of what you read on the site.
- **A network's application ≠ its houses' applications.** The Residency's
  network-wide intake closed 31 July 2026 and all 12 houses flipped to "apply
  next time" — but **Bangalore runs its own rolling intake** on its own domain
  and stayed open. Before applying a network-wide status to every house, check
  whether any house has its own domain and its own form.
- **A date printed on a live site is not proof it's current.** The Residency's
  `/apply` still read "next cohort begins June 5th, 2026" in August. Always ask
  whether the date you just read is in the *past*.
- **Seasonal programs close annually; that is not dormancy.** The Yale Hacker
  House ran late-May → end-of-July and stopped. That's `status: closed`,
  `lifecycle: active` — an annual program between editions.
- **"Coming soon" can be flatly wrong in the other direction.** SILTA sat at
  `coming-soon` while having already run **8 cohorts**. Re-check the optimistic
  labels too, not just the pessimistic ones.
- **A dead domain is NOT proof of a dead program.** Programs move domains. Before
  declaring anything defunct, search for a **new/renamed domain** and check socials.
  *(Real example: Pluto's `pluto.community` stopped resolving, but the program is alive
  at `joinpluto.io` with an active LinkedIn — removing it was wrong.)*
- **Roving / pop-up residencies legitimately end a location and continue.** "The Munich
  cohort ended" or "this house wrapped" ≠ closure. Look for the *next* cohort/city.
  (Pluto; The Residency's themed houses behave this way.)
- **Aggregator / listicle / `google.com/search?...` URLs are not valid program URLs.**
  If an entry's `url` is one of these, propose a direct-link fix even if it's active.
- **Don't fabricate recency.** Never write "last posted N days ago" unless you actually
  saw the dated post. Cite the specific post/source URL you used.

## Also flag — out-of-scope entries (surface these even if "active")

Orbital maps places where founders **live together in a cohort / residency**. While
auditing, watch for listed entries that were never that, and flag them for removal
with a one-line reason — being "alive" doesn't make them in-scope:

- **Generic / nomad co-living** — pay-by-the-month housing open to "students,
  professionals, digital nomads," not a selective founder cohort (e.g. Hive Coliving,
  HackerHouse.world). Co-living ≠ a founder program.
- **One-time events / pop-up retreats** — a single dated event (a weekend hackathon, a
  5-day retreat) that isn't a recurring program (e.g. Bali Hacker House / The Collective).
- **Pure co-working / clubs** — desks + events, no live-in (e.g. SHACK15).
- **Online community / course** — no physical residency.

Distinguish from a roving residency (Pluto) — that *is* a cohort program that changes
city; keep it. The test is "selective founder cohort that lives together," not "has a
building." When unsure, flag rather than assert.

## Two axes: `status` vs `lifecycle` — never conflate them

The dataset carries **two independent fields**, and most bad calls come from
mixing them up:

| Field | Question | Values | Changes |
| --- | --- | --- | --- |
| `status` | What are applications doing right now? | `open` \| `coming-soon` \| `running` \| `closed` | Every few months |
| `lifecycle` | Is anyone still running this at all? | `active` \| `dormant` \| `defunct` | Rarely; `defunct` is ~permanent |

**A healthy program between cohorts is `status: closed` + `lifecycle: active`.**
That is the normal, common case — The Residency in August, Focal until its
January intake, Pluto between cohorts. Setting `lifecycle` to anything but
`active` because an application window shut is the single worst error this skill
can make: it tells founders a thriving residency is dead.

Only `lifecycle: active` records appear in the map, `/explore` and `/dashboard`.
Non-active records keep their page, their outbound link and their record, and are
shown at **`/archive`** as case studies — so archiving is *reversible and
non-destructive*, not a deletion. `lifecycle` is absent ⇒ treated as `active`.

Every non-active record **must** carry:
- `lifecycleEvidence` — dated prose, e.g. "newest dated content on the site is a
  February 2019 press reference; footer reads © 2012–2022"
- `lifecycleCheckedAt` — ISO date you checked

## Classification

For each program, assign one verdict with **dated evidence + source URLs**:

| Verdict | Criteria | Proposed change |
| --- | --- | --- |
| **Active** | Social or site activity within ~90 days, **or any future-dated cohort**, or a confirmed recent cohort. | None (bump `lastVerified`; refresh `status` if the window moved). |
| **Moved / renamed** | Program is alive but the domain/handle changed, or `url` is an aggregator. | Update `url` + `domain` (and `name` if rebranded). Do **not** archive. |
| **Dormant** | No activity anywhere (site **and** socials) for ~3–6 months, **and** no future cohort advertised. | Propose `lifecycle: dormant` + evidence. Never a deletion. |
| **Defunct** | Domain dead **and** socials silent/gone for 6+ months, or an explicit shutdown / "for sale" domain. | Propose `lifecycle: defunct` + evidence. Still not a deletion — it becomes a case study. |

When site and socials disagree, **socials win** for liveness (a stale site with an
active LinkedIn is Active/Moved, not Dormant) — **except** that a future-dated
cohort on the program's own site beats social silence outright. See below.

## Process

1. **Pull the program list** from `/api/programs.json` (or the JSON file).
2. **Check open issues first** (`https://github.com/jcobrew/orbital/issues`) so you
   don't refile a liveness audit that's already pending.
3. **Audit each program** with the test above. Keep a working table:
   `name | verdict | last-activity (date) | evidence URL(s) | proposed change`.
   Prioritise socials; spend your verification budget on the *uncertain* ones (the
   obviously-active, well-known houses need only a quick confirmation).
4. **Group the findings** into: Archive as defunct, Archive as dormant (flagged),
   Update link/domain (moved/aggregator), Update status, Active (no change).
5. **Report the results** (see Output). Default to **one GitHub issue** — that
   keeps the skill usable by an agent with no write access, and a maintainer
   gates every change.

   **When the maintainer has asked you to apply the changes**, skip the issue and
   go straight to a **draft PR** instead: the PR carries the same evidence plus
   the actual diff, so filing both is duplicate noise. Say which you did and why.
   Either way the changes are human-gated — never push data to `master`.

## Output: a GitHub issue (the /submit channel)

Submit through the same path as the website's **Submit / update** form
(`src/lib/submit.ts` → a prefilled GitHub issue on the Orbital repo, label
`data-update`). Two ways, depending on the agent's access:

- **With `gh` / GitHub API:** open an issue on `jcobrew/orbital`, label `data-update`.
- **Browser/no-write agent:** open the prefilled URL the form builds:
  `https://github.com/jcobrew/orbital/issues/new?labels=data-update&title=...&body=...`
  (URL-encode title/body).

**Title:** `[Liveness audit] <YYYY-MM-DD> — <N> proposed changes`

**Body template:**

```
Liveness audit of the listed programs (social-first: LinkedIn + X, then site).
Method: checked each program's LinkedIn/X + people who run it, then official site,
then recent news. Dates = most recent activity I could verify.

### Archive as defunct — `lifecycle: defunct` (<n>)
- <Program> — domain dead (<url>) AND no social activity since <date>. Evidence: <links>.
  (Record + link kept; moves to /archive as a case study, not deleted.)

### Archive as dormant — `lifecycle: dormant`, please confirm (<n>)
- <Program> — site loads but no posts/cohorts since <date>, and no future cohort
  advertised. Evidence: <links>.

### Update link / domain (<n>)
- <Program> — moved <old> → <new> (still active, last post <date>). Evidence: <links>.
- <Program> — `url` is an aggregator/search link; direct site is <url>.

### Update status (<n>)
- <Program> — status should be <status> (cohort <opened/closed> <date>). Evidence: <link>.

### Active — no change (<n>)
- <Program> — confirmed active, last activity <date> (<link>).

Notes: dead domain ≠ dead program; roving programs that ended a single
location are still active. Flagged items are judgment calls for a human.
```

Keep it evidence-dense and honest: every archive/update line needs a dated source.
Put anything you couldn't verify under "Archive as dormant — please confirm",
never silently into a defunct call.

**State your method's limits up front.** If LinkedIn and X were unreachable, the
first line of the output should say so — a reader must be able to tell
"no activity found" from "couldn't look". The 2026-08 run opened with exactly
that disclosure and it was the most useful line in the report.

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

## Cadence

Good as a periodic (e.g. monthly) unattended run, or on request. Because output is an
issue (not a direct commit), it's safe to run often — a maintainer gates the changes.
Re-checking the same programs is fine; just don't duplicate an already-open audit issue.
