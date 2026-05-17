/**
 * TypeScript mirror of scripts/blog-link-registry.mjs (canonical).
 * Update the .mjs file first, then sync keys here for the blog-pipeline LLM injector.
 */
export const LINK_REGISTRY: Record<string, string> = {
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

const SORTED_KEYS = Object.keys(LINK_REGISTRY).sort((a, b) => b.length - a.length);

export function injectOfficialLinks(markdown: string): string {
  const linked = new Set<string>();
  let result = markdown;

  for (const key of SORTED_KEYS) {
    if (linked.has(key)) continue;
    const url = LINK_REGISTRY[key];
    const pattern = new RegExp(
      `(?<!\\[)(?<!\\]\\()\\b(${escapeRegExp(key)})\\b(?!\\])(?!\\]\\()`,
      'gi',
    );
    if (!pattern.test(result)) continue;

    result = result.replace(pattern, (match) => {
      if (linked.has(key.toLowerCase())) return match;
      linked.add(key.toLowerCase());
      return `[${match}](${url})`;
    });
  }

  return result;
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
