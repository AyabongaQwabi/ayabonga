import fs from 'node:fs';
import path from 'node:path';

const AYAFB = '/Users/nonwork/dev/ayafb';
const BLOG = path.join(process.cwd(), 'src/content/blog');

const esc = (s) => JSON.stringify(String(s));

function writePost(slug, meta, body) {
  const out = `---
title: ${esc(meta.title)}
excerpt: ${esc(meta.excerpt)}
date: ${meta.date}
readTime: ${meta.readTime}
---

${body.trim()}\n`;
  fs.writeFileSync(path.join(BLOG, `${slug}.md`), out, 'utf8');
}

function read(rel) {
  return fs.readFileSync(path.join(AYAFB, rel), 'utf8');
}

/** Dev.to long-form from mar/post 16.md (skip thread + LinkedIn duplicate). */
function bodyPost16() {
  const full = read('mar/post 16.md');
  const start = full.indexOf(
    '**The Cheapest Payment Gateways for South African React/Next.js E-commerce in 2026 – Real TCO Breakdown',
  );
  const end = full.indexOf('\n---\n\n**LinkedIn Version**');
  if (start === -1 || end === -1) throw new Error('post 16 boundaries not found');
  let chunk = full.slice(start, end).trim();
  const lines = chunk.split('\n');
  if (lines[0]?.startsWith('**') && lines[0]?.endsWith('**')) {
    lines[0] = '## ' + lines[0].slice(2, -2);
    chunk = lines.join('\n');
  }
  chunk = chunk.replace(/^\*\*Dev\.to Version\*\*.*\n\n/s, '');
  return chunk;
}

