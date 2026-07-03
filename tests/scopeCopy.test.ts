import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const PUBLIC_COPY_FILES = [
  'src/pages/index.astro',
  'src/pages/explore.astro',
  'src/pages/submit.astro',
  'src/components/SavedList.tsx',
  'src/components/IntroOverlay.tsx',
  'src/islands/GlobeView.tsx',
  'src/pages/llms.txt.ts',
  'README.md',
];

const FORBIDDEN_PUBLIC_COPY = [
  /startup campuses/i,
  /startup support/i,
  /builder environments/i,
  /new builder environment/i,
  /add a builder environment/i,
  /submit a builder environment/i,
];

describe('public scope copy', () => {
  it('keeps public positioning focused on live-in founder programs', () => {
    for (const file of PUBLIC_COPY_FILES) {
      const text = readFileSync(resolve(__dirname, '..', file), 'utf8');
      for (const pattern of FORBIDDEN_PUBLIC_COPY) {
        expect(text, `${file} contains forbidden public copy: ${pattern}`).not.toMatch(pattern);
      }
    }
  });
});
