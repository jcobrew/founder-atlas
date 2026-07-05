// Globe pin declustering — pure helpers extracted from the GlobeView island so
// the fan-out behavior is unit-testable (the island itself imports globe.gl +
// leaflet CSS, which node-env vitest can't load).
import type { Program } from '../data/programs';

// Dense regions can get their own crisp, interactive minimap (shown one at a
// time). Membership is by lat/lng box. `pin` optionally places the clickable
// globe marker off-coast so it isn't buried under the program pins it summarizes.
// A marker only appears when the region actually clusters programs (see MIN_DENSITY).
export const CLUSTERS = [
  { id: 'sf', label: 'SF Bay Area', bounds: [[37.2, -122.65], [37.95, -121.7]], pin: [37.55, -123.7] },
  { id: 'nyc', label: 'New York', bounds: [[40.45, -74.2], [40.95, -73.65]] },
  { id: 'ldn', label: 'London', bounds: [[51.25, -0.55], [51.72, 0.3]], pin: [51.45, 1.95] },
  { id: 'blr', label: 'Bangalore', bounds: [[12.78, 77.4], [13.18, 77.85]] },
] as const;

// A minimap/marker is only worthwhile where programs genuinely cluster too
// tightly to click apart on the globe — i.e. this many or more in the box. Kept
// strict (5) so only true hubs (e.g. the SF Bay Area) earn a minimap; thin
// 2–3-program "clusters" just render as normal pins instead.
export const MIN_DENSITY = 5;

export function inBounds(p: Pick<Program, 'lat' | 'lng'>, b: readonly (readonly number[])[]) {
  return p.lat >= b[0][0] && p.lat <= b[1][0] && p.lng >= b[0][1] && p.lng <= b[1][1];
}

export function jitter(arr: Program[]) {
  // Pins are a fixed pixel size, so any two programs sitting within a degree or
  // so of each other (e.g. FR8 in Espoo and SILTA's origin pin in Helsinki)
  // render as one overlapping blob on the globe — not just exact-coordinate
  // dupes. Group every set of near-neighbours and fan them out evenly around
  // the group's centre so each reads as a distinct node.
  //
  // Programs inside a DENSE cluster box (≥ MIN_DENSITY members in this array)
  // are skipped: they collapse into that city's minimap, and nudging them could
  // change the box's program count. Below-density boxes never get a minimap, so
  // their members must fan out like everyone else (e.g. Bangalore's two).
  const PROX = 0.9; // ≈ how close two programs must be to collide as pins
  const SPREAD = 0.8; // ring radius (degrees latitude) the group fans out to
  const boxCounts = CLUSTERS.map((c) => arr.filter((p) => inBounds(p, c.bounds)).length);
  const inDenseBox = (p: Program) =>
    CLUSTERS.some((c, i) => boxCounts[i] >= MIN_DENSITY && inBounds(p, c.bounds));
  type Cluster = { lat: number; lng: number; members: Program[] };
  const clusters: Cluster[] = [];
  arr.forEach((p) => {
    if (inDenseBox(p)) return;
    const near = clusters.find(
      (cl) => Math.abs(cl.lat - p.lat) < PROX && Math.abs(cl.lng - p.lng) < PROX,
    );
    if (near) near.members.push(p);
    else clusters.push({ lat: p.lat, lng: p.lng, members: [p] });
  });
  clusters.forEach((c) => {
    if (c.members.length < 2) return;
    const cLat = c.members.reduce((s, p) => s + p.lat, 0) / c.members.length;
    const cLng = c.members.reduce((s, p) => s + p.lng, 0) / c.members.length;
    // Longitude degrees shrink by cos(lat), so widen the ring's lng radius to
    // keep the fan visually circular at high latitudes (Helsinki at 60°N would
    // otherwise read half as wide). Clamp at ±75° so near-polar groups don't
    // blow up.
    const latRad = (Math.min(75, Math.abs(cLat)) * Math.PI) / 180;
    const lngSpread = SPREAD / Math.cos(latRad);
    const step = (2 * Math.PI) / c.members.length;
    c.members.forEach((p, i) => {
      const a = i * step;
      p.lat = cLat + SPREAD * Math.cos(a);
      p.lng = cLng + lngSpread * Math.sin(a);
    });
  });
}