const posts = [
  {
    slug: 'sa-dev-conferences-2026',
    src: 'apr/post1.md',
    title: 'South African Dev Conferences Worth Your Time in 2026',
    excerpt:
      'An honest review of DevConf, Africa Tech Festival, DataConf, TECHSPO, and more — plus networking tips for Mzansi devs.',
    date: 'April 8, 2026',
    readTime: '10 min read',
  },
  {
    slug: 'mzansi-dev-toolkit-ai-agents-2026',
    src: 'apr/post 3.md',
    title: 'The 2026 Mzansi Dev Toolkit — Build Your Own AI Agents',
    excerpt:
      'ADK, n8n, agent.ai, LangGraph, CrewAI, Vercel AI SDK, Dify, Mastra, and what SA devs actually use in production.',
    date: 'April 7, 2026',
    readTime: '9 min read',
  },
  {
    slug: 'client-websites-v0-workflow',
    src: 'mar/post17-client-websites-10-20-minutes-v0-prompt-generator.md',
    title: 'How I Build Client Websites in 10–20 Minutes',
    excerpt:
      'Agent.ai v0 prompt generator, v0.dev, and Vercel — from business name to live site without gatekeeping.',
    date: 'April 6, 2026',
    readTime: '6 min read',
  },
  {
    slug: 'sa-payment-gateways-tco-2026',
    src: null,
    title: 'The Cheapest SA Payment Gateways for React/Next.js in 2026 — Real TCO',
    excerpt:
      'Total cost of ownership beyond percentage fees: payout fees, load shedding, orchestrator patterns, and practical picks.',
    date: 'April 4, 2026',
    readTime: '12 min read',
    bodyFn: bodyPost16,
  },
  {
    slug: 'hosting-platforms-guide-2026',
    src: 'mar/post15-hosting-platforms-2026.md',
    title: 'The 2026 Hosting Platforms Guide for JavaScript Devs',
    excerpt:
      'Vercel, Netlify, Supabase, Firebase, and when you meet AWS, Azure, and GCP — from side projects to serious apps.',
    date: 'April 3, 2026',
    readTime: '11 min read',
  },
  {
    slug: 'ai-vibe-coding-agents-2026',
    src: 'mar/post14-thread-best-ai-vibe-coding-agents-2026.md',
    title: 'The Best AI Vibe Coding Agents of 2026 (and What They Cost)',
    excerpt:
      'Claude, Cursor, v0, Bolt, Base44, Windsurf, Replit, Copilot, Cody, Codeium, Cline — pricing and when to use each.',
    date: 'April 2, 2026',
    readTime: '14 min read',
  },
  {
    slug: 'learn-react-before-cursor',
    src: 'mar/post-13-cursor-or-react-first.md',
    title: 'Why Bootcamp Grads Should Learn React Before Leaning on Cursor',
    excerpt:
      'Foundation first, then tutor mode, then multiplier — how to use AI without turning it into a crutch.',
    date: 'April 1, 2026',
    readTime: '7 min read',
  },
  {
    slug: 'sa-payment-gateways-react-next-2026',
    src: 'mar/post12.md',
    title: 'Easiest Payment Gateway Integrations for React/Next.js in South Africa (2026)',
    excerpt:
      'Yoco, iKhokha, PayFast, Ozow, Peach, Paystack — ranked for DX, sandboxes, and SA market reality.',
    date: 'March 30, 2026',
    readTime: '15 min read',
  },
  {
    slug: 'devquote-sa-developer-pricing',
    src: 'mar/post11.md',
    title: 'DevQuote — A Pricing Tool for South African Developers',
    excerpt:
      'Quote client projects from your real hourly rate, experience, features, and timeline — open source on Vercel.',
    date: 'March 29, 2026',
    readTime: '6 min read',
  },
  {
    slug: 'sa-bootcamp-grads-hiring-skills-2026',
    src: 'mar/post10.md',
    title: 'Why Most SA Bootcamp Grads Still Struggle in 2026 — and 3 Skills That Get You Hired',
    excerpt:
      'AI-augmented development, system thinking beyond CRUD, and proof you can ship — tailored to the Mzansi market.',
    date: 'March 28, 2026',
    readTime: '10 min read',
  },
  {
    slug: 'remote-junior-developer-lessons',
    src: 'mar/post9.md',
    title: 'My Experiences as a Remote Junior Developer',
    excerpt:
      'Over-communication, notes, initiative, and responsibility — lessons from working remotely from Queenstown.',
    date: 'April 20, 2018',
    readTime: '6 min read',
  },
  {
    slug: 'deploy-co-za-site-netlify-gatsby-gitlab',
    src: 'mar/post8.md',
    title: 'Deploy a .co.za Site to Netlify with Gatsby, GitLab, and RegisterDomainSA',
    excerpt:
      'Step-by-step: Gatsby on Netlify, GitLab CI, and pointing RegisterDomainSA nameservers to Netlify DNS.',
    date: 'October 13, 2019',
    readTime: '12 min read',
  },
  {
    slug: 'gatsby-react-performance-journey',
    src: 'mar/post7.md',
    title: 'How I Dramatically Improved the Speed of My Gatsby Website',
    excerpt:
      'Tree shaking Ramda, Gatsby Image, code splitting social plugins, and value analysis — PageSpeed before and after.',
    date: 'August 15, 2020',
    readTime: '10 min read',
  },
  {
    slug: 'historybook-to-dataset-xhosa-thembu',
    src: 'mar/post6.md',
    title: 'historybook-to-dataset — From PDF History Books to LLM Training Data',
    excerpt:
      'Open-source pipeline for Xhosa Thembu texts, Ollama Q&A triples, Hugging Face datasets, and the Nomava YouTube channel.',
    date: 'March 25, 2026',
    readTime: '8 min read',
  },
  {
    slug: 'one-man-jive-2026-javascript-tooling',
    src: 'mar/post5.md',
    title: 'One-Man Jive 2026 — An AI-Powered Tool Guide for Solo JavaScript Devs',
    excerpt:
      'Next.js, v0, Cursor, Vercel, Supabase, testing, and how one person can ship like a small team in 2026.',
    date: 'March 8, 2026',
    readTime: '12 min read',
  },
  {
    slug: 'laundry-marketplace-white-label-sa',
    src: 'mar/post4.md',
    title: 'White-Label On-Demand Laundry Marketplace for South Africa',
    excerpt:
      'Production-ready customer, driver, partner, and admin apps — stack, demo credentials, and who it is for.',
    date: 'March 22, 2026',
    readTime: '7 min read',
  },
  {
    slug: 'simply-five-year-service-reflection',
    src: 'mar/post3.md',
    title: 'Five Years at Simply — and a Dedication to My Late Mother',
    excerpt:
      'A certificate, gratitude, isiXhosa, and the journey from Mida School and UWC to senior developer.',
    date: 'March 20, 2026',
    readTime: '4 min read',
  },
  {
    slug: 'vibe-coding-documentation-framework',
    src: 'mar/post2.md',
    title: 'Vibe Coding Is Only as Good as Your Documentation',
    excerpt:
      'A 3-tool framework: ChatGPT for the PRD, Grok for business logic, Cursor for execution — orchestration over chaos.',
    date: 'March 18, 2026',
    readTime: '4 min read',
  },
  {
    slug: 'google-adk-production-lessons',
    src: 'mar/post1.md',
    title: 'Lessons from Google ADK in Production — and a Queens Connect Loans Demo',
    excerpt:
      'Orchestrators vs monolithic prompts, granular tools, session pre-loading, Gemini coupling, and what ships on Render.',
    date: 'March 15, 2026',
    readTime: '9 min read',
  },
];

for (const p of posts) {
  const body = p.bodyFn ? p.bodyFn() : read(p.src);
  writePost(
    p.slug,
    { title: p.title, excerpt: p.excerpt, date: p.date, readTime: p.readTime },
    body,
  );
  console.log('wrote', p.slug);
}

console.log('done', posts.length, 'posts');
