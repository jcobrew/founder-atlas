import type { APIRoute } from "astro";

const BODY = `# 0rbital — Orbital for live-in founder programs

> Find your orbit. Launch what’s next. The right environment changes your trajectory.
> Compare founder residencies, hacker houses, and co-living programs
> where builders gather momentum for their next launch.

This site is a static, agent-friendly map. AI agents should prefer the JSON API below
over scraping the HTML views.

## Scope & positioning

0rbital is focused on co-living founder programs: founder residencies, hacker houses, and residential cohorts where early-stage builders, founders, researchers, hackers, and creative technologists live, work, and build around serious peers. It is NOT a broad accelerator, grant, visa, startup-visa, co-founder-matching, or generic startup-support database.

Current records are co-living only: \`canonicalType\` is \`founder-residency\` or \`hacker-house\`, and/or \`format\` is \`live-in\`. Legacy schema/taxonomy values may remain representable for compatibility, but only co-living program types flagged \`mvp:true\` are in active curated scope.

## Freshness & provenance

- Every record carries a \`lastVerified\` date and a \`verificationStatus\`
  (\`verified\` | \`needs-review\` | \`unverified\`). A record older than ~90 days is treated as stale.
- "A program exists" is NOT "applications are open". Application status is computed from
  time-aware application windows when available, falling back to the legacy recruiting \`status\`.
  Resolved status is one of \`open\` | \`upcoming\` | \`closed\` | \`unknown\` — shown honestly, never hidden.
- Provenance is first-class: sources carry a \`kind\` (official | press | aggregator | …) and a
  \`trust\` level (\`trusted\` | \`reported\` | \`unverified\` | \`sample\`). Placeholder data is marked
  \`sample\` and must never be presented as fact.
- Status and visa/relocation details change frequently — always confirm on the official program site.

## Machine-readable data (preferred for agents)

Legacy, stable contracts (output shape will not change):

- [Unified program API](/api/programs.json): All programs in one file, categorized by
  \`canonicalType\` (the primary axis). Each entry also carries a deprecated, derived
  \`dataset\` (residential | traditional) for back-compat only. Includes \`meta\`, \`schema\`,
  \`count\`, and \`facets\` (\`canonicalType\`, \`country\`, \`status\` counts, plus derived
  \`dataset\` and legacy \`type\` facets). Served with CORS \`Access-Control-Allow-Origin: *\`.
- [Countries API](/api/countries.json): machine-readable country ecosystem profiles (see below).

New, agent-oriented exports (additive; richer, may evolve):

- [Normalized programs](/api/programs.normalized.json): every program with canonical taxonomy IDs
  (\`canonicalType\`, \`supportModes\`, \`canonicalStages\`, \`costFundingModel\`), a resolved
  \`applicationStatus\` (window-aware), a \`freshness\` summary, and a \`provenance\`/trust summary.
  Prefer this when you want structured, normalized data.
- [Curated MVP programs](/api/programs.mvp.json): only records tagged \`mvp:true\` within the
  current co-living-only scope — the vetted slice. Treat an empty list as "no curated records yet",
  not an error.
- [Program-type taxonomy](/api/program-types.json): canonical taxonomy IDs, labels, MVP flags,
  and descriptions. Active MVP program types are co-living only (\`founder-residency\`,
  \`hacker-house\`); retired/non-residential types may appear only with \`mvp:false\` for compatibility.
- [Update report](/api/update-report.json): offline-computed freshness / source-inventory /
  MVP-readiness summary across the dataset (report-only; no network probing at build time).

JSON Schema documents (Draft 2020-12):

- [Program schema](/schemas/program.schema.json)
- [Update-report schema](/schemas/program-update.schema.json)

## Program schema

Core fields (always present): \`name\`, \`type\` (human label), \`canonicalType\` (primary
categorical axis), \`city\`, \`country\`, \`lat\`, \`lng\`, \`focus\`, \`operator\`, \`stage\`,
\`status\`, \`status_detail\`, \`domain\`, \`url\`, \`highlight\`. \`dataset\` (residential |
traditional) is also present but deprecated/derived — prefer \`canonicalType\`.

Founder fields (optional; absent/"unknown" until verified & filled): \`format\`, \`stageFit[]\`,
\`founderFit[]\`, \`sectorFocus[]\`, \`applicationDeadline\`, \`nextCohortStart\`, \`durationWeeksMin/Max\`,
\`cohortSize\`, \`fundingAmount\`, \`equityTaken\`, \`cost\`, \`provides*\` booleans (Housing/Workspace/
Funding/Mentorship/InvestorAccess/DemoDay/VisaSupport), \`applyUrl\`, \`sourceUrls[]\`, \`lastVerified\`,
\`verificationStatus\`, \`tags[]\`, \`notes\`. See \`schema\` in the API for descriptions.

\`status\` enum: \`open\` (applications open — rolling or a cohort window) |
\`coming-soon\` (announced, not launched yet) | \`running\` (cohort in session) | \`closed\`.

## Dashboard and Explore — navigable by URL (best for agents)

The [Dashboard](/dashboard) renders the full map as a semantic, sortable table with
schema.org JSON-LD per program. The [Explore](/explore) page renders the same filter contract
as searchable cards. Drive either view by query params (filters compose with AND):

- \`q\` = free-text match over program identity, location, focus, notes, tags, and structured fit fields
- \`sector\` = exact sector ID from \`src/data/sectors.ts\` / the visible Sector filter; repeatable for OR
- \`country\` = exact country; repeatable for OR (see \`facets.country\`)
- \`format\` = legacy compatibility program-format filter; active 0rbital records are co-living/live-in scope
- \`status\` = one of \`open\`, \`coming-soon\`, \`running\`, \`closed\`
- \`housing=1\` = legacy compatibility housing filter; housing is baseline for active co-living records
- \`workspace=1\` = require explicit workspace support (\`providesWorkspace\` or \`supportModes\` includes \`workspace\`)
- \`funding=1\` = require explicit funding support (\`providesFunding\` or \`supportModes\` includes \`funding\`)
- \`sort\` = dashboard column to sort by (any program field used by the table, commonly \`name\`, \`canonicalType\`, \`city\`, \`country\`, \`status\`, \`focus\`, \`stage\`), with \`dir=-1\` to reverse

Example: \`/dashboard?country=USA&status=open&funding=1\` opens pre-filtered to open US programs with explicit funding. Any filter state is reflected back into the URL, so a dashboard or explore URL is a shareable deep link.

## Country ecosystem profiles

Country profiles summarize relocation context, visa/residency routes, key organizations, and links when available.

- [Countries API](/api/countries.json): machine-readable profiles. Each country joins back to the
  program data via the shared \`name\` field and carries a \`programCount\`. Served with CORS.
- Human country pages are available under \`/country/<slug>\` and the country index is available at \`/countries\`.

This dataset is intentionally focused and growing; it is designed to move to an updatable
cloud database without changing the API shape.

## Human views

Every page shares one header: brand · icon toggles for Globe / List · Countries · Submit · Story · Saved.

- [Globe](/): 3D globe — the entry point on every device. Programs panel, dense-city minimaps and
  the status legend are toggleable overlays; where WebGL is unavailable it falls back to a list-view link.
- [Explore](/explore): searchable, filterable card list with a program detail drawer.
- [Dashboard](/dashboard): semantic table with URL filters and JSON-LD per program.
- [Countries](/countries): country index linking to human country pages.
- [About](/about): the product story and why the scope stays focused on live-in founder programs.

Each program also has a dedicated profile page at \`/programs/<slug>\` (slug = lowercased name,
non-alphanumerics → hyphens), with schema.org \`EducationalOccupationalProgram\` JSON-LD.
`;

export const GET: APIRoute = () =>
  new Response(BODY, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
