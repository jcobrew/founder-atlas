import type { APIRoute } from "astro";
import { TAXONOMY, MVP_PROGRAM_TYPE_IDS } from "../../data/taxonomy";

// Stream 9 — Canonical taxonomy export (ADDITIVE).
//
// Publishes the 0rbital taxonomy as machine-readable JSON: every
// dimension (programType, supportMode, founderStage, intakeMethod,
// intakeFrequency, costFundingModel) with its IDs, human labels, MVP flags and
// descriptions. The `programType` dimension is co-living-only for active MVP values; the others are
// included so agents can resolve every canonical ID returned by
// /api/programs.normalized.json.
//
// CORS / content-type headers are applied by vercel.json on deploy.
export const GET: APIRoute = () => {
  const dimensions = Object.fromEntries(
    Object.entries(TAXONOMY).map(([dimension, entries]) => [
      dimension,
      {
        count: entries.length,
        mvpCount: entries.filter((e) => e.mvp).length,
        values: entries.map((e) => ({
          id: e.id,
          label: e.label,
          mvp: e.mvp,
          description: e.description ?? null,
        })),
      },
    ]),
  );

  const body = {
    meta: {
      title: "0rbital — canonical taxonomy",
      tagline:
        "Canonical co-living program types plus supporting dimensions, with current MVP scope flags and labels.",
      compiled: new Date().toISOString().slice(0, 10),
      note:
        "ADDITIVE export. For programType, `mvp:true` marks only current co-living categories: " +
        "founder-residency and hacker-house. Retired or non-residential startup-support types " +
        "remain representable with `mvp:false` for compatibility, but are not active MVP program types.",
      dimensions: Object.keys(TAXONOMY),
      mvpProgramTypes: MVP_PROGRAM_TYPE_IDS,
    },
    // The headline dimension, surfaced at top level for convenience.
    programTypes: dimensions.programType.values,
    taxonomy: dimensions,
  };

  return new Response(JSON.stringify(body, null, 2) + "\n", {
    headers: { "Content-Type": "application/json; charset=utf-8" },
  });
};
