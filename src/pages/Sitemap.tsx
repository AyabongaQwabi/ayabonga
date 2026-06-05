import { Helmet } from 'react-helmet-async';
import { PageShell } from '../components/layout/PageShell';
import { TransitionLink } from '../components/ui/TransitionLink';
import { buildSitemapSections, type SitemapEntry } from '../lib/sitemap-sections';
import { absoluteUrl, SITE_NAME, TWITTER_HANDLE } from '../lib/site-config';
import { buildSimplePageGraph } from '../lib/entity-schema';

const linkClass =
  'interactive-link text-[var(--warm-white)] underline decoration-[var(--gold)]/40 underline-offset-4 hover:text-[var(--gold)] hover:decoration-[var(--gold)] focus-visible:text-[var(--gold)]';

function SitemapTree({ entries, depth = 0 }: { entries: SitemapEntry[]; depth?: number }) {
  return (
    <ul
      className={
        depth === 0
          ? 'space-y-2'
          : 'mt-2 space-y-1.5 border-l border-white/10 pl-4 ml-1'
      }
    >
      {entries.map((entry) => (
        <li key={entry.path ?? entry.label}>
          {entry.path ? (
            <TransitionLink to={entry.path} className={linkClass}>
              {entry.label}
            </TransitionLink>
          ) : (
            <span className="font-technical text-sm font-medium uppercase tracking-[var(--tracking-label)] text-[var(--text-muted)]">
              {entry.label}
            </span>
          )}
          {entry.children && entry.children.length > 0 ? (
            <SitemapTree entries={entry.children} depth={depth + 1} />
          ) : null}
        </li>
      ))}
    </ul>
  );
}

export default function SitemapPage() {
  const sections = buildSitemapSections();
  const canonicalPath = '/sitemap';
  const title = `Sitemap | ${SITE_NAME}`;
  const description = `Browse every page on ${SITE_NAME}: services, writing, solutions, comparisons, and developer hub routes.`;

  return (
    <PageShell>
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={description} />
        <link rel="canonical" href={absoluteUrl(canonicalPath)} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={absoluteUrl(canonicalPath)} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:locale" content="en_ZA" />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:site" content={TWITTER_HANDLE} />
        <meta name="robots" content="index, follow" />
        <script type="application/ld+json">
          {JSON.stringify(
            buildSimplePageGraph({
              name: title,
              description,
              canonical: absoluteUrl(canonicalPath),
            }),
          )}
        </script>
      </Helmet>

      <main id="main-content" className="mx-auto max-w-3xl px-6 py-12 md:py-16">
        <header className="mb-10 border-b border-white/10 pb-8">
          <p className="font-technical text-label-sm uppercase tracking-[var(--tracking-label)] text-[var(--text-muted)]">
            Site index
          </p>
          <h1 className="mt-3 font-display text-heading-lg text-[var(--warm-white)]">Sitemap</h1>
          <p className="mt-4 max-w-xl font-sans text-base leading-relaxed text-[var(--text-muted)]">
            Every public page on this site, grouped by section. For crawlers, see{' '}
            <a href="/sitemap.xml" className={linkClass}>
              sitemap.xml
            </a>
            .
          </p>
        </header>

        <nav aria-label="Site pages">
          {sections.map((section) => (
            <section
              key={section.id}
              aria-labelledby={`sitemap-${section.id}`}
              className="mb-10 last:mb-0"
            >
              <h2
                id={`sitemap-${section.id}`}
                className="mb-4 font-display text-heading-sm text-[var(--warm-white)]"
              >
                {section.title}
              </h2>
              <SitemapTree entries={section.items} />
            </section>
          ))}
        </nav>
      </main>
    </PageShell>
  );
}
