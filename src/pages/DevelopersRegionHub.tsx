import { Navigate } from 'react-router-dom';
import { PageShell } from '../components/layout/PageShell';
import { TransitionLink } from '../components/ui/TransitionLink';
import { Helmet } from 'react-helmet-async';
import { ChevronRight, MapPin, MessageCircle } from 'lucide-react';
import {
  absoluteUrl,
  DEFAULT_OG_IMAGE,
  SITE_NAME,
  TWITTER_HANDLE,
  WHATSAPP_URL,
} from '../lib/site-config';
import {
  buildHubSchema,
  buildLocalPageTitle,
  cityDisplayName,
  easternCapeHubPath,
  getAllRoles,
  getEasternCapeCities,
  getRegion,
  localPagePath,
  southAfricaHubPath,
  type LocalCity,
  type LocalRole,
  type RegionSlug,
} from '../lib/local-developers';

const linkClass =
  'interactive-link text-primary transition-colors hover:text-[var(--gold)] focus-visible:text-[var(--gold)]';

function CityRoleLinks({ city, roles }: { city: LocalCity; roles: LocalRole[] }) {
  return (
    <article className="interactive-card rounded-xl border border-border bg-card/40 p-5 hover:border-primary/40 motion-reduce:hover:translate-y-0">
      <h3 className="text-lg font-semibold text-foreground mb-1">{cityDisplayName(city)}</h3>
      <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{city.localIntro}</p>
      <ul className="flex flex-wrap gap-2">
        {roles.map((role) => (
          <li key={role.slug}>
            <TransitionLink
              to={localPagePath(city.slug, role.slug)}
              className="text-xs px-2.5 py-1 rounded-md bg-secondary text-secondary-foreground hover:bg-primary/20 hover:text-[var(--gold)] transition-colors"
            >
              {role.label}
            </TransitionLink>
          </li>
        ))}
      </ul>
    </article>
  );
}

type DevelopersRegionHubProps = {
  regionSlug: RegionSlug;
};

