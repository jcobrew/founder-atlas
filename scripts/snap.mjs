#!/usr/bin/env node
/**
 * Screenshot harness for design/UX iteration loops.
 *
 * Usage:
 *   node scripts/snap.mjs                        # snap the default route set
 *   node scripts/snap.mjs /explore /saved        # snap specific routes
 *   OUT=shots node scripts/snap.mjs /explore     # change output dir (default: .snap)
 *   BASE=http://localhost:4322 node scripts/snap.mjs
 *
 * Each route is captured at desktop (1280x900) and mobile (390x844) widths.
 * Output files: <out>/<route-slug>.desktop.png and .mobile.png
 * The dev server must already be running (npm run dev).
 *
 * Playwright resolution: tries a local install first, then the globally
 * installed one (Claude Code web containers ship one at
 * /opt/node22/lib/node_modules/playwright with browsers in /opt/pw-browsers).
 */
import { mkdirSync } from 'node:fs';

const BASE = process.env.BASE || 'http://localhost:4321';
const OUT = process.env.OUT || '.snap';
const DEFAULT_ROUTES = ['/explore', '/countries', '/country/usa', '/saved', '/submit', '/story', '/dashboard', '/programs/hexa-house'];
const routes = process.argv.slice(2).length ? process.argv.slice(2) : DEFAULT_ROUTES;

async function loadChromium() {
  const candidates = ['playwright', '/opt/node22/lib/node_modules/playwright/index.mjs'];
  for (const c of candidates) {
    try {
      return (await import(c)).chromium;
    } catch {
      /* try next */
    }
  }
  throw new Error('playwright not found: npm i -D playwright, or use the preinstalled global one');
}

const chromium = await loadChromium();
const browser = await chromium.launch().catch(async (e) => {
  // Claude Code web containers: browsers live in /opt/pw-browsers.
  if (String(e).includes('executable')) {
    return chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
  }
  throw e;
});

mkdirSync(OUT, { recursive: true });
const viewports = [
  ['desktop', { width: 1280, height: 900 }],
  ['mobile', { width: 390, height: 844 }],
];

let failures = 0;
for (const [label, viewport] of viewports) {
  const page = await browser.newPage({ viewport });
  const errors = [];
  page.on('pageerror', (e) => errors.push(String(e)));
  for (const route of routes) {
    const slug = route === '/' ? 'home' : route.replace(/^\//, '').replaceAll('/', '-');
    try {
      // domcontentloaded, not load: external nice-to-haves (favicon lookups,
      // map tiles) can stall the load event in sandboxed/offline environments.
      await page.goto(BASE + route, { waitUntil: 'domcontentloaded', timeout: 20000 });
      await page.waitForTimeout(1500); // let islands hydrate
      await page.screenshot({ path: `${OUT}/${slug}.${label}.png` });
      console.log(`ok   ${OUT}/${slug}.${label}.png`);
    } catch (e) {
      failures++;
      console.error(`FAIL ${route} (${label}): ${String(e).slice(0, 120)}`);
    }
  }
  if (errors.length) {
    failures++;
    console.error(`page errors (${label}):\n` + errors.join('\n'));
  }
  await page.close();
}

await browser.close();
process.exit(failures ? 1 : 0);
