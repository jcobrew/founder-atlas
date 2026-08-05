# Handoff: Daily X (Twitter) posts for 0rbital programs

**Audience of this document:** Claude Cowork (or any assistant/person) writing the daily social posts.
**Owner:** @jcobrew (cpt.stix@gmail.com)
**Compiled:** 2026-08-05 from `src/data/programs-data.json` (dataset `meta.compiled` 2026-08-04, following the Aug 2026 liveness audit). The roster is fresh as of that audit — but it ages fast, so §3 still applies.

---

## 1. The mission

Post **one X post per day**, each spotlighting **one program** from the 0rbital dataset, and always pointing readers back to the website. Cycle through all 39 programs (roster in §6), then start over — by the second pass the data will have refreshed, so re-pull details before reusing an entry.

Two goals per post, in this order:

1. Make the **program** sound as concrete and appealing as it actually is (real details: city, duration, cost, funding, the hook).
2. Make **0rbital** the place to find it and compare it against the rest ("39 live-in founder programs, one map").

## 2. What 0rbital is (the website you're promoting)

- **Live site:** https://0rbital.app
- **One-liner:** *Find your orbit. Launch what's next.* 0rbital helps early-stage builders, founders, researchers, hackers, and creative technologists compare the places where people **live, work, and build** around serious peers.
- **Scope:** live-in founder programs only — founder residencies, hacker houses, and co-living cohorts. It is deliberately **not** a generic accelerator/grant/visa database. Don't describe it as an "accelerator list."
- **Pages worth linking:**
  - `https://0rbital.app/` — 3D globe of every program (the visual hook; great for screenshots/video).
  - `https://0rbital.app/explore` — search + filters + program cards.
  - `https://0rbital.app/programs/<slug>` — one page per program (each roster entry below includes its exact URL). **Prefer this link in program spotlight posts.**
  - `https://0rbital.app/countries` — country ecosystem profiles for founders considering relocation.
  - `https://0rbital.app/submit` — anyone can submit a missing program (good CTA for community posts).

## 3. Data freshness — the non-negotiable rule

Program statuses (open / closed / running / coming-soon) change **frequently**. The roster in §6 is a snapshot.

