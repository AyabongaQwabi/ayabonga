---
title: I tested every AI coding tool I could get my hands on and here's what I found out
excerpt: Cursor, Claude, Codex, Antigravity, Manus, Bolt and even v0  I threw real client work at all of them. Pricing in rands, what actually ships, and what quietly wastes your money.
date: May 18, 2026
dateModified: May 18, 2026
readTime: 9 min read
slug: every-ai-tool-i-tested-honest-take
tags: AI, Cursor, Claude, Codex, Antigravity, Manus, v0, Bolt, Tooling, South Africa
categories: Engineering, AI
featured: false
headerImage: /images/blog/antigravity_issue.png
ogImage: /images/blog/cursor_billing.png
---

<!--
SEO meta title (≤60): Every AI Coding Tool I Tested, An Honest Take | Ayabonga Qwabi
Meta description (≤155): Cursor, Claude, Codex, Antigravity, Manus, Bolt, v0, real project use, honest pricing in ZAR, and what I actually reach for every day.
Last updated: May 18, 2026
-->

Over the past few months I've thrown real work at pretty much every AI coding tool on the market: [Cursor](https://cursor.sh), [Claude](https://claude.ai), [Manus](https://manus.im), Antigravity, [Codex](https://platform.openai.com/codex), [Bolt](https://bolt.new), [Vercel v0](https://v0.dev), and more. Not benchmarks, but actual project work on [Qwabi Engineering](https://business.qwabi.co.za) builds. Here's what I found.

<div class="stat-row">
  <div class="stat">
    <span class="stat-num">8+</span>
    <span class="stat-label">Tools tested</span>
  </div>
  <div class="stat">
    <span class="stat-num">~R350</span>
    <span class="stat-label">Cost of one Cursor on-demand top-up</span>
  </div>
  <div class="stat">
    <span class="stat-num">6h</span>
    <span class="stat-label">How long that on-demand lasts</span>
  </div>
</div>

## Cursor: the daily driver

Cursor is my workhorse. The multi-agent composer lets you spin up to 8 sub-agents scoped to avoid file conflicts, which means you can prompt a full site redesign in a single pass without agents stepping on each other's toes.

<div class="tool-card">
  <div class="tool-card-header">
    <span class="tool-name"><i class="ti ti-bolt" aria-hidden="true"></i> <a href="https://cursor.sh" target="_blank" rel="noopener">Cursor</a></span>
    <span class="verdict hot">Daily driver</span>
  </div>
  <p>Auto mode picks the right model per task, lighter ones for grunt work, heavier reasoners like GPT-5.5 or Codex 5.3 for complex architecture. Heads up though: those heavyweight models eat tokens in the millions even for simple prompts. Don't select them manually unless you enjoy watching credits disappear. The planning agent is great, showing you how the AI thinks before it acts.</p>
</div>

The pricing reality is worth knowing: the $20/month premium subscription lasts me about two days of real-world usage. After that there's an on-demand tier, I cap it at $20 (around R350) but it can be gone in roughly 6 hours of intensive use. It's expensive, but nothing else matches the speed. On my very first month in April 2026 I somehow burned through what felt like billions of tokens on a single subscription (not sure if there was a glitch on their end, but it was wild).

<div class="pull-quote">"Cursor is what I use when I need to think in code and ship fast. Everything else is supplementary."</div>

<img
  class="section-img"
  src="/images/blog/cursor_billing.png"
  alt="Developer working across multiple screens"
  onerror="this.style.display='none'"
/>

## Claude: the thinker in the room

Claude doesn't just answer, it reasons. I tested this by asking [Grok](https://grok.com) and Claude the same research task: synthesize landing page best practices from 10+ sources into a usable design brief. Grok gave me a bloated doc full of contradictions. Claude flagged that the gathered information conflicted and reframed the problem before producing something I could actually work with.

<div class="tool-card">
  <div class="tool-card-header">
    <span class="tool-name"><i class="ti ti-brain" aria-hidden="true"></i> <a href="https://claude.ai" target="_blank" rel="noopener">Claude (Anthropic)</a></span>
    <span class="verdict hot">Sharpest thinker</span>
  </div>
  <p>Claude is the AI I use to sense-check everything else. It thinks more like a human, noticing when something doesn't make sense and saying so rather than confidently producing nonsense. The free tier gives you maybe 15–20 minutes of use every 5–6 hours before it kicks you out, which is tight for deep work. But it's also the most equipped: plugins, connectors, and custom MCP skills make it the most extensible of the lot. I think of it as the AI that keeps other AIs honest.</p>
</div>

## Codex: the genius behind a paywall

