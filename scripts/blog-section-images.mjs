/**
 * Curated Pexels CDN images for inline blog sections (distinct from hero/inline dupes).
 * Keys: `${slug}-${suffix}` → public file `${slug}-${suffix}.webp`
 */
export const PRIORITY_SECTION_SLUGS = [
  'ai-tools-building-apps-2026',
  'what-is-web-development',
  'how-to-build-high-converting-landing-page',
  'software-development-companies-south-africa-2026',
  'microservices-architecture-explained',
  'mobile-app-development-companies-south-africa',
];

const w = (id) =>
  `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=1200`;

/** @type {Record<string, string>} */
export const SECTION_IMAGE_SOURCES = {
  // ai-tools-building-apps-2026
  'ai-tools-building-apps-2026-intro': w(3861949),
  'ai-tools-building-apps-2026-layers': w(546819),
  'ai-tools-building-apps-2026-founders': w(3184418),
  'ai-tools-building-apps-2026-security': w(5380658),

  // what-is-web-development
  'what-is-web-development-stack': w(1181263),
  'what-is-web-development-modern': w(4974915),
  'what-is-web-development-timeline': w(3184296),
  'what-is-web-development-vendor': w(3184360),

  // how-to-build-high-converting-landing-page
  'how-to-build-high-converting-landing-page-goal': w(265072),
  'how-to-build-high-converting-landing-page-structure': w(196644),
  'how-to-build-high-converting-landing-page-stack': w(11035471),
  'how-to-build-high-converting-landing-page-performance': w(1092644),

  // software-development-companies-south-africa-2026
  'software-development-companies-south-africa-2026-categories': w(3183197),
  'software-development-companies-south-africa-2026-checklist': w(3184465),
  'software-development-companies-south-africa-2026-custom-build': w(7688336),
  'software-development-companies-south-africa-2026-hubs': w(1486781),

  // microservices-architecture-explained
  'microservices-architecture-explained-diagram': w(1181467),
  'microservices-architecture-explained-monolith': w(325229),
  'microservices-architecture-explained-tracing': w(577210),
  'microservices-architecture-explained-modular': w(574071),

  // mobile-app-development-companies-south-africa
  'mobile-app-development-companies-south-africa-devices': w(607812),
  'mobile-app-development-companies-south-africa-discovery': w(3182814),
  'mobile-app-development-companies-south-africa-budget': w(4386321),
  'mobile-app-development-companies-south-africa-testing': w(1092638),
};

/** Markdown path + alt per section key (for batch updates). */
export const SECTION_MARKDOWN_UPDATES = {
  'ai-tools-building-apps-2026': [
    {
      key: 'ai-tools-building-apps-2026-intro',
      alt: 'Developer using AI coding tools on a laptop in a focused workspace',
    },
    {
      key: 'ai-tools-building-apps-2026-layers',
      alt: 'Three-layer model comparing IDE agents, terminal agents, and browser app generators',
    },
    {
      key: 'ai-tools-building-apps-2026-founders',
      alt: 'Founder and developer choosing different AI coding tools for their stage',
    },
    {
      key: 'ai-tools-building-apps-2026-security',
      alt: 'Secure development workflow with branch protection and secrets outside prompts',
    },
  ],
  'what-is-web-development': [
    {
      key: 'what-is-web-development-stack',
      alt: 'Full-stack web development workflow on laptop and server diagram',
    },
    {
      key: 'what-is-web-development-modern',
      alt: 'Modern web stack with TypeScript, React components, and cloud deployment pipeline',
    },
    {
      key: 'what-is-web-development-timeline',
      alt: 'Web project timeline from discovery through launch and iteration on a whiteboard',
    },
    {
      key: 'what-is-web-development-vendor',
      alt: 'Team reviewing a software vendor shortlist and production app references',
    },
  ],
  'how-to-build-high-converting-landing-page': [
    {
      key: 'how-to-build-high-converting-landing-page-goal',
      alt: 'High-converting landing page hero with a single call to action',
    },
    {
      key: 'how-to-build-high-converting-landing-page-structure',
      alt: 'Landing page wireframe with hero, proof strip, and repeated call to action blocks',
    },
    {
      key: 'how-to-build-high-converting-landing-page-stack',
      alt: 'Developer choosing between no-code landing tools and a custom React codebase',
    },
    {
      key: 'how-to-build-high-converting-landing-page-performance',
      alt: 'Compressed WebP images and fast mobile page load metrics on an Android phone',
    },
  ],
  'software-development-companies-south-africa-2026': [
    {
      key: 'software-development-companies-south-africa-2026-categories',
      alt: 'Map of software development company categories in South Africa',
    },
    {
      key: 'software-development-companies-south-africa-2026-checklist',
      alt: 'Buyer checklist for vetting a South African software development partner',
    },
    {
      key: 'software-development-companies-south-africa-2026-custom-build',
      alt: 'Startup founder comparing agency overhead with a senior-led custom build',
    },
    {
      key: 'software-development-companies-south-africa-2026-hubs',
      alt: 'Map highlighting Johannesburg, Cape Town, and distributed teams across South Africa',
    },
  ],
  'microservices-architecture-explained': [
    {
      key: 'microservices-architecture-explained-diagram',
      alt: 'Diagram of microservices connected by APIs instead of one monolith',
    },
    {
      key: 'microservices-architecture-explained-monolith',
      alt: 'Monolith versus microservices comparison diagram on a whiteboard',
    },
    {
      key: 'microservices-architecture-explained-tracing',
      alt: 'Distributed system tracing across multiple services in a monitoring dashboard',
    },
    {
      key: 'microservices-architecture-explained-modular',
      alt: 'Modular monolith codebase folders separated before any service extraction',
    },
  ],
  'mobile-app-development-companies-south-africa': [
    {
      key: 'mobile-app-development-companies-south-africa-devices',
      alt: 'Mobile app development on iOS and Android devices in South Africa',
    },
    {
      key: 'mobile-app-development-companies-south-africa-discovery',
      alt: 'Discovery workshop covering offline mode, Paystack payments, and app store submission',
    },
    {
      key: 'mobile-app-development-companies-south-africa-budget',
      alt: 'Mobile app budget planning with ZAR cost bands and timeline estimates',
    },
    {
      key: 'mobile-app-development-companies-south-africa-testing',
      alt: 'TestFlight and Google Play internal testing builds on iOS and Android devices',
    },
  ],
};
