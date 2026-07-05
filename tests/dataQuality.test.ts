import { describe, expect, it } from 'vitest';
import { PROGRAMS, programSlug, type Program } from '../src/data/programs';
import { missingDecisionFactLabels } from '../src/lib/dataQuality';

describe('program data quality guardrails', () => {
  it('generates a unique detail-route slug for every program', () => {
    const seen = new Map<string, string>();
    for (const program of PROGRAMS) {
      const slug = programSlug(program.name);
      expect(slug, `${program.name} generated an empty slug`).not.toBe('');
      expect(seen.get(slug), `${program.name} collides with ${seen.get(slug)} at /programs/${slug}`).toBeUndefined();
      seen.set(slug, program.name);
    }
  });

  it('keeps every record backed by an official URL and at least one verification source', () => {
    for (const program of PROGRAMS) {
      expect(program.url, `${program.name} is missing an official URL`).toMatch(/^https?:\/\//);
      expect(program.sourceUrls?.length, `${program.name} needs at least one source URL`).toBeGreaterThan(0);
    }
  });

  it('keeps every record timestamped for freshness checks', () => {
    for (const program of PROGRAMS) {
      expect(program.lastVerified, `${program.name} is missing lastVerified`).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    }
  });

  it('identifies missing decision facts without treating false values as missing', () => {
    const program = {
      durationWeeksMin: 4,
      durationWeeksMax: 4,
      cost: '',
      equityTaken: '0%',
      cohortSize: undefined,
      providesHousing: true,
      providesWorkspace: false,
    } as Program;

    expect(missingDecisionFactLabels(program)).toEqual(['cost', 'cohort size']);
  });
});