I've used [OpenAI Codex](https://platform.openai.com/codex) exactly twice on the free tier (different accounts, let's move on). Both times it floored me. The reasoning was on another level, featuring an intelligence dial from low to extra-high on GPT-5.5, which I haven't seen on any other tool. Even set to medium it was sharper than most tools at their maximum.

<div class="tool-card">
  <div class="tool-card-header">
    <span class="tool-name"><i class="ti ti-sparkles" aria-hidden="true"></i> <a href="https://platform.openai.com/codex" target="_blank" rel="noopener">OpenAI Codex</a></span>
    <span class="verdict hot">Elite, if you can access it</span>
  </div>
  <p>The catch: you need a pro account, or you wait roughly 17 days for a free-tier refill. That friction is brutal. If it were more accessible this would be my default. For now it stays in the "impressive but impractical" category unless you're on a paid plan.</p>
</div>

<img
  class="section-img"
  src="/images/blog/codex_screenshot.png"
  alt="AI and technology abstract"
  onerror="this.style.display='none'"
/>

## The rest of the field

### Manus

<div class="tool-card">
  <div class="tool-card-header">
    <span class="tool-name"><i class="ti ti-world" aria-hidden="true"></i> <a href="https://manus.im" target="_blank" rel="noopener">Manus</a></span>
    <span class="verdict mid">Research agent, not a coder</span>
  </div>
  <p>Manus can launch a real browser and interact with pages, which is a genuine superpower for research and automation tasks. It gives you 8,000 credits on the trial, but the UI claimed I had used 0 of 8,000 while I was clearly burning through them (700 one day, 400 the next). Confusing. My read: Manus is excellent as a research agent, not for coding.</p>
</div>

### Antigravity

<div class="tool-card">
  <div class="tool-card-header">
    <span class="tool-name"><i class="ti ti-atom" aria-hidden="true"></i> Antigravity</span>
    <span class="verdict mid">Capable but slow</span>
  </div>
  <p>Antigravity can puppeteer a Chromium browser and act as you, which is interesting. But it moves slowly and has a narrow model library, leaning heavily on Gemini. To fix some animations that should have taken 5 minutes in Cursor it spent 2 hours 17 minutes trying to understand the context, which included opening a browser to research why the animations weren't working. Impressive effort, wrong direction. I'm on Google AI Pro so when I run out of credits I fall back to Gemini Flash while I wait for the 5-day refill.</p>
</div>

### Bolt.new & Vercel v0

<div class="tool-card">
  <div class="tool-card-header">
    <span class="tool-name"><i class="ti ti-package" aria-hidden="true"></i> <a href="https://bolt.new" target="_blank" rel="noopener">Bolt.new</a> &amp; <a href="https://v0.dev" target="_blank" rel="noopener">Vercel v0</a></span>
    <span class="verdict nah">Too stingy on free tiers</span>
  </div>
  <p>Bolt gives you around 1 million tokens per month on free, which I can burn in it will be gone in 30 minutes or in 5 or 6 iterations. Vercel v0 gives you 5 credits per month: that's one single-page site with one prompt and one follow-up edit, if you gave it good context. Both are impressive demos but punishing to actually rely on.</p>
</div>

## So what does this all mean?

We're in a weird moment where the best tools are the most expensive, and the free tiers are designed to frustrate you into subscribing. For anyone building on a budget in South Africa, where these dollar costs translate to serious rand spend, you have to be strategic about which tools you invest in.

My stack right now: Cursor for building, Claude for thinking and sense-checking, Codex when I need to throw a hard problem at something genuinely smart. Everything else is situational.

<div class="pull-quote">"The tools that are worth paying for are the ones that get out of the way and let you ship. Everything else is just expensive distraction."</div>

I build systems for South African businesses at [Qwabi Engineering](https://business.qwabi.co.za). If you're curious how I apply these tools to real client work, from SMME digitisation to AI-powered ops, reach out or follow along here.

<div class="tag-list">
  <span class="tag">AI tools</span>
  <span class="tag">Cursor</span>
  <span class="tag">Claude</span>
  <span class="tag">Codex</span>
  <span class="tag">Developer experience</span>
  <span class="tag">South Africa</span>
  <span class="tag">Product engineering</span>
</div>

<div class="cta-bar">
  <p>Want to discuss how I use these on real builds? Let's talk.</p>
  <a class="cta-btn" href="https://wa.me/27603116777?text=Hi%20Ayabonga%2C%20I%20read%20your%20AI%20tools%20blog%20post%20and%20I'd%20like%20to%20chat%20about%20a%20project." target="_blank" rel="noopener noreferrer">Let's talk on WhatsApp ↗</a>
</div>
