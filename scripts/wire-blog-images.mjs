#!/usr/bin/env node
/**
 * Wire blog markdown + frontmatter to real files in public/images/blog/.
 * Run: node scripts/wire-blog-images.mjs
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const BLOG_IMG = path.join(ROOT, 'public/images/blog');
const ICONS_DIR = path.join(BLOG_IMG, 'icons');
const DIAGRAMS_DIR = path.join(BLOG_IMG, 'diagrams');
const MD_DIR = path.join(ROOT, 'src/content/blog');
const LOGOS = path.join(ROOT, '../logos/logos');
const LOGOS_TARAN = path.join(ROOT, '../logos-taran');
const AWESOME_DIAGRAMS = path.join(ROOT, '../awesome-diagrams');
const AWESOME_ARCH = path.join(ROOT, '../awesome-software-architecture');

function img(filename) {
  return `/images/blog/${filename}`;
}

function enc(publicPath) {
  if (!publicPath.startsWith('/images/blog/')) return publicPath;
  const prefix = '/images/blog/';
  const rest = publicPath.slice(prefix.length);
  return prefix + rest.split('/').map((s) => encodeURIComponent(s)).join('/');
}

/** @type {Record<string, { headerImage?: string|null, ogImage?: string|null, replacements?: [string,string][], stripPexels?: boolean, stripAllImages?: boolean }>} */
const SLUG_WIRE = {
  'abathemubu-lineage': {
    headerImage: img('AbaThembu Lineage South Africa Africa.png'),
    ogImage: img('AbaThembu Lineage South Africa Africa.png'),
    replacements: [
      ['/images/blog/abathemubu-lineage.webp', img('AbaThembu Lineage South Africa Africa.png')],
      ['/images/blog/abathemubu-lineage-inline.webp', img('Thembu lineage and history South Africa African heritage.jpg')],
    ],
  },
  'ai-tools-building-apps-2026': {
    headerImage: img('developer laptop workspace ai coding tools.jpg'),
    ogImage: img('developer laptop workspace ai coding tools.jpg'),
    replacements: [
      ['/images/blog/ai-tools-building-apps-2026.webp', img('developer laptop workspace ai coding tools.jpg')],
      ['/images/blog/ai-tools-building-apps-2026-inline.webp', img('Who this is for AI Tools for Building Apps in 2026.jpg')],
      ['/images/blog/ai-tools-building-apps-2026.jpg', img('antigravity vs cursor vs vscode.png')],
    ],
  },
  'ai-vibe-coding-agents-2026': {
    headerImage: img('thread ai vibe coding agents 2026.jpg'),
    ogImage: img('thread ai vibe coding agents 2026.jpg'),
    stripPexels: true,
  },
  'build-ai-agents-libraries-2026': {
    headerImage: img('large language model apps.jpeg'),
    ogImage: img('large language model apps.jpeg'),
    stripPexels: true,
  },
  'building-for-impact': {
    headerImage: img('Building Software for Social Impact South Africa Africa.jpg'),
    ogImage: img('Building Software for Social Impact South Africa Africa.jpg'),
    replacements: [
      ['/images/blog/building-for-impact.webp', img('Building Software for Social Impact South Africa Africa.jpg')],
      ['/images/blog/building-for-impact-inline.webp', img('Technology as a Bridge South Africa African heritage.jpg')],
    ],
  },
  'bulhoek-massacre-hospital-list': {
    headerImage: img('Bulhoek massacre South Africa 1921 history.webp'),
    ogImage: img('Bulhoek massacre South Africa 1921 history.webp'),
    replacements: [
      ['/images/blog/bulhoek-massacre-hospital-list.webp', img('Bulhoek massacre South Africa 1921 history.webp')],
      [
        '/images/blog/bulhoek-massacre-hospital-list-inline.webp',
        img('3. Names from the Bulhoek Massacre- A Hospital List I Was Never Supposed to Find South Africa Africa .jpg'),
      ],
    ],
  },
  'client-websites-v0-workflow': {
    headerImage: img('agent.ai v0 prompt generated.png'),
    ogImage: img('agent.ai v0 prompt generated.png'),
    stripPexels: true,
  },
  'cloud-architecture-lessons': {
    headerImage: img('serverless is not always the answer cloud architecture lessons.png'),
    ogImage: img('serverless is not always the answer cloud architecture lessons.png'),
    stripPexels: true,
  },
  'declarative-apps-functional-javascript': {
    headerImage: img('declarative programming.jpg'),
    ogImage: img('declarative programming.jpg'),
    stripPexels: true,
  },
  'deploy-co-za-site-netlify-gatsby-gitlab': {
    headerImage: img('how-to-use-wordpress.jpg'),
    ogImage: img('how-to-use-wordpress.jpg'),
    stripPexels: true,
  },
  'designing-for-stage-six-resilience': {
    headerImage: img('wifi.webp'),
    ogImage: img('wifi.webp'),
    stripPexels: true,
  },
  'devquote-sa-developer-pricing': {
    headerImage: img('developer laptop workspace ai coding tools.jpg'),
    ogImage: img('developer laptop workspace ai coding tools.jpg'),
    stripPexels: true,
  },
  'gatsby-react-performance-journey': {
    headerImage: img('developer laptop workspace ai coding tools.jpg'),
    ogImage: img('developer laptop workspace ai coding tools.jpg'),
    stripPexels: true,
  },
  'google-adk-production-lessons': {
    headerImage: img('modi-openai-anthropic-2261854815.webp'),
    ogImage: img('modi-openai-anthropic-2261854815.webp'),
    stripPexels: true,
  },
  'hidden-cost-junior-mvp': {
    headerImage: img('developer laptop workspace ai coding tools.jpg'),
    ogImage: img('developer laptop workspace ai coding tools.jpg'),
    replacements: [['/images/blog/hidden-cost-junior-mvp.png', img('developer laptop workspace ai coding tools.jpg')]],
  },
  'historybook-to-dataset-xhosa-thembu': {
    headerImage: img('Thembu kingdom Xhosa South Africa landscape.jpg'),
    ogImage: img('Thembu kingdom Xhosa South Africa landscape.jpg'),
    replacements: [
      ['/images/blog/historybook-to-dataset-xhosa-thembu.webp', img('Thembu kingdom Xhosa South Africa landscape.jpg')],
      ['/images/blog/historybook-to-dataset-xhosa-thembu-inline.webp', img('What-is-a-Database-Schema-Understanding-Its-Role-in-Database-Design.png')],
    ],
  },
  'hosting-platforms-guide-2026': {
    headerImage: img('bonus idea- cloudflare (next post) hosting platforms guide 2026.webp'),
    ogImage: img('bonus idea- cloudflare (next post) hosting platforms guide 2026.webp'),
    stripPexels: true,
  },
  'how-to-build-high-converting-landing-page': {
    headerImage: img('elements-of-a-landing-page-hero.jpeg'),
    ogImage: img('elements-of-a-landing-page-hero.jpeg'),
    replacements: [
      ['/images/blog/how-to-build-high-converting-landing-page.webp', img('elements-of-a-landing-page-hero.jpeg')],
      ['/images/blog/how-to-build-high-converting-landing-page-inline.webp', img('landing page.jpeg')],
      ['/images/blog/how-to-build-high-converting-landing-page.jpg', img('landing-pages-vs-homepages_d55bc63a-fc7e-48ec-a217-7772ef2ab6e1_1024x1024.webp')],
    ],
  },
  'laundry-marketplace-white-label-sa': {
    headerImage: img('mobile apps.jpeg'),
    ogImage: img('mobile apps.jpeg'),
    stripPexels: true,
  },
  'learn-react-before-cursor': {
    headerImage: img('cursor coding.jpg'),
    ogImage: img('cursor coding.jpg'),
    stripPexels: true,
  },
  'llm-tone-local-accents': {
    headerImage: img('exploring_large_language_models_llms_.webp'),
    ogImage: img('exploring_large_language_models_llms_.webp'),
    replacements: [
      ['/images/blog/llm-tone-local-accents.webp', img('exploring_large_language_models_llms_.webp')],
      ['/images/blog/llm-tone-local-accents-inline.webp', img('are-there-really-right-brained-and-left-brained-people.webp')],
    ],
  },
  'memory-sensory-replay-and-thought': {
    headerImage: img('Human-Brain-Function-Map-scaled.jpg'),
    ogImage: img('Human-Brain-Function-Map-scaled.jpg'),
    replacements: [
      ['/images/blog/memory-sensory-replay-and-thought.webp', img('Human-Brain-Function-Map-scaled.jpg')],
      ['/images/blog/memory-sensory-replay-and-thought-inline.webp', img('how-brain-works-2.webp')],
    ],
  },
  'microservices-architecture-explained': {
    headerImage: img('Microservice_Architecture.png'),
    ogImage: img('Microservice_Architecture.png'),
    replacements: [
      ['/images/blog/microservices-architecture-explained.webp', img('Microservice_Architecture.png')],
      ['/images/blog/microservices-architecture-explained-inline.webp', img('monolithic-vs-microservices.png')],
      ['/images/blog/microservices-architecture-explained.jpg', img('m icroservices.png')],
    ],
  },
  'mida-christian-school-experience': {
    headerImage: img('mida school assembly with other school.jpg'),
    ogImage: img('mida school assembly with other school.jpg'),
    replacements: [
      ['/images/blog/mida-christian-school-experience.webp', img('mida school assembly with other school.jpg')],
      ['/images/blog/mida-christian-school-experience-inline.webp', img('mida school girls.jpg')],
    ],
  },
  'mobile-app-development-companies-south-africa': {
    headerImage: img('mobile-apps-1-scaled.jpg'),
    ogImage: img('mobile-apps-1-scaled.jpg'),
    replacements: [
      ['/images/blog/mobile-app-development-companies-south-africa.webp', img('mobile-apps-1-scaled.jpg')],
      ['/images/blog/mobile-app-development-companies-south-africa-inline.webp', img('iphone_apps.jpg')],
      ['/images/blog/mobile-app-development-companies-south-africa.jpg', img('phone showing home screen with apps.jpg')],
    ],
  },
  'mzansi-dev-toolkit-ai-agents-2026': {
    headerImage: img('sources (for your own verification) ai vibe coding agents 2026.jpg'),
    ogImage: img('sources (for your own verification) ai vibe coding agents 2026.jpg'),
    stripPexels: true,
  },
  'ntsikana-prophet-pacification-xhosa': {
    headerImage: img('Ntsikana_Header.webp'),
    ogImage: img('Ntsikana_Header.webp'),
    replacements: [
      ['/images/blog/ntsikana-prophet-pacification-xhosa.webp', img('Ntsikana_Header.webp')],
      ['/images/blog/ntsikana-prophet-pacification-xhosa-inline.webp', img('ntsikana image.jpg')],
    ],
  },
  'ntsikana-was-a-sellout': {
    headerImage: img('kholo kingdom church service.jpg'),
    ogImage: img('kholo kingdom church service.jpg'),
    replacements: [
      ['/images/blog/ntsikana-was-a-sellout.webp', img('kholo kingdom church service.jpg')],
      ['/images/blog/ntsikana-was-a-sellout-inline.webp', img('pastor david mniki kholo kingdom.jpg')],
    ],
  },
  'one-man-jive-2026-javascript-tooling': {
    headerImage: img('declrative javascript.jpg'),
    ogImage: img('declrative javascript.jpg'),
    stripPexels: true,
  },
  'philosophy-of-localhost-manifesto': {
    headerImage: img('what-is-localhost.png'),
    ogImage: img('what-is-localhost.png'),
    replacements: [
      ['/images/blog/philosophy-of-localhost-manifesto.webp', img('what-is-localhost.png')],
      ['/images/blog/philosophy-of-localhost-manifesto-inline.webp', img('cursor coding.jpg')],
    ],
  },
  'philosophy-of-the-event-loop-asynchronous-world': {
    headerImage: img('declrative javascript.jpg'),
    ogImage: img('declrative javascript.jpg'),
    replacements: [
      ['/images/blog/philosophy-of-the-event-loop-asynchronous-world.webp', img('declrative javascript.jpg')],
      ['/images/blog/philosophy-of-the-event-loop-asynchronous-world-inline.webp', img('developer laptop workspace ai coding tools.jpg')],
    ],
  },
  'philosophy-of-the-garden-refactoring-your-environment': {
    headerImage: img('south african heritage.jpg'),
    ogImage: img('south african heritage.jpg'),
    replacements: [
      ['/images/blog/philosophy-of-the-garden-refactoring-your-environment.webp', img('south african heritage.jpg')],
      ['/images/blog/philosophy-of-the-garden-refactoring-your-environment-inline.webp', img('Looking Forward South Africa African heritage.jpg')],
    ],
  },
  'qwabi-family-history-amaqithi': {
    headerImage: null,
    ogImage: null,
    stripAllImages: true,
  },
  'remote-junior-developer-lessons': {
    headerImage: img('developer laptop workspace ai coding tools.jpg'),
    ogImage: img('developer laptop workspace ai coding tools.jpg'),
    stripPexels: true,
  },
  'sa-bootcamp-grads-hiring-skills-2026': {
    headerImage: img('south africa flag with people.jpg'),
    ogImage: img('south africa flag with people.jpg'),
    stripPexels: true,
  },
  'sa-dev-conferences-2026': {
    headerImage: img('johanesburg.jpeg'),
    ogImage: img('johanesburg.jpeg'),
    stripPexels: true,
  },
  'sa-payment-gateways-react-next-2026': {
    headerImage: img('images showing payments .webp'),
    ogImage: img('images showing payments .webp'),
    stripPexels: true,
    replacements: [
      ['/images/blog/sa-payment-gateways-react-next-2026-inline.jpg', img('payment gateway online.webp')],
    ],
  },
  'sa-payment-gateways-tco-2026': {
    headerImage: img('payment gateway online.webp'),
    ogImage: img('payment gateway online.webp'),
    stripPexels: true,
  },
  'senior-title-township-wifi-test': {
    headerImage: img('wifi.webp'),
    ogImage: img('wifi.webp'),
    stripPexels: true,
  },
  'simply-five-year-service-reflection': {
    headerImage: img('simply logo transparent.png'),
    ogImage: img('simply logo transparent.png'),
    stripPexels: true,
  },
  'software-development-companies-south-africa-2026': {
    headerImage: img('cape town.webp'),
    ogImage: img('cape town.webp'),
    replacements: [
      ['/images/blog/software-development-companies-south-africa-2026.webp', img('cape town.webp')],
      ['/images/blog/software-development-companies-south-africa-2026-inline.webp', img('johanesburg.avif')],
      ['/images/blog/software-development-companies-south-africa-2026.jpg', img('south african township.avif')],
    ],
  },
  'technical-cofounder-cost-south-africa-2026': {
    headerImage: img('cape town townships.jpg'),
    ogImage: img('cape town townships.jpg'),
    replacements: [
      ['/images/blog/technical-cofounder-cost-south-africa-2026.png', img('cape town townships.jpg')],
      ['/images/blog/technical-cofounder-cost-south-africa-2026-inline.jpg', img('south african people.webp')],
    ],
  },
  'typical-software-systems-small-business-south-africa': {
    headerImage: img('What-is-a-Database-Schema-Understanding-Its-Role-in-Database-Design.png'),
    ogImage: img('What-is-a-Database-Schema-Understanding-Its-Role-in-Database-Design.png'),
    replacements: [
      ['/images/blog/typical-software-systems-small-business-south-africa.webp', img('What-is-a-Database-Schema-Understanding-Its-Role-in-Database-Design.png')],
      ['/images/blog/typical-software-systems-small-business-south-africa-inline.webp', img('phone showing home screen with apps.jpg')],
    ],
  },
  'ubuntu-thembu-philosophy': {
    headerImage: img('XHOSA PEOPLE.jpg'),
    ogImage: img('XHOSA PEOPLE.jpg'),
    replacements: [
      ['/images/blog/ubuntu-thembu-philosophy.webp', img('XHOSA PEOPLE.jpg')],
      ['/images/blog/ubuntu-thembu-philosophy-inline.webp', img('African tribal heritage Eastern Cape South Africa.jpg')],
    ],
  },
  'vibe-coding-documentation-framework': {
    headerImage: img('cursor example.webp'),
    ogImage: img('cursor example.webp'),
    stripPexels: true,
  },
  'web-design-companies-south-africa': {
    headerImage: img('landing page.jpeg'),
    ogImage: img('landing page.jpeg'),
    replacements: [
      ['/images/blog/web-design-companies-south-africa.webp', img('landing page.jpeg')],
      ['/images/blog/web-design-companies-south-africa-inline.webp', img('landing page types.avif')],
    ],
  },
  'web-development-companies-south-africa': {
    headerImage: img('developer laptop workspace ai coding tools.jpg'),
    ogImage: img('developer laptop workspace ai coding tools.jpg'),
    replacements: [
      ['/images/blog/web-development-companies-south-africa.webp', img('developer laptop workspace ai coding tools.jpg')],
      ['/images/blog/web-development-companies-south-africa-inline.webp', img('how-to-use-wordpress.jpg')],
    ],
  },
  'what-is-a-landing-page': {
    headerImage: img('landing-page-e1721988239907.webp'),
    ogImage: img('landing-page-e1721988239907.webp'),
    replacements: [
      ['/images/blog/what-is-a-landing-page.webp', img('landing-page-e1721988239907.webp')],
      ['/images/blog/what-is-a-landing-page-inline.webp', img('elements-of-a-landing-page-hero.jpeg')],
    ],
  },
  'what-is-a-software-developer': {
    headerImage: img('developer laptop workspace ai coding tools.jpg'),
    ogImage: img('developer laptop workspace ai coding tools.jpg'),
    replacements: [
      ['/images/blog/what-is-a-software-developer.webp', img('developer laptop workspace ai coding tools.jpg')],
      ['/images/blog/what-is-a-software-developer-inline.webp', img('copilot-chat-ee053e45453d.png')],
    ],
  },
  'what-is-application-development': {
    headerImage: img('mobile apps.jpeg'),
    ogImage: img('mobile apps.jpeg'),
    replacements: [
      ['/images/blog/what-is-application-development.webp', img('mobile apps.jpeg')],
      ['/images/blog/what-is-application-development-inline.webp', img('iphone_apps.jpg')],
    ],
  },
  'what-is-web-design': {
    headerImage: img('landing page.jpeg'),
    ogImage: img('landing page.jpeg'),
    replacements: [
      ['/images/blog/what-is-web-design.webp', img('landing page.jpeg')],
      ['/images/blog/what-is-web-design-inline.webp', img('wordpres dashboard.avif')],
    ],
  },
  'what-is-web-development': {
    headerImage: img('developer laptop workspace ai coding tools.jpg'),
    ogImage: img('developer laptop workspace ai coding tools.jpg'),
    replacements: [
      ['/images/blog/what-is-web-development.webp', img('developer laptop workspace ai coding tools.jpg')],
      ['/images/blog/what-is-web-development-inline.webp', img('how-to-use-wordpress.jpg')],
      ['/images/blog/what-is-web-development.jpg', img('codex openai.jpeg')],
    ],
  },
  'xhosa-hip-hop-digital': {
    headerImage: img('south african township 2.jpg'),
    ogImage: img('south african township 2.jpg'),
    replacements: [
      ['/images/blog/xhosa-hip-hop-digital.webp', img('south african township 2.jpg')],
      ['/images/blog/xhosa-hip-hop-digital-inline.webp', img('life-in-south-africas-gugulethu-township_652ff99a6f81b.webp')],
    ],
  },
  'xhosa-meaningful-baby-name-ideas': {
    headerImage: img('xhosa girl.jpg'),
    ogImage: img('xhosa girl.jpg'),
    replacements: [
      ['/images/blog/xhosa-meaningful-baby-name-ideas.webp', img('xhosa girl.jpg')],
      ['/images/blog/xhosa-meaningful-baby-name-ideas-inline.webp', img('2. The recorded names South Africa African heritage .jpg')],
    ],
  },
  'xhosa-names-unofficial-taxonomy': {
    headerImage: img('2. The recorded names South Africa African heritage .jpg'),
    ogImage: img('2. The recorded names South Africa African heritage .jpg'),
    replacements: [
      ['/images/blog/xhosa-names-unofficial-taxonomy.webp', img('2. The recorded names South Africa African heritage .jpg')],
      ['/images/blog/xhosa-names-unofficial-taxonomy-inline.webp', img('xhosa clan women.jpg')],
    ],
  },
  'you-are-not-restarting-you-are-updating': {
    headerImage: img('Looking Forward South Africa African heritage.jpg'),
    ogImage: img('Looking Forward South Africa African heritage.jpg'),
    replacements: [
      ['/images/blog/you-are-not-restarting-you-are-updating.webp', img('Looking Forward South Africa African heritage.jpg')],
      ['/images/blog/you-are-not-restarting-you-are-updating-inline.webp', img('south african heritage.jpg')],
    ],
  },
};

