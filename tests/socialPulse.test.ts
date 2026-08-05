import { describe, it, expect } from 'vitest';
import {
  handleFromUrl,
  ageInDays,
  estimateCostUsd,
  selectPrograms,
  newestPost,
  MAX_POSTS_PER_PROGRAM,
  USD_PER_POST_READ,
} from '../scripts/social-pulse';
import type { Program } from '@/data/programs';

const prog = (over: Partial<Program> & { xUrl?: string }): Program =>
  ({ name: 'X', lastVerified: '2026-08-01', ...over }) as Program;

describe('handleFromUrl', () => {
  it('reads handles from x.com and twitter.com, with or without www', () => {
    expect(handleFromUrl('https://x.com/HF0Residency')).toBe('HF0Residency');
    expect(handleFromUrl('https://www.twitter.com/shipfr8')).toBe('shipfr8');
    expect(handleFromUrl('http://x.com/forgeresidency/')).toBe('forgeresidency');
  });

  it('returns null rather than guessing when there is no usable handle', () => {
    expect(handleFromUrl(undefined)).toBeNull();
    expect(handleFromUrl('')).toBeNull();
    expect(handleFromUrl('https://linkedin.com/company/hf0')).toBeNull();
    expect(handleFromUrl('https://x.com/')).toBeNull();
  });
});

describe('ageInDays', () => {
  const now = new Date('2026-08-05T00:00:00Z');

  it('counts whole days back from now', () => {
    expect(ageInDays('2026-08-05T00:00:00Z', now)).toBe(0);
    expect(ageInDays('2026-07-06T00:00:00Z', now)).toBe(30);
  });

  it('returns null for missing or unparseable input — never 0', () => {
    // 0 would read as "posted today", which is the opposite of "unknown".
    expect(ageInDays(null, now)).toBeNull();
    expect(ageInDays('not-a-date', now)).toBeNull();
  });
});

describe('estimateCostUsd', () => {
  it('prices a full sweep at the documented pay-per-use rate', () => {
    expect(USD_PER_POST_READ).toBe(0.005);
    // 39 programs x 20 posts — the number quoted in the skill.
    expect(estimateCostUsd(39 * MAX_POSTS_PER_PROGRAM)).toBeCloseTo(3.9, 2);
  });

  it('is free when nothing is read', () => {
    expect(estimateCostUsd(0)).toBe(0);
  });
});

describe('selectPrograms', () => {
  const now = new Date('2026-08-05T00:00:00Z');
  const programs = [
    prog({ name: 'Fresh', lastVerified: '2026-08-01' }),
    prog({ name: 'Stale', lastVerified: '2026-01-01' }),
    prog({ name: 'Undated', lastVerified: undefined }),
  ];

  it('takes everything by default', () => {
    expect(selectPrograms(programs, { now })).toHaveLength(3);
  });

  it('limits a sweep to records past the staleness threshold', () => {
    const picked = selectPrograms(programs, { staleDays: 60, now }).map((p) => p.name);
    expect(picked).toEqual(['Stale', 'Undated']);
  });

  it('treats a missing lastVerified as stale rather than skipping it', () => {
    const picked = selectPrograms(programs, { staleDays: 9999, now }).map((p) => p.name);
    expect(picked).toContain('Undated');
  });

  it('filters by name, case-insensitively', () => {
    expect(selectPrograms(programs, { name: 'fresh', now })).toHaveLength(1);
  });
});

describe('newestPost', () => {
  it('picks the latest post regardless of array order', () => {
    const got = newestPost([
      { id: '1', created_at: '2026-07-01T00:00:00Z' },
      { id: '2', created_at: '2026-07-28T00:00:00Z' },
      { id: '3', created_at: '2026-06-01T00:00:00Z' },
    ]);
    expect(got?.id).toBe('2');
  });

  it('returns null for an empty or undated timeline', () => {
    expect(newestPost([])).toBeNull();
    expect(newestPost(undefined)).toBeNull();
    expect(newestPost([{ id: '1' }])).toBeNull();
  });
});
