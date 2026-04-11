---
title: "How I Build Client Websites in 10–20 Minutes"
excerpt: "Agent.ai v0 prompt generator, v0.dev, and Vercel — from business name to live site without gatekeeping."
date: April 6, 2026
readTime: 6 min read
tags: v0, Vercel, Agent.ai, Web design, Client work
categories: Engineering, Product
---

# How I Build Great-Looking, Fully Functional Client Websites in 10–20 Minutes

I get asked a lot how I ship client sites so fast without sacrificing quality. Here’s the exact workflow I use — no gatekeeping, just the stack and the steps.

**TL;DR:** I use an AI agent to generate a v0-ready prompt from the client’s basics, then I feed that into [Vercel v0](https://v0.dev). In 5 minutes or less v0 gives me a full site. I add a custom domain and deploy. Total time: **10–20 minutes** from brief to live.

---

## What you need from the client (and what to do if you don’t have it)

Before anything else, I need three things:

1. **Business name**  
2. **Industry** (e.g. restaurant, law firm, salon, gym, NPO)  
3. **Short description** — what they do, who they serve, tone (professional, casual, premium, etc.)

If the client hasn’t sent a description, I either:

- Use whatever they *did* send (email, WhatsApp brief, one-pager), or  
- **Generate one** with [Gemini](https://gemini.google.com) or [Grok](https://grok.com): I paste the business name + industry and ask for a 2–3 sentence “About” blurb suitable for a website hero or About section. Takes under a minute.

Once I have name, industry, and description, I’m ready for the next step.

---

## Step 1: Generate the v0 prompt with the Agent.ai agent

I don’t write the v0 prompt from scratch. I use the **[Vercel v0 Website Prompt Generator](https://agent.ai/agent/vercel-v0-prompt-generator)** on Agent.ai.

- I open the agent, then feed it:
  - **Website/business name**  
  - **Industry**  
  - **About/description** (the one from the client or the one I generated with Gemini/Grok)

The agent returns a **ready-made prompt** (plus context) that’s tuned for v0 — the kind of structure and wording that gets v0 to produce a coherent, on-brand site instead of a generic template.

That’s the whole job of this step: **input = name + industry + description → output = v0-ready prompt.**

---

## Step 2: Paste into v0.dev and generate

1. I open **[v0.dev](https://v0.dev)** and start a **new chat**.  
2. I **paste the prompt** from the Agent.ai agent.  
3. I **paste the description** (or the same “About” text) so v0 has the exact copy.  
4. I hit **Generate**.

In **5 minutes or less**, v0’s AI has usually produced a full landing/marketing site: hero, sections, layout, and styling (Tailwind/shadcn-style components). I review it, maybe ask for one or two tweaks in the same chat (e.g. “make the CTA button blue” or “add a testimonials section”), then I’m ready to move on.

---

## Step 3: Custom domain and deploy

- I **add the client’s custom domain** in the v0/Vercel project (or in the linked Vercel project if I’ve exported the code).  
- I **deploy** — Vercel’s default flow is push or “Deploy” from v0; I make sure the production branch is set and the domain is connected.  
- DNS is pointed (A/CNAME as per Vercel’s instructions). Once propagation is done, the site is live.

**All done.** From “here’s my business name and industry” to a live, good-looking, fully functional client website in **10–20 minutes** — with most of that time being prompt generation, review, and domain/DNS, not manual coding.

---

## Why this works

- **v0** is built for generating production-ready React/Next-style UIs from a good prompt.  
- The **Agent.ai prompt generator** turns loose client info into that “good prompt” so I don’t have to trial-and-error in v0.  
- **Gemini or Grok** fills the gap when the client doesn’t send a description, so I always have something solid to feed the agent and v0.  
- **Vercel** keeps deploy and custom domains simple, so “go live” is literally a few clicks after the UI is ready.

I’ve used this for restaurants, salons, small practices, NPOs, and local businesses. It’s not for every project (e.g. heavy e‑commerce or complex apps), but for **marketing/landing sites and simple client sites**, it’s my default. Fast, professional, and repeatable.

If you try the same stack — Agent.ai prompt generator → v0 → Vercel + custom domain — I’d love to hear how it goes or what you’d add. Drop a comment or reply with your own tweaks.

---

**Links**

- [Vercel v0 Website Prompt Generator (Agent.ai)](https://agent.ai/agent/vercel-v0-prompt-generator)  
- [Vercel v0](https://v0.dev)  
- [Gemini](https://gemini.google.com) / [Grok](https://grok.com) (for generating descriptions when the client doesn’t provide one)
