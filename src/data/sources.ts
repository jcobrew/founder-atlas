// Stream 4 — Provenance / source model.
//
// First-class source + trust objects, linked to programs EXTERNALLY by program
// slug (see `programSlug` in ./programs). This stream does NOT edit the
// `Program` type; instead it keys provenance off the slug so a program can carry
// richer provenance without touching its source-of-truth record.
//
// This is additive: programs without any SourceRecord here keep rendering with
// their existing `sourceUrls` / `lastVerified` fields untouched.

import { type VerificationStatus } from "./programs";

// Re-export the existing verification enum so consumers can import provenance
// shape + verification status from one place. (Additive; no new source of truth.)
export type { VerificationStatus } from "./programs";

/** What kind of artefact a source is. Drives how much weight we give it. */
export type SourceKind =
  | "official" // the program's own site / application page
  | "official-social" // the program's own verified social account / newsletter
  | "press" // reputable third-party reporting
  | "aggregator" // directories (F6S, Crunchbase, …) — weaker
  | "community" // forums, word-of-mouth — weakest
  | "sample"; // clearly-marked placeholder, not a real citation

/**
 * Trust level for a piece of provenance. Distinct from `VerificationStatus`
 * (which describes whether a *record* was reviewed): `TrustStatus` describes how
 * much we trust the *source* behind a particular fact.
 */
export type TrustStatus =
  | "trusted" // official / primary source, recently retrieved
  | "reported" // credible secondary source
  | "unverified" // weak/aggregator/community source, or never confirmed
  | "sample"; // placeholder data, never to be presented as fact

/** A single citation backing a program's facts. */
export interface SourceRecord {
  /** Canonical URL of the source. */
  url: string;
  /** Human-readable title of the page/article. */
  title: string;
  /** Who published it (e.g. "Y Combinator", "TechCrunch"). */
  publisher?: string;
  /** ISO date (YYYY-MM-DD) the source was retrieved/checked. */
  retrievedAt?: string;
  /** What kind of source this is. */
  kind: SourceKind;
  /** How much we trust it. */
  trust: TrustStatus;
  /** Optional short note about what this source backs. */
  note?: string;
}

/** Provenance bundle for one program, keyed by program slug. */
export interface ProgramProvenance {
  programSlug: string;
  sources: SourceRecord[];
  /** Optional record-level verification status override / restatement. */
  verificationStatus?: VerificationStatus;
}

/**
 * Current provenance keyed by program slug.
 *
 * Stale sample source records for removed, out-of-scope generic startup-support
 * programs are intentionally excluded. Consumers must continue to handle missing
 * provenance by falling back to legacy `sourceUrls` or empty source arrays.
 */
export const PROGRAM_SOURCES: Record<string, ProgramProvenance> = {};

/** Look up provenance for a program by slug. Returns undefined when absent. */
export function provenanceForSlug(slug: string): ProgramProvenance | undefined {
  return PROGRAM_SOURCES[slug];
}
