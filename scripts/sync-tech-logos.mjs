/**
 * Sync tech logos from ~/dev/logos and ~/dev/logos-taran into the site.
 * Outputs public/images/tech-logos/, mirrors blog/icons/, and src/data/tech-logos.json.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const DEV_ROOT = path.join(ROOT, '..');

const LOGO_SOURCES = [
  path.join(DEV_ROOT, 'logos', 'logos'),
  path.join(DEV_ROOT, 'logos-taran'),
  path.join(DEV_ROOT, 'logos-taran', '_SVGs'),
];

const OUT_TECH = path.join(ROOT, 'public', 'images', 'tech-logos');
const OUT_BLOG_ICONS = path.join(ROOT, 'public', 'images', 'blog', 'icons');
const MANIFEST_PATH = path.join(ROOT, 'src', 'data', 'tech-logos.json');

const IMAGE_EXT = new Set(['.svg', '.png', '.webp', '.jpg', '.jpeg']);

/** Curated slugs with display aliases (matched case-insensitively). */
const CURATED = [
  { slug: 'react', aliases: ['React', 'ReactJS', 'reactjs'] },
  { slug: 'nextjs', aliases: ['Next.js', 'NextJS', 'next'] },
  { slug: 'nodejs', aliases: ['Node.js', 'NodeJS', 'node'] },
  { slug: 'typescript', aliases: ['TypeScript', 'TS'] },
  { slug: 'javascript', aliases: ['JavaScript', 'JS'] },
  { slug: 'python', aliases: ['Python'] },
  { slug: 'go', aliases: ['Go', 'Golang', 'golang'] },
  { slug: 'rust', aliases: ['Rust'] },
  { slug: 'java', aliases: ['Java'] },
  { slug: 'kotlin', aliases: ['Kotlin'] },
  { slug: 'swift', aliases: ['Swift'] },
  { slug: 'dart', aliases: ['Dart'] },
  { slug: 'clojure', aliases: ['Clojure'] },
  { slug: 'graphql', aliases: ['GraphQL'] },
  { slug: 'html5', aliases: ['HTML', 'HTML5'] },
  { slug: 'css3', aliases: ['CSS', 'CSS3'] },
  { slug: 'sass', aliases: ['Sass', 'SCSS'] },
  { slug: 'tailwindcss', aliases: ['Tailwind', 'Tailwind CSS'] },
  { slug: 'vite', aliases: ['Vite'] },
  { slug: 'webpack', aliases: ['Webpack'] },
  { slug: 'rollup', aliases: ['Rollup'] },
  { slug: 'esbuild', aliases: ['esbuild'] },
  { slug: 'babel', aliases: ['Babel'] },
  { slug: 'eslint', aliases: ['ESLint'] },
  { slug: 'prettier', aliases: ['Prettier'] },
  { slug: 'jest', aliases: ['Jest'] },
  { slug: 'vitest', aliases: ['Vitest'] },
  { slug: 'cypress', aliases: ['Cypress'] },
  { slug: 'playwright', aliases: ['Playwright'] },
  { slug: 'docker', aliases: ['Docker'] },
  { slug: 'kubernetes', aliases: ['Kubernetes', 'K8s', 'k8s'] },
  { slug: 'terraform', aliases: ['Terraform'] },
  { slug: 'ansible', aliases: ['Ansible'] },
  { slug: 'aws', aliases: ['AWS', 'Amazon Web Services'] },
  { slug: 'google-cloud', aliases: ['GCP', 'Google Cloud'] },
  { slug: 'azure', aliases: ['Azure', 'Microsoft Azure'] },
  { slug: 'vercel', aliases: ['Vercel'] },
  { slug: 'netlify', aliases: ['Netlify'] },
  { slug: 'cloudflare', aliases: ['Cloudflare'] },
  { slug: 'firebase', aliases: ['Firebase'] },
  { slug: 'supabase', aliases: ['Supabase'] },
  { slug: 'mongodb', aliases: ['MongoDB', 'Mongo'] },
  { slug: 'postgresql', aliases: ['PostgreSQL', 'Postgres', 'postgres'] },
  { slug: 'mysql', aliases: ['MySQL'] },
  { slug: 'redis', aliases: ['Redis'] },
  { slug: 'prisma', aliases: ['Prisma'] },
  { slug: 'drizzle', aliases: ['Drizzle'] },
  { slug: 'express', aliases: ['Express', 'Express.js'] },
  { slug: 'nestjs', aliases: ['NestJS', 'Nest.js'] },
  { slug: 'fastapi', aliases: ['FastAPI'] },
  { slug: 'django', aliases: ['Django'] },
  { slug: 'flask', aliases: ['Flask'] },
  { slug: 'gatsby', aliases: ['Gatsby', 'GatsbyJS'] },
  { slug: 'remix', aliases: ['Remix'] },
  { slug: 'astro', aliases: ['Astro'] },
  { slug: 'svelte', aliases: ['Svelte'] },
  { slug: 'vue', aliases: ['Vue', 'Vue.js', 'VueJS'] },
  { slug: 'angular', aliases: ['Angular'] },
  { slug: 'nuxt', aliases: ['Nuxt', 'Nuxt.js'] },
  { slug: 'react-native', aliases: ['React Native'] },
  { slug: 'expo', aliases: ['Expo'] },
  { slug: 'flutter', aliases: ['Flutter'] },
  { slug: 'electron', aliases: ['Electron'] },
  { slug: 'tauri', aliases: ['Tauri'] },
  { slug: 'openai', aliases: ['OpenAI'] },
  { slug: 'anthropic', aliases: ['Anthropic', 'Claude'] },
  { slug: 'claude', aliases: ['claude'] },
  { slug: 'langchain', aliases: ['LangChain'] },
  { slug: 'huggingface', aliases: ['Hugging Face', 'HuggingFace'] },
  { slug: 'tensorflow', aliases: ['TensorFlow'] },
  { slug: 'pytorch', aliases: ['PyTorch'] },
  { slug: 'cursor', aliases: ['Cursor'] },
  { slug: 'github', aliases: ['GitHub'] },
  { slug: 'gitlab', aliases: ['GitLab'] },
  { slug: 'bitbucket', aliases: ['Bitbucket'] },
  { slug: 'npm', aliases: ['npm'] },
  { slug: 'yarn', aliases: ['Yarn'] },
  { slug: 'pnpm', aliases: ['pnpm'] },
  { slug: 'figma', aliases: ['Figma'] },
  { slug: 'stripe', aliases: ['Stripe'] },
  { slug: 'paystack', aliases: ['Paystack'] },
  { slug: 'payfast', aliases: ['Payfast', 'PayFast'] },
  { slug: 'nginx', aliases: ['Nginx'] },
  { slug: 'apache', aliases: ['Apache'] },
  { slug: 'linux', aliases: ['Linux'] },
  { slug: 'ubuntu', aliases: ['Ubuntu'] },
  { slug: 'debian', aliases: ['Debian'] },
  { slug: 'git', aliases: ['Git'] },
  { slug: 'github-actions', aliases: ['GitHub Actions'] },
  { slug: 'istio', aliases: ['Istio'] },
  { slug: 'helm', aliases: ['Helm'] },
  { slug: 'prometheus', aliases: ['Prometheus'] },
  { slug: 'grafana', aliases: ['Grafana'] },
  { slug: 'datadog', aliases: ['Datadog'] },
  { slug: 'sentry', aliases: ['Sentry'] },
  { slug: 'slack', aliases: ['Slack'] },
  { slug: 'notion', aliases: ['Notion'] },
  { slug: 'linear', aliases: ['Linear'] },
  { slug: 'jira', aliases: ['Jira'] },
  { slug: 'confluence', aliases: ['Confluence'] },
  { slug: 'shopify', aliases: ['Shopify'] },
  { slug: 'woocommerce', aliases: ['WooCommerce'] },
  { slug: 'wordpress', aliases: ['WordPress'] },
  { slug: 'sanity', aliases: ['Sanity'] },
  { slug: 'contentful', aliases: ['Contentful'] },
  { slug: 'storybook', aliases: ['Storybook'] },
  { slug: 'shadcn', aliases: ['shadcn', 'shadcn/ui'] },
  { slug: 'radix-ui', aliases: ['Radix', 'Radix UI'] },
  { slug: 'trpc', aliases: ['tRPC'] },
  { slug: 'zod', aliases: ['Zod'] },
  { slug: 'redux', aliases: ['Redux'] },
  { slug: 'mobx', aliases: ['MobX'] },
  { slug: 'tanstack', aliases: ['TanStack'] },
  { slug: 'react-query', aliases: ['React Query', 'TanStack Query'] },
  { slug: 'solidjs', aliases: ['Solid', 'SolidJS'] },
  { slug: 'bun', aliases: ['Bun'] },
  { slug: 'deno', aliases: ['Deno'] },
  { slug: 'cloudinary', aliases: ['Cloudinary'] },
  { slug: 'twilio', aliases: ['Twilio'] },
  { slug: 'sendgrid', aliases: ['SendGrid'] },
  { slug: 'resend', aliases: ['Resend'] },
];

