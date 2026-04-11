/**
 * One-off: add tags + categories lines after readTime in each blog post.
 * Run: node scripts/inject-blog-taxonomy.mjs
 */
import fs from 'node:fs';
import path from 'node:path';

const blogDir = path.join(process.cwd(), 'src/content/blog');

/** @type {Record<string, { tags: string; categories: string }>} */
const TAXONOMY = {
  'building-for-impact': {
    categories: 'Engineering, Culture',
    tags: 'Social impact, South Africa, Digital divide, Community tech',
  },
  'cloud-architecture-lessons': {
    categories: 'Engineering, Cloud',
    tags: 'AWS, GCP, Azure, Serverless, Architecture, DevOps',
  },
  'xhosa-hip-hop-digital': {
    categories: 'Culture, Product',
    tags: 'isiXhosa, Music, eSpazza, Heritage, Streaming',
  },
  'sa-dev-conferences-2026': {
    categories: 'Career',
    tags: 'South Africa, DevConf, Conferences, Networking, Meetups',
  },
  'mzansi-dev-toolkit-ai-agents-2026': {
    categories: 'AI, Engineering',
    tags: 'South Africa, Agents, LangGraph, n8n, ADK, Vercel AI SDK',
  },
  'client-websites-v0-workflow': {
    categories: 'Engineering, Product',
    tags: 'v0, Vercel, Agent.ai, Web design, Client work',
  },
  'hosting-platforms-guide-2026': {
    categories: 'Engineering, Cloud',
    tags: 'Vercel, Netlify, Supabase, Firebase, AWS, Deployment',
  },
  'ai-vibe-coding-agents-2026': {
    categories: 'AI, Engineering',
    tags: 'Claude, Cursor, v0, Bolt, Copilot, Pricing, Tooling',
  },
  'learn-react-before-cursor': {
    categories: 'Career, AI',
    tags: 'React, Cursor, Bootcamp, Education, Fundamentals',
  },
  'sa-payment-gateways-react-next-2026': {
    categories: 'Engineering, Product',
    tags: 'Payments, South Africa, Next.js, React, Yoco, Paystack',
  },
  'devquote-sa-developer-pricing': {
    categories: 'Engineering, Product',
    tags: 'Freelancing, Pricing, Open source, South Africa, Next.js',
  },
  'sa-bootcamp-grads-hiring-skills-2026': {
    categories: 'Career, AI',
    tags: 'South Africa, Bootcamp, Hiring, AI coding, Next.js',
  },
  'remote-junior-developer-lessons': {
    categories: 'Career',
    tags: 'Remote work, Junior developer, Communication, Teamwork',
  },
  'deploy-co-za-site-netlify-gatsby-gitlab': {
    categories: 'Engineering',
    tags: 'Netlify, Gatsby, GitLab, co.za, South Africa, DNS',
  },
  'gatsby-react-performance-journey': {
    categories: 'Engineering',
    tags: 'React, Gatsby, Performance, Webpack, Ramda',
  },
  'historybook-to-dataset-xhosa-thembu': {
    categories: 'AI, Culture',
    tags: 'Machine learning, isiXhosa, Thembu, Ollama, Hugging Face, Open source',
  },
  'one-man-jive-2026-javascript-tooling': {
    categories: 'Engineering',
    tags: 'JavaScript, Next.js, Vercel, Cursor, v0, shadcn, 2026',
  },
  'laundry-marketplace-white-label-sa': {
    categories: 'Product',
    tags: 'Marketplace, South Africa, White-label, React Native, Supabase',
  },
  'simply-five-year-service-reflection': {
    categories: 'Personal, Career',
    tags: 'Career, Reflection, Simply, Family',
  },
  'vibe-coding-documentation-framework': {
    categories: 'AI, Engineering',
    tags: 'Vibe coding, Cursor, ChatGPT, Grok, Documentation, Workflow',
  },
  'google-adk-production-lessons': {
    categories: 'AI, Engineering',
    tags: 'Google ADK, Gemini, Agents, Multi-agent, Queens Connect',
  },
  'sa-payment-gateways-tco-2026': {
    categories: 'Engineering, Product',
    tags: 'Payments, Fintech, South Africa, TCO, Next.js, Ozow, Yoco',
  },
  'ubuntu-thembu-philosophy': {
    categories: 'Culture, Philosophy',
    tags: 'Ubuntu, Thembu, Nguni, Leadership, Heritage',
  },
  'abathemubu-lineage': {
    categories: 'Culture, History',
    tags: 'Thembu, Genealogy, South Africa, NomavaTV, isiXhosa history',
  },
  'declarative-apps-functional-javascript': {
    categories: 'Engineering',
    tags: 'JavaScript, Functional programming, Ramda, Redux, Composition',
  },
  'build-ai-agents-libraries-2026': {
    categories: 'AI, Engineering',
    tags: 'Agents, LangGraph, Mastra, CrewAI, n8n, South Africa, ADK',
  },
  'philosophy-of-localhost-manifesto': {
    categories: 'Philosophy',
    tags: 'Developers, Metaphor, Mental health, Growth, 127.0.0.1',
  },
};

function inject(filePath, slug) {
  const tax = TAXONOMY[slug];
  if (!tax) {
    console.warn('missing taxonomy for', slug);
    return;
  }
  let raw = fs.readFileSync(filePath, 'utf8');
  if (/\ntags:\s/.test(raw) || /\ncategories:\s/.test(raw)) {
    console.log('skip (already has tags/categories)', slug);
    return;
  }
  const insert = `\ntags: ${tax.tags}\ncategories: ${tax.categories}`;
  const updated = raw.replace(/(\nreadTime:\s[^\n]+)(\n---)/, `$1${insert}$2`);
  if (updated === raw) {
    console.warn('pattern not found', slug);
    return;
  }
  fs.writeFileSync(filePath, updated, 'utf8');
  console.log('updated', slug);
}

for (const name of fs.readdirSync(blogDir)) {
  if (!name.endsWith('.md')) continue;
  const slug = name.replace(/\.md$/i, '');
  inject(path.join(blogDir, name), slug);
}
