import { beforeEach, describe, expect, it } from 'vitest';
import {
  $globeIntroReady,
  $introOpen,
  autoOpenIntro,
  closeIntro,
  markGlobeIntroReady,
  openIntro,
  resetGlobeIntroReady,
} from '@/stores/ui';

function installSessionStorage() {
  const values = new Map<string, string>();
  Object.defineProperty(globalThis, 'sessionStorage', {
    configurable: true,
    value: {
      getItem: (key: string) => values.get(key) ?? null,
      setItem: (key: string, value: string) => {
        values.set(key, value);
      },
      removeItem: (key: string) => {
        values.delete(key);
      },
      clear: () => {
        values.clear();
      },
      key: (index: number) => Array.from(values.keys())[index] ?? null,
      get length() {
        return values.size;
      },
    },
  });
}

describe('intro overlay state', () => {
  beforeEach(() => {
    installSessionStorage();
    $introOpen.set(false);
    resetGlobeIntroReady();
  });

  it('auto-opens until dismissed for the current session', () => {
    autoOpenIntro();
    expect($introOpen.get()).toBe(true);

    closeIntro();
    expect($introOpen.get()).toBe(false);

    autoOpenIntro();
    expect($introOpen.get()).toBe(false);
  });

  it('keeps manual Story opens independent from the globe readiness gate', () => {
    expect($globeIntroReady.get()).toBe(false);

    openIntro();

    expect($introOpen.get()).toBe(true);
  });

  it('tracks when the globe boot surface is ready for the intro', () => {
    expect($globeIntroReady.get()).toBe(false);

    markGlobeIntroReady();
    expect($globeIntroReady.get()).toBe(true);

    resetGlobeIntroReady();
    expect($globeIntroReady.get()).toBe(false);
  });
});
