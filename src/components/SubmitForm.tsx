import { useEffect, useState } from 'react';
import { buildIssueUrl, type SubmitFields } from '../lib/submit';

const empty: SubmitFields = {
  mode: 'new',
  name: '',
  type: '',
  websiteUrl: '',
  applyUrl: '',
  city: '',
  country: '',
  stage: '',
  sector: '',
  status: '',
  deadline: '',
  funding: '',
  equity: '',
  housing: '',
  duration: '',
  notes: '',
  sourceUrl: '',
  submitter: '',
  affiliated: false,
};

const input =
  'w-full rounded-full border border-line2 bg-[rgba(16,16,16,.6)] px-3 py-2 text-[13px] text-text outline-none transition focus:border-a1';
const labelCls = 'mb-1 block text-[11px] font-semibold uppercase tracking-wide text-muted';

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className={labelCls}>{label}</span>
      {children}
    </label>
  );
}

export default function SubmitForm() {
  const [f, setF] = useState<SubmitFields>(empty);
  const [opened, setOpened] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Prefill from the URL: /submit?program=<name>&mode=update
  useEffect(() => {
    const u = new URLSearchParams(location.search);
    const program = u.get('program');
    const mode = u.get('mode') === 'update' ? 'update' : 'new';
    setF((prev) => ({ ...prev, mode, name: program ?? prev.name }));
  }, []);

  const set = (k: keyof SubmitFields) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setF((prev) => ({ ...prev, [k]: e.target.type === 'checkbox' ? (e.target as HTMLInputElement).checked : e.target.value }));

  function submit(e: { preventDefault: () => void }) {
    e.preventDefault();
    const sourceUrl = f.sourceUrl?.trim() ?? '';
    if (!f.name.trim()) {
      setError('Add the program name before opening the GitHub issue.');
      return;
    }
    if (!sourceUrl) {
      setError('Add at least one source URL so maintainers can verify the program.');
      return;
    }
    setError(null);
    const url = buildIssueUrl(f);
    setOpened(url);
    window.open(url, '_blank', 'noopener');
  }

  return (
    <form onSubmit={submit} className="max-w-[680px]">
      {/* mode toggle */}
      <div className="mb-5 inline-flex gap-1 rounded-full border border-line2 bg-[rgba(16,16,16,.5)] p-1">
        {(['new', 'update'] as const).map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => setF((prev) => ({ ...prev, mode: m }))}
            className={`rounded-full px-3.5 py-1.5 font-display text-[12.5px] font-semibold transition ${
              f.mode === m ? 'text-[#0a0a0a]' : 'text-muted hover:text-text'
            }`}
            style={f.mode === m ? { background: 'var(--grad)' } : undefined}
          >
            {m === 'new' ? 'New program' : 'Update existing'}
          </button>
        ))}
      </div>

      <p className="mb-5 max-w-[620px] text-[13px] leading-relaxed text-muted">
        Submit a live-in founder residency, hacker house, or residential builder cohort where builders live and build together for a fixed term. We do not list generic accelerators, grants, startup visas, incubators, coworking spaces, or remote-only programs.
      </p>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <Field label="Program name *">
            <input required value={f.name} onChange={set('name')} className={input} placeholder="e.g. HF0 (Hacker Fellowship Zero)" />
          </Field>
        </div>
        <Field label="Type"><input value={f.type} onChange={set('type')} className={input} placeholder="Founder residency, hacker house, live-in cohort…" /></Field>
        <Field label="Website"><input value={f.websiteUrl} onChange={set('websiteUrl')} className={input} placeholder="https://…" /></Field>
        <Field label="Application URL"><input value={f.applyUrl} onChange={set('applyUrl')} className={input} placeholder="https://…/apply" /></Field>
        <Field label="City"><input value={f.city} onChange={set('city')} className={input} /></Field>
        <Field label="Country"><input value={f.country} onChange={set('country')} className={input} /></Field>
        <Field label="Stage fit"><input value={f.stage} onChange={set('stage')} className={input} placeholder="pre-seed, seed…" /></Field>
        <Field label="Sector focus"><input value={f.sector} onChange={set('sector')} className={input} placeholder="AI, climate…" /></Field>
        <Field label="Application status"><input value={f.status} onChange={set('status')} className={input} placeholder="rolling / open / closed…" /></Field>
        <Field label="Deadline"><input value={f.deadline} onChange={set('deadline')} className={input} placeholder="YYYY-MM-DD" /></Field>
        <Field label="Funding"><input value={f.funding} onChange={set('funding')} className={input} placeholder="e.g. $250K" /></Field>
        <Field label="Equity"><input value={f.equity} onChange={set('equity')} className={input} placeholder="e.g. 7%" /></Field>
        <Field label="Housing / cost details"><input value={f.housing} onChange={set('housing')} className={input} placeholder="included, paid separately, shared rooms, meals included…" /></Field>
        <Field label="Duration"><input value={f.duration} onChange={set('duration')} className={input} placeholder="e.g. 12 weeks" /></Field>
        <div className="sm:col-span-2">
          <Field label="Source URL(s) — required for verification">
            <input
              required
              value={f.sourceUrl}
              onChange={set('sourceUrl')}
              aria-invalid={error?.toLowerCase().includes('source') ? true : undefined}
              aria-describedby={error ? 'submit-error' : undefined}
              className={input}
              placeholder="Official pages or announcements that confirm the above"
            />
          </Field>
        </div>
        <div className="sm:col-span-2">
          <Field label="Notes">
            <textarea value={f.notes} onChange={set('notes')} rows={3} className={input + ' !rounded-md'} placeholder="Anything else worth knowing" />
          </Field>
        </div>
        <Field label="Your name / email (optional)"><input value={f.submitter} onChange={set('submitter')} className={input} /></Field>
        <label className="flex items-center gap-2 self-end pb-2 text-[12.5px] text-muted">
          <input type="checkbox" checked={f.affiliated} onChange={set('affiliated')} />
          I'm affiliated with this program
        </label>
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <button
          type="submit"
          className="rounded-full border border-transparent px-5 py-2.5 font-display text-[13px] font-bold text-[#0a0a0a]"
          style={{ background: 'var(--grad)' }}
        >
          Open prefilled GitHub issue →
        </button>
        <span className="text-[12px] text-muted">Opens GitHub with your details filled in — review, then click “Submit new issue”.</span>
      </div>

      {error && (
        <p id="submit-error" className="mt-3 text-[12.5px] font-semibold text-[#ff9f9f]" role="alert">
          {error}
        </p>
      )}

      {opened && (
        <p className="mt-4 text-[12.5px] text-muted">
          Didn’t open?{' '}
          <a href={opened} target="_blank" rel="noopener" className="font-semibold text-a2">
            Open the issue here
          </a>
          .
        </p>
      )}
    </form>
  );
}
