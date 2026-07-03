import { describe, expect, it } from 'vitest';
import { EMPTY_FILTERS, hasActiveFilters, passes, type Filters } from '@/lib/filter';
import { filtersFromURL, filtersToQuery } from '@/stores/filters';
import type { Program } from '@/data/programs';

const program: Program = {
  dataset: 'residential',
  name: 'Deep Focus House',
  type: 'Hacker House',
  canonicalType: 'hacker-house',
  city: 'San Francisco',
  country: 'USA',
  lat: 37.7,
  lng: -122.4,
  focus: 'AI builders',
  operator: 'Orbital Test',
  stage: 'Pre-seed',
  status: 'open',
  status_detail: 'Live-in cohort for technical founders.',
  domain: 'example.com',
  url: 'https://example.com',
  highlight: 'Housing, workspace, and a strong LLM peer group.',
  notes: 'Best for repeat technical builders.',
  format: 'live-in',
  providesHousing: true,
  providesWorkspace: true,
  providesFunding: false,
  supportModes: ['housing', 'workspace', 'community'],
  stageFit: ['pre-seed'],
  founderFit: ['technical-builder'],
  sectorFocus: ['AI'],
  tags: ['llm'],
};

const f = (patch: Partial<Filters> = {}): Filters => ({ ...EMPTY_FILTERS, ...patch });

describe('program filters', () => {
  it('searches notes, highlights, tags and structured fit fields', () => {
    expect(passes(program, f({ q: 'repeat technical' }))).toBe(true);
    expect(passes(program, f({ q: 'llm' }))).toBe(true);
    expect(passes(program, f({ q: 'climate' }))).toBe(false);
  });

  it('filters by living model and explicit perks', () => {
    expect(passes(program, f({ format: ['live-in'], housing: true, workspace: true }))).toBe(true);
    expect(passes(program, f({ format: ['remote'] }))).toBe(false);
    expect(passes(program, f({ funding: true }))).toBe(false);
  });

  it('round-trips new filter params through the URL', () => {
    const filters = f({
      q: 'ai',
      country: ['USA'],
      sector: ['ai'],
      format: ['live-in'],
      housing: true,
      workspace: true,
      funding: true,
      status: 'open',
    });
    const qs = filtersToQuery(filters);
    expect(filtersFromURL('?' + qs)).toEqual(filters);
  });

  it('detects active filters', () => {
    expect(hasActiveFilters(EMPTY_FILTERS)).toBe(false);
    expect(hasActiveFilters(f({ housing: true }))).toBe(true);
  });
});
