---
title: "Lessons from Google ADK in Production — and a Queens Connect Loans Demo"
excerpt: "Orchestrators vs monolithic prompts, granular tools, session pre-loading, Gemini coupling, and what ships on Render."
date: March 15, 2026
readTime: 9 min read
tags: Google ADK, Gemini, Agents, Multi-agent, Queens Connect
categories: AI, Engineering
---

Over the past few weeks I’ve been deep in Google’s Agent Development Kit (ADK), wiring up multi-agent flows, testing handoffs, debugging tool calls, the full works.
A few hard-earned lessons from real hands-on time:
Hierarchy > monolithic prompts
A clean, slim orchestrator that only routes (“this goes to onboarding”, “this needs the loans lane”) is way more reliable than trying to cram routing + tools + personality + state into one giant system prompt. Debugging becomes manageable and hallucinations drop sharply.
Granular tools are non-negotiable
Moving logic (profile lookup, KYC link generation, verification checks) into proper, well-defined tools instead of prompt instructions improved accuracy massively. You also get observability for free, which calls are firing, how often, what’s failing.
Session state pre-loading saves lives
Injecting critical context (currentDate, waNumber, cached userProfile/userSession) at the Python entry point before the agent even thinks means far fewer redundant DB/tool calls during multi-turn conversations.
Post-processing for tone is cheap and effective
Raw Gemini/ADK output is correct but usually reads like internal documentation. A quick rewrite pass (I’m using Grok for this) with strict instructions to keep it warm, professional-yet-relatable township style makes the replies feel native without breaking correctness.
The real motivation killer: absence of daily users You can build elegant agent trees and perfect tool schemas, but without real people hitting the endpoint every day it starts feeling like a very expensive academic exercise.
One thing that’s genuinely frustrating me (and I know I’m not alone): Google markets this ADK as “model-agnostic”, but in practice it is heavily specialised for Gemini models.
Trying to plug in anything else (Grok, Claude, Llama variants, etc.) takes considerable extra engineering effort, custom wrappers, prompt re-engineering, tool-calling format translation and even then the results are often flaky or degraded.
The tight coupling to Gemini’s function-calling shape, reasoning patterns and JSON handling is very noticeable. That “model-agnostic” line feels misleading when you’re actually building production-grade flows.
Anyways, that frustration is exactly why I put something small but concrete online instead of staying in theory land.
I’ve got a minimal Queens Connect Loans Registration demo running:
Explains a small loans program
Collects name + SA ID + address
Triggers KYC via Didit.me
Creates lender or borrower profile on success
Transfers control back to the main loans agent
It’s just a clean showcase of gatekeeper → sub-agent → tool calls → hand-back pattern. Hosted on Render’s free tier, so it might spin down and take 30–60 seconds to wake if it’s been quiet.
Check it out here:
https://qwabi.co.za
