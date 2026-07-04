import { useEffect, useState } from 'react';
import { useStore } from '@nanostores/react';
import { $filters, filtersToQuery } from '../stores/filters';
import { $saved, initSaved } from '../stores/saved';
import { openIntro } from '../stores/ui';

export type NavCurrent = 'globe' | 'list' | 'countries' | 'dashboard' | 'about' | 'saved' | 'submit';

const VIEWS: { key: NavCurrent; href: string; label: string }[] = [
  { key: 'globe', href: '/', label: 'Globe' },
  { key: 'list', href: '/explore', label: 'List' },
];

const SECTIONS: { key: NavCurrent; href: string; label: string }[] = [
  { key: 'countries', href: '/countries', label: 'Countries' },
  { key: 'submit', href: '/submit', label: 'Submit' },
];

const iconSvg = {
  width: 15,
  height: 15,
  viewBox: '0 0 16 16',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.55,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
};

function ViewIcon({ view }: { view: NavCurrent }) {
  if (view === 'globe') {
    return (
      <svg {...iconSvg} aria-hidden="true">
        <circle cx="8" cy="8" r="6.2" />
        <path d="M2 8h12M8 1.8c1.7 1.7 2.5 3.8 2.5 6.2S9.7 12.5 8 14.2M8 1.8C6.3 3.5 5.5 5.6 5.5 8s.8 4.5 2.5 6.2" />
      </svg>
    );
  }
  return (
    <svg {...iconSvg} aria-hidden="true">
      <path d="M4.5 3.5h9M4.5 8h9M4.5 12.5h9" />
      <circle cx="2.3" cy="3.5" r=".7" fill="currentColor" stroke="none" />
      <circle cx="2.3" cy="8" r=".7" fill="currentColor" stroke="none" />
      <circle cx="2.3" cy="12.5" r=".7" fill="currentColor" stroke="none" />
    </svg>
  );
}

function BookmarkIcon({ filled = false }: { filled?: boolean }) {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 16 16"
      fill={filled ? 'currentColor' : 'none'}
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M4 2.5h8a.5.5 0 0 1 .5.5v10.5L8 11l-4.5 2.5V3a.5.5 0 0 1 .5-.5Z" />
    </svg>
  );
}

/**
 * The one header used on every page (top of scroll pages, top of the globe
 * sidebar). Brand · Globe/List icon toggle · Story/Saved shortcuts. Countries lives off the
 * globe (in List mode and beyond) to keep the globe panel uncluttered; the
 * toggle carries the live filter query so filters persist across views.
 */
export function ViewToggle({ current, className = 'bg-[rgba(16,16,16,.5)]' }: { current?: NavCurrent; className?: string }) {
  const filters = useStore($filters);
  const qs = filtersToQuery(filters);
  const suffix = qs ? '?' + qs : '';

  return (
    <div
      className={`inline-flex gap-1 rounded-full border border-line2 p-1 ${className}`}
      role="tablist"
      aria-label="View"
    >
      {VIEWS.map((v) => {
        const active = v.key === current;
        return (
          <a
            key={v.key}
            href={v.href + suffix}
            role="tab"
            aria-selected={active}
            aria-current={active ? 'page' : undefined}
            aria-label={v.label}
            title={v.label}
            className={`inline-flex h-7 w-7 items-center justify-center rounded-full font-display text-[12px] font-semibold no-underline transition active:scale-95 ${
              active
                ? 'text-[#0a0a0a] shadow-[0_2px_10px_rgba(0,0,0,.4)]'
                : 'text-a2 hover:bg-[rgba(255,255,255,.07)] hover:text-text'
            }`}
            style={active ? { background: 'var(--grad)' } : undefined}
          >
            <ViewIcon view={v.key} />
          </a>
        );
      })}
    </div>
  );
}

export default function SiteNav({ current }: { current?: NavCurrent }) {
  const saved = useStore($saved);
  const [toast, setToast] = useState<string | null>(null);
  useEffect(() => {
    initSaved();
  }, []);

  useEffect(() => {
    const onSaved = (e: Event) => {
      const detail = (e as CustomEvent<{ name?: string; saved?: boolean }>).detail;
      setToast(detail?.saved ? 'Saved to shortlist' : 'Removed from shortlist');
      setTimeout(() => setToast(null), 1400);
    };
    window.addEventListener('orbital:saved-toggle', onSaved);
    return () => window.removeEventListener('orbital:saved-toggle', onSaved);
  }, []);

  return (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
      <a href="/" className="inline-flex items-center gap-1.5 font-display text-[14px] font-bold tracking-tight text-text no-underline">
        <span className="orbit-node" aria-hidden="true" />
        0rbital
      </a>

      <ViewToggle current={current} />

      <nav className="ml-auto flex items-center gap-1" aria-label="Sections">
        {/* Saved shortlist — the bookmark buttons live on every card and on the globe's
            program popup, so every view (the globe included) needs a way back to
            the list they fill; shows a live count when non-empty. */}
        {SECTIONS.map((item) => (
          <a
            key={item.key}
            href={item.href}
            aria-current={current === item.key ? 'page' : undefined}
            className={`rounded-[3px] px-2.5 py-1.5 font-display text-[12px] font-semibold no-underline transition ${
              current === item.key ? 'text-text' : 'text-a2 hover:text-text'
            }`}
          >
            {item.label}
          </a>
        ))}
        <button
          type="button"
          onClick={openIntro}
          aria-haspopup="dialog"
          className="rounded-[3px] px-2.5 py-1.5 font-display text-[12px] font-semibold text-a2 transition hover:text-text"
        >
          Story
        </button>
        <a
          href="/saved"
          aria-current={current === 'saved' ? 'page' : undefined}
          aria-label={saved.length ? `${saved.length} saved programs` : 'Saved programs'}
          title={saved.length ? `${saved.length} saved programs` : 'Saved programs'}
          className={`inline-flex items-center gap-1 rounded-[3px] px-2.5 py-1.5 font-display text-[12px] font-semibold no-underline transition ${
            current === 'saved' ? 'text-text' : 'text-a2 hover:text-text'
          }`}
        >
          <BookmarkIcon filled={saved.length > 0} />
          {saved.length > 0 && (
            <span className="rounded-full border border-line2 px-1.5 text-[10px] leading-[1.4] text-muted">
              {saved.length}
            </span>
          )}
        </a>
      </nav>
      {toast && (
        <div className="fixed bottom-6 left-1/2 z-[1100] -translate-x-1/2 rounded-full px-4 py-2.5 text-[12.5px] font-bold text-[#0a0a0a]" style={{ background: 'var(--grad)' }} role="status">
          {toast}
        </div>
      )}
    </div>
  );
}
