import { useEffect, useRef } from 'react';
import type { Program } from '../data/programs';
import { programSlug } from '../data/programs';
import Logo from './Logo';
import StatusBadge from './StatusBadge';
import SaveButton from './SaveButton';
import { applyHref } from './ProgramCard';
import { noteApplyIntent } from '../stores/applyIntent';
import { UNKNOWN, quickFacts } from '../lib/display';
import { countrySlug, hasCountryProfile } from '../data/countries';
import { dataQualitySummary, missingDecisionFactLabels } from '../lib/dataQuality';

function CountryLink({ country }: { country: string }) {
  return hasCountryProfile(country) ? (
    <a href={`/country/${countrySlug(country)}`} className="font-semibold text-a2 no-underline hover:text-text">
      {country}
    </a>
  ) : (
    <>{country}</>
  );
}

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-[10.5px] font-semibold uppercase tracking-wide text-muted">{label}</dt>
      <dd className="m-0 mt-0.5 text-[12.5px] text-text">{value}</dd>
    </div>
  );
}

/**
 * Program detail drawer / bottom-sheet (handoff §13). Honest about missing data:
 * quick facts are hide-when-empty (see quickFacts in lib/display) and the
 * "Needs verification" panel reports what's missing instead of "Unknown" rows.
 * Non-modal: the rest of the page stays visible and interactive — no scrim.
 * Accessible: Esc to close, focus moves into the panel on open.
 */
export default function ProgramDetailDrawer({ program: p, onClose }: { program: Program | null; onClose: () => void }) {
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!p) return;
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [p, onClose]);

  if (!p) return null;
  const sources = p.sourceUrls ?? [];
  const slug = programSlug(p.name);
  const missingFacts = missingDecisionFactLabels(p);
  const qualitySummary = dataQualitySummary(p);

  return (
    <div
      role="dialog"
      aria-label={`${p.name} details`}
      className="fixed right-0 top-0 z-[1000] flex h-full w-full max-w-[440px] flex-col border-l border-line2 bg-[#0c0c0c] shadow-[0_24px_70px_rgba(0,0,0,.65)] max-[480px]:max-w-full"
    >
        {/* Header */}
        <div className="flex items-start gap-3 border-b border-line p-5">
          <Logo name={p.name} domain={p.domain} size={48} />
          <div className="min-w-0 flex-1">
            <h2 className="m-0 font-display text-[17px] font-bold leading-tight text-text">{p.name}</h2>
            <div className="mt-1 text-[12px] text-muted">
              {p.type} · {p.city}, <CountryLink country={p.country} />
            </div>
            <div className="mt-1 text-[11.5px] text-muted">Run by {p.operator || UNKNOWN}</div>
            <div className="mt-2">
              <StatusBadge status={p.status} full />
            </div>
          </div>
          <div className="flex flex-none items-center gap-1.5">
            <SaveButton slug={slug} name={p.name} size="md" />
            <button
              ref={closeRef}
              onClick={onClose}
              aria-label="Close"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-line2 text-[14px] leading-none text-muted transition hover:border-a1 hover:text-text"
            >
              ✕
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-5">
          {/* CTAs — blocky/rectangular, matching the full page + list. Icon
              buttons (bookmark/close) stay circular in the header. */}
          <div className="mb-5 flex flex-wrap items-center gap-2">
            <a
              href={applyHref(p)}
              target="_blank"
              rel="noopener"
              onClick={() => noteApplyIntent({ slug, name: p.name })}
              className="rounded-[3px] border border-transparent px-5 py-2.5 font-display text-[13px] font-bold text-[#0a0a0a] no-underline"
              style={{ background: 'var(--grad)' }}
            >
              {p.applyUrl ? 'Apply' : 'Visit site'} →
            </a>
            {p.applyUrl && (
              <a
                href={p.url}
                target="_blank"
                rel="noopener"
                className="rounded-[3px] border border-line2 px-5 py-2.5 text-[13px] font-semibold text-text no-underline transition hover:border-a1"
              >
                Visit site
              </a>
            )}
          </div>

          {/* Notes — surfaced high so the human context reads before the facts grid. */}
          {(p.highlight || p.status_detail || p.notes) && (
            <>
              <h3 className="m-0 mb-2 font-display text-[13px] font-bold text-text">Notes</h3>
              {p.highlight && <p className="m-0 mb-2 text-[12.5px] leading-normal text-text">{p.highlight}</p>}
              {p.status_detail && <p className="m-0 mb-2 text-[12.5px] leading-normal text-text">{p.status_detail}</p>}
              {p.notes && <p className="m-0 mb-2 text-[12.5px] leading-normal text-text">{p.notes}</p>}
              <div className="orbit-divider my-5" aria-hidden="true" />
            </>
          )}

          {/* Quick facts — hide-when-empty; the panel below reports what's missing */}
          <h3 className="m-0 mb-2 font-display text-[13px] font-bold text-text">Quick facts</h3>
          <dl className="mb-5 grid grid-cols-2 gap-x-4 gap-y-3">
            {quickFacts(p).map(([label, value]) => (
              <Fact key={label} label={label} value={value} />
            ))}
          </dl>

          {qualitySummary && (
            <div className="mb-5 rounded-[3px] border border-line2 bg-[rgba(255,255,255,.035)] p-3">
              <h4 className="m-0 font-display text-[12.5px] font-bold text-text">Needs verification</h4>
              <p className="m-0 mt-1 text-[12px] leading-normal text-muted">
                {qualitySummary} If you know the details, help keep 0rbital accurate.
              </p>
              <div className="mt-2 flex flex-wrap gap-1">
                {missingFacts.map((fact) => (
                  <span key={fact} className="rounded-[3px] border border-line2 px-2 py-0.5 text-[10.5px] uppercase tracking-wide text-muted">
                    {fact}
                  </span>
                ))}
              </div>
              <a
                href={`/submit?program=${encodeURIComponent(p.name)}&mode=update`}
                className="mt-2 inline-block text-[11.5px] font-semibold text-a2 no-underline hover:text-text"
              >
                Report missing data →
              </a>
            </div>
          )}

          {/* Best for — hide-when-empty, like the facts grid */}
          {p.founderFit && p.founderFit.length > 0 && (
            <>
              <div className="orbit-divider my-5" aria-hidden="true" />
              <h3 className="m-0 mb-2 font-display text-[13px] font-bold text-text">Best for</h3>
              <p className="m-0 mb-5 text-[12.5px] leading-normal text-text">{p.founderFit.join(', ')}</p>
            </>
          )}

          <div className="orbit-divider my-5" aria-hidden="true" />

          {/* Sources */}
          <h3 className="m-0 mb-2 font-display text-[13px] font-bold text-text">Sources</h3>
          <ul className="orbit-list m-0 mb-2 list-none p-0 text-[12px]">
            <li>
              <a href={p.url} target="_blank" rel="noopener" className="text-a2">Official site</a>
            </li>
            {sources.map((s) => (
              <li key={s} className="mt-1">
                <a href={s} target="_blank" rel="noopener" className="break-all text-a2">{s}</a>
              </li>
            ))}
          </ul>
          <p className="m-0 mt-3 text-[11px] italic text-muted">
            Last checked: {p.lastVerified || UNKNOWN}. Application status and terms change often — confirm on the official site before applying.
          </p>
          <p className="m-0 mt-3 text-[11px]">
            <a
              href={`/submit?program=${encodeURIComponent(p.name)}&mode=update`}
              className="text-muted underline decoration-line2 underline-offset-2 transition hover:text-text"
            >
              Something off? Report an update
            </a>
          </p>
      </div>
    </div>
  );
}
