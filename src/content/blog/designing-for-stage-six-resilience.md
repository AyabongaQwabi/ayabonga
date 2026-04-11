---
title: "Designing for Stage Six — What Resilient SA Web Apps Actually Do"
excerpt: "Loadshedding is not an edge case here. It is the baseline. A short checklist for builders who ship to real South African pockets and power cuts."
date: April 12, 2026
readTime: 7 min read
tags: South Africa, Resilience, DevOps, UX, Offline, Mobile
categories: Engineering, Cloud
---

If your uptime story only makes sense in a datacenter in Virginia, you have already lost half your users before they finish loading the hero section.

In South Africa, **Eskom is a feature requirement**, not a footnote. Stage four is a good day. Stage six means your API might as well be on holiday while someone’s trying to pay for airtime or submit a form.

Here is the uncomfortable truth: **resilience is not a banner that says “we use Cloudflare.”** It is how your app behaves when the signal drops mid-request, when the phone switches to 2G, when the user comes back online three minutes later with half a form filled in.

## Assume the network is hostile

Treat every request like it might fail. Retries with backoff, idempotent writes where money or identity is involved, and **clear UI** when something did not land — not a white screen and a prayer.

If your only error state is “something went wrong,” you have outsourced empathy to the browser.

## Cache what keeps people moving

Static assets, fonts, anything that does not need a round trip every time. Service workers are not fashion; they are **dignity** for someone on expensive, intermittent data.

You do not need a PWA manifest on day one, but you do need to ask: *what still works when the pipe is thin?*

## Webhooks and background jobs: plan for the gap

Load shedding loves eating confirmations. Queue retries. Log failures somewhere you will actually read. **Never trust a success redirect alone** for payments or bookings — your user trusted you with money or time; the platform should earn that trust back with receipts.

## Test like you live here

Run your critical path on:

- Throttled 3G  
- Airplane mode toggled mid-flow  
- A cheap Android phone with twelve tabs open  

If it feels embarrassing in that environment, fix it before you pitch “world-class.”

## The point

We are not building for hypothetical always-on users. We are building for **cousins on prepaid, founders on fibre that still drops, and communities where “I’ll do it when the power is back” is a scheduling constraint.**

Ship software that respects that reality. The rest is marketing.
