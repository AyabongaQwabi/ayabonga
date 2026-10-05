import { useCallback, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';

type PhoneAdminRecord = {
  id: string;
  receivedAt: string;
  uploadedAt: string;
  pathname: string;
  method: string;
  url: string;
  query: Record<string, string | string[]>;
  headers: Record<string, string>;
  body: string;
  bodyLength: number;
};

type PhoneAdminResponse = {
  records: PhoneAdminRecord[];
  total: number;
  limit: number;
};

function formatWhen(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString('en-ZA', {
    dateStyle: 'medium',
    timeStyle: 'short',
  });
}

function bodyPreview(body: string, max = 120): string {
  const trimmed = body.trim();
  if (!trimmed) return '(empty body)';
  if (trimmed.length <= max) return trimmed;
  return `${trimmed.slice(0, max)}…`;
}

function RecordDetails({ record }: { record: PhoneAdminRecord }) {
  return (
    <div className="space-y-4 border-t border-white/10 px-4 py-4 text-sm">
      <div>
        <p className="mb-2 font-technical text-xs uppercase tracking-[0.12em] text-[var(--text-muted)]">
          Body
        </p>
        <pre className="overflow-x-auto rounded-lg border border-white/10 bg-black/30 p-3 font-mono text-xs leading-relaxed text-[var(--warm-white)] whitespace-pre-wrap">
          {record.body || '(empty)'}
        </pre>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <p className="mb-2 font-technical text-xs uppercase tracking-[0.12em] text-[var(--text-muted)]">
            Headers
          </p>
          <dl className="space-y-1 rounded-lg border border-white/10 bg-black/20 p-3">
            {Object.entries(record.headers).map(([key, value]) => (
              <div key={key} className="grid grid-cols-[9rem_1fr] gap-2">
                <dt className="font-mono text-xs text-[var(--gold)]">{key}</dt>
                <dd className="break-all font-mono text-xs text-[var(--warm-white)]">{value}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div>
          <p className="mb-2 font-technical text-xs uppercase tracking-[0.12em] text-[var(--text-muted)]">
            Meta
          </p>
          <dl className="space-y-2 rounded-lg border border-white/10 bg-black/20 p-3 text-xs">
            <div>
              <dt className="text-[var(--text-muted)]">ID</dt>
              <dd className="mt-0.5 break-all font-mono">{record.id}</dd>
            </div>
            <div>
              <dt className="text-[var(--text-muted)]">Path</dt>
              <dd className="mt-0.5 break-all font-mono">{record.pathname}</dd>
            </div>
            <div>
              <dt className="text-[var(--text-muted)]">Method</dt>
              <dd className="mt-0.5 font-mono">{record.method}</dd>
            </div>
            <div>
              <dt className="text-[var(--text-muted)]">URL</dt>
              <dd className="mt-0.5 break-all font-mono">{record.url}</dd>
            </div>
            <div>
              <dt className="text-[var(--text-muted)]">Body length</dt>
              <dd className="mt-0.5 font-mono">{record.bodyLength} chars</dd>
            </div>
            {Object.keys(record.query).length > 0 ? (
              <div>
                <dt className="text-[var(--text-muted)]">Query</dt>
                <dd className="mt-0.5 break-all font-mono">
                  {JSON.stringify(record.query, null, 2)}
                </dd>
              </div>
            ) : null}
          </dl>
        </div>
      </div>
    </div>
  );
}

export default function PhoneAdmin() {
  const [records, setRecords] = useState<PhoneAdminRecord[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/phoneadmin?limit=100');
      const data = (await response.json()) as PhoneAdminResponse & { error?: string };

      if (!response.ok) {
        throw new Error(data.error || 'Failed to load records');
      }

      setRecords(data.records);
      setTotal(data.total);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'Failed to load records');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  return (
    <div className="min-h-screen bg-[var(--navy)] text-[var(--warm-white)]">
      <Helmet>
        <title>Phone admin</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <main id="main-content" className="mx-auto max-w-5xl px-4 py-8 md:px-6 md:py-12">
        <header className="mb-8 flex flex-col gap-4 border-b border-white/10 pb-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="font-technical text-xs uppercase tracking-[0.15em] text-[var(--text-muted)]">
              Phone status
            </p>
            <h1 className="mt-2 font-display text-3xl text-[var(--warm-white)]">Phone admin</h1>
            <p className="mt-2 text-sm text-[var(--text-muted)]">
              Incoming `/phonestatus` payloads saved to Vercel Blob.
            </p>
          </div>

          <button
            type="button"
            onClick={() => void load()}
            disabled={loading}
            className="rounded-lg border border-[var(--gold)]/40 bg-[var(--gold)]/10 px-4 py-2 text-sm font-medium text-[var(--gold)] transition hover:bg-[var(--gold)]/20 disabled:opacity-50"
          >
            {loading ? 'Loading…' : 'Refresh'}
          </button>
        </header>

        {error ? (
          <div className="mb-6 rounded-lg border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-200">
            {error}
          </div>
        ) : null}

        <p className="mb-4 text-sm text-[var(--text-muted)]">
          Showing {records.length} of {total} stored request{total === 1 ? '' : 's'}.
        </p>

        {loading && records.length === 0 ? (
          <p className="text-sm text-[var(--text-muted)]">Loading records…</p>
        ) : null}

        {!loading && records.length === 0 && !error ? (
          <p className="rounded-lg border border-white/10 bg-black/20 px-4 py-8 text-center text-sm text-[var(--text-muted)]">
            No phone status records yet.
          </p>
        ) : null}

        <div className="space-y-3">
          {records.map((record) => {
            const expanded = expandedId === record.id;
            const ip =
              record.headers['x-forwarded-for'] ||
              record.headers['x-real-ip'] ||
              'unknown IP';

            return (
              <article
                key={record.id}
                className="overflow-hidden rounded-xl border border-white/10 bg-[var(--card)]"
              >
                <button
                  type="button"
                  onClick={() => setExpandedId(expanded ? null : record.id)}
                  className="flex w-full flex-col gap-2 px-4 py-4 text-left transition hover:bg-white/5 sm:flex-row sm:items-start sm:justify-between"
                >
                  <div className="min-w-0 flex-1">
                    <p className="font-mono text-sm text-[var(--gold)]">
                      {formatWhen(record.receivedAt)}
                    </p>
                    <p className="mt-2 break-words font-sans text-sm leading-relaxed text-[var(--warm-white)]">
                      {bodyPreview(record.body)}
                    </p>
                  </div>

                  <div className="shrink-0 text-xs text-[var(--text-muted)] sm:text-right">
                    <p>{ip}</p>
                    <p className="mt-1 max-w-xs truncate">
                      {record.headers['user-agent'] || 'unknown agent'}
                    </p>
                    <p className="mt-2 text-[var(--gold)]">{expanded ? 'Hide' : 'Details'}</p>
                  </div>
                </button>

                {expanded ? <RecordDetails record={record} /> : null}
              </article>
            );
          })}
        </div>
      </main>
    </div>
  );
}