export default function DevelopersRegionHub({ regionSlug }: DevelopersRegionHubProps) {
  const region = getRegion(regionSlug);

  if (!region) {
    return <Navigate to={easternCapeHubPath()} replace />;
  }

  const isEC = regionSlug === 'eastern-cape';
  const canonicalPath = isEC ? easternCapeHubPath() : southAfricaHubPath();
  const canonical = absoluteUrl(canonicalPath);
  const ogTitle = `${region.title} | ${SITE_NAME}`;
  const cities = getEasternCapeCities();
  const roles = getAllRoles();

  return (
    <PageShell className="bg-background text-foreground font-sans">
      <Helmet>
        <title>{ogTitle}</title>
        <meta name="description" content={region.description} />
        <meta name="keywords" content={region.hubKeywords.join(', ')} />
        <link rel="canonical" href={canonical} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={canonical} />
        <meta property="og:title" content={ogTitle} />
        <meta property="og:description" content={region.description} />
        <meta property="og:image" content={DEFAULT_OG_IMAGE} />
        <meta property="og:locale" content="en_ZA" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content={TWITTER_HANDLE} />
        <meta name="robots" content="index, follow" />
        <script type="application/ld+json">{JSON.stringify(buildHubSchema(region, canonical))}</script>
      </Helmet>

      <main id="main-content" className="max-w-6xl mx-auto px-6 py-12 md:py-20">
        <header className="relative mb-12 max-w-3xl overflow-hidden rounded-2xl border border-border p-8 md:p-12">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-[0.06]"
            style={{
              backgroundImage: `
                linear-gradient(135deg, transparent 46%, rgba(255, 215, 0, 0.35) 49%, rgba(255, 215, 0, 0.35) 51%, transparent 54%),
                linear-gradient(45deg, rgba(255,255,255,0.04) 25%, transparent 25%, transparent 75%, rgba(255,255,255,0.04) 75%)
              `,
              backgroundSize: '72px 72px, 20px 20px',
            }}
          />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_0%,rgba(255,215,0,0.08),transparent_55%)]" aria-hidden />
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium mb-6">
              <MapPin className="w-3.5 h-3.5" aria-hidden />
              <span>{region.name}</span>
            </div>
            <h1 className="text-3xl md:text-5xl font-bold text-foreground mb-6 leading-tight text-balance">
              {region.title}
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">{region.description}</p>
          </div>
        </header>

        {!isEC && (
          <>
            <section className="mb-12 p-6 rounded-xl border border-primary/20 bg-primary/5">
              <p className="text-foreground mb-4">
                Based in Queenstown, Eastern Cape. I work with founders and SMMEs across South Africa
                remotely on MVPs, web apps, cloud architecture, and AI integrations.
              </p>
              <TransitionLink to={easternCapeHubPath()} className={`inline-flex items-center gap-1 font-medium ${linkClass}`}>
                City pages: software developers in the Eastern Cape
                <ChevronRight className="w-4 h-4" aria-hidden />
              </TransitionLink>
            </section>
            <section className="mb-14">
              <h2 className="text-2xl font-bold mb-4">What I build nationally</h2>
              <ul className="grid sm:grid-cols-2 gap-3 text-muted-foreground">
                {roles.map((role) => (
                  <li key={role.slug} className="flex items-center gap-2">
                    <ChevronRight className="w-4 h-4 text-primary shrink-0" aria-hidden />
                    <span>
                      <span className="text-foreground font-medium">{role.label}</span>
                      <span className="text-muted-foreground"> · {role.shortFocus}</span>
                    </span>
                  </li>
                ))}
              </ul>
            </section>
          </>
        )}

        {isEC && (
          <>
            <section className="mb-10">
              <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-4">
                Hire by role (all Eastern Cape towns)
              </h2>
              <p className="text-sm text-muted-foreground mb-4">
                Roles available in every town:{' '}
                {roles.map((r) => r.label).join(', ')}. Pick your town below for local context, FAQs,
                and contact.
              </p>
            </section>

            <section className="mb-14">
              <h2 className="text-2xl font-bold mb-6">Towns and cities</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                {cities.map((city) => (
                  <CityRoleLinks key={city.slug} city={city} roles={roles} />
                ))}
              </div>
            </section>

            <section className="mb-14 border-t border-border pt-10">
              <h2 className="text-2xl font-bold mb-4">Popular searches</h2>
              <ul className="grid sm:grid-cols-2 gap-2 text-sm">
                {[
                  { city: 'east-london', role: 'web-developer' as const, label: 'Web developer East London' },
                  { city: 'gqeberha', role: 'web-designer' as const, label: 'Web designer Gqeberha' },
                  { city: 'queenstown', role: 'software-engineer' as const, label: 'Software engineer Queenstown' },
                  { city: 'mthatha', role: 'software-developer' as const, label: 'Software developer Mthatha' },
                ].map((item) => {
                  const city = cities.find((c) => c.slug === item.city)!;
                  const role = roles.find((r) => r.slug === item.role)!;
                  return (
                    <li key={item.label}>
                      <TransitionLink to={localPagePath(item.city, item.role)} className={linkClass}>
                        {item.label}
                      </TransitionLink>
                      <span className="text-muted-foreground ml-1 hidden sm:inline">
                        ({buildLocalPageTitle(role, city).replace(`${role.label} in `, '')})
                      </span>
                    </li>
                  );
                })}
              </ul>
            </section>
          </>
        )}

        {isEC && (
          <section className="mb-14">
            <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-4">
              National coverage
            </h2>
            <TransitionLink
              to={southAfricaHubPath()}
              className={`inline-flex items-center gap-1 text-sm font-medium ${linkClass}`}
            >
              Software developers South Africa
              <ChevronRight className="w-4 h-4" aria-hidden />
            </TransitionLink>
          </section>
        )}

        <section className="flex flex-col sm:flex-row gap-4">
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="interactive-button inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#25D366] hover:bg-[#128C7E] text-white font-semibold rounded-lg"
          >
            <MessageCircle className="w-5 h-5" aria-hidden />
            Message on WhatsApp
          </a>
          <TransitionLink
            to="/get-a-quote"
            className="interactive-button inline-flex items-center justify-center gap-2 px-6 py-3 border border-border hover:border-primary/50 hover:text-[var(--gold)] font-semibold rounded-lg transition-colors"
          >
            Get a quote
          </TransitionLink>
        </section>
      </main>
    </PageShell>
  );
}
