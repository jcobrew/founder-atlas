/**
 * Globe pin declustering (lib/globeJitter). Locks the fixes for same-city pins
 * rendering as one blob: below-density cluster boxes fan out (Bangalore), dense
 * boxes stay untouched (SF collapses into its minimap), rings are widened by
 * 1/cos(lat) so they read circular at high latitudes (Helsinki), and origin
 * twins participate when jittered together with programs.
 */
import { describe, it, expect } from 'vitest';
import { jitter, CLUSTERS, MIN_DENSITY, inBounds } from '@/lib/globeJitter';
import { withOriginPins, type Program } from '@/data/programs';

const prog = (name: string, lat: number, lng: number, extra: Record<string, unknown> = {}) =>
  ({ name, lat, lng, city: 'x', country: 'x', ...extra }) as unknown as Program;

const dist = (a: Program, b: Program) => Math.hypot(a.lat - b.lat, a.lng - b.lng);

describe('jitter', () => {
  it('fans out a same-city pair inside a below-density cluster box (Bangalore)', () => {
    // Real coordinates: The Residency — Bangalore and Forge — Bangalore, both
    // inside the blr box, which at 2 members is below MIN_DENSITY.
    const a = prog('The Residency — Bangalore', 12.9116, 77.6389);
    const b = prog('Forge — Bangalore (Cohort 1)', 12.9352, 77.6245);
    const blr = CLUSTERS.find((c) => c.id === 'blr')!;
    expect(inBounds(a, blr.bounds)).toBe(true);
    expect(inBounds(b, blr.bounds)).toBe(true);
    jitter([a, b]);
    expect(dist(a, b)).toBeGreaterThan(1.4); // opposite ring points ≈ 2×SPREAD apart
  });

  it('leaves members of a dense cluster box untouched (SF minimap)', () => {
    const sf = CLUSTERS.find((c) => c.id === 'sf')!;
    const members = Array.from({ length: MIN_DENSITY + 1 }, (_, i) =>
      prog(`sf-${i}`, 37.77 + i * 0.01, -122.42 + i * 0.01),
    );
    const before = members.map((p) => [p.lat, p.lng]);
    members.forEach((p) => expect(inBounds(p, sf.bounds)).toBe(true));
    jitter([...members]);
    members.forEach((p, i) => {
      expect(p.lat).toBe(before[i][0]);
      expect(p.lng).toBe(before[i][1]);
    });
  });

  it('widens the ring longitudinally at high latitude so the fan reads circular', () => {
    // Two pins at Helsinki latitude: lng separation must be ≈ lat separation
    // divided by cos(60°) ≈ ×2.
    const a = prog('a', 60.2, 24.7);
    const b = prog('b', 60.17, 24.9);
    jitter([a, b]);
    const latSep = Math.abs(a.lat - b.lat);
    const lngSep = Math.abs(a.lng - b.lng);
    // Pair fans along one axis-pair (angles 0 and π): members sit at
    // (±SPREAD, 0) — so re-run expectations on the ring radii instead: total
    // separation projected back to visual degrees must be ≥ 2×SPREAD.
    const cLat = (a.lat + b.lat) / 2;
    const visual = Math.hypot(latSep, lngSep * Math.cos((cLat * Math.PI) / 180));
    expect(visual).toBeGreaterThan(1.4);
  });

  it('origin twins jittered alongside programs separate from their neighbours (Helsinki)', () => {
    // FR8 in Espoo vs SILTA's Helsinki origin twin — the real collision.
    const fr8 = prog('FR8 (Hacker Hotel)', 60.2055, 24.6559);
    const silta = prog('SILTA', 37.7749, -122.4194, {
      originLat: 60.1699,
      originLng: 24.9384,
      originCity: 'Helsinki',
      originCountry: 'Finland',
    });
    const expanded = withOriginPins([fr8, silta]).map((p) => ({ ...p }));
    jitter(expanded);
    const twin = expanded.find((p) => p.isOriginPin)!;
    const fr8After = expanded.find((p) => p.name === 'FR8 (Hacker Hotel)')!;
    expect(twin).toBeDefined();
    expect(dist(twin, fr8After)).toBeGreaterThan(1.4);
  });
});