const ICON_COPIES = [
  [path.join(LOGOS, 'react.svg'), 'react.svg'],
  [path.join(LOGOS, 'nextjs.svg'), 'nextjs.svg'],
  [path.join(LOGOS, 'nodejs.svg'), 'nodejs.svg'],
  [path.join(LOGOS, 'typescript.svg'), 'typescript.svg'],
  [path.join(LOGOS, 'vite.svg'), 'vite.svg'],
  [path.join(LOGOS, 'vercel.svg'), 'vercel.svg'],
  [path.join(LOGOS, 'openai.svg'), 'openai.svg'],
  [path.join(LOGOS, 'claude.svg'), 'claude.svg'],
  [path.join(LOGOS, 'anthropic.svg'), 'anthropic.svg'],
  [path.join(LOGOS, 'gitlab.svg'), 'gitlab.svg'],
  [path.join(LOGOS, 'netlify.svg'), 'netlify.svg'],
  [path.join(BLOG_IMG, 'Payfast-logo.svg'), 'payfast.svg'],
  [path.join(BLOG_IMG, 'paystack.png'), 'paystack.png'],
  [path.join(BLOG_IMG, 'yoco logo.png'), 'yoco.png'],
  [path.join(BLOG_IMG, 'peach payments logo.png'), 'peach-payments.png'],
  [path.join(BLOG_IMG, 'ozow logo.png'), 'ozow.png'],
  [path.join(BLOG_IMG, 'ikhoka logo.png'), 'ikhoka.png'],
  [path.join(BLOG_IMG, 'Cursor logo.svg'), 'cursor.svg'],
  [path.join(BLOG_IMG, 'Chat-GPT-logo.webp'), 'chatgpt.webp'],
];

