import { noteApplyIntent } from '../stores/applyIntent';

/**
 * Apply/Visit CTA with apply-intent tracking. The recruiting status is shown once
 * in the page header badge, so this button no longer repeats an urgency pill.
 */
export default function ApplyButton({
  slug,
  name,
  url,
  applyUrl,
}: {
  slug: string;
  name: string;
  url: string;
  applyUrl?: string;
}) {
  const href = applyUrl || url;
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener"
      onClick={() => noteApplyIntent({ slug, name })}
      className="inline-flex rounded-[3px] border border-transparent px-5 py-2.5 font-display text-[13px] font-bold text-[#0a0a0a] no-underline"
      style={{ background: 'var(--grad)' }}
    >
      {applyUrl ? 'Apply' : 'Visit site'} →
    </a>
  );
}
