import { absoluteUrl, SITE_NAME, WHATSAPP_URL } from './site-config';

export const AUTHOR_JOB_TITLE = 'Senior Product Engineer & Cloud Architect';

export const AUTHOR_LOCATION = 'Queenstown, Eastern Cape, South Africa';

export const AUTHOR_EXPERIENCE_YEARS = '10';

export const AUTHOR_EMAIL = 'aya@qwabi.co.za';

export const AUTHOR_SAME_AS = [
  'https://github.com/ayabongaqwabi',
  'https://www.linkedin.com/in/ayabongaqwabi',
  'https://twitter.com/ayabongaqwabi',
] as const;

export const ORGANIZATION_NAME = 'Qwabi Technologies';

export const AUTHOR_SHORT_BIO =
  'Senior product engineer and cloud architect based in Queenstown, Eastern Cape. I build full-stack apps, AI tools, and cloud systems for founders across South Africa.';

export const AUTHOR_BIO_LINKS = {
  about: '/about',
  writing: '/blog',
  whatsapp: WHATSAPP_URL,
  linkedin: 'https://www.linkedin.com/in/ayabongaqwabi',
  email: `mailto:${AUTHOR_EMAIL}`,
} as const;

/** Professional headshot (same asset as homepage carousel). */
export const AUTHOR_PROFILE_IMAGE =
  'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/634131924_4362348684012184_2809328754212142225_n%20%281%29-n9dEY5Noh5Y0nxfTCK3TwAMABTs8KG.jpg';

export function authorPersonSchema(overrides?: { url?: string }) {
  return {
    '@type': 'Person' as const,
    name: SITE_NAME,
    url: overrides?.url ?? absoluteUrl('/about'),
    image: AUTHOR_PROFILE_IMAGE,
    jobTitle: AUTHOR_JOB_TITLE,
    email: AUTHOR_EMAIL,
    sameAs: [...AUTHOR_SAME_AS],
    address: {
      '@type': 'PostalAddress' as const,
      addressLocality: 'Queenstown',
      addressRegion: 'Eastern Cape',
      addressCountry: 'ZA',
    },
  };
}
