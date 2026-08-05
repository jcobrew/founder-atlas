import { describe, it, expect } from 'vitest';
import {
  PROGRAMS,
  LIVE_PROGRAMS,
  ARCHIVED_PROGRAMS,
  FACETS,
  API_SCHEMA,
} from '@/data/programs';
import {
  LIFECYCLE,
  LIFECYCLE_ORDER,
  lifecycleOf,
  isLive,
  isArchived,
} from '@/lib/lifecycle';
import { STATUS } from '@/lib/status';
import { CITIES, hasCityProfile } from '@/data/cities';

describe('lifecycle vocabulary', () => {
  it('has exactly the three liveness states, ordered most-alive first', () => {
    expect(Object.keys(LIFECYCLE)).toEqual(['active', 'dormant', 'defunct']);
    expect(LIFECYCLE_ORDER).toEqual(['active', 'dormant', 'defunct']);
  });

  it('defaults a record with no lifecycle to active', () => {
    expect(lifecycleOf({})).toBe('active');
    expect(lifecycleOf({ lifecycle: undefined })).toBe('active');
    expect(isLive({})).toBe(true);
  });

  it('ignores unknown values rather than inventing a state', () => {
    expect(lifecycleOf({ lifecycle: 'zombie' })).toBe('active');
  });

  it('is a separate axis from status — no value names overlap', () => {
    const overlap = Object.keys(LIFECYCLE).filter((k) => k in STATUS);
    expect(overlap).toEqual([]);
  });
});

describe('program partitioning', () => {
  it('splits PROGRAMS into live + archived with nothing lost or doubled', () => {
    expect(LIVE_PROGRAMS.length + ARCHIVED_PROGRAMS.length).toBe(PROGRAMS.length);
    const names = new Set([...LIVE_PROGRAMS, ...ARCHIVED_PROGRAMS].map((p) => p.name));
    expect(names.size).toBe(PROGRAMS.length);
  });

  it('puts only active programs in the live set', () => {
    expect(LIVE_PROGRAMS.every(isLive)).toBe(true);
    expect(ARCHIVED_PROGRAMS.every(isArchived)).toBe(true);
  });

  it('keeps every archived program reachable — record, link and evidence intact', () => {
    for (const p of ARCHIVED_PROGRAMS) {
      expect(p.url, `${p.name} must keep its website link`).toBeTruthy();
      expect(p.domain, `${p.name} must keep its domain`).toBeTruthy();
      expect(
        p.lifecycleEvidence,
        `${p.name} is archived, so it must carry dated evidence`,
      ).toBeTruthy();
      expect(
        p.lifecycleCheckedAt,
        `${p.name} must record when the call was checked`,
      ).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    }
  });

  it('never archives a program purely for having closed applications', () => {
    // The whole point of the split: a healthy program between cohorts is
    // `closed` + `active`. If this ever fails, the two axes have been conflated.
    const closedButLive = LIVE_PROGRAMS.filter((p) => p.status === 'closed');
    expect(closedButLive.length).toBeGreaterThan(0);
  });
});

describe('dataset lifecycle integrity', () => {
  it('gives every record an explicit, valid lifecycle value', () => {
    for (const p of PROGRAMS) {
      expect(
        Object.keys(LIFECYCLE),
        `${p.name} has an unknown lifecycle: ${p.lifecycle}`,
      ).toContain(p.lifecycle);
    }
  });

  it('counts lifecycle in the API facets over the whole set', () => {
    const total = Object.values(FACETS.lifecycle).reduce((a, b) => a + b, 0);
    expect(total).toBe(PROGRAMS.length);
    expect(FACETS.lifecycle.active).toBe(LIVE_PROGRAMS.length);
  });

  it('documents the lifecycle fields in the public API schema', () => {
    expect(API_SCHEMA.lifecycle).toContain('dormant');
    expect(API_SCHEMA.lifecycle).toContain('defunct');
    expect(API_SCHEMA).toHaveProperty('lifecycleEvidence');
    expect(API_SCHEMA).toHaveProperty('lifecycleCheckedAt');
  });
});

describe('city rollups follow the live set', () => {
  it('builds city pages only from live programs', () => {
    const liveCities = new Set(LIVE_PROGRAMS.map((p) => p.city));
    for (const c of CITIES) expect(liveCities).toContain(c.city);
  });

  it('reports no profile for a city whose only programs are archived', () => {
    const archivedOnly = ARCHIVED_PROGRAMS.map((p) => p.city).filter(
      (city) => !LIVE_PROGRAMS.some((p) => p.city === city),
    );
    // Guards the detail page against linking to a city route that isn't built.
    for (const city of archivedOnly) expect(hasCityProfile(city)).toBe(false);
  });
});