/** Map curated slug → filename stem in the logo library when names differ. */
const SOURCE_SLUG_MAP = {
  css3: 'css',
  azure: 'microsoft-azure',
  huggingface: 'hugging-face',
  rollup: 'rollupjs',
  'radix-ui': 'radix-ui',
};

const SLUG_ALIASES = {
  golang: 'go',
  postgres: 'postgresql',
  postgresql: 'postgresql',
  mongo: 'mongodb',
  k8s: 'kubernetes',
  ts: 'typescript',
  js: 'javascript',
  'next.js': 'nextjs',
  next: 'nextjs',
  'node.js': 'nodejs',
  node: 'nodejs',
  'vue.js': 'vue',
  'express.js': 'express',
  'nest.js': 'nestjs',
  gcp: 'google-cloud',
  claude: 'anthropic',
  huggingface: 'huggingface',
  'tanstack-query': 'react-query',
  shadcnui: 'shadcn',
};

function normalizeSlug(input) {
  return String(input)
    .trim()
    .toLowerCase()
    .replace(/\.(svg|png|webp|jpe?g)$/i, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function fileSlug(filePath) {
  const base = path.basename(filePath, path.extname(filePath));
  return normalizeSlug(base.replace(/-icon(-alt|-round)?$/i, '').replace(/-dark$/i, ''));
}

function scoreCandidate(filePath, targetSlug) {
  const base = path.basename(filePath);
  const ext = path.extname(filePath).toLowerCase();
  const stem = path.basename(filePath, ext);
  const slug = fileSlug(filePath);

  let score = 0;
  if (slug === targetSlug) score += 100;
  else if (slug.startsWith(`${targetSlug}-`)) score += 40;
  else if (slug.includes(targetSlug)) score += 20;

  if (stem === targetSlug) score += 50;
  if (stem.endsWith('-icon') || stem.endsWith('-icon-alt')) score -= 30;
  if (stem.includes('-dark')) score -= 15;
  if (ext === '.svg') score += 25;
  else if (ext === '.webp') score += 10;
  else if (ext === '.png') score += 5;

  if (base.length < 24) score += 3;
  return score;
}

function walkDir(dir, files = []) {
  if (!fs.existsSync(dir)) return files;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name.startsWith('.')) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walkDir(full, files);
    else if (IMAGE_EXT.has(path.extname(entry.name).toLowerCase())) files.push(full);
  }
  return files;
}

