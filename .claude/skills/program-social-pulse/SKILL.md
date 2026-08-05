---
name: program-social-pulse
description: >-
  Pull dated social activity for the founder programs listed on Orbital, so
  liveness calls rest on "last posted 2026-07-28" instead of a guess. Use when
  asked to check what programs have been posting, to get social recency before a
  liveness audit, to refresh xUrl/linkedinUrl handles, or when a dormancy call
  needs evidence. Reads the X API (pay-per-use) via scripts/social-pulse.ts and
  falls back to free public signals when no token is configured. This is the
  EVIDENCE-GATHERING skill — it does not change program data or open PRs;
  `program-liveness-audit` consumes its output and proposes the changes.
---

# Orbital — program social pulse

This skill answers one question per program: **when did this program last show a
sign of life, and where did I see it?** It produces dated evidence. It does not
decide anything — `program-liveness-audit` makes the calls, and
`founder-atlas-refresh` edits the data.

It exists because of a specific failure. In the 2026-08 audit, LinkedIn returned
HTTP 999 and X returned HTTP 402 to every automated fetch, so the entire pass ran
on websites alone. That is precisely the wrong blind spot: the question that
started the audit was "Forge has gone quiet on socials, are they dead?" and it
was unanswerable from the site. (The site said otherwise — an open cohort dated
11 Oct – 1 Nov — so the answer was *no*. But that was luck, not method.)

## What the access situation actually is

Read this before promising anyone social coverage. It changed in 2026 and the
old assumptions are wrong.

| Source | Reality | Verdict |
| --- | --- | --- |
| **X / Twitter** | Free tier **discontinued for new developers** (6 Feb 2026). Pay-per-use is now the default: **$0.005 per post read**, capped 2M reads/month. Legacy Basic ($200/mo) and Pro ($5,000/mo) are closed to new signups. | **Use it.** ~39 programs × 20 posts ≈ **$4/month**. |
| **LinkedIn** | The official API **cannot read other companies' posts at all** — the Community Management API only publishes to pages you own. Partner Program approval takes 4 weeks–4 months, is manually reviewed, and is often rejected; Sales Navigator API is closed to new partners. Plain fetches return **HTTP 999**. | **Not available officially.** Do not promise it. |
| **Program's own site** | Cohort pages, apply pages, changelogs, blogs. Free. | **Always check. Ranks above socials — see below.** |
| **Luma** | Public event pages carry hard future dates. Free. | Use for houses that run events. |
| **Press / search** | Free, but *lags*. In this run, search snippets still said Forge's cohort 2 was in "Bali" weeks after the site said Goa. | Corroboration only, never primary. |

**If LinkedIn coverage is ever requested:** the only routes are third-party
vendors (Bright Data, Apify, Scrapingdog; ~$1.5/1,000 records). Public-data
scraping is broadly lawful in the US after *hiQ v. LinkedIn*, but Proxycurl was
shut down in 2025 after litigation over **fake-account** access. So: reputable
vendor, public data only, never credentialed scraping. Get a human decision
before adding that dependency — don't take it on your own initiative.

## Prerequisite — the handles must exist first

The script reads each record's **`xUrl`**. On `master` that field does not exist
yet: it is added by **PR #93 ("Add official X + LinkedIn links to all program
records")**, which fills `xUrl` for 34 of 39 programs and `linkedinUrl` for 35.

Until #93 merges, `social-pulse.ts` runs but selects **0 handles** and costs
nothing — it is correctly reporting that it has nothing to check, not that the
programs are quiet. **Merge #93 before relying on this skill.** After it lands,
re-run `--dry-run` to confirm the handle count jumps to ~34.

Five programs have no X account of their own (Casa Bernarda, STAK, v2, SILTA,
Pluto). For those, fall back to the site + LinkedIn-by-hand, and record
`no-handle` rather than treating the silence as a signal.

## Setup — what "active" requires

1. **An X developer account** with an app, at <https://developer.x.com>. Copy the
   app's **Bearer token** (App-only OAuth 2.0 — no user login, no write scope).
2. **Store it as a secret**, never in the repo:
   - Local: `export X_BEARER_TOKEN=...`
   - GitHub Actions: repo → Settings → Secrets → Actions → `X_BEARER_TOKEN`
3. **Billing**: pay-per-use is metered. Set a spend cap in the X developer
   console. At Orbital's size the bill is single-digit dollars/month; the cap is
   there so a runaway loop can't change that.

**With no token the script still runs** — it reports `unknown` recency for every
program and tells you the token is missing, so the audit degrades to
site-and-press rather than silently pretending it checked. Never report social
recency you did not fetch.

## Running it

```bash
# Everything (39 programs)
npx tsx scripts/social-pulse.ts

# Only the stale + already-suspect ones — the cheap default for scheduled runs
npx tsx scripts/social-pulse.ts --stale-days 60

# One program, while investigating
npx tsx scripts/social-pulse.ts --name "Forge"

# See the cost before spending it
npx tsx scripts/social-pulse.ts --dry-run
```

Output is a JSON report at `data/social-pulse/<date>.json` plus a table on
stdout: `name | handle | lastPostAt | ageDays | postCount | source`.

## How to read the result — the ranking that matters

Social recency is **evidence, not a verdict**, and it does not outrank the
program's own site. The order:

1. **A future-dated cohort on the program's own site beats everything.** If
   `/cohorts` advertises an intake that hasn't happened yet, the program is
   alive — full stop, regardless of social silence. This is the Forge rule.
2. **Recent posts (< 90 days) confirm life.** Cite the post date and URL.
3. **Silence is a question, not an answer.** Quiet socials with a live site and
   no future cohort ⇒ `dormant` *candidate*, to be confirmed by a human.
4. **Silence + dead domain + no future cohort, 6+ months ⇒ `defunct` candidate.**

Founders and small houses often post through a **personal** account rather than
a company one (AGI House SF → the founder; STAK → the parent company; Yale
Hacker House → the society). A quiet company handle with a busy founder handle
is an **active** program with a mislabelled `xUrl` — fix the handle, don't
archive the program.

## Feeding the result back

- **Dated evidence** → hand to `program-liveness-audit`, which turns it into
  `lifecycle` + `lifecycleEvidence` proposals.
- **Wrong or missing handles** → `xUrl` / `linkedinUrl` corrections for
  `founder-atlas-refresh`.
- **Never edit `programs-data.json` from this skill.** Evidence in, report out.

## Cost discipline

- Default to `--stale-days 60` on scheduled runs; a full sweep is for when
  someone asks for one.
- `max_results` is capped at 20 posts/program in the script — enough to date the
  most recent post, which is all a liveness call needs.
- Cache: a report from the last 7 days is reused unless `--force` is passed.

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

Monthly, ahead of `program-liveness-audit`, so the audit runs on fresh dated
evidence rather than on whatever the websites happen to say.
