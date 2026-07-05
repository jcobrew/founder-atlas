// "Why are you looking?" founder triggers (handoff §8.2 / §16). Simple, honest,
// rule-based: each trigger maps to a filter preset that genuinely narrows the
// list toward the kind of program that solves that bottleneck. No black-box
// recommender — clicking a trigger just sets filters you can see and tweak.
import type { Filters } from '../lib/filter';

export interface Trigger {
  label: string;
  /** Filter preset applied (replacing the current filters). */
  preset: Partial<Filters>;
}

// Each trigger narrows the list via the free-text `q` (the living/working
// `model` filter was retired in favour of the data-driven Sector/Country
// filters, so triggers map to keyword presets the search hay can match).
export const TRIGGERS: Trigger[] = [
  {
    label: 'I need funding',
    preset: { q: 'accelerator' },
  },
  {
    label: 'I want a live-in residency',
    preset: { q: 'live-in' },
  },
  {
    label: 'I need a cofounder or community',
    preset: { q: 'hacker house' },
  },
  {
    label: 'I need deep focus',
    preset: { q: 'residency' },
  },
];
