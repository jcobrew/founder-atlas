import { useEffect } from 'react';
import { useStore } from '@nanostores/react';
import { $globeIntroReady, $introOpen, autoOpenIntro, closeIntro } from '../stores/ui';

/**
 * Dismissible Story / intro overlay (mounted once via the layout). Auto-opens on
 * a visitor's first arrival, reopens from the nav's Story button. Intentionally
 * simple — just what 0rbital is and why it exists — since all the real
 * interaction lives on the globe itself.
 */
export default function IntroOverlay({ autoOpen = false }: { autoOpen?: boolean }) {
  const open = useStore($introOpen);
  const globeIntroReady = useStore($globeIntroReady);

  useEffect(() => {
    if (autoOpen && globeIntroReady) autoOpenIntro();
  }, [autoOpen, globeIntroReady]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeIntro();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[2000] flex items-start justify-center overflow-y-auto p-4 sm:items-center" role="presentation">
      <button aria-label="Close" onClick={closeIntro} className="fixed inset-0 cursor-default bg-black/65" />
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Orbital story"
        className="relative z-[1] w-full max-w-[520px] rounded-[3px] border border-line2 bg-[#0c0c0c] p-7 shadow-[0_30px_80px_rgba(0,0,0,.7)]"
      >
        <button
          onClick={closeIntro}
          aria-label="Close"
          className="absolute right-4 top-4 rounded-[3px] border border-line2 px-2 py-1 text-[14px] leading-none text-muted transition hover:text-text"
        >
          ✕
        </button>

        <div className="mb-1.5 inline-flex items-center gap-1.5 font-display text-[10.5px] font-semibold uppercase tracking-[.22em] text-a2">
          <span className="orbit-node" aria-hidden="true" />
          0rbital
        </div>
        <h2 className="m-0 mb-3 max-w-[440px] font-display text-[22px] font-bold leading-[1.12] text-text">
          Find your orbit. Launch what’s next.
        </h2>

        <div className="flex flex-col gap-3 text-[13.5px] leading-relaxed text-muted">
          <p className="m-0">
            The right environment changes your trajectory. Compare live-in founder residencies, hacker houses, and co-living programs where builders gather momentum for their next launch.
          </p>
          <p className="m-0">
            Spin the globe to see where these communities cluster, click a point to read what it is and how to
            join, and open a dense city's minimap to zoom in. Switch to <span className="text-text">List</span> any
            time to search and filter every program.
          </p>
          <p className="m-0">
            Orbital keeps these communities in one living, source-backed index — what each one is, where it runs,
            and whether applications are open — so you can compare possible orbits and pick where to build next,
            around serious peers.
          </p>
        </div>

        <div className="mt-6">
          <button
            onClick={closeIntro}
            className="rounded-full border border-transparent px-4 py-2.5 font-display text-[13px] font-bold text-[#0a0a0a] transition active:scale-95"
            style={{ background: 'var(--grad)' }}
          >
            Enter orbit
          </button>
        </div>
      </div>
    </div>
  );
}
