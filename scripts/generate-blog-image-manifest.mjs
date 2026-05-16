#!/usr/bin/env node
/**
 * One-off generator for scripts/blog-image-manifest.json
 * Run: node scripts/generate-blog-image-manifest.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  PRIORITY_SECTION_SLUGS,
  SECTION_IMAGE_SOURCES,
  SECTION_MARKDOWN_UPDATES,
} from './blog-section-images.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const BLOG_DIR = path.join(ROOT, 'src/content/blog');
const IMAGES_DIR = path.join(ROOT, 'public/images/blog');
const ICONS_DIR = path.join(IMAGES_DIR, 'icons');
const OUT = path.join(__dirname, 'blog-image-manifest.json');

/** @type {Set<string>} */
const diskFiles = new Set();
if (fs.existsSync(IMAGES_DIR)) {
  for (const f of fs.readdirSync(IMAGES_DIR)) {
    if (!f.startsWith('.')) diskFiles.add(f);
  }
}
/** @type {Set<string>} */
const diskIcons = new Set();
if (fs.existsSync(ICONS_DIR)) {
  for (const f of fs.readdirSync(ICONS_DIR)) {
    diskIcons.add(f);
  }
}

function fileExists(publicPath) {
  const base = path.basename(publicPath);
  if (publicPath.includes('/icons/')) return diskIcons.has(base);
  return diskFiles.has(base);
}

