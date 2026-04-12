const envSite =
  typeof import.meta !== 'undefined' && import.meta.env?.VITE_SITE_URL
    ? String(import.meta.env.VITE_SITE_URL).replace(/\/$/, '')
    : '';

/** Canonical site URL (no trailing slash). Set `VITE_SITE_URL` for previews/staging. */
export const SITE_ORIGIN = envSite || 'https://www.qwabi.co.za';

export const SITE_NAME = 'Ayabonga Qwabi';

export const DEFAULT_PAGE_TITLE =
  'Ayabonga Qwabi | AI Specialist & Cloud Architect | South Africa';

export const DEFAULT_PAGE_DESCRIPTION =
  'AI Specialist and Cloud Architect with 10 years of experience. Queenstown, South Africa. AI/ML, GCP, AWS, Azure, React, Node.js, full-stack.';

export const DEFAULT_OG_IMAGE =
  'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/634131924_4362348684012184_2809328754212142225_n%20%281%29-n9dEY5Noh5Y0nxfTCK3TwAMABTs8KG.jpg';

export const TWITTER_HANDLE = '@ayabongaqwabi';

export function absoluteUrl(path: string): string {
  const p = path.startsWith('/') ? path : `/${path}`;
  return `${SITE_ORIGIN}${p}`;
}

/** Best-effort ISO date for JSON-LD from frontmatter display strings like "April 15, 2026". */
export function parsePostDateForSchema(dateStr: string): string | undefined {
  const t = Date.parse(dateStr);
  if (Number.isNaN(t)) return undefined;
  return new Date(t).toISOString().split('T')[0];
}