const DIAGRAM_COPIES = [
  [path.join(BLOG_IMG, 'Microservice_Architecture.png'), 'microservice-architecture.png'],
  [path.join(BLOG_IMG, 'monolithic-vs-microservices.png'), 'monolithic-vs-microservices.png'],
  [path.join(BLOG_IMG, 'Serverless-Computing.webp'), 'serverless-computing.webp'],
];

function ensureDir(d) {
  fs.mkdirSync(d, { recursive: true });
}

function copyAssets() {
  ensureDir(ICONS_DIR);
  ensureDir(DIAGRAMS_DIR);
  for (const [src, dest] of ICON_COPIES) {
    if (fs.existsSync(src)) {
      fs.copyFileSync(src, path.join(ICONS_DIR, dest));
    } else if (process.env.NODE_ENV === 'development') {
      console.warn('[wire] missing icon source:', src);
    }
  }
  for (const [src, dest] of DIAGRAM_COPIES) {
    if (fs.existsSync(src)) {
      fs.copyFileSync(src, path.join(DIAGRAMS_DIR, dest));
    }
  }
}

function setFrontmatter(text, key, value) {
  const re = new RegExp(`^${key}:\\s*.+$`, 'm');
  if (value === null) {
    if (re.test(text)) return text.replace(re, '');
    return text;
  }
  const line = `${key}: ${value}`;
  if (re.test(text)) return text.replace(re, line);
  return text.replace(/^---\r?\n/, `---\n${line}\n`);
}

