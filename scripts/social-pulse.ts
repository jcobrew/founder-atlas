#!/usr/bin/env -S npx tsx
/**
 * Social pulse — dated social recency for the listed programs (report-only).
 *
 * Answers one question per program: when did it last post, and where did I see
 * it? This script NEVER modifies `programs-data.json`. It writes a JSON report
 * and prints a table; `program-liveness-audit` turns that into proposals.
 *
 * Why it exists: the 2026-08 audit had to run on websites alone because
 * LinkedIn returns HTTP 999 and X returns HTTP 402 to unauthenticated fetches.
 * That left "have they gone quiet on socials?" — the question that started the
 * audit — unanswerable. This closes that gap for X.
 *
 * Access reality (2026): X killed its free tier on 6 Feb 2026; pay-per-use is
 * $0.005/post read. LinkedIn's official API cannot read third-party company
 * posts at all, so this script does not attempt it and reports `no-api` rather
 * than pretending otherwise.
 *
 * Run:
 *   npx tsx scripts/social-pulse.ts                    # every program
 *   npx tsx scripts/social-pulse.ts --stale-days=60    # only stale records
 *   npx tsx scripts/social-pulse.ts --name="Forge"     # one program
 *   npx tsx scripts/social-pulse.ts --dry-run          # cost estimate, no calls
 *   npx tsx scripts/social-pulse.ts --json             # machine-readable only
 *
 * Auth: set X_BEARER_TOKEN (App-only OAuth 2.0). With no token the script still
 * runs and reports `unknown` recency — it never fabricates a date.
 */

