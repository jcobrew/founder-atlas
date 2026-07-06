import type { Program } from '../data/programs';
import { UNKNOWN, displayBool, displayDuration, displayVal } from './display';

export interface MissingFact {
  key: keyof Program | 'duration';
  label: string;
}

const UNKNOWN_BOOL_VALUES = new Set([UNKNOWN]);

export const DECISION_FACTS: MissingFact[] = [
  { key: 'duration', label: 'duration' },
  { key: 'cost', label: 'cost' },
  { key: 'equityTaken', label: 'equity' },
  { key: 'cohortSize', label: 'cohort size' },
  { key: 'providesWorkspace', label: 'workspace' },
];

function hasFact(program: Program, fact: MissingFact): boolean {
  if (fact.key === 'duration') return displayDuration(program) !== UNKNOWN;
  if (fact.key === 'providesWorkspace') {
    return !UNKNOWN_BOOL_VALUES.has(displayBool(program[fact.key]));
  }
  return displayVal(program[fact.key] as string | number | null | undefined) !== UNKNOWN;
}

export function missingDecisionFacts(program: Program): MissingFact[] {
  return DECISION_FACTS.filter((fact) => !hasFact(program, fact));
}

export function missingDecisionFactLabels(program: Program): string[] {
  return missingDecisionFacts(program).map((fact) => fact.label);
}

export function dataQualitySummary(program: Program): string | null {
  const missing = missingDecisionFactLabels(program);
  if (missing.length === 0) return null;
  return `We still need verified ${missing.join(', ')} data for this program.`;
}