function stripMarkdownImages(text) {
  return text
    .replace(/!\[[^\]]*\]\([^)]+\)\s*\n*/g, '')
    .replace(/<img[^>]+>\s*\n*/gi, '')
    .replace(/\n{3,}/g, '\n\n');
}

function stripPexelsImages(text) {
  return text.replace(/!\[[^\]]*\]\(https:\/\/images\.pexels\.com[^)]+\)\s*\n*/g, '');
}

function applyWire(slug, text) {
  const cfg = SLUG_WIRE[slug];
  if (!cfg) return text;

  let out = text;

  if (cfg.stripAllImages) {
    out = setFrontmatter(out, 'headerImage', null);
    out = setFrontmatter(out, 'ogImage', null);
    out = setFrontmatter(out, 'image', null);
    return stripMarkdownImages(out);
  }

  if (cfg.headerImage !== undefined) {
    out = setFrontmatter(out, 'headerImage', cfg.headerImage ? enc(cfg.headerImage) : null);
  }
  if (cfg.ogImage !== undefined) {
    out = setFrontmatter(out, 'ogImage', cfg.ogImage ? enc(cfg.ogImage) : null);
  }

  if (cfg.replacements) {
    for (const [from, to] of cfg.replacements) {
      const toEnc = enc(to);
      out = out.split(from).join(toEnc);
      out = out.split(enc(from)).join(toEnc);
    }
  }

  if (cfg.stripPexels) out = stripPexelsImages(out);

  return out;
}

