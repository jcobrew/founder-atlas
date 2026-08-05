// Program lifecycle — "is this program still alive?"
//
// This is a SEPARATE axis from `status` (see ./status.ts) and the two must not
// be conflated:
//
//   status    → what applications are doing right now.
//               open | coming-soon | running | closed. Changes every few months.
//   lifecycle → whether anyone is still running the program at all.
//               active | dormant | defunct. Changes rarely, and `defunct` is
//               effectively permanent.
//
// A program can legitimately be `status: 'closed'` + `lifecycle: 'active'` —
// that's just a healthy program between cohorts (The Residency in August, Focal
// until its January intake). Collapsing those into one "closed-ish" state is
// exactly the mistake this split exists to prevent: it would tell founders a
// thriving residency is dead because its application window shut last week.
//
// Records with no `lifecycle` value are treated as `active`, so the field is
// additive — existing data and any external consumer keep working unchanged.

export type LifecycleKey = 'active' | 'dormant' | 'defunct';

export interface LifecycleMeta {
  label: string;
  color: string;
  /** Shown on the archive page + detail banner to explain the state. */
  blurb: string;
}

export const LIFECYCLE: Record<LifecycleKey, LifecycleMeta> = {
  active: {
    label: 'Active',
    color: '#25e0a4',
    blurb: 'Running now — verified recent activity from the program itself.',
  },
  dormant: {
    label: 'Dormant',
    color: '#f0a03c',
    blurb:
      'No verified activity for months. It may simply be quiet between cohorts, ' +
      'so the record is kept and linked — treat it as unconfirmed, not dead.',
  },
  defunct: {
    label: 'Closed down',
    color: '#8b6f9e',
    blurb:
      'The program has shut down. Kept as a case study: what it tried, where it ' +
      'ran, and where to read about it.',
  },
};

/** Display/sort order (most alive first). */
export const LIFECYCLE_ORDER: LifecycleKey[] = ['active', 'dormant', 'defunct'];

/** Legend for the public API + docs. */
export const LIFECYCLE_LEGEND: Record<LifecycleKey, string> = {
  active: 'Program is operating; recent activity verified',
  dormant: 'No verified activity for months — may be between cohorts, unconfirmed',
  defunct: 'Program has shut down; kept as an archived case study',
};

/**
 * Read a record's lifecycle, defaulting to `active`.
 *
 * The default matters: it means adding this field is backwards-compatible and a
 * program is only ever moved out of the main views by an explicit, evidenced
 * decision — never by an omission.
 */
export function lifecycleOf(p: { lifecycle?: string }): LifecycleKey {
  const v = p.lifecycle;
  if (v === 'dormant' || v === 'defunct') return v;
  return 'active';
}

/** True when the program belongs in the main comparison views. */
export function isLive(p: { lifecycle?: string }): boolean {
  return lifecycleOf(p) === 'active';
}

/** True when the program belongs in /archive. */
export function isArchived(p: { lifecycle?: string }): boolean {
  return !isLive(p);
}

export function lifecycleMeta(key: string): LifecycleMeta {
  return (
    LIFECYCLE[key as LifecycleKey] ?? {
      label: key,
      color: '#999',
      blurb: '',
    }
  );
}
