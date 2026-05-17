/** Canonical primary nav — same labels on HomeNav and SiteNav (CURSOR-FULL-SITE-PROMPT). */
export type NavLinkItem = {
  label: string;
  to: string;
  /** Home only: scroll to this section id instead of client routing */
  homeSectionId?: string;
};

export const PRIMARY_NAV_LINKS: readonly NavLinkItem[] = [
  { label: 'About', to: '/about', homeSectionId: 'about' },
  { label: 'Services', to: '/services', homeSectionId: 'expertise' },
  { label: 'TaaS', to: '/technical-cofounder' },
  { label: 'Writing', to: '/blog', homeSectionId: 'writing' },
] as const;

export const NAV_CTA_BLOG = { label: 'Blog', to: '/blog' } as const;
export const NAV_CTA_QUOTE = { label: 'Get a Quote', to: '/get-a-quote' } as const;

/** Inner pages: Home + primary links */
export const SITE_NAV_LINKS: readonly NavLinkItem[] = [
  { label: 'Home', to: '/' },
  ...PRIMARY_NAV_LINKS,
] as const;
