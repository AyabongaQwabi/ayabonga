#!/usr/bin/env node
/**
 * Download unique Pexels hero images for GSC strategy blog posts and update frontmatter.
 * Run: node scripts/fetch-gsc-blog-images.mjs
 */
import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { fetchPexelsToWebp, fileExists } from './blog-image-fetch.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const BLOG_DIR = path.join(ROOT, 'public/images/blog');
const MD_DIR = path.join(ROOT, 'src/content/blog');

/** slug → { pexelsId, alt } */
const GSC_POSTS = [
  {
    slug: 'best-go-libraries-ai-agents-2026',
    pexelsId: 546819,
    alt: 'Developer reviewing Go code on a laptop',
  },
  {
    slug: 'manus-vs-codex-2026',
    pexelsId: 3861949,
    alt: 'AI coding assistant interface on a developer screen',
  },
  {
    slug: 'flutter-vs-react-native-2026',
    pexelsId: 1092644,
    alt: 'Mobile app development on smartphone and laptop',
  },
  {
    slug: 'base44-vs-codeium-2026',
    pexelsId: 3184292,
    alt: 'Website builder and code editor on a desktop workspace',
  },
  {
    slug: 'xhosa-boy-names',
    pexelsId: 1303098,
    alt: 'African cultural heritage and traditional patterns',
  },
  {
    slug: 'xhosa-girl-names',
    pexelsId: 3761502,
    alt: 'Portrait evoking African heritage and community',
  },
  {
    slug: 'ayabonga-name-meaning',
    pexelsId: 267415,
    alt: 'Journal and pen on a desk for name and meaning research',
  },
  {
    slug: 'mastra-supabase-2026',
    pexelsId: 3184465,
    alt: 'Low-code workflow and database schema on screen',
  },
  {
    slug: 'claude-ai-for-building-apps-2026',
    pexelsId: 3861969,
    alt: 'Developer workspace with laptop for AI-assisted app building',
  },
  {
    slug: 'whatsapp-automation-south-africa',
    pexelsId: 752637,
    alt: 'Smartphone showing messaging for business automation',
  },
  {
    slug: 'best-python-libraries-ai-agents-2026',
    pexelsId: 1181677,
    alt: 'Python code on a computer monitor',
  },
  {
    slug: 'best-platforms-building-ai-agents-2026',
    pexelsId: 7688336,
    alt: 'Comparison of software platforms on a laptop screen',
  },
  {
    slug: 'paystack-fees-south-africa-2026',
    pexelsId: 4968394,
    alt: 'Online payment and card transaction concept',
  },
  {
    slug: 'what-is-llm-finetuning',
    pexelsId: 8439099,
    alt: 'Abstract visualization of machine learning and neural networks',
  },
  {
    slug: 'build-ai-agents-libraries-2026',
    pexelsId: 8386440,
    alt: 'AI agent workflow diagram on a developer monitor',
  },
  {
    slug: 'sa-payment-gateways-tco-2026',
    pexelsId: 4968394,
    alt: 'Online payment checkout on laptop and phone',
  },
  {
    slug: 'what-is-web-development',
    pexelsId: 3184296,
    alt: 'Web developer coding HTML and CSS in the browser',
  },
  {
    slug: 'sa-bootcamp-grads-hiring-skills-2026',
    pexelsId: 3183150,
    alt: 'Team collaboration in a modern tech office',
  },
  {
    slug: 'software-development-companies-south-africa-2026',
    pexelsId: 3183153,
    alt: 'Software team planning sprint on whiteboard',
  },
  {
    slug: 'ai-tools-building-apps-2026',
    pexelsId: 4974915,
    alt: 'UI components and design system on screen',
  },
  {
    slug: 'mobile-app-development-companies-south-africa',
    pexelsId: 607812,
    alt: 'Mobile apps on phone beside laptop analytics',
  },
  {
    slug: 'what-is-application-development',
    pexelsId: 3182814,
    alt: 'Application architecture sketch on developer desk',
  },
  {
    slug: 'what-is-a-landing-page',
    pexelsId: 196644,
    alt: 'Marketing landing page design on laptop',
  },
  {
    slug: 'mzansi-llm-local-language-model',
    pexelsId: 17486368,
    alt: 'Neural network and language technology concept',
  },
];

function publicImagePath(filename) {
  const encoded = filename
    .split('/')
    .map((s) => encodeURIComponent(s))
    .join('/');
  return `/images/blog/${encoded}`;
}

function updateFrontmatter(raw, imagePath) {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  if (!match) return raw;

  const lines = match[1].split(/\r?\n/);
  const rest = new Set(['headerImage', 'ogImage']);
  const out = [];
  for (const line of lines) {
    const key = line.split(':')[0]?.trim();
    if (rest.has(key)) continue;
    out.push(line);
  }
  out.push(`headerImage: ${imagePath}`);
  out.push(`ogImage: ${imagePath}`);
  return `---\n${out.join('\n')}\n---\n${match[2]}`;
}

async function main() {
  const results = [];

  for (const post of GSC_POSTS) {
    const baseName = `gsc-${post.slug}-hero`;
    const webpPath = path.join(BLOG_DIR, `${baseName}.webp`);
    const mdPath = path.join(MD_DIR, `${post.slug}.md`);

    try {
      if (!(await fileExists(webpPath))) {
        await fetchPexelsToWebp(post.pexelsId, BLOG_DIR, baseName);
        console.log(`[gsc-images] Downloaded Pexels ${post.pexelsId} → ${baseName}.webp`);
      } else {
        console.log(`[gsc-images] Skip download (exists): ${baseName}.webp`);
      }

      const imagePath = publicImagePath(`${baseName}.webp`);
      let raw = await readFile(mdPath, 'utf8');
      raw = updateFrontmatter(raw, imagePath);
      await writeFile(mdPath, raw, 'utf8');
      results.push({ slug: post.slug, imagePath, ok: true });
    } catch (err) {
      console.error(`[gsc-images] FAIL ${post.slug}:`, err.message);
      results.push({ slug: post.slug, ok: false, error: err.message });
    }
  }

  const ok = results.filter((r) => r.ok).length;
  console.log(`[gsc-images] Done: ${ok}/${results.length} posts updated`);
  if (ok < results.length) process.exitCode = 1;
}

main();