function parseFrontmatter(raw) {
  const text = raw.replace(/^\uFEFF/, '');
  const match = text.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  if (!match) return { data: {}, content: text.trim() };

  const data = {};
  for (const line of match[1].split(/\r?\n/)) {
    const colon = line.indexOf(':');
    if (colon === -1) continue;
    const key = line.slice(0, colon).trim();
    let value = line.slice(colon + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    data[key] = value;
  }
  return { data, content: match[2] };
}

function parseCommaList(value) {
  if (!value?.trim()) return [];
  return value.split(',').map((s) => s.trim()).filter(Boolean);
}

function slugFromFilename(filename) {
  return filename.replace(/\.md$/i, '');
}

function extractPexelsId(url) {
  if (!url) return undefined;
  const m = url.match(/photos\/(\d+)\//);
  return m ? m[1] : undefined;
}

function imageTypeFromPath(p, slug) {
  const base = path.basename(p).toLowerCase();
  if (base === `${slug}.webp` || base === `${slug}.jpg` || base === `${slug}.png`)
    return 'hero';
  if (base.includes('og')) return 'og';
  return 'inline';
}

function headingToSuffix(heading, slug) {
  const text = heading.replace(/^#+\s*/, '').trim();
  const words = text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 4);
  return words.join('-').slice(0, 48) || 'section';
}

const ENTITY_PATTERNS = [
  // tools — high/medium
  { name: 'Cursor', type: 'tool', priority: 'high', keywords: ['cursor ide logo', 'official brand'], hint: 'cursor.com brand' },
  { name: 'Claude', type: 'tool', priority: 'high', keywords: ['anthropic claude logo', 'official brand'], hint: 'anthropic.com press' },
  { name: 'Claude Code', type: 'tool', priority: 'medium', keywords: ['claude code terminal', 'anthropic'], hint: 'anthropic.com' },
  { name: 'OpenAI Codex', type: 'tool', priority: 'medium', keywords: ['openai codex logo'], hint: 'openai.com brand' },
  { name: 'GitHub Copilot', type: 'tool', priority: 'medium', keywords: ['github copilot logo'], hint: 'github.com brand' },
  { name: 'Vercel v0', type: 'tool', priority: 'medium', keywords: ['vercel v0 logo'], hint: 'vercel.com brand' },
  { name: 'Bolt', type: 'tool', priority: 'low', keywords: ['bolt new logo'], hint: 'bolt.new' },
  { name: 'React', type: 'tool', priority: 'medium', keywords: ['react logo', 'simple icons react'], hint: 'react.dev brand' },
  { name: 'Next.js', type: 'tool', priority: 'medium', keywords: ['nextjs logo', 'vercel next.js'], hint: 'nextjs.org' },
  { name: 'TypeScript', type: 'tool', priority: 'medium', keywords: ['typescript logo'], hint: 'typescriptlang.org' },
  { name: 'Node.js', type: 'tool', priority: 'medium', keywords: ['nodejs logo'], hint: 'nodejs.org' },
  { name: 'Python', type: 'tool', priority: 'low', keywords: ['python logo'], hint: 'python.org' },
  { name: 'Supabase', type: 'tool', priority: 'medium', keywords: ['supabase logo'], hint: 'supabase.com brand' },
  { name: 'Firebase', type: 'tool', priority: 'low', keywords: ['firebase logo'], hint: 'firebase.google.com' },
  { name: 'Kubernetes', type: 'tool', priority: 'low', keywords: ['kubernetes logo'], hint: 'cncf brand' },
  { name: 'Docker', type: 'tool', priority: 'low', keywords: ['docker logo'], hint: 'docker.com brand' },
  { name: 'Netlify', type: 'tool', priority: 'low', keywords: ['netlify logo'], hint: 'netlify.com' },
  { name: 'Gatsby', type: 'tool', priority: 'low', keywords: ['gatsby logo'], hint: 'gatsbyjs.com' },
  { name: 'Paystack', type: 'tool', priority: 'high', keywords: ['paystack logo', 'official brand'], hint: 'paystack.com brand' },
  { name: 'Google Antigravity', type: 'tool', priority: 'low', keywords: ['google antigravity ide'], hint: 'google developers' },
  { name: 'LangChain', type: 'tool', priority: 'low', keywords: ['langchain logo'], hint: 'langchain.com' },
  { name: 'TensorFlow', type: 'tool', priority: 'low', keywords: ['tensorflow logo'], hint: 'tensorflow.org' },
  // SA companies
  { name: 'DVT', type: 'company', priority: 'high', keywords: ['dvt software south africa logo'], hint: 'dvtsoftware.com official' },
  { name: 'Netgen', type: 'company', priority: 'high', keywords: ['netgen custom software logo'], hint: 'netgen.io' },
  { name: 'Synthesis', type: 'company', priority: 'high', keywords: ['synthesis software south africa'], hint: 'synthesis.co.za' },
  { name: 'SovTech', type: 'company', priority: 'high', keywords: ['sovtech logo south africa'], hint: 'sovtech.com' },
  { name: 'Warp Development', type: 'company', priority: 'high', keywords: ['warp development cape town logo'], hint: 'warpdevelopment.com' },
  { name: 'Specno', type: 'company', priority: 'high', keywords: ['specno product studio logo'], hint: 'specno.com' },
  { name: 'Bluegrass Digital', type: 'company', priority: 'high', keywords: ['bluegrass digital logo'], hint: 'bluegrassdigital.com' },
  { name: 'BBD', type: 'company', priority: 'medium', keywords: ['bbd software south africa'], hint: 'bbdsoftware.com' },
  { name: 'Entelect', type: 'company', priority: 'medium', keywords: ['entelect logo'], hint: 'entelect.co.za' },
  { name: 'Accenture', type: 'company', priority: 'low', keywords: ['accenture logo'], hint: 'accenture brand press' },
  { name: 'MIDA', type: 'company', priority: 'medium', keywords: ['mida christian school'], hint: 'school official site' },
  { name: 'Simply', type: 'company', priority: 'medium', keywords: ['simply insurance south africa'], hint: 'simply.co.za' },
  // products
  { name: 'Queens Connect', type: 'product', priority: 'medium', keywords: ['queens connect ai queenstown'], hint: 'queensconnect.qwabi.co.za' },
  { name: 'Kingly', type: 'product', priority: 'medium', keywords: ['kingly ai prompts'], hint: 'kingly.qwabi.co.za' },
  { name: 'Laundry Marketplace', type: 'product', priority: 'medium', keywords: ['laundry marketplace app'], hint: 'laundry.qwabi.co.za' },
  { name: 'UTap', type: 'product', priority: 'low', keywords: ['utap nfc campus'], hint: 'utaptech.co.za' },
  { name: 'ClinicPlus', type: 'product', priority: 'low', keywords: ['clinicplus bookings'], hint: 'clinicplusbookings.co.za' },
  // people
  { name: 'Ayabonga Qwabi', type: 'person', priority: 'medium', keywords: ['ayabonga qwabi portrait'], hint: 'qwabi.co.za about' },
  { name: 'Ntsikana', type: 'person', priority: 'medium', keywords: ['ntsikana xhosa prophet historical'], hint: 'public domain historical art' },
];

function entityFilename(name) {
  const special = {
    'Next.js': 'nextjs',
    'Node.js': 'nodejs',
    'OpenAI Codex': 'openai-codex',
    'GitHub Copilot': 'github-copilot',
    'Vercel v0': 'vercel-v0',
    'Google Antigravity': 'google-antigravity',
    'Claude Code': 'claude-code',
    'Warp Development': 'warp-development',
    'Bluegrass Digital': 'bluegrass-digital',
    'Queens Connect': 'queens-connect',
    'Laundry Marketplace': 'laundry-marketplace',
    'Ayabonga Qwabi': 'ayabonga-qwabi',
  };
  if (special[name]) return `${special[name]}.webp`;
  return (
    name
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '')
      .replace(/--+/g, '-') + '.webp'
  );
}

function detectEntities(content, slug) {
  const headings = [...content.matchAll(/^(#{2,3})\s+(.+)$/gm)].map((m) => m[2]);
  const found = [];
  const seen = new Set();

  for (const ent of ENTITY_PATTERNS) {
    const re = new RegExp(`\\b${ent.name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
    if (!re.test(content)) continue;
    if (seen.has(ent.name)) continue;
    seen.add(ent.name);

    let sectionHeading = '';
    for (const h of headings) {
      if (re.test(h) || content.indexOf(h) < content.search(re)) {
        sectionHeading = `## ${h}`;
        break;
      }
    }
    if (!sectionHeading && headings.length) sectionHeading = `## ${headings[0]}`;

    const filename = entityFilename(ent.name);
    const publicPath = `/images/blog/icons/${filename}`;
    const onDisk = diskIcons.has(filename);

    found.push({
      entityName: ent.name,
      entityType: ent.type,
      priority: ent.priority,
      suggestedFilename: filename,
      publicPath,
      sectionHeading: sectionHeading || '## (first mention in body)',
      searchKeywords: ent.keywords,
      officialSourceHint: ent.hint,
      status: onDisk ? 'exists' : ent.priority === 'low' ? 'optional' : 'needed',
    });
  }

  return found;
}

function buildPrioritySectionImages(slug) {
  const updates = SECTION_MARKDOWN_UPDATES[slug] || [];
  return updates.map((u) => {
    const key = u.key;
    const suffix = key.replace(`${slug}-`, '');
    const suggestedFilename = `${key}.webp`;
    const publicPath = `/images/blog/${suggestedFilename}`;
    const src = SECTION_IMAGE_SOURCES[key];
    const pexelsId = extractPexelsId(src);
    const exists = fileExists(publicPath) || fileExists(`/images/blog/${key}.jpg`);

    return {
      sectionHeading: inferHeadingForKey(slug, suffix),
      suggestedFilename,
      publicPath,
      searchKeywords: keywordsForSection(slug, suffix),
      ...(pexelsId ? { pexelsId } : {}),
      altText: u.alt,
      status: exists ? 'exists' : 'missing',
    };
  });
}

function inferHeadingForKey(slug, suffix) {
  const map = {
    'ai-tools-building-apps-2026': {
      intro: '## Who this is for',
      layers: '## The three layers (quick mental model)',
      founders: '## Cursor',
      security: '## Security and IP',
    },
    'what-is-web-development': {
      stack: '## What web development includes',
      modern: '## Modern web stack',
      timeline: '## Typical project timeline',
      vendor: '## Choosing a vendor',
    },
    'how-to-build-high-converting-landing-page': {
      goal: '## Start with one goal',
      structure: '## Page structure',
      stack: '## Stack choice',
      performance: '## Performance and images',
    },
    'software-development-companies-south-africa-2026': {
      categories: '## Categories that actually matter',
      checklist: '## Buyer checklist',
      'custom-build': '## When a senior custom build wins',
      hubs: '## Hubs and distributed teams',
    },
    'microservices-architecture-explained': {
      diagram: '## What are microservices',
      monolith: '## Monolith vs microservices',
      tracing: '## Observability and tracing',
      modular: '## Modular monolith first',
    },
    'mobile-app-development-companies-south-africa': {
      devices: '## What buyers need',
      discovery: '## Discovery and scope',
      budget: '## Budget bands in ZAR',
      testing: '## TestFlight and Play internal testing',
    },
  };
  return map[slug]?.[suffix] ? map[slug][suffix] : `## ${suffix.replace(/-/g, ' ')}`;
}

function keywordsForSection(slug, suffix) {
  const defaults = {
    intro: ['developer laptop workspace', 'ai coding tools'],
    layers: ['software architecture diagram', 'workflow layers'],
    founders: ['startup founder developer', 'choosing tools'],
    security: ['secure coding branch protection', 'developer security'],
    stack: ['full stack web development', 'laptop server'],
    modern: ['react typescript cloud', 'modern web development'],
    timeline: ['project timeline whiteboard', 'agile planning'],
    vendor: ['software vendor meeting', 'team review'],
    goal: ['landing page hero cta', 'conversion focused'],
    structure: ['landing page wireframe', 'ux structure'],
    performance: ['mobile page speed', 'webp optimization'],
    categories: ['south africa business map', 'software categories'],
    checklist: ['procurement checklist', 'buyer due diligence'],
    'custom-build': ['startup founder agency', 'custom software'],
    hubs: ['south africa cities map', 'johannesburg cape town'],
    diagram: ['microservices api diagram', 'distributed system'],
    monolith: ['monolith microservices comparison', 'whiteboard'],
    tracing: ['distributed tracing dashboard', 'observability'],
    modular: ['modular monolith codebase', 'folder structure'],
    devices: ['ios android development', 'mobile devices'],
    discovery: ['workshop whiteboard', 'product discovery'],
    budget: ['budget planning spreadsheet', 'zar startup'],
    testing: ['testflight google play', 'mobile qa'],
  };
  return defaults[suffix] || [`${slug.replace(/-/g, ' ')}`, suffix.replace(/-/g, ' ')];
}

function inferSectionImages(slug, content, currentImages) {
  const headings = [...content.matchAll(/^##\s+(.+)$/gm)].map((m) => m[1].trim());
  if (!headings.length) return [];

  const heroPaths = new Set(
    currentImages.filter((i) => i.type === 'hero').map((i) => i.path),
  );
  const inlinePaths = currentImages
    .filter((i) => i.type === 'inline')
    .map((i) => i.path);

  const dupesHero =
    inlinePaths.length > 0 &&
    inlinePaths.every((p) => [...heroPaths].some((h) => path.basename(p) === path.basename(h) || p === h));

  const hasUniqueInline = inlinePaths.some((p) => {
    const b = path.basename(p, path.extname(p));
    return !b.includes('-') || (b !== slug && !b.startsWith(`${slug}-inline`));
  });

  if (!dupesHero && hasUniqueInline && inlinePaths.length >= 2) {
    return []; // optional — already has distinct section images
  }

  const skip = new Set(['who this is for', 'introduction', 'summary', 'conclusion', 'faq', 'related']);
  const sections = [];

  for (const h of headings.slice(0, 5)) {
    if (skip.has(h.toLowerCase())) continue;
    const suffix = headingToSuffix(`## ${h}`, slug);
    const key = `${slug}-${suffix}`;
    const suggestedFilename = `${key}.webp`;
    const publicPath = `/images/blog/${suggestedFilename}`;
    const exists = fileExists(publicPath);

    const reused = inlinePaths.find((p) => path.basename(p).includes(suffix));
    sections.push({
      sectionHeading: `## ${h}`,
      suggestedFilename,
      publicPath,
      searchKeywords: [h.toLowerCase(), slug.replace(/-/g, ' ')],
      altText: `${h} illustration for ${slug.replace(/-/g, ' ')}`,
      status: exists ? 'exists' : reused ? 'duplicate-reuse' : 'missing',
    });
  }

  return sections;
}

const mdFiles = fs.readdirSync(BLOG_DIR).filter((f) => f.endsWith('.md')).sort();
const posts = [];

for (const file of mdFiles) {
  const slug = slugFromFilename(file);
  const raw = fs.readFileSync(path.join(BLOG_DIR, file), 'utf8');
  const { data, content } = parseFrontmatter(raw);

  const title = data.title || slug;
  const categories = parseCommaList(data.categories);
  const headerImage = data.headerImage || '';
  const ogImage = data.ogImage || data.headerImage || '';

  const imageMatches = [...content.matchAll(/!\[([^\]]*)\]\(([^)]+)\)/g)];
  const currentImages = [];
  const seenPaths = new Set();

  for (const [, alt, imgPath] of imageMatches) {
    const normalized = imgPath.startsWith('/') ? imgPath : `/${imgPath}`;
    if (seenPaths.has(normalized)) continue;
    seenPaths.add(normalized);
    currentImages.push({
      path: normalized,
      type: imageTypeFromPath(normalized, slug),
      alt: alt || '',
    });
  }

  let sectionImages;
  if (PRIORITY_SECTION_SLUGS.includes(slug)) {
    sectionImages = buildPrioritySectionImages(slug);
  } else {
    sectionImages = inferSectionImages(slug, content, currentImages);
  }

  const entityIcons = detectEntities(content, slug);

  posts.push({
    slug,
    title,
    categories,
    hasHeaderImage: Boolean(headerImage),
    hasOgImage: Boolean(ogImage),
    currentImages,
    sectionImages,
    entityIcons,
  });
}

// shared icons across posts
const iconUsage = new Map();
for (const post of posts) {
  for (const icon of post.entityIcons) {
    const fn = icon.suggestedFilename;
    if (!iconUsage.has(fn)) iconUsage.set(fn, []);
    iconUsage.get(fn).push(post.slug);
  }
}

const sharedIcons = [...iconUsage.entries()]
  .filter(([, slugs]) => slugs.length > 1)
  .map(([filename, usedInSlugs]) => ({ filename, usedInSlugs: [...new Set(usedInSlugs)] }))
  .sort((a, b) => b.usedInSlugs.length - a.usedInSlugs.length);

let sectionCount = 0;
let sectionMissing = 0;
let iconCount = 0;
let iconMissing = 0;

for (const p of posts) {
  sectionCount += p.sectionImages.length;
  sectionMissing += p.sectionImages.filter((s) => s.status === 'missing').length;
  iconCount += p.entityIcons.length;
  iconMissing += p.entityIcons.filter((i) => i.status === 'needed').length;
}

const manifest = {
  meta: {
    generatedAt: new Date().toISOString(),
    version: '1.0.0',
    totalPosts: posts.length,
    rules: {
      minWidthPx: 1200,
      minHeightPx: 675,
      maxFileSizeKb: { hero: 300, inline: 250, icon: 40 },
      preferredFormats: ['webp', 'png for icons with transparency'],
      iconDisplayPx: { width: 28, height: 28 },
      copyright: {
        requireLicense:
          'CC0, Pexels License, Unsplash License, official brand press kit, or own photo',
        prohibited:
          "Google Image scrape, watermarked stock, 'free download' aggregator ripoffs",
        attribution:
          'Pexels/Unsplash attribution optional per their license; brand logos follow trademark fair use for editorial',
        editorialNote:
          'Blog images support technical and cultural editorial content on qwabi.co.za. Prefer South African context where relevant. Do not imply endorsement by companies whose logos appear in comparison tables.',
      },
      altTextRules: [
        'descriptive',
        'no em dashes',
        'include entity name for icons',
      ],
    },
    allowedSources: [
      'Pexels',
      'Unsplash',
      'undraw.co (customize brand colors before download)',
      'freewebillustrations.com',
      'Vecteezy (verify license tier per asset)',
      'Simple Icons',
      'official brand press and media kits',
      'Wikimedia Commons (verify license per file)',
      'own photography',
    ],
    avoidSources: [
      'Shutterstock',
      'Getty Images',
      'iStock',
      'Adobe Stock',
      'VectorStock',
      'Depositphotos',
      'Dreamstime',
      '123RF',
      'Freepik (unless explicit free license documentation)',
      'random Pinterest repins',
      'Google Images scrape sites',
      'watermarked preview downloads',
    ],
  },
  posts,
  sharedIcons,
};

fs.writeFileSync(OUT, JSON.stringify(manifest, null, 2) + '\n');

console.log(
  JSON.stringify(
    {
      totalPosts: posts.length,
      sectionImages: sectionCount,
      sectionMissing,
      entityIcons: iconCount,
      iconsNeeded: iconMissing,
      output: OUT,
    },
    null,
    2,
  ),
);
