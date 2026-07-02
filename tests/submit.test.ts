import { describe, expect, it } from 'vitest';
import { buildIssueBody, buildIssueUrl, type SubmitFields } from '@/lib/submit';

const base: SubmitFields = {
  mode: 'new',
  name: 'Example Residency',
  type: 'Founder residency',
  sourceUrl: 'https://example.com/program',
  affiliated: false,
};

describe('submit issue builder', () => {
  it('uses co-living-specific submission language', () => {
    const body = buildIssueBody(base);
    expect(body).toContain('New live-in founder program submission');
    expect(body).toContain('Please verify this live-in founder program');
    expect(body).not.toContain('New builder environment submission');
  });

  it('builds issues in the jcobrew/orbital repo with the live-in founder label in the title', () => {
    const url = buildIssueUrl(base);
    expect(url).toContain('https://github.com/jcobrew/orbital/issues/new?');
    const params = new URL(url).searchParams;
    expect(params.get('title')).toBe('[New live-in founder program] Example Residency');
    expect(params.get('labels')).toBe('program-submission');
  });
});