function verifyFilesExist() {
  const missing = [];
  for (const cfg of Object.values(SLUG_WIRE)) {
    for (const p of [cfg.headerImage, cfg.ogImage].filter(Boolean)) {
      const name = decodeURIComponent(p.replace('/images/blog/', ''));
      if (!fs.existsSync(path.join(BLOG_IMG, name))) missing.push(name);
    }
    for (const [, to] of cfg.replacements ?? []) {
      const name = decodeURIComponent(to.replace('/images/blog/', ''));
      if (!fs.existsSync(path.join(BLOG_IMG, name))) missing.push(name);
    }
  }
  return [...new Set(missing)];
}

function main() {
  copyAssets();
  const missingFiles = verifyFilesExist();
  if (missingFiles.length) {
    console.warn('Missing image files on disk:', missingFiles);
  }

  let updated = 0;
  for (const file of fs.readdirSync(MD_DIR).filter((f) => f.endsWith('.md'))) {
    const slug = file.replace(/\.md$/, '');
    if (!SLUG_WIRE[slug]) continue;
    const fp = path.join(MD_DIR, file);
    const before = fs.readFileSync(fp, 'utf8');
    const after = applyWire(slug, before);
    if (after !== before) {
      fs.writeFileSync(fp, after);
      updated += 1;
      console.log('wired:', slug);
    }
  }

  console.log(`\nUpdated ${updated} posts. Icons in ${ICONS_DIR}`);
}

main();
