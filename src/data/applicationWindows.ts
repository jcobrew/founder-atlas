// Stream 4 — Application windows / deadlines model.
//
// Separates *stable program identity* (the `Program` record) from *changing
// application data* (when can a founder actually apply?). "A program exists" is
// NOT the same as "applications are open".
//
// Windows are linked to programs EXTERNALLY by program slug (see `programSlug`
// in ./programs) — this stream does NOT edit the `Program` type. A program with
// no window here keeps rendering exactly as today off its legacy `status` field.

/** A single application window for a program cohort/intake. */
export interface ApplicationWindow {
  /**
   * Rolling means "always open" — no fixed opens/closes. When true, `opens` /
   * `closes` are ignored for status computation.
   */
  rolling?: boolean;
  /** ISO date (YYYY-MM-DD) applications open. Omitted for rolling. */
  opens?: string;
  /** ISO date (YYYY-MM-DD) applications close. Omitted for rolling/open-ended. */
  closes?: string;
  /** Cohort/batch label, e.g. "Winter 2026", "Cohort 14". */
  cohortLabel?: string;
  /** Optional direct application URL for this specific window. */
  applyUrl?: string;
  /** Free-text deadline/intake notes. */
  notes?: string;
}

/** Application-window data for one program, keyed by program slug. */
export interface ProgramWindows {
  programSlug: string;
  /** Zero or more windows; the soonest-relevant one drives displayed status. */
  windows: ApplicationWindow[];
}

/**
 * Current application-window data keyed by program slug.
 *
 * This intentionally excludes stale sample windows for generic startup-support
 * programs removed from 0rbital's co-living-only scope. Consumers must continue
 * to handle missing window data gracefully by falling back to legacy program
 * status or `unknown`.
 */
export const PROGRAM_WINDOWS: Record<string, ProgramWindows> = {};

/** Look up windows for a program by slug. Returns undefined when absent. */
export function windowsForSlug(slug: string): ProgramWindows | undefined {
  return PROGRAM_WINDOWS[slug];
}
