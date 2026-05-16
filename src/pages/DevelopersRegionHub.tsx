import { Link, Navigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ArrowLeft, ChevronRight, MapPin, MessageCircle } from 'lucide-react';
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

function CityRoleLinks({ city, roles }: { city: LocalCity; roles: LocalRole[] }) {
  return (
    <article className="rounded-xl border border-border bg-card/40 p-5 hover:border-primary/40 transition-colors">
      <h3 className="text-lg font-semibold text-foreground mb-1">{cityDisplayName(city)}</h3>
      <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{city.localIntro}</p>
      <ul className="flex flex-wrap gap-2">
        {roles.map((role) => (
          <li key={role.slug}>
            <Link
              to={localPagePath(city.slug, role.slug)}
              className="text-xs px-2.5 py-1 rounded-md bg-secondary text-secondary-foreground hover:bg-primary hover:text-primary-foreground transition-colors"
            >
              {role.label}
            </Link>
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
    <div className="min-h-screen bg-background text-foreground font-sans">
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

      <nav className="border-b border-border">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Home</span>
          </Link>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-6 py-12 md:py-20">
        <header className="mb-12 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium mb-6">
            <MapPin className="w-3.5 h-3.5" aria-hidden />
            <span>{region.name}</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-bold text-foreground mb-6 leading-tight text-balance">
            {region.title}
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed">{region.description}</p>
        </header>

        {!isEC && (
          <>
            <section className="mb-12 p-6 rounded-xl border border-primary/20 bg-primary/5">
              <p className="text-foreground mb-4">
                Based in Queenstown, Eastern Cape. I work with founders and SMMEs across South Africa
                remotely on MVPs, web apps, cloud architecture, and AI integrations.
              </p>
              <Link
                to={easternCapeHubPath()}
                className="inline-flex items-center gap-1 text-primary font-medium hover:underline underline-offset-4"
              >
                City pages: software developers in the Eastern Cape
                <ChevronRight className="w-4 h-4" />
              </Link>
            </section>
            <section className="mb-14">
              <h2 className="text-2xl font-bold mb-4">What I build nationally</h2>
              <ul className="grid sm:grid-cols-2 gap-3 text-muted-foreground">
                {roles.map((role) => (
                  <li key={role.slug} className="flex items-center gap-2">
                    <ChevronRight className="w-4 h-4 text-primary shrink-0" />
                    <span>
                      <span className="text-foreground font-medium">{role.label}</span>
                      {' — '}
                      {role.shortFocus}
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
                      <Link
                        to={localPagePath(item.city, item.role)}
                        className="text-primary hover:underline underline-offset-4"
                      >
                        {item.label}
                      </Link>
                      <span className="text-muted-foreground ml-1 hidden sm:inline">
                        — {buildLocalPageTitle(role, city).replace(role.label + ' in ', '')}
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
            <Link
              to={southAfricaHubPath()}
              className="inline-flex items-center gap-1 text-sm text-primary hover:underline underline-offset-4"
            >
              Software developers South Africa
              <ChevronRight className="w-4 h-4" />
            </Link>
          </section>
        )}

        <section className="flex flex-col sm:flex-row gap-4">
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#25D366] hover:bg-[#128C7E] text-white font-semibold rounded-lg transition-colors"
          >
            <MessageCircle className="w-5 h-5" aria-hidden />
            Message on WhatsApp
          </a>
          <Link
            to="/get-a-quote"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 border border-border hover:border-primary/50 font-semibold rounded-lg transition-colors"
          >
            Get a quote
          </Link>
        </section>
      </main>
    </div>
  );
}
