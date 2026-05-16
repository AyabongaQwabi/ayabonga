import { useCallback, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { SpeedInsights } from '@vercel/speed-insights/react';
import { Analytics } from '@vercel/analytics/react';
import { HomeArtHero } from './components/home/HomeArtHero';
import { HomeManifesto } from './components/home/HomeManifesto';
import { HomeWhatIDo } from './components/home/HomeWhatIDo';
import {
  HomeCollaborations,
  HomeSelectedWork,
  type HomeProject,
} from './components/home/HomeSelectedWork';
import { HomeAboutTeaser } from './components/home/HomeAboutTeaser';
import { HomeLatestWriting } from './components/home/HomeLatestWriting';
import { HomeFinalCta } from './components/home/HomeFinalCta';
import { HomeNav } from './components/home/HomeNav';
import { SiteFooter } from './components/SiteFooter';
import { blogPosts } from './data/blog-posts';
import { authorPersonSchema } from './lib/author-profile';
import {
  absoluteUrl,
  DEFAULT_OG_IMAGE,
  DEFAULT_PAGE_DESCRIPTION,
  DEFAULT_PAGE_TITLE,
  TWITTER_HANDLE,
} from './lib/site-config';
import { HOME_PORTRAIT } from './lib/home-images';
import {
  buildOrganizationSchema,
  buildWebSiteSchema,
} from './lib/entity-schema';

const projects: HomeProject[] = [
  {
    title: 'Laundry Marketplace',
    description:
      'A turnkey laundry marketplace connecting customers with local laundry service providers.',
    url: 'https://laundry.qwabi.co.za',
    tech: ['Next.js', 'React', 'Tailwind CSS'],
  },
  {
    title: 'ClinicPlus',
    description:
      'Clinic appointments for mining companies in Witbank, streamlining occupational healthcare access.',
    url: 'https://clinicplusbookings.co.za',
    tech: ['React', 'Node.js', 'MongoDB'],
  },
  {
    title: 'Queens Connect',
    description:
      'A friendly AI companion for the Queenstown community, with local information and assistance.',
    url: 'https://queensconnect.qwabi.co.za',
    tech: ['AI', 'Next.js', 'OpenAI'],
  },
  {
    title: 'Kingly',
    description:
      'An AI tool for vibe coding documents and prompts, built for developer productivity.',
    url: 'https://kingly.qwabi.co.za',
    tech: ['AI', 'React', 'TypeScript'],
  },
  {
    title: 'UTap',
    description:
      'University NFC access card mobile wallet for campus access and payments.',
    url: 'https://utaptech.co.za',
    tech: ['React Native', 'NFC', 'Firebase'],
  },
  {
    title: 'eSpazza',
    description:
      'Xhosa hip hop music streaming and blogging celebrating Eastern Cape hip hop culture.',
    url: '/projects/espazza',
    tech: ['React', 'Express', 'MongoDB'],
  },
];

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
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@graph': [
              buildOrganizationSchema(),
              {
                ...authorPersonSchema({ url: absoluteUrl('/about') }),
                '@id': `${absoluteUrl('/')}#person`,
                image: personImage,
              },
              buildWebSiteSchema(),
              {
                '@type': 'Service',
                serviceType: 'Technical Co-founder as a Service',
                provider: { '@id': `${absoluteUrl('/')}#person` },
                description:
                  'End-to-end product engineering, AI integration, and cloud architecture for non-technical founders.',
                areaServed: 'South Africa',
                offers: {
                  '@type': 'Offer',
                  description: 'Fixed-price Phase 1 builds starting from R50,000',
                },
              },
            ],
          })}
        </script>
      </Helmet>

      <div className="min-h-screen bg-background font-sans text-foreground">
        <HomeNav scrolled={scrolled} onScrollTo={scrollToSection} />

        <main>
          <HomeArtHero onScrollTo={scrollToSection} />
          <HomeManifesto />
          <HomeWhatIDo />
          <HomeSelectedWork projects={projects} />
          <HomeCollaborations collaborations={collaborations} />
          <HomeAboutTeaser />
          <HomeLatestWriting posts={latestPosts} />
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
