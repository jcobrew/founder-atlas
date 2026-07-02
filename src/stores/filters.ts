// Cross-island filter state. Astro islands are isolated, so the map/globe and
// the sidebar share state through this nanostore rather than props. The store
// also stays in sync with the URL query string — the deep-link contract that
// agents and humans use (e.g. /dashboard?model=both&country=USA&country=UK&status=open).
//
// The filter axis is intentionally small but founder-decision oriented:
// one-or-more sector/country/format ids, recruiting `status`, explicit
// housing/workspace/funding toggles, and free-text `q`. Older links carrying
// removed params (type/stage/model/dataset) are silently ignored.
// A legacy single `?country=USA` still works (parsed into a one-element array).

import { atom } from 'nanostores';
import { EMPTY_FILTERS, type Filters } from '../lib/filter';
import { STATUS } from '../lib/status';

export const $filters = atom<Filters>({ ...EMPTY_FILTERS });

/** Parse the current location.search into a Filters object. */
export function filtersFromURL(search = window.location.search): Filters {
  const u = new URLSearchParams(search);
  const status = u.get('status');
  return {
    q: u.get('q') ?? '',
    status: status && status in STATUS ? status : '',
    sector: u.getAll('sector').filter(Boolean),
    country: u.getAll('country').filter(Boolean),
    format: u.getAll('format').filter(Boolean),
    housing: u.get('housing') === '1',
    workspace: u.get('workspace') === '1',
    funding: u.get('funding') === '1',
  };
}

/** Serialize filters back into a query string (omitting defaults). */
export function filtersToQuery(f: Filters): string {
  const u = new URLSearchParams();
  if (f.q) u.set('q', f.q);
  for (const s of f.sector) u.append('sector', s);
  for (const c of f.country) u.append('country', c);
  for (const m of f.format) u.append('format', m);
  if (f.status) u.set('status', f.status);
  if (f.housing) u.set('housing', '1');
  if (f.workspace) u.set('workspace', '1');
  if (f.funding) u.set('funding', '1');
  return u.toString();
}

/** Hydrate the store from the URL — runs once even if several islands call it. */
let initialized = false;
export function initFiltersFromURL(): void {
  if (initialized) return;
  initialized = true;
  $filters.set(filtersFromURL());
}

/** Merge a partial update into the store and reflect it in the URL. */
export function setFilters(patch: Partial<Filters>): void {
  const next = { ...$filters.get(), ...patch };
  $filters.set(next);
  const qs = filtersToQuery(next);
  history.replaceState(null, '', qs ? location.pathname + '?' + qs : location.pathname);
}

/** Replace all filters with a clean preset (used by the founder triggers). */
export function applyPreset(preset: Partial<Filters>): void {
  setFilters({ ...EMPTY_FILTERS, ...preset });
}
