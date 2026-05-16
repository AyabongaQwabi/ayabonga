/**
 * `personal` → www.qwabi.co.za (portfolio, blog, full SEO surface)
 * `business` → business.qwabi.co.za (conversion landings only; blog excluded)
 *
 * Set at build time: VITE_SITE_VARIANT=business
 */
export type SiteVariant = 'personal' | 'business';

export const SITE_VARIANT: SiteVariant =
  import.meta.env.VITE_SITE_VARIANT === 'business' ? 'business' : 'personal';

export const isBusinessSite = SITE_VARIANT === 'business';

export const BUSINESS_SITE_ORIGIN = 'https://business.qwabi.co.za';
