// Shared "show what we know, say Unknown otherwise" formatting — used by the
// detail drawer and the program profile page so they never drift.
import type { Program } from '../data/programs';
import { labelFor } from '../data/taxonomy';

export const UNKNOWN = 'Unknown';

export function displayVal(v: string | number | undefined | null): string {
  if (v === undefined || v === null || v === '') return UNKNOWN;
  return String(v);
}

export function displayBool(v: boolean | null | undefined): string {
  if (v === true) return 'Yes';
  if (v === false) return 'No';
  return UNKNOWN;
}

export function displayDuration(p: Program): string {
  if (p.durationWeeksMin && p.durationWeeksMax)
    return p.durationWeeksMin === p.durationWeeksMax
      ? `${p.durationWeeksMin} weeks`
      : `${p.durationWeeksMin}–${p.durationWeeksMax} weeks`;
  if (p.durationWeeksMin) return `${p.durationWeeksMin}+ weeks`;
  return UNKNOWN;
}

/**
 * The quick-facts grid shown by the detail drawer and the program page.
 * Hide-when-empty: a fact is included only when we actually have the value.
 * Most "missing" facts are structurally inapplicable (a pay-rent house has no
 * Funding/Equity to disclose), and the "Needs verification" panel already
 * reports genuinely-missing data — so the grid never renders an "Unknown" row.
 */
export function quickFacts(p: Program): [string, string][] {
  const applications =
    p.intakeMethod && p.intakeMethod !== 'unknown' ? labelFor('intakeMethod', p.intakeMethod) : UNKNOWN;
  const facts: [string, string][] = [
    ['Stage fit', (p.stageFit && p.stageFit.join(', ')) || displayVal(p.stage)],
    ['Sector', (p.sectorFocus && p.sectorFocus.join(', ')) || displayVal(p.focus)],
    ['Applications', applications],
    ['Duration', displayDuration(p)],
    ['Cohort size', displayVal(p.cohortSize)],
    ['Funding', displayVal(p.fundingAmount)],
    ['Equity', displayVal(p.equityTaken)],
    ['Cost', displayVal(p.cost)],
    ['Workspace', displayBool(p.providesWorkspace)],
    ['Last verified', displayVal(p.lastVerified)],
  ];
  return facts.filter(([, value]) => value !== UNKNOWN);
}

/** "What you get" — only the perks we can confirm are provided. */
export const PROVIDES: { key: keyof Program; label: string }[] = [
  { key: 'providesFunding', label: 'Funding' },
  { key: 'providesWorkspace', label: 'Workspace' },
  { key: 'providesMentorship', label: 'Mentorship' },
  { key: 'providesInvestorAccess', label: 'Investor access' },
  { key: 'providesDemoDay', label: 'Demo day' },
  { key: 'providesVisaSupport', label: 'Visa / relocation support' },
];

export function whatYouGet(p: Program): string[] {
  return PROVIDES.filter(({ key }) => p[key] === true).map(({ label }) => label);
}
