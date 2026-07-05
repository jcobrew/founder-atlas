/**
 * quickFacts() — the hide-when-empty quick-facts grid shared by the detail
 * drawer and the program page. Locks the behavior decided in the 2026-07
 * field-coverage pass: no "Unknown" rows ever; fields render only when the
 * value exists; "Applications" derives from intakeMethod.
 */
import { describe, it, expect } from 'vitest';
import { quickFacts, UNKNOWN } from '@/lib/display';
import { PROGRAMS, type Program } from '@/data/programs';

const base = {
  name: 'Test House',
  type: 'Hacker House',
  canonicalType: 'hacker-house',
  supportModes: ['housing'],
  url: 'https://example.com',
  city: 'Testville',
  country: 'USA',
  lat: 0,
  lng: 0,
  status: 'open',
  stage: 'Pre-seed / very early',
  focus: 'AI',
  lastVerified: '2026-07-05',
} as unknown as Program;

describe('quickFacts', () => {
  it('never emits an "Unknown" value — for any record in the live dataset', () => {
    for (const p of PROGRAMS) {
      for (const [label, value] of quickFacts(p)) {
        expect(value, `${p.name} → ${label} leaked "Unknown"`).not.toBe(UNKNOWN);
        expect(value.trim().length, `${p.name} → ${label} is empty`).toBeGreaterThan(0);
      }
    }
  });

  it('a minimal record still shows the always-available facts via fallbacks', () => {
    const labels = quickFacts(base).map(([l]) => l);
    expect(labels).toContain('Stage fit'); // falls back to free-text stage
    expect(labels).toContain('Sector'); // falls back to free-text focus
    expect(labels).toContain('Last verified');
    // And nothing we have no data for:
    expect(labels).not.toContain('Funding');
    expect(labels).not.toContain('Equity');
    expect(labels).not.toContain('Cost');
    expect(labels).not.toContain('Duration');
  });

  it('includes "Applications" only when intakeMethod is set and not "unknown"', () => {
    expect(quickFacts(base).map(([l]) => l)).not.toContain('Applications');
    expect(quickFacts({ ...base, intakeMethod: 'unknown' } as Program).map(([l]) => l)).not.toContain('Applications');
    const withIntake = quickFacts({ ...base, intakeMethod: 'rolling' } as Program);
    expect(Object.fromEntries(withIntake)).toHaveProperty('Applications', 'Rolling');
  });

  it('a fully-populated record yields all 12 facts', () => {
    const full = {
      ...base,
      format: 'live-in',
      intakeMethod: 'cohort-application',
      stageFit: ['pre-seed'],
      sectorFocus: ['AI'],
      durationWeeksMin: 12,
      durationWeeksMax: 12,
      providesHousing: true,
      providesWorkspace: true,
      fundingAmount: '$1M uncapped SAFE',
      equityTaken: '5%',
      cost: 'Free — housing covered',
      cohortSize: '10 teams',
    } as Program;
    const facts = quickFacts(full);
    expect(facts).toHaveLength(12);
    expect(facts.map(([l]) => l)).toEqual([
      'Living model',
      'Stage fit',
      'Sector',
      'Applications',
      'Duration',
      'Cohort size',
      'Funding',
      'Equity',
      'Cost',
      'Housing',
      'Workspace',
      'Last verified',
    ]);
  });
});
