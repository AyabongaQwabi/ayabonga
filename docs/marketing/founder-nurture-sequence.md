# Founder nurture sequence (quote tool)

Automated follow-up for founders who export a scope summary from `/get-a-quote`.

## Flow

| Day | Email | Purpose |
|-----|-------|---------|
| 0 | Quote export (HTML) | Deliver scope summary + set nurture expectation |
| 2 | Rebuild tax | Link to junior-MVP post, filter low-intent |
| 5 | One-page scope | Practical scoping, CTA back to quote tool |
| 9 | When to hire senior | TaaS positioning |
| 14 | Next step | Reply or update quote; WhatsApp secondary |

Implementation: `api/send.ts` schedules emails 2–5 via Resend `scheduledAt`. Email 1 sends immediately.

## Resend setup

1. Add `RESEND_API_KEY` and verify domain `qwabi.co.za` in Vercel production env.
2. Optional: set `RESEND_AUDIENCE_ID`, `RESEND_LEADS_SEGMENT_ID` (defaults match existing audience).
3. Set `NOTIFY_EMAIL` for internal lead alerts with intent score (High / Medium / Low).
4. Disable nurture in staging: `RESEND_NURTURE_ENABLED=false`.

Local API testing: run `npx vercel dev` (Vite alone does not serve `/api/send`).

## Qualification rules (API)

- At least one feature selected.
- Project brief minimum 30 characters.
- Founder stage captured (idea / mvp / live / rebuild).

Internal notifications include intent score and a WhatsApp prefill link for high-context follow-up.

## Distribution copy

### LinkedIn (post)

Most founders compare dev quotes without a shared scope. I built a free estimator on qwabi.co.za/get-a-quote: pick features, get a ZAR ballpark, email yourself the breakdown.

If you are past idea stage, add a 90-day outcome in the brief. I reply to exports with real scope, not generic DMs.

### WhatsApp groups (short)

Sharing a scope tool I use with founders: https://www.qwabi.co.za/get-a-quote

Pick app type + features, get a ZAR estimate, email the summary. Useful before you hire a dev or agency. Built for SA (Paystack, mobile, realistic timelines).

### X / Twitter

Built a scope + ZAR quote tool for founders: qwabi.co.za/get-a-quote

Email yourself the breakdown. No agency fluff.

## Metrics

- Quote export conversion (step 5 → submit).
- Internal lead intent distribution (High / Medium / Low).
- Reply rate to email 1 vs WhatsApp volume (goal: fewer empty WhatsApps).