import { writeFileSync, mkdirSync, readdirSync, readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { PROGRAMS, type Program } from '../src/data/programs';

/** Posts fetched per program. 20 is plenty to date the most recent post. */
export const MAX_POSTS_PER_PROGRAM = 20;
/** X pay-per-use rate, USD per post read (as of 2026-02-06). */
export const USD_PER_POST_READ = 0.005;
/** Reuse a report younger than this unless --force. */
export const CACHE_DAYS = 7;

const REPORT_DIR = 'data/social-pulse';
const X_API = 'https://api.x.com/2';

export type PulseSource = 'x-api' | 'no-token' | 'no-handle' | 'error';

export interface PulseRecord {
  name: string;
  handle: string | null;
  /** ISO datetime of the most recent post, when one was actually seen. */
  lastPostAt: string | null;
  /** Whole days since `lastPostAt`; null when unknown. */
  ageDays: number | null;
  /** Posts returned in the window. */
  postCount: number;
  /** URL of the most recent post — the citation an audit needs. */
  lastPostUrl: string | null;
  source: PulseSource;
  note?: string;
}

export interface PulseReport {
  generatedAt: string;
  tokenPresent: boolean;
  requested: number;
  postsRead: number;
  estimatedCostUsd: number;
  /** LinkedIn is structurally unavailable — recorded so readers don't wonder. */
  linkedin: 'no-api';
  records: PulseRecord[];
}

// ── pure helpers (exported for the test suite) ───────────────────────────────

/** Extract an X handle from a profile URL. Returns null when absent/unparseable. */
export function handleFromUrl(url: string | undefined): string | null {
  if (!url) return null;
  const m = url.match(/^https?:\/\/(?:www\.)?(?:x|twitter)\.com\/([A-Za-z0-9_]{1,15})\/?/i);
  return m ? m[1] : null;
}

/** Whole days between an ISO datetime and `now`. Null on missing/invalid input. */
export function ageInDays(iso: string | null, now: Date = new Date()): number | null {
  if (!iso) return null;
  const t = Date.parse(iso);
  if (Number.isNaN(t)) return null;
  return Math.floor((now.getTime() - t) / 86_400_000);
}

/** Cost of reading `posts` at the current pay-per-use rate, rounded to cents. */
export function estimateCostUsd(posts: number): number {
  return Math.round(posts * USD_PER_POST_READ * 100) / 100;
}

/**
 * Which programs to check. `staleDays` limits the sweep to records whose
 * `lastVerified` is older than the threshold (or missing) — the cheap default
 * for scheduled runs. `name` filters to a single program, case-insensitively.
 */
export function selectPrograms(
  programs: Program[],
  opts: { staleDays?: number; name?: string; now?: Date } = {},
): Program[] {
  const { staleDays, name, now = new Date() } = opts;
  let out = programs;
  if (name) {
    const needle = name.toLowerCase();
    out = out.filter((p) => p.name.toLowerCase().includes(needle));
  }
  if (typeof staleDays === 'number') {
    out = out.filter((p) => {
      const age = ageInDays(p.lastVerified ?? null, now);
      return age === null || age >= staleDays;
    });
  }
  return out;
}

/** Most recent post in an X timeline payload, or null when the timeline is empty. */
export function newestPost(
  data: Array<{ id: string; created_at?: string }> | undefined,
): { id: string; created_at: string } | null {
  if (!data?.length) return null;
  const dated = data.filter((d): d is { id: string; created_at: string } => !!d.created_at);
  if (!dated.length) return null;
  return dated.reduce((a, b) => (Date.parse(b.created_at) > Date.parse(a.created_at) ? b : a));
}

// ── X API ────────────────────────────────────────────────────────────────────

async function xFetch(path: string, token: string): Promise<any> {
  const res = await fetch(`${X_API}${path}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) {
    const body = await res.text().catch(() => '');
    throw new Error(`X API ${res.status} ${res.statusText} — ${body.slice(0, 200)}`);
  }
  return res.json();
}

async function pulseForProgram(p: Program, token: string | null): Promise<PulseRecord> {
  const handle = handleFromUrl((p as Program & { xUrl?: string }).xUrl);
  const base: PulseRecord = {
    name: p.name,
    handle,
    lastPostAt: null,
    ageDays: null,
    postCount: 0,
    lastPostUrl: null,
    source: 'no-handle',
  };

  if (!handle) {
    return { ...base, note: 'No xUrl on the record — find the handle before archiving.' };
  }
  if (!token) {
    return {
      ...base,
      source: 'no-token',
      note: 'X_BEARER_TOKEN not set; recency genuinely unknown, not zero.',
    };
  }

  try {
    const user = await xFetch(`/users/by/username/${handle}`, token);
    const id = user?.data?.id;
    if (!id) {
      return { ...base, source: 'error', note: `Handle @${handle} not found on X.` };
    }
    const tl = await xFetch(
      `/users/${id}/tweets?max_results=${MAX_POSTS_PER_PROGRAM}&tweet.fields=created_at`,
      token,
    );
    const posts = (tl?.data ?? []) as Array<{ id: string; created_at?: string }>;
    const newest = newestPost(posts);
    return {
      ...base,
      source: 'x-api',
      postCount: posts.length,
      lastPostAt: newest?.created_at ?? null,
      ageDays: ageInDays(newest?.created_at ?? null),
      lastPostUrl: newest ? `https://x.com/${handle}/status/${newest.id}` : null,
      note: newest ? undefined : 'Handle exists but the recent timeline is empty.',
    };
  } catch (err) {
    return { ...base, source: 'error', note: (err as Error).message };
  }
}

// ── cache ────────────────────────────────────────────────────────────────────

function recentReportPath(now: Date): string | null {
  if (!existsSync(REPORT_DIR)) return null;
  const files = readdirSync(REPORT_DIR)
    .filter((f) => f.endsWith('.json'))
    .sort()
    .reverse();
  for (const f of files) {
    const age = ageInDays(f.replace('.json', '') + 'T00:00:00Z', now);
    if (age !== null && age < CACHE_DAYS) return join(REPORT_DIR, f);
  }
  return null;
}

// ── CLI ──────────────────────────────────────────────────────────────────────

