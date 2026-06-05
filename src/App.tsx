import { useCallback, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { SpeedInsights } from '@vercel/speed-insights/react';
import { Analytics } from '@vercel/analytics/react';
import { HomeArtHero } from './components/home/HomeArtHero';
import { HomeManifesto } from './components/home/HomeManifesto';
import { HomeWhatIDo } from './components/home/HomeWhatIDo';
import { HomeCollaborations, HomeSelectedWork } from './components/home/HomeSelectedWork';
import { homeProjects } from './data/home-projects';
import { HomeAboutTeaser } from './components/home/HomeAboutTeaser';
import { HomeLatestWriting } from './components/home/HomeLatestWriting';
import { HomeFinalCta } from './components/home/HomeFinalCta';
import { HomeNav } from './components/home/HomeNav';
import { HomeProofStrip } from './components/home/HomeProofStrip';
import { SiteFooter } from './components/SiteFooter';
import { CustomCursor } from './components/ui/CustomCursor';
import { blogPosts } from './data/blog-posts';
import {
  absoluteUrl,
  DEFAULT_OG_IMAGE,
  DEFAULT_PAGE_DESCRIPTION,
  DEFAULT_PAGE_TITLE,
  SITE_ORIGIN,
  TWITTER_HANDLE,
} from './lib/site-config';
import { HOME_PORTRAIT } from './lib/home-images';
import {
  authorGraphNode,
  buildJsonLdGraph,
  buildOrganizationSchema,
  buildWebSiteSchema,
  personRef,
} from './lib/entity-schema';
const collaborations = [
  { name: 'Project Codex', url: 'https://www.projectcodex.co' },
  { name: 'Western Cape Labs', url: 'https://www.westerncapelabs.com' },
  { name: 'Picsa', url: 'https://www.picsa.com' },
  { name: 'Simply Financial', url: 'https://www.simply.co.za' },
  { name: 'Warner Music Africa', url: 'https://wmacultureshifters.com/' },
  { name: 'Cloudsure', url: 'https://www.cloudsure.mu' },
];

const latestPosts = blogPosts.slice(0, 3);

function App() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 48);
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = useCallback((id: string) => {
    const element = document.getElementById(id);
    if (!element) return;
    const yOffset = -88;
    const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.scrollTo({ top: y, behavior: reduceMotion ? 'auto' : 'smooth' });
  }, []);

  const personImage = absoluteUrl(HOME_PORTRAIT);

  return (
    <>
      <Helmet>
        <title>{DEFAULT_PAGE_TITLE}</title>
        <meta name="description" content={DEFAULT_PAGE_DESCRIPTION} />
        <link rel="canonical" href={absoluteUrl('/')} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={absoluteUrl('/')} />
        <meta property="og:title" content={DEFAULT_PAGE_TITLE} />
        <meta property="og:description" content={DEFAULT_PAGE_DESCRIPTION} />
        <meta property="og:image" content={DEFAULT_OG_IMAGE} />
        <meta property="og:locale" content="en_ZA" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={DEFAULT_PAGE_TITLE} />
        <meta name="twitter:description" content={DEFAULT_PAGE_DESCRIPTION} />
        <meta name="twitter:image" content={DEFAULT_OG_IMAGE} />
        <meta name="twitter:site" content={TWITTER_HANDLE} />
        <meta name="twitter:creator" content={TWITTER_HANDLE} />
        <meta name="robots" content="index, follow" />

        <script type="application/ld+json">
          {JSON.stringify(
            buildJsonLdGraph([
              buildOrganizationSchema(),
              { ...authorGraphNode(), image: personImage },
              buildWebSiteSchema(),
              {
                '@type': 'Service',
                '@id': `${SITE_ORIGIN}/#taas-service`,
                serviceType: 'Technical Co-founder as a Service',
                provider: personRef(),
                description:
                  'End-to-end product engineering, AI integration, and cloud architecture for non-technical founders.',
                areaServed: {
                  '@type': 'Country',
                  name: 'South Africa',
                },
                offers: {
                  '@type': 'Offer',
                  description: 'Fixed-price Phase 1 builds starting from R50,000',
                },
              },
            ]),
          )}
        </script>
      </Helmet>

      <div className="min-h-screen bg-background font-sans text-foreground" data-cursor-root>
        <CustomCursor />
        <HomeNav scrolled={scrolled} onScrollTo={scrollToSection} />

        <main id="main-content">
          <HomeArtHero onScrollTo={scrollToSection} />
          <HomeManifesto />
          <HomeWhatIDo />
          <HomeCollaborations collaborations={collaborations} />
          <HomeAboutTeaser />
          <HomeProofStrip />
          <HomeLatestWriting posts={latestPosts} />
          <HomeSelectedWork projects={homeProjects} />
          <HomeFinalCta />
        </main>

        <SiteFooter />
        <SpeedInsights />
        <Analytics />
      </div>
    </>
  );
}

export default App;
