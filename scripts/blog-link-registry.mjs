/**
 * Canonical official URLs for blog AUTO_LINK_PLACEHOLDER replacement.
 * Keys are lowercase. Use LABEL_ALIASES for display labels that do not match keys exactly.
 */
export const LINK_REGISTRY = {
  react: 'https://react.dev/',
  'next.js': 'https://nextjs.org/',
  nextjs: 'https://nextjs.org/',
  vercel: 'https://vercel.com/',
  'vercel v0': 'https://v0.dev/',
  v0: 'https://v0.dev/',
  'v0.dev': 'https://v0.dev/',
  supabase: 'https://supabase.com/',
  firebase: 'https://firebase.google.com/',
  tailwind: 'https://tailwindcss.com/',
  'tailwind css': 'https://tailwindcss.com/',
  'tailwind ui': 'https://tailwindui.com/',
  typescript: 'https://www.typescriptlang.org/',
  nodejs: 'https://nodejs.org/',
  'node.js': 'https://nodejs.org/',
  playwright: 'https://playwright.dev/',
  openai: 'https://openai.com/',
  anthropic: 'https://www.anthropic.com/',
  claude: 'https://claude.ai/',
  cursor: 'https://cursor.com/',
  github: 'https://github.com/',
  'github copilot': 'https://github.com/features/copilot',
  docker: 'https://www.docker.com/',
  kubernetes: 'https://kubernetes.io/',
  aws: 'https://aws.amazon.com/',
  gcp: 'https://cloud.google.com/',
  azure: 'https://azure.microsoft.com/',
  stripe: 'https://stripe.com/',
  paystack: 'https://paystack.com/',
  shopify: 'https://www.shopify.com/',
  webflow: 'https://webflow.com/',
  framer: 'https://www.framer.com/',
  wix: 'https://www.wix.com/',
  squarespace: 'https://www.squarespace.com/',
  bubble: 'https://bubble.io/',
  'bolt.new': 'https://bolt.new/',
  bolt: 'https://bolt.new/',
  base44: 'https://base44.com/',
  lovable: 'https://lovable.dev/',
  pagedone: 'https://pagedone.io/',
  wordpress: 'https://wordpress.org/',
  woocommerce: 'https://woocommerce.com/',
  retool: 'https://retool.com/',
  outsystems: 'https://www.outsystems.com/',
  'envato elements': 'https://elements.envato.com/',
  themeforest: 'https://themeforest.net/',
  cruip: 'https://cruip.com/',
  flowbite: 'https://flowbite.com/',
  'shadcn/ui': 'https://ui.shadcn.com/',
  'aceternity ui': 'https://ui.aceternity.com/',
  'magic ui': 'https://magicui.design/',
  hyperui: 'https://hyperui.dev/',
  mdx: 'https://mdxjs.com/',
  mermaid: 'https://mermaid.js.org/',
  jamstack: 'https://jamstack.org/',
  graphql: 'https://graphql.org/',
  prisma: 'https://www.prisma.io/',
  drizzle: 'https://orm.drizzle.team/',
  remix: 'https://remix.run/',
  astro: 'https://astro.build/',
  svelte: 'https://svelte.dev/',
  sveltekit: 'https://svelte.dev/docs/kit',
  vue: 'https://vuejs.org/',
  nuxt: 'https://nuxt.com/',
  angular: 'https://angular.dev/',
  netlify: 'https://www.netlify.com/',
  cloudflare: 'https://www.cloudflare.com/',
  vite: 'https://vite.dev/',
  html: 'https://developer.mozilla.org/en-US/docs/Web/HTML',
  css: 'https://developer.mozilla.org/en-US/docs/Web/CSS',
  javascript: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript',
  python: 'https://www.python.org/',
  go: 'https://go.dev/',
  rust: 'https://www.rust-lang.org/',
  postgresql: 'https://www.postgresql.org/',
  sanity: 'https://www.sanity.io/',
  contentful: 'https://www.contentful.com/',
  strapi: 'https://strapi.io/',
  medusa: 'https://medusajs.com/',
};

/** Exact markdown link label → registry key */
export const LABEL_ALIASES = {
  'Vercel v0': 'vercel v0',
  'Tailwind CSS': 'tailwind css',
  'Tailwind UI': 'tailwind ui',
  'Node.js': 'node.js',
  'Next.js': 'next.js',
  'GitHub Copilot': 'github copilot',
  'Bolt.new': 'bolt.new',
  'Envato Elements': 'envato elements',
  'shadcn/ui': 'shadcn/ui',
  'Aceternity UI': 'aceternity ui',
  'Magic UI': 'magic ui',
  'HyperUI': 'hyperui',
  'PageDone': 'pagedone',
  'SvelteKit': 'sveltekit',
};

/**
 * @param {string} label - Text inside [label](AUTO_LINK_PLACEHOLDER)
 * @returns {string | undefined}
 */
export function resolveLinkUrl(label) {
  const trimmed = label.trim();
  if (LABEL_ALIASES[trimmed]) {
    const key = LABEL_ALIASES[trimmed];
    return LINK_REGISTRY[key];
  }
  const lower = trimmed.toLowerCase();
  if (LINK_REGISTRY[lower]) return LINK_REGISTRY[lower];
  const slashKey = lower.replace(/\s+/g, ' ');
  if (LINK_REGISTRY[slashKey]) return LINK_REGISTRY[slashKey];
  return undefined;
}
