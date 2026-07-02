import { describe, expect, it } from 'vitest';
import astroConfig from '../astro.config.mjs';

describe('route compatibility', () => {
  it('keeps /countries available as a real page instead of redirecting home', () => {
    expect(astroConfig.redirects).not.toHaveProperty('/countries');
  });

  it('redirects the common HFO/HF0 typo to the canonical HF0 program page', () => {
    expect(astroConfig.redirects).toMatchObject({
      '/programs/hfo-hacker-fellowship-zero': '/programs/hf0-hacker-fellowship-zero',
    });
  });
});