function arg(flag: string): string | undefined {
  const hit = process.argv.find((a) => a.startsWith(`--${flag}=`));
  if (hit) return hit.split('=').slice(1).join('=');
  const idx = process.argv.indexOf(`--${flag}`);
  if (idx !== -1 && process.argv[idx + 1] && !process.argv[idx + 1].startsWith('--')) {
    return process.argv[idx + 1];
  }
  return undefined;
}
const has = (flag: string) => process.argv.includes(`--${flag}`);

async function main() {
  const now = new Date();
  const token = process.env.X_BEARER_TOKEN ?? null;
  const staleRaw = arg('stale-days');
  const selected = selectPrograms(PROGRAMS, {
    staleDays: staleRaw ? Number(staleRaw) : undefined,
    name: arg('name'),
    now,
  });

  const withHandles = selected.filter((p) => handleFromUrl((p as any).xUrl));
  const maxPosts = withHandles.length * MAX_POSTS_PER_PROGRAM;

  if (has('dry-run')) {
    console.log(`social-pulse — dry run`);
    console.log(`  programs selected : ${selected.length}`);
    console.log(`  with an X handle  : ${withHandles.length}`);
    console.log(`  max posts read    : ${maxPosts}`);
    console.log(`  max cost          : $${estimateCostUsd(maxPosts).toFixed(2)}`);
    console.log(`  token present     : ${token ? 'yes' : 'NO — would report unknown'}`);
    return;
  }

  const cached = has('force') ? null : recentReportPath(now);
  if (cached) {
    console.log(`Reusing ${cached} (younger than ${CACHE_DAYS} days). Pass --force to refetch.`);
    if (has('json')) console.log(readFileSync(cached, 'utf8'));
    return;
  }

  if (!token) {
    console.warn(
      'WARNING: X_BEARER_TOKEN is not set. Reporting recency as unknown for every ' +
        'program — do NOT read this as "they have gone quiet". See the ' +
        'program-social-pulse skill for setup.',
    );
  }

  const records: PulseRecord[] = [];
  for (const p of selected) {
    records.push(await pulseForProgram(p, token));
  }

  const postsRead = records.reduce((n, r) => n + r.postCount, 0);
  const report: PulseReport = {
    generatedAt: now.toISOString(),
    tokenPresent: !!token,
    requested: selected.length,
    postsRead,
    estimatedCostUsd: estimateCostUsd(postsRead),
    linkedin: 'no-api',
    records,
  };

  mkdirSync(REPORT_DIR, { recursive: true });
  const out = join(REPORT_DIR, `${now.toISOString().slice(0, 10)}.json`);
  writeFileSync(out, JSON.stringify(report, null, 2) + '\n');

  if (has('json')) {
    console.log(JSON.stringify(report, null, 2));
    return;
  }

  const pad = (s: string, n: number) => s.padEnd(n).slice(0, n);
  console.log(`\nsocial pulse — ${records.length} programs, ${postsRead} posts read `
    + `($${report.estimatedCostUsd.toFixed(2)})`);
  console.log(`LinkedIn: no official API for third-party company posts — not attempted.\n`);
  console.log(
    `${pad('program', 34)} ${pad('handle', 18)} ${pad('last post', 12)} ${pad('age', 6)} ${'source'}`,
  );
  for (const r of records.sort((a, b) => (b.ageDays ?? 1e9) - (a.ageDays ?? 1e9))) {
    console.log(
      `${pad(r.name, 34)} ${pad(r.handle ? '@' + r.handle : '—', 18)} ` +
        `${pad(r.lastPostAt?.slice(0, 10) ?? '—', 12)} ${pad(r.ageDays !== null ? `${r.ageDays}d` : '?', 6)} ${r.source}`,
    );
  }
  console.log(`\nReport: ${out}`);
  console.log(
    'Reminder: a future-dated cohort on the program\'s own site outranks social ' +
      'silence. Never archive on quiet socials alone.',
  );
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}
