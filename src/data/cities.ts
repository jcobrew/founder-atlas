// City groupings derived from the program data — the source for /cities/<slug>
// and for linking a program (or country) to its city. Mirrors countries.ts.
// City names don't currently collide across countries, so the city name alone
// is a safe slug.
import { LIVE_PROGRAMS, programSlug, type Program } from './programs';

export interface City {
  city: string;
  country: string;
  slug: string;
  count: number;
  programs: Program[];
}

export function citySlug(city: string): string {
  return programSlug(city);
}

const byKey = new Map<string, City>();
for (const p of LIVE_PROGRAMS) {
  if (!p.city) continue;
  const slug = citySlug(p.city);
  let c = byKey.get(slug);
  if (!c) {
    c = { city: p.city, country: p.country, slug, count: 0, programs: [] };
    byKey.set(slug, c);
  }
  c.programs.push(p);
  c.count++;
}

/** All cities, most programs first. */
export const CITIES: City[] = [...byKey.values()].sort((a, b) => b.count - a.count || a.city.localeCompare(b.city));

const BY_SLUG = new Map(CITIES.map((c) => [c.slug, c]));

export function getCity(slug: string): City | undefined {
  return BY_SLUG.get(slug);
}

/**
 * True when a city has a built page. City pages are generated from the *live*
 * programs, so a city whose only entries are archived (Mérida, Palo Alto,
 * Da Nang) has no page — callers must check before linking, the same way
 * `hasCountryProfile` guards country links.
 */
export function hasCityProfile(city: string): boolean {
  return BY_SLUG.has(citySlug(city));
}

/** Cities in a given country, most programs first. */
export function citiesInCountry(country: string): City[] {
  return CITIES.filter((c) => c.country === country);
}
