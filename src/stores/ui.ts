// Intro-overlay visibility — shared across islands so the Story control (in the
// nav) and the overlay itself (mounted once in the layout) stay in sync.
import { atom } from 'nanostores';

export const $introOpen = atom(false);
export const $globeIntroReady = atom(false);

const SEEN_KEY = 'orbital_intro_seen';
const LEGACY_SEEN_KEY = 'fa_intro_seen';

function introSeenThisSession(): boolean {
  try {
    return (
      sessionStorage.getItem(SEEN_KEY) === '1' ||
      sessionStorage.getItem(LEGACY_SEEN_KEY) === '1'
    );
  } catch {
    return false;
  }
}

/** Open the overlay only if the visitor hasn't dismissed it before. */
export function autoOpenIntro(): void {
  if (!introSeenThisSession()) {
    $introOpen.set(true);
  }
}

export function openIntro(): void {
  $introOpen.set(true);
}

/** Close + remember for this browser session, so reloads don't immediately reopen it. */
export function closeIntro(): void {
  $introOpen.set(false);
  try {
    sessionStorage.setItem(SEEN_KEY, '1');
    sessionStorage.removeItem(LEGACY_SEEN_KEY);
  } catch {
    /* storage unavailable — fine */
  }
}

export function resetGlobeIntroReady(): void {
  $globeIntroReady.set(false);
}

export function markGlobeIntroReady(): void {
  $globeIntroReady.set(true);
}