- **Before writing each day's post**, fetch the live record from `https://0rbital.app/api/programs.json` (all 39 programs, one JSON array under `programs`) and use *that* status, cost, and funding figure — not the snapshot below. Each record also carries `xUrl` and `linkedinUrl`, so the account to tag comes from the API too.
- If the live API and the roster below disagree, **the API wins**.
- Each roster entry has a **"Caveats"** line where the dataset itself flags shaky numbers (e.g. HF0's funding terms are reported inconsistently). Never post a number the caveat says to confirm first — either confirm it on the program's own site that day, or write around it ("funding on an uncapped SAFE — current terms on their site").
- **Skip any program whose "Last verified" line says `needs-review`, and any whose "Status detail" opens with `NEEDS REVIEW`.** These are records 0rbital itself isn't sure about — a program that may have moved, changed scope, or stopped existing. As of the Aug 2026 audit that's **Startup Embassy, Casa Bernarda, Forge — Dubai, FoundHer House, and the Yale house**; Forge — Dubai in particular may not exist as described (the cohorts page now shows "Ithaca — in development" and no longer mentions Dubai). Posting a program into doubt is the one mistake that costs credibility with founders. Pick the next program in the rotation instead, and if you like, mention the gap to @jcobrew so the record gets fixed.
- Never say "applications open" / "apply now" unless the live status is `open`. For `coming-soon` say "launching soon"; for `running` say "cohort in session"; for `closed` say "applications closed — next cycle TBA" or skip the apply angle entirely.

**Status legend** (from the dataset): `open` = applications open (rolling or current window) · `coming-soon` = announced but not launched · `running` = cohort currently in session · `closed` = applications closed, check the site for the next cycle.

## 4. Post format & voice

**Hard constraints**

- ≤ 280 characters (assume a non-premium account) — link included. X shortens every URL to ~23 characters regardless of length, so budget 23 chars for the link.
- One link per post: the program's 0rbital page (`/programs/<slug>`). Not the program's own site — the point is to route through 0rbital; their site is one click away from there.
- Tag the program's X handle when it has one. Handles **are** in the dataset — every roster entry below has a "Tag on X" line, and the live API carries `xUrl` / `linkedinUrl` per program. Use those; don't guess a handle, and don't go hunting the program's site for one. If the roster says none was found, post without a tag — a wrong tag is worse than none.
- 0–2 hashtags max, only when natural: #buildinpublic #foundershouse #hackerhouse #startups. Never a hashtag wall.
- No em-dash-heavy AI-sounding filler, no "🚀 Exciting news!", no "game-changer". Plain, specific, confident.

**Structure that works (guideline, not template)**

1. **Hook** — the single most surprising concrete detail (each roster entry has a "Hook / best detail" line, usually the strongest opener).
2. **Facts** — 2–3 of: city, duration, cohort size, cost/free, funding & equity, focus.
3. **CTA + link** — "Details + 38 more live-in programs:" + 0rbital link.

**Example (HF0, 271 chars):**

> A 12-week residency inside a 22,000 sq ft mansion by Alamo Square — they call it the Monastery of Code. ~10 teams, housing + meals covered, funding on an uncapped SAFE. @HF0Residency
>
> Details + 38 more live-in founder programs: https://0rbital.app/programs/hf0-hacker-fellowship-zero

**Example (community/website day):**

> Hacker houses in SF, Bangalore, Berlin, Sydney, Mérida, Da Nang. 39 places where founders live and build together, on one globe. Free to browse, filter by stage, cost, and status: https://0rbital.app
>
> Know a house we're missing? https://0rbital.app/submit

**Voice**

- Write like a founder recommending a place to a friend, not like a brand account.
- Lead with the detail that makes someone stop scrolling (a mansion, a freight-ship hotel, $1M uncapped, "free rent for hackers").
- Facts over adjectives. "Free — housing, meals, laundry covered" beats "amazing perks."
- It's fine to be warm about a program with `closed` status — frame it as "one to watch for the next cycle."

## 5. Rotation & cadence

- **One program per day**, in roster order (§6) or shuffled — but track what's been posted so nothing repeats within a cycle. Keep a simple checklist (program name + date posted + link to the tweet).
- **Every 7th post**, swap the program spotlight for a **website post**: the globe, the countries pages, the submit flow, a "this week on 0rbital" roundup of statuses that changed, or a themed thread (e.g. "every hacker house in SF, ranked by weirdness of building").
- **Grouping tip:** The Residency operates ~11 houses (SF Parc, Arcadia, Homebrew NYC, Bangalore, Aurea Berlin, Vienna, Inventors, SF2, Odyssey, Biopunk, v2 Vancouver) and Forge (Bangalore, Goa, Dubai) and Arrayah (Sydney, Melbourne, Brisbane) each have 3 locations. Spread these across the cycle rather than posting sibling houses back-to-back — or occasionally combine siblings into one thread ("The Residency now spans 4 countries").
- Programs whose live status is `closed` or `coming-soon` still get posts — angle them as "watch this one" rather than "apply now."

**As of the Aug 2026 audit the mix is 19 open · 16 closed · 3 coming-soon · 1 running** — so on any given day there's a real chance your program is *not* open, and most of The Residency's houses closed their intake in this audit. Don't let the cadence push you into an "apply now" post for a closed program; the "watch this one" angle exists precisely for these. If you want a run of apply-now posts, filter for `status=open` when you pull the API and save the closed ones for a themed roundup.

## 6. Program roster (snapshot, 2026-08-04 audit — re-verify via the API before posting)

Every entry below: the facts the site shows, the strongest hook, the exact 0rbital link, the account to tag, and any caveat the dataset flags. **The "Caveats" and "Status" lines are load-bearing — read them before drafting.**

A note on the "Tag on X" line — not every handle is the program's own account:

- **Personal accounts of the founder/CEO** stand in where the program has none: Neo → `@apartovi` (Ali Partovi, CEO) and AGI House SF → `@JvNixon` (Jeremy Nixon, founder). Tagging a person reads differently from tagging a program, so phrase the post so the tag makes sense — "built by @JvNixon" rather than implying the account *is* the house.
- **Organizer accounts** cover programs run by a larger body: Yale's house → `@yesofyale` (Yale Entrepreneurial Society), and The Bridge's LinkedIn is Entrepreneurs First's page (its X, `@jointhebridge`, is genuinely its own).
- **Network accounts** cover The Residency's themed houses — SF Parc, Arcadia, Homebrew, Aurea, Vienna, Inventors, SF2, and Odyssey all share `@_TheResidency`. Bangalore, Biopunk, and v2 have their own. Don't post two houses on the same day if they'd tag the same account twice.
- **Five programs have no X account at all** (Casa Bernarda, STAK, v2, SILTA, Pluto) — post those without a tag rather than substituting something approximate. Casa Bernarda has no social presence found at all.

Every one of these substitutions is also spelled out in that entry's Caveats line, so you don't have to remember this list.
### 1. HF0 (Hacker Fellowship Zero)

- **Where:** San Francisco, USA
- **Type:** Founder Residency
- **Status:** Applications open
- **Status detail:** 12-week live-in residency, ~10 founders. Up to $1M uncapped SAFE for 5%. Next batches start 13 September 2026 (demo day 4 December) and 4 January 2027; applications open, no stated deadline.
- **Focus:** Repeat & technical founders; deep focus
- **Run by:** Dave Fontenot (& Emily Liu)
- **Duration:** 12 weeks
- **Cohort size:** ~10 teams per batch
- **Stage fit:** pre-seed
- **Founder fit:** technical builder, repeat founder
- **Provides:** housing, workspace, funding
- **Cost:** Free — housing, meals, laundry covered
- **Funding:** $1M uncapped SAFE
- **Equity taken:** 5%
- **Intake:** cohort application, biannual
- **Program site:** https://www.hf0.com/
- **0rbital page:** https://0rbital.app/programs/hf0-hacker-fellowship-zero
- **Tag on X:** @HF0Residency (https://x.com/HF0Residency)
- **LinkedIn:** https://www.linkedin.com/company/hf0/
- **Hook / best detail:** Housed in the historic 22,000 sq ft Archbishop's Mansion by Alamo Square ('the Monastery of Code').
- **Caveats (read before posting):** Live-in 12-week residency. Funding/equity reported inconsistently across sources ($125K/7% up to $1M uncapped/5%) — confirm current cohort terms on hf0.com before relying on a figure.
- **Last verified:** 2026-08-04 (verified)

### 2. AGI House SF

- **Where:** San Francisco, USA
- **Type:** Hacker House
- **Status:** Applications open
- **Status detail:** Events & residencies for AI builders; perched atop Twin Peaks.
- **Focus:** AI / ML, hackathons, frontier research
- **Run by:** Jeremy Nixon (ex-Google Brain)
- **Founder fit:** technical builder, researcher
- **Provides:** housing
- **Intake:** rolling
- **Program site:** https://agihouse.ai/
- **0rbital page:** https://0rbital.app/programs/agi-house-sf
- **Tag on X:** @JvNixon (https://x.com/JvNixon)
- **LinkedIn:** — none found
- **Hook / best detail:** Brings hackathon culture back to SF; AGI House Ventures invests up to $1M.
- **Caveats (read before posting):** Social links: no official AGI House SF accounts found; xUrl is founder Jeremy Nixon's account. Do not use linkedin.com/company/agi-house — that page belongs to the rival Hillsborough AGI House (agihouse.org).
- **Last verified:** 2026-07-05 (verified)

### 3. AGI House (Hillsborough)

- **Where:** Hillsborough, USA
- **Type:** Hacker House
- **Status:** Applications open
- **Status detail:** Palatial AI hacker house with its own venture fund (separate from the SF house).
- **Focus:** AI / ML research & hackathons
- **Run by:** Rocky Yu
- **Cohort size:** 8–10 residents
- **Founder fit:** technical builder, researcher
- **Provides:** housing
- **Funding:** Up to $1M (AGI House Ventures)
- **Intake:** rolling
- **Program site:** https://www.agihouse.org/
- **0rbital page:** https://0rbital.app/programs/agi-house-hillsborough
- **Tag on X:** @agihouse_org (https://x.com/agihouse_org)
- **LinkedIn:** https://www.linkedin.com/company/agi-house/
- **Hook / best detail:** The original Peninsula AGI House; AGI House Ventures backs residents.
- **Last verified:** 2026-07-05 (verified)

### 4. The Residency — SF Parc

- **Where:** San Francisco, USA
- **Type:** Founder Residency
- **Status:** Applications closed (check site for next cycle)
- **Status detail:** Network-wide applications for the Fall 2026 cohort closed 31 July 2026; every house on the residencies page now reads “apply next time”. Placement runs through the shared application — watch the apply page for the next intake.
- **Focus:** Early-stage founders, researchers, artists (all sectors)
- **Run by:** The Residency (livetheresidency)
- **Duration:** 12–26 weeks
- **Stage fit:** idea, pre-seed
- **Provides:** housing, workspace, funding
- **Equity taken:** takes equity (amount varies)
- **Intake:** rolling
- **Program site:** https://www.livetheresidency.com/residencies
- **0rbital page:** https://0rbital.app/programs/the-residency-sf-parc
- **Tag on X:** @_TheResidency (https://x.com/_TheResidency)
- **LinkedIn:** https://www.linkedin.com/school/live-the-residency/
- **Hook / best detail:** Flagship Presidio house; part of a global network of homes.
- **Caveats (read before posting):** Provides housing, food and cash for ~3 months in exchange for equity; cohorts run 3–6 months. Network-wide terms (livetheresidency.com). Social links: network-wide accounts of The Residency (this house has no separate accounts).
- **Last verified:** 2026-08-04 (verified)

### 5. The Residency — Arcadia (Berkeley)

- **Where:** Berkeley, USA
- **Type:** Founder Residency
- **Status:** Applications closed (check site for next cycle)
- **Status detail:** Network-wide applications for the Fall 2026 cohort closed 31 July 2026; every house on the residencies page now reads “apply next time”. Placement runs through the shared application — watch the apply page for the next intake.
- **Focus:** Early-stage founders & builders
- **Run by:** The Residency (livetheresidency)
- **Duration:** 12–26 weeks
- **Cohort size:** 14 bedrooms
- **Provides:** housing
- **Intake:** rolling
- **Program site:** https://www.livetheresidency.com/residencies
- **0rbital page:** https://0rbital.app/programs/the-residency-arcadia-berkeley
- **Tag on X:** @_TheResidency (https://x.com/_TheResidency)
- **LinkedIn:** https://www.linkedin.com/school/live-the-residency/
- **Hook / best detail:** Berkeley house in The Residency network.
- **Caveats (read before posting):** Social links: network-wide accounts of The Residency (this house has no separate accounts).
- **Last verified:** 2026-08-04 (verified)

### 6. The Residency — Homebrew (NYC)

- **Where:** New York, USA
- **Type:** Founder Residency
- **Status:** Applications closed (check site for next cycle)
- **Status detail:** Network-wide applications for the Fall 2026 cohort closed 31 July 2026; every house on the residencies page now reads “apply next time”. Placement runs through the shared application — watch the apply page for the next intake.
- **Focus:** Early-stage founders & builders
- **Run by:** The Residency (livetheresidency)
- **Duration:** 12–26 weeks
- **Provides:** housing
- **Intake:** rolling
- **Program site:** https://www.livetheresidency.com/residencies
- **0rbital page:** https://0rbital.app/programs/the-residency-homebrew-nyc
- **Tag on X:** @_TheResidency (https://x.com/_TheResidency)
- **LinkedIn:** https://www.linkedin.com/school/live-the-residency/
- **Hook / best detail:** East-coast house in The Residency network.
- **Caveats (read before posting):** Social links: network-wide accounts of The Residency (this house has no separate accounts).
- **Last verified:** 2026-08-04 (verified)

### 7. The Residency — Bangalore

- **Where:** Bangalore, India
- **Type:** Founder Residency
- **Status:** Applications open
- **Status detail:** HSR Layout co-living with weekly successful-founder mentors. Runs its own rolling intake on residencyblr.com (“reviewed on a rolling basis — apply now for the next cohort”), separate from The Residency's network-wide application, which closed 31 July 2026.
- **Focus:** Builders, researchers, artists; early-stage, hustle-y
- **Run by:** The Residency (livetheresidency)
- **Provides:** housing, workspace
- **Intake:** rolling
- **Program site:** https://www.residencyblr.com/
- **0rbital page:** https://0rbital.app/programs/the-residency-bangalore
- **Tag on X:** @residencyBLR (https://x.com/residencyBLR)
- **LinkedIn:** https://www.linkedin.com/company/residencyblr/
- **Hook / best detail:** India house in The Residency network.
- **Last verified:** 2026-08-04 (verified)

### 8. The Residency — Aurea (Berlin)

- **Where:** Berlin, Germany
- **Type:** Founder Residency
- **Status:** Applications closed (check site for next cycle)
- **Status detail:** Network-wide applications for the Fall 2026 cohort closed 31 July 2026; every house on the residencies page now reads “apply next time”. Placement runs through the shared application — watch the apply page for the next intake.
- **Focus:** Deep tech — builders, scientists & engineers chasing breakthroughs
- **Run by:** The Residency (livetheresidency)
- **Duration:** 12–26 weeks
- **Provides:** housing
- **Intake:** rolling
- **Program site:** https://www.livetheresidency.com/residencies
- **0rbital page:** https://0rbital.app/programs/the-residency-aurea-berlin
- **Tag on X:** @_TheResidency (https://x.com/_TheResidency)
- **LinkedIn:** https://www.linkedin.com/school/live-the-residency/
- **Hook / best detail:** Berlin deep-tech house (Aurea) in The Residency network.
- **Caveats (read before posting):** Social links: network-wide accounts of The Residency (this house has no separate accounts).
- **Last verified:** 2026-08-04 (verified)

### 9. Foundry (Foundry Coliving)

- **Where:** San Francisco, USA
- **Type:** Hacker House
- **Status:** Applications open
- **Status detail:** Residency-style coliving; 100+ founders & engineers have lived there.
- **Focus:** Startup founders & engineers
- **Run by:** Foundry
- **Provides:** housing, workspace
- **Cost:** $1,890–$2,090/mo (discounts 6+ months)
- **Intake:** rolling
- **Program site:** https://foundry.today/
- **0rbital page:** https://0rbital.app/programs/foundry-foundry-coliving
- **Tag on X:** @foundry_today (https://x.com/foundry_today)
- **LinkedIn:** — none found
- **Hook / best detail:** Self-styled 'Number One Hacker House' in SF.
- **Caveats (read before posting):** Social links: no Foundry Coliving LinkedIn page found (linkedin.com/company/foundryglobal is an unrelated company).
- **Last verified:** 2026-07-05 (verified)

### 10. Accelr8

- **Where:** San Francisco, USA
- **Type:** Hacker House
- **Status:** Applications open
- **Status detail:** Where founders live: co-living + co-working community.
- **Focus:** Founders — co-living + co-working
- **Run by:** Accelr8
- **Cohort size:** 120+ residents
- **Provides:** housing, workspace
- **Intake:** rolling
- **Program site:** https://joinaccelr8.com/
- **0rbital page:** https://0rbital.app/programs/accelr8
- **Tag on X:** @joinaccelr8 (https://x.com/joinaccelr8)
- **LinkedIn:** https://www.linkedin.com/company/joinaccelr8/
- **Hook / best detail:** Residency program blending housing and workspace for founders.
- **Last verified:** 2026-07-05 (verified)

### 11. STAK Space

- **Where:** Oakland, USA
- **Type:** Hacker House
- **Status:** Applications open
- **Status detail:** Live/work/play STAK Space offering in Oakland; official root site replaces prior third-party listicle URL.
- **Focus:** Founders & builders, close-knit startup community
- **Run by:** STAK
- **Provides:** housing, workspace
- **Cost:** Memberships $299–$1,800/mo
- **Intake:** rolling
- **Program site:** https://stakspace.com/
- **0rbital page:** https://0rbital.app/programs/stak-space
- **Tag on X:** — none found; post without a tag
- **LinkedIn:** https://www.linkedin.com/company/behringco/
- **Hook / best detail:** Large-scale East Bay hacker house.
- **Caveats (read before posting):** Social links: no STAK Space X/LinkedIn accounts found; linkedinUrl is operator Behring Co's page.
- **Last verified:** 2026-07-05 (verified)

### 12. FoundHer House

- **Where:** San Francisco, USA
- **Type:** Hacker House
- **Status:** Applications open
- **Status detail:** All-female co-living/working space for women founders.
- **Focus:** Women-led startups; all-female co-living & working
- **Run by:** FoundHer House
- **Duration:** 12–13 weeks
- **Provides:** housing
- **Cost:** $1,000–$1,300/mo (sponsor-subsidized)
- **Intake:** cohort application
- **Program site:** https://www.foundherhouse.org/
- **0rbital page:** https://0rbital.app/programs/foundher-house
- **Tag on X:** @foundherhouse (https://x.com/foundherhouse)
- **LinkedIn:** https://www.linkedin.com/company/foundher-house/
- **Hook / best detail:** Designed to foster women-led tech startups.
- **Last verified:** 2026-07-05 (needs-review)

### 13. Startup Embassy

- **Where:** Palo Alto, USA
- **Type:** Hacker House
- **Status:** Applications open
- **Status detail:** NEEDS REVIEW: Palo Alto's longest-running founder co-living, and the application form is still live, but the site footer reads © 2012–2022 and the most recent dated content on it is from February 2019. No activity in the last ~90 days could be verified — possible dormancy.
- **Focus:** Tech entrepreneurs visiting Silicon Valley
- **Run by:** Startup Embassy
- **Cohort size:** 10 beds
- **Provides:** housing, workspace
- **Program site:** https://startupembassy.com/
- **0rbital page:** https://0rbital.app/programs/startup-embassy
- **Tag on X:** @StartupEmbassy (https://x.com/StartupEmbassy)
- **LinkedIn:** https://www.linkedin.com/company/startup-embassy/
- **Hook / best detail:** Long-running Silicon Valley founder house.
- **Last verified:** 2026-08-04 (needs-review)

### 14. Georgia Tech Hacker House

- **Where:** Atlanta, USA
- **Type:** Hacker House
- **Status:** Applications open
- **Status detail:** Currently accepting applications for Fall 2026 on a rolling basis (© 2026 HackerHouse Campus Inc.).
- **Focus:** Students building & finding product-market fit
- **Run by:** Georgia Tech
- **Cohort size:** ~10 residents/semester
- **Stage fit:** student
- **Founder fit:** student founder
- **Provides:** housing, workspace
- **Cost:** $49/semester membership + rent
- **Intake:** rolling, biannual
- **Program site:** https://www.gthackerhouse.com/
- **0rbital page:** https://0rbital.app/programs/georgia-tech-hacker-house
- **Tag on X:** @gthackerhouse (https://x.com/gthackerhouse)
- **LinkedIn:** https://www.linkedin.com/company/gt-hackerhouse/
- **Hook / best detail:** University-run hacker house for student founders.
- **Last verified:** 2026-08-04 (verified)

### 15. Casa Bernarda

- **Where:** Mérida, Mexico
- **Type:** Hacker House
- **Status:** Applications open
- **Status detail:** NEEDS REVIEW (scope): books by the day, week or month and is open to “developers, founders and digital nomads” rather than running a selective founder cohort — this reads as generic nomad co-living. Site also shows © 2025 and its room listing fails to load.
- **Focus:** Developers, founders, digital nomads
- **Run by:** Casa Bernarda
- **Program site:** https://hackerhousemerida.com/
- **0rbital page:** https://0rbital.app/programs/casa-bernarda
- **Tag on X:** — none found; post without a tag
- **LinkedIn:** — none found
- **Hook / best detail:** LatAm builder house in Mérida.
- **Last verified:** 2026-08-04 (needs-review)

### 16. FR8 (Hacker Hotel)

- **Where:** Espoo, Finland
- **Type:** Hacker House
- **Status:** Applications open
- **Status detail:** Cohort 2.f runs 24 August – 21 November 2026, with demo day at Slush. Applications reviewed on a rolling basis with no published deadline, but the cohort starts 24 August — apply early. Covers flights, room and food for three months; takes 0% equity.
- **Focus:** Young technical builders (under 30) — deep tech, hardware, AI research
- **Run by:** FR8
- **Duration:** 13 weeks
- **Cost:** Free — flights, hotel room and food covered
- **Equity taken:** None
- **Intake:** rolling
- **Program site:** https://fr8.so/
- **0rbital page:** https://0rbital.app/programs/fr8-hacker-hotel
- **Tag on X:** @shipfr8 (https://x.com/shipfr8)
- **LinkedIn:** https://www.linkedin.com/company/fr8so/
- **Hook / best detail:** Resort-style stay + collaborative tech environment.
- **Last verified:** 2026-08-04 (verified)

### 17. Neo (Accelerator / Residency)

- **Where:** San Francisco, USA
- **Type:** Founder Residency
- **Status:** Applications open
- **Status detail:** Neo Residency: 3 months SF + 2-week Oregon bootcamp; $750K uncapped SAFE + $450K credits.
- **Focus:** Top young technical founders & students
- **Run by:** Ali Partovi
- **Duration:** 12–14 weeks
- **Cohort size:** 20 teams
- **Stage fit:** pre-idea, idea, pre-seed, student
- **Provides:** workspace
- **Cost:** Free (funded program)
- **Funding:** $750K uncapped SAFE + $450K+ credits
- **Equity taken:** Participation rights up to 5%
- **Intake:** cohort application, annual
- **Program site:** https://neo.com/residency
- **0rbital page:** https://0rbital.app/programs/neo-accelerator-residency
- **Tag on X:** @apartovi (https://x.com/apartovi)
- **LinkedIn:** https://www.linkedin.com/company/neoventures/
- **Hook / best detail:** Low-dilution residency replacing the original Neo Accelerator (Feb 2026).
- **Caveats (read before posting):** Social links: neo.com publishes no socials; xUrl is CEO Ali Partovi's account (posts Neo Residency news).
- **Last verified:** 2026-07-05 (verified)

### 18. Forge — Bangalore (Cohort 1)

- **Where:** Bangalore, India
- **Type:** Founder Residency
- **Status:** Applications closed (check site for next cycle)
- **Status detail:** Cohort 01 “Troy” (Bengaluru, July 2026, 16 fellows, 31 days) is marked complete on the official cohorts page. Applications now run through Cohort 02.
- **Focus:** '-1 to 0' contrarian builders going full-time
- **Run by:** Adi (forge / adihuman ai)
- **Duration:** 4–5 weeks
- **Cohort size:** 16 fellows
- **Provides:** housing
- **Intake:** cohort application
- **Program site:** https://www.forgeresidency.com/cohorts/1
- **0rbital page:** https://0rbital.app/programs/forge-bangalore-cohort-1
- **Tag on X:** @forgeresidency (https://x.com/forgeresidency)
- **LinkedIn:** https://www.linkedin.com/company/forgeind/
- **Hook / best detail:** Born in Mumbai (Cohort 0, Mar 2026); 'a sanctuary for the contrarian.' EST 2026.
- **Last verified:** 2026-08-04 (verified)

### 19. Forge — Goa (Cohort 2)

- **Where:** Goa, India
- **Type:** Founder Residency
- **Status:** Applications open
- **Status detail:** Cohort 02 “Alexandria”, Goa: 11 October – 1 November 2026, 12–14 founders, 22 days. Applications open. Grant funding opens with this cohort — cash grants, compute credits and follow-on capital, no equity.
- **Focus:** '-1 to 0' contrarian builders
- **Run by:** Adi (forge / adihuman ai)
- **Duration:** 3 weeks
- **Cohort size:** 12–14 founders
- **Provides:** housing
- **Equity taken:** None
- **Intake:** cohort application
- **Program site:** https://www.forgeresidency.com/cohorts/2
- **0rbital page:** https://0rbital.app/programs/forge-goa-cohort-2
- **Tag on X:** @forgeresidency (https://x.com/forgeresidency)
- **LinkedIn:** https://www.linkedin.com/company/forgeind/
- **Hook / best detail:** Cohort 02 relocates to Goa (not Bali, as earlier announced); first Forge cohort to carry grant funding.
- **Last verified:** 2026-08-04 (verified)

### 20. Forge — Dubai (Cohort 3)

- **Where:** Dubai, UAE
- **Type:** Founder Residency
- **Status:** Announced, not open yet
- **Status detail:** NEEDS REVIEW: the official cohorts page now lists Cohort 03 as “Ithaca — in development” with no city announced, and no longer mentions Dubai (or Bali) anywhere. The Dubai location is unconfirmed — this record should be renamed to Ithaca (city TBD) or removed.
- **Focus:** '-1 to 0' contrarian builders
- **Run by:** Adi (forge / adihuman ai)
- **Cohort size:** 16 fellows
- **Provides:** housing
- **Intake:** cohort application
- **Program site:** https://www.forgeresidency.com/cohorts
- **0rbital page:** https://0rbital.app/programs/forge-dubai-cohort-3
- **Tag on X:** @forgeresidency (https://x.com/forgeresidency)
- **LinkedIn:** https://www.linkedin.com/company/forgeind/
- **Hook / best detail:** Forge's planned Middle East expansion.
- **Last verified:** 2026-08-04 (needs-review)

### 21. Arrayah (Araya) — Sydney

- **Where:** Sydney, Australia
- **Type:** Hacker House
- **Status:** Applications open
- **Status detail:** Houses 'Billabong' (Drummoyne) & 'Banksia'; 9-resident homes with coworking + hardware lab. Runs a 14-day residency.
- **Focus:** Founders, artists & researchers; AI-era creativity
- **Run by:** Akshat Agarwal
- **Duration:** 1–5 weeks
- **Cohort size:** 10–21 per house
- **Provides:** housing, workspace
- **Equity taken:** None
- **Intake:** cohort application
- **Program site:** https://arrayah.city/
- **0rbital page:** https://0rbital.app/programs/arrayah-araya-sydney
- **Tag on X:** @_Arrayah (https://x.com/_Arrayah)
- **LinkedIn:** https://www.linkedin.com/company/live-arrayah/
- **Hook / best detail:** Australia's hacker-house experiment — 'a campfire for founders, artists and researchers.'
- **Last verified:** 2026-07-05 (verified)

### 22. Arrayah (Araya) — Melbourne

- **Where:** Melbourne, Australia
- **Type:** Hacker House
- **Status:** Announced, not open yet
- **Status detail:** Melbourne home announced as launching soon.
- **Focus:** Founders, artists & researchers
- **Run by:** Akshat Agarwal
- **Cohort size:** 10–21 per house
- **Provides:** housing, workspace
- **Equity taken:** None
- **Intake:** cohort application
- **Program site:** https://arrayah.city/
- **0rbital page:** https://0rbital.app/programs/arrayah-araya-melbourne
- **Tag on X:** @_Arrayah (https://x.com/_Arrayah)
- **LinkedIn:** https://www.linkedin.com/company/live-arrayah/
- **Hook / best detail:** Arrayah's Victoria expansion.
- **Last verified:** 2026-07-05 (verified)

### 23. Arrayah (Araya) — Brisbane

- **Where:** Brisbane, Australia
- **Type:** Hacker House
- **Status:** Announced, not open yet
- **Status detail:** Brisbane home announced as launching soon.
- **Focus:** Founders, artists & researchers
- **Run by:** Akshat Agarwal
- **Cohort size:** 10–21 per house
- **Provides:** housing, workspace
- **Equity taken:** None
- **Intake:** cohort application
- **Program site:** https://arrayah.city/
- **0rbital page:** https://0rbital.app/programs/arrayah-araya-brisbane
- **Tag on X:** @_Arrayah (https://x.com/_Arrayah)
- **LinkedIn:** https://www.linkedin.com/company/live-arrayah/
- **Hook / best detail:** Arrayah's Queensland expansion.
- **Last verified:** 2026-07-05 (verified)

### 24. The Residency — Vienna

- **Where:** Vienna, Austria
- **Type:** Founder Residency
- **Status:** Applications closed (check site for next cycle)
- **Status detail:** Network-wide applications for the Fall 2026 cohort closed 31 July 2026; every house on the residencies page now reads “apply next time”. Placement runs through the shared application — watch the apply page for the next intake.
- **Focus:** Early-stage founders, researchers, artists
- **Run by:** The Residency (livetheresidency)
- **Duration:** 12–26 weeks
- **Provides:** housing, workspace
- **Intake:** rolling
- **Program site:** https://www.livetheresidency.com/residencies
- **0rbital page:** https://0rbital.app/programs/the-residency-vienna
- **Tag on X:** @_TheResidency (https://x.com/_TheResidency)
- **LinkedIn:** https://www.linkedin.com/school/live-the-residency/
- **Hook / best detail:** Vienna house in The Residency network.
- **Caveats (read before posting):** Social links: network-wide accounts of The Residency (this house has no separate accounts).
- **Last verified:** 2026-08-04 (verified)

### 25. The Residency — Inventors (SF)

- **Where:** San Francisco, USA
- **Type:** Founder Residency
- **Status:** Applications closed (check site for next cycle)
- **Status detail:** Network-wide applications for the Fall 2026 cohort closed 31 July 2026; every house on the residencies page now reads “apply next time”. Placement runs through the shared application — watch the apply page for the next intake.
- **Focus:** Inventors — researchers, founders & creatives doing something novel
- **Run by:** The Residency (livetheresidency)
- **Duration:** 12 weeks
- **Provides:** housing
- **Intake:** rolling
- **Program site:** https://www.livetheresidency.com/residencies
- **0rbital page:** https://0rbital.app/programs/the-residency-inventors-sf
- **Tag on X:** @_TheResidency (https://x.com/_TheResidency)
- **LinkedIn:** https://www.linkedin.com/school/live-the-residency/
- **Hook / best detail:** SF 'inventors' house in The Residency network.
- **Caveats (read before posting):** Social links: network-wide accounts of The Residency (this house has no separate accounts).
- **Last verified:** 2026-08-04 (verified)

### 26. The Residency — SF2

- **Where:** San Francisco, USA
- **Type:** Hacker House
- **Status:** Applications closed (check site for next cycle)
- **Status detail:** Network-wide applications for the Fall 2026 cohort closed 31 July 2026; every house on the residencies page now reads “apply next time”. Placement runs through the shared application — watch the apply page for the next intake.
- **Focus:** Hardware & deep tech — humanoid robots, BCIs, rockets
- **Run by:** The Residency (livetheresidency)
- **Provides:** housing
- **Intake:** rolling
- **Program site:** https://sf2.sh/
- **0rbital page:** https://0rbital.app/programs/the-residency-sf2
- **Tag on X:** @_TheResidency (https://x.com/_TheResidency)
- **LinkedIn:** https://www.linkedin.com/school/live-the-residency/
- **Hook / best detail:** SF deep-tech house in The Residency network.
- **Caveats (read before posting):** Social links: network-wide accounts of The Residency (this house has no separate accounts).
- **Last verified:** 2026-08-04 (verified)

### 27. The Residency — Odyssey (SF)

- **Where:** San Francisco, USA
- **Type:** Founder Residency
- **Status:** Applications closed (check site for next cycle)
- **Status detail:** Network-wide applications for the Fall 2026 cohort closed 31 July 2026; every house on the residencies page now reads “apply next time”. Placement runs through the shared application — watch the apply page for the next intake.
- **Focus:** Purpose-driven founders with universe-denting ambition
- **Run by:** The Residency (livetheresidency)
- **Duration:** 12–26 weeks
- **Provides:** housing
- **Intake:** rolling
- **Program site:** https://www.livetheresidency.com/residencies
- **0rbital page:** https://0rbital.app/programs/the-residency-odyssey-sf
- **Tag on X:** @_TheResidency (https://x.com/_TheResidency)
- **LinkedIn:** https://www.linkedin.com/school/live-the-residency/
- **Hook / best detail:** SF 'purpose-driven' house in The Residency network.
- **Caveats (read before posting):** Social links: network-wide accounts of The Residency (this house has no separate accounts).
- **Last verified:** 2026-08-04 (verified)

### 28. The Residency — Biopunk (SF)

- **Where:** San Francisco, USA
- **Type:** Founder Residency
- **Status:** Applications closed (check site for next cycle)
- **Status detail:** Network-wide applications for the Fall 2026 cohort closed 31 July 2026; every house on the residencies page now reads “apply next time”. Placement runs through the shared application — watch the apply page for the next intake. Biopunk Lab separately runs a rolling “apply for membership” form on biopunklab.com, which is not the residency intake.
- **Focus:** Biotech — community biolab; DIY, rebellious, collaborative
- **Run by:** The Residency (livetheresidency)
- **Provides:** workspace
- **Intake:** rolling
- **Program site:** https://biopunklab.com/
- **0rbital page:** https://0rbital.app/programs/the-residency-biopunk-sf
- **Tag on X:** @BiopunkLab (https://x.com/BiopunkLab)
- **LinkedIn:** https://www.linkedin.com/company/biopunklab/
- **Hook / best detail:** SF biotech house in The Residency network.
- **Last verified:** 2026-08-04 (verified)

### 29. The Residency — v2 (Vancouver)

- **Where:** Vancouver, Canada
- **Type:** Founder Residency
- **Status:** Applications closed (check site for next cycle)
- **Status detail:** Network-wide applications for the Fall 2026 cohort closed 31 July 2026; every house on the residencies page now reads “apply next time”. Placement runs through the shared application — watch the apply page for the next intake.
- **Focus:** Creative technologists — artistic taste meets tech
- **Run by:** The Residency (livetheresidency)
- **Duration:** 16–17 weeks
- **Provides:** housing
- **Cost:** ~$1,400/mo rent + ~$100/mo programming
- **Intake:** rolling
- **Program site:** https://v2.city/
- **0rbital page:** https://0rbital.app/programs/the-residency-v2-vancouver
- **Tag on X:** — none found; post without a tag
- **LinkedIn:** https://www.linkedin.com/company/v2city/
- **Hook / best detail:** Canada house in The Residency network.
- **Caveats (read before posting):** Social links: no V2-specific X account found; LinkedIn is V2's own page.
- **Last verified:** 2026-08-04 (verified)

### 30. The Founding Co. (Hyderabad)

- **Where:** Hyderabad, India
- **Type:** Hacker House
- **Status:** Cohort in session
- **Status detail:** Cohort I in session: applications closed 15 June 2026, cohort started 3 July 2026 and runs 90 days (through late September). 12 founders, full costs covered, monthly stipend, weekly demo days & investor intros.
- **Focus:** Founders already in motion — costs covered + stipend
- **Run by:** The Founding Co. (Residency-affiliated)
- **Duration:** 12–13 weeks
- **Cohort size:** 12 founders
- **Stage fit:** pre-product, mvp, pre-seed
- **Founder fit:** solo founder
- **Provides:** housing, workspace
- **Cost:** Free — housing + meals covered, ₹40,000/mo stipend
- **Equity taken:** 1%
- **Intake:** cohort application
- **Program site:** https://www.thefounding.co/founders
- **0rbital page:** https://0rbital.app/programs/the-founding-co-hyderabad
- **Tag on X:** @thefoundingco_ (https://x.com/thefoundingco_)
- **LinkedIn:** https://www.linkedin.com/company/thefoundingco/
- **Hook / best detail:** High-accountability Indian founder house surfaced via The Residency network.
- **Last verified:** 2026-08-04 (verified)

### 31. Focal Founder Residency

- **Where:** Miami, USA
- **Type:** Founder Residency
- **Status:** Applications closed (check site for next cycle)
- **Status detail:** 3+ month fully in-person residency at The LAB Miami (Wynwood); Miami relocation required (all co-founders), 6 days/wk, 10 founders, costs offset, optional $25K–$50K SAFE. Next residency runs January 2027, with applications opening October 2026.
- **Focus:** Hardcore technical / AI founders; venture-scale
- **Run by:** Pascal Unger (Focal VC)
- **Duration:** 12–13 weeks
- **Cohort size:** 10 teams
- **Stage fit:** idea, pre-seed
- **Founder fit:** technical builder
- **Provides:** housing
- **Cost:** Free — relocation costs offset
- **Intake:** cohort application, annual
- **Program site:** https://www.focal.vc/residency
- **0rbital page:** https://0rbital.app/programs/focal-founder-residency
- **Tag on X:** @focal_vc (https://x.com/focal_vc)
- **LinkedIn:** https://www.linkedin.com/company/focal-vc/
- **Hook / best detail:** 'All the firepower of a top accelerator without the heavy dilution' — but genuinely residential (you relocate to Miami).
- **Last verified:** 2026-08-04 (verified)

### 32. Frontier Tower (BerlinHouse)

- **Where:** San Francisco, USA
- **Type:** Hacker House
- **Status:** Applications open
- **Status detail:** 16-floor 'vertical village' at 995 Market St with 8 themed labs + co-living residences. Originally named Berlin House.
- **Focus:** Frontier tech & arts — AI, crypto, biotech, longevity, deep tech
- **Run by:** Jakob Drzazga & Christian Nagel (Deep Ink Ventures)
- **Cohort size:** 750+ members
- **Provides:** workspace
- **Cost:** Membership $190/mo ($1,800/yr)
- **Intake:** rolling
- **Program site:** https://frontiertower.io/
- **0rbital page:** https://0rbital.app/programs/frontier-tower-berlinhouse
- **Tag on X:** @frontiertower (https://x.com/frontiertower)
- **LinkedIn:** https://www.linkedin.com/company/frontiertower/
- **Hook / best detail:** A whole tower as a hacker house — co-living floors stacked over themed frontier-tech labs.
- **Last verified:** 2026-07-05 (verified)

### 33. Hexa House

- **Where:** San Francisco, USA
- **Type:** Hacker House
- **Status:** Applications open
- **Status detail:** Hexa Start applications are open; official Hexa House post says every Start founder can live and build from Hexa House San Francisco.
- **Focus:** AI founders — live & build
- **Run by:** Hexa (startup studio)
- **Duration:** 12–13 weeks
- **Cohort size:** Small curated first cohort
- **Founder fit:** international founder, relocating founder, technical builder
- **Provides:** housing
- **Intake:** cohort application
- **Program site:** https://www.hexa.com/apply-as-a-founder
- **0rbital page:** https://0rbital.app/programs/hexa-house
- **Tag on X:** @joinhexa (https://x.com/joinhexa)
- **LinkedIn:** https://www.linkedin.com/company/joinhexa/
- **Hook / best detail:** Hexa's US expansion — a live-and-build house for AI founders.
- **Last verified:** 2026-07-05 (verified)

### 34. Bili House

- **Where:** Bellevue, USA
- **Type:** Hacker House
- **Status:** Applications open
- **Status detail:** Rolling applications; 1–3 month stays ($500–$2,000/mo). 7,000 sq ft waterfront house on Meydenbauer Bay with pool and boat dock.
- **Focus:** AI, dev tools & B2B startup founders
- **Run by:** Shawn Yang & founding team
- **Provides:** housing, workspace
- **Intake:** rolling
- **Program site:** https://www.joinbili.com/apply
- **0rbital page:** https://0rbital.app/programs/bili-house
- **Tag on X:** @bili_nyc (https://x.com/bili_nyc)
- **LinkedIn:** https://www.linkedin.com/company/bilihouse/
- **Hook / best detail:** Seattle area's flagship founder hacker house — waterfront mansion in Bellevue supporting the Pacific Northwest startup scene.
- **Last verified:** 2026-07-05 (verified)

### 35. Hacker Residency Group

- **Where:** Da Nang, Vietnam
- **Type:** Founder Residency
- **Status:** Applications closed (check site for next cycle)
- **Status detail:** Most recent official site advertises the May 1–May 31, 2026 Da Nang residency; no current official source verified a new cohort, so applications are treated as closed.
- **Focus:** Indie hackers, SaaS & product founders
- **Run by:** Travis Fischer, Tony Dinh & Minh-Phuc Tran
- **Duration:** 4–5 weeks
- **Cohort size:** 10 founders
- **Provides:** housing, workspace
- **Cost:** Free — villa, food, laundry covered (you pay flights)
- **Equity taken:** None
- **Intake:** cohort application
- **Program site:** https://www.hackerresidencygroup.com/
- **0rbital page:** https://0rbital.app/programs/hacker-residency-group
- **Tag on X:** @HackerResidency (https://x.com/HackerResidency)
- **LinkedIn:** — none found
- **Hook / best detail:** Led by world-class indie hackers (Tony Dinh: $1M+ ARR solo; Travis Fischer: 2 exits). Vietnam's premier founder residency.
- **Caveats (read before posting):** Social links: no company LinkedIn page found; site lists only personal profiles.
- **Last verified:** 2026-07-05 (verified)

### 36. Yale Entrepreneurial Society Hacker House

- **Where:** San Francisco, USA
- **Type:** Hacker House
- **Status:** Applications closed (check site for next cycle)
- **Status detail:** Summer 2026 edition ran late May to the end of July 2026 and has now wrapped: 12 Yale founders, 10 weeks in a Nob Hill house, sponsored by Raymond Tonsing (Caffeinated Capital). Residents reported ~$17M raised collectively. No 2027 edition announced yet.
- **Focus:** Yale student founders — technical, venture-scale
- **Run by:** Yale Entrepreneurial Society (Leia Ryan & Oliver Hime)
- **Duration:** 10 weeks
- **Cohort size:** 9 founders (first cohort)
- **Stage fit:** student
- **Founder fit:** student founder
- **Provides:** housing, workspace
- **Cost:** Free — fully funded housing + office for the summer
- **Program site:** https://www.yalehackerhouse.com/
- **0rbital page:** https://0rbital.app/programs/yale-entrepreneurial-society-hacker-house
- **Tag on X:** @yesofyale (https://x.com/yesofyale)
- **LinkedIn:** https://www.linkedin.com/company/yale-entrepreneur-society/
- **Hook / best detail:** Yale's first SF hacker house — elite student founders plugging directly into the Bay Area ecosystem for a summer.
- **Caveats (read before posting):** Social links: accounts are the organizer's (Yale Entrepreneurial Society); the house has no separate accounts.
- **Last verified:** 2026-08-04 (needs-review)

### 37. SILTA

- **Where:** San Francisco, USA
- **Type:** Founder Residency
- **Status:** Applications closed (check site for next cycle)
- **Status detail:** Applications for the Fall '26 cohort are closed; Spring '27 applications open October 2026. SILTA has run 8 cohorts (12-week programme, 6-week option), taking Finnish early-stage founders to a founder house in SF.
- **Focus:** Finnish early-stage founders; US market validation, fundraising
- **Run by:** SILTA (Finland → Silicon Valley)
- **Stage fit:** pre-product, pre-seed
- **Founder fit:** technical builder
- **Provides:** housing
- **Intake:** cohort application, biannual
- **Program site:** https://www.siltahouse.com/
- **0rbital page:** https://0rbital.app/programs/silta
- **Tag on X:** — none found; post without a tag
- **LinkedIn:** https://www.linkedin.com/school/siltahq/
- **Hook / best detail:** A Finnish founder house in Silicon Valley — a cohort that crosses the Atlantic to live and build together for a season.
- **Caveats (read before posting):** Social links: no SILTA X account found; LinkedIn from siltahouse.com footer.
- **Last verified:** 2026-08-04 (verified)

### 38. The Bridge (by Entrepreneurs First)

- **Where:** San Francisco, USA
- **Type:** Founder Residency
- **Status:** Applications open
- **Status detail:** 8-wk SF residency: apply solo, get matched, then live & build together in a Bay Area hacker house. Housing + board + visa support. EF invests $250K ($125K for 8% SAFE + optional $125K MFN). Fall '26 cohort is open — applications close 30 August 2026, programme starts October 2026.
- **Focus:** Pre-team/pre-idea founders; cofounder matching → company building
- **Run by:** Entrepreneurs First
- **Duration:** 8 weeks
- **Cohort size:** 40 spots
- **Stage fit:** pre-idea, pre-seed
- **Founder fit:** solo founder, technical builder, domain expert
- **Provides:** housing, workspace, funding
- **Cost:** Free — housing, food, workspace covered
- **Funding:** $250K ($125K for 8% SAFE + optional $125K MFN)
- **Equity taken:** 8%
- **Intake:** cohort application, quarterly
- **Program site:** https://www.join-thebridge.com/
- **0rbital page:** https://0rbital.app/programs/the-bridge-by-entrepreneurs-first
- **Tag on X:** @jointhebridge (https://x.com/jointhebridge)
- **LinkedIn:** https://www.linkedin.com/company/entrepreneur-first/
- **Hook / best detail:** EF's relocation residency — cofounder matching that moves into an SF hacker house for 8 weeks.
- **Caveats (read before posting):** Social links: linkedinUrl is organizer Entrepreneurs First's page; The Bridge has no separate LinkedIn.
- **Last verified:** 2026-08-04 (verified)

### 39. Pluto (AI Hacker House)

- **Where:** Zurich, Switzerland
- **Type:** Hacker House
- **Status:** Applications closed (check site for next cycle)
- **Status detail:** Roving AI/robotics builder residency (most recent cohorts: Munich, Zurich, Paris). Site states “applications for the next cohort will open soon” — between cohorts, not closed down.
- **Focus:** AI & robotics builders
- **Run by:** Pluto
- **Duration:** 1 week
- **Cohort size:** ~15 per batch
- **Provides:** housing, workspace
- **Cost:** Free — no costs, no equity (+ cloud & Claude Code credits)
- **Equity taken:** None
- **Intake:** cohort application
- **Program site:** https://joinpluto.io
- **0rbital page:** https://0rbital.app/programs/pluto-ai-hacker-house
- **Tag on X:** — none found; post without a tag
- **LinkedIn:** https://www.linkedin.com/company/joinpluto/
- **Hook / best detail:** Roving live-in residency for AI/robotics builders.
- **Caveats (read before posting):** Moving/pop-up program: each cohort runs in a different city, so an ended location is not a closure. Domain moved pluto.community -> joinpluto.io; verify cadence via LinkedIn. Social links: no Pluto X account found; LinkedIn is where the program announces cohorts.
- **Last verified:** 2026-08-04 (verified)