function buildSourceIndex() {
  const bySlug = new Map();
  for (const dir of LOGO_SOURCES) {
    for (const file of walkDir(dir)) {
      const slug = fileSlug(file);
      if (!slug) continue;
      const prev = bySlug.get(slug);
      if (!prev || scoreCandidate(file, slug) > scoreCandidate(prev, slug)) {
        bySlug.set(slug, file);
      }
    }
  }
  return bySlug;
}

function resolveSourceForSlug(targetSlug, index) {
  const sourceKey = SOURCE_SLUG_MAP[targetSlug] ?? targetSlug;
  const canonical = SLUG_ALIASES[sourceKey] ?? sourceKey;
  if (index.has(canonical)) return index.get(canonical);

  let best = null;
  let bestScore = -1;
  for (const [slug, file] of index) {
    const score = scoreCandidate(file, canonical);
    if (score > bestScore) {
      bestScore = score;
      best = file;
    }
  }
  return bestScore >= 60 ? best : null;
}

function existingBlogIcon(slug) {
  if (!fs.existsSync(OUT_BLOG_ICONS)) return null;
  for (const ext of ['.svg', '.webp', '.png', '.jpg', '.jpeg']) {
    const p = path.join(OUT_BLOG_ICONS, `${slug}${ext}`);
    if (fs.existsSync(p)) return p;
  }
  return null;
}

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

function copyLogo(src, destSlug) {
  const ext = path.extname(src).toLowerCase() || '.svg';
  const filename = `${destSlug}${ext}`;
  const techDest = path.join(OUT_TECH, filename);
  const blogDest = path.join(OUT_BLOG_ICONS, filename);
  fs.copyFileSync(src, techDest);
  fs.copyFileSync(src, blogDest);
  return `/images/tech-logos/${filename}`;
}

function main() {
  console.log('[sync-tech-logos] Scanning logo libraries…');
  const index = buildSourceIndex();
  console.log(`[sync-tech-logos] Indexed ${index.size} source files`);

  ensureDir(OUT_TECH);
  ensureDir(OUT_BLOG_ICONS);

  const manifest = {};
  const seenSlugs = new Set();

  for (const entry of CURATED) {
    const slug = entry.slug;
    if (seenSlugs.has(slug)) continue;

    let source =
      resolveSourceForSlug(slug, index) ?? existingBlogIcon(slug) ?? null;

    if (!source) {
      console.warn(`[sync-tech-logos] Missing logo for: ${slug}`);
      continue;
    }

    const filePath = copyLogo(source, slug);
    manifest[slug] = {
      file: filePath,
      blogIcon: `/images/blog/icons/${path.basename(filePath)}`,
      aliases: [slug, ...(entry.aliases ?? [])],
    };
    seenSlugs.add(slug);
  }

  for (const name of fs.readdirSync(OUT_BLOG_ICONS)) {
    const ext = path.extname(name).toLowerCase();
    if (!IMAGE_EXT.has(ext)) continue;
    const slug = normalizeSlug(name);
    if (seenSlugs.has(slug) || manifest[slug]) continue;

    const src = path.join(OUT_BLOG_ICONS, name);
    const techPath = path.join(OUT_TECH, name);
    if (!fs.existsSync(techPath)) fs.copyFileSync(src, techPath);

    manifest[slug] = {
      file: `/images/tech-logos/${name}`,
      blogIcon: `/images/blog/icons/${name}`,
      aliases: [slug, name.replace(ext, '')],
    };
    seenSlugs.add(slug);
  }

  fs.writeFileSync(MANIFEST_PATH, `${JSON.stringify(manifest, null, 2)}\n`);
  console.log(
    `[sync-tech-logos] Wrote ${Object.keys(manifest).length} logos → ${path.relative(ROOT, MANIFEST_PATH)}`,
  );
}

main();
