import type { QuotePayload, SendQuoteRequestBody } from './types';
import { escapeHtml, formatMoneyZar, founderStageLabel } from './format';
import { EMAIL_BRAND, wrapBrandedEmail } from './emailLayout';

const SITE_URL = process.env.SITE_URL?.replace(/\/$/, '') || 'https://www.qwabi.co.za';

function quoteAssumptionsNote(quote: QuotePayload): string {
  return `Estimates use R${quote.hourlyRateZar}/hr, ${quote.yearsExperience}+ years experience, ${quote.hoursPerDay} billable hours/day, ${quote.bufferPercent}% buffer. Ballpark only, not a fixed proposal.`;
}

export function buildQuoteEmailText(body: SendQuoteRequestBody): string {
  const { name, quote, projectDetails, founderStage } = body;
  const lines = [
    `Hi ${name.split(' ')[0]},`,
    '',
    'Here is the project scope summary you saved from the quote tool on qwabi.co.za.',
    '',
    `Stage: ${founderStageLabel(founderStage)}`,
    `Product type: ${quote.projectTypes.join(', ') || 'Not specified'}`,
    '',
    'Features selected:',
    ...quote.features.map(
      (f) =>
        `- ${f.name}: ${formatMoneyZar(f.adjustedPriceZar, quote.currency)} (~${f.adjustedDays.toFixed(1)} days)`,
    ),
    '',
    `Estimated build (our timeline): ${formatMoneyZar(quote.totals.basePriceZar, quote.currency)} over ~${Math.round(quote.totals.estimatedDays)} days`,
    `Adjusted (your target timeline): ${formatMoneyZar(quote.totals.adjustedPriceZar, quote.currency)} over ~${quote.totals.effectiveDesiredDays} days`,
    quote.desiredDays
      ? `Your target timeline input: ${quote.desiredDays} days`
      : 'No target timeline entered',
    '',
    quoteAssumptionsNote(quote),
    '',
    'Your notes:',
    projectDetails,
    '',
    `Revise scope: ${SITE_URL}/get-a-quote`,
    `Technical co-founder model: ${SITE_URL}/technical-cofounder`,
    '',
    'Ayabonga Qwabi',
  ];
  return lines.join('\n');
}

export function buildQuoteEmailHtml(body: SendQuoteRequestBody): string {
  const { name, quote, projectDetails, founderStage } = body;
  const firstName = name.split(' ')[0] || name;
  const featureRows = quote.features
    .map(
      (f) => `<tr>
        <td style="padding:10px 12px;border-bottom:1px solid ${EMAIL_BRAND.border};font-size:14px;">${escapeHtml(f.name)}</td>
        <td style="padding:10px 12px;border-bottom:1px solid ${EMAIL_BRAND.border};text-align:right;font-size:14px;">${formatMoneyZar(f.adjustedPriceZar, quote.currency)}</td>
        <td style="padding:10px 12px;border-bottom:1px solid ${EMAIL_BRAND.border};text-align:right;font-size:14px;color:${EMAIL_BRAND.muted};">${f.adjustedDays.toFixed(1)}d</td>
      </tr>`,
    )
    .join('');

  const bodyHtml = `
    <p style="margin:0 0 16px;font-size:15px;line-height:1.65;color:${EMAIL_BRAND.text};">
      Here is your saved scope summary from the
      <a href="${SITE_URL}/get-a-quote" style="color:${EMAIL_BRAND.cyan};font-weight:600;text-decoration:none;">project quote tool</a>.
      Use it when you compare devs, agencies, or a technical partner.
    </p>

    <div style="background:${EMAIL_BRAND.paper};border:1px solid ${EMAIL_BRAND.border};border-radius:12px;padding:16px 18px;margin:0 0 16px;">
      <p style="margin:0 0 8px;font-size:12px;color:${EMAIL_BRAND.muted};text-transform:uppercase;letter-spacing:0.06em;font-weight:600;">Context</p>
      <p style="margin:0 0 4px;font-size:14px;line-height:1.5;"><strong>Stage:</strong> ${escapeHtml(founderStageLabel(founderStage))}</p>
      <p style="margin:0;font-size:14px;line-height:1.5;"><strong>Product type:</strong> ${escapeHtml(quote.projectTypes.join(', ') || 'Not specified')}</p>
    </div>

    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;background:${EMAIL_BRAND.card};border:1px solid ${EMAIL_BRAND.border};border-radius:12px;overflow:hidden;margin:0 0 16px;">
      <thead>
        <tr style="background:${EMAIL_BRAND.paper};">
          <th style="padding:10px 12px;text-align:left;font-size:12px;color:${EMAIL_BRAND.muted};text-transform:uppercase;letter-spacing:0.04em;">Feature</th>
          <th style="padding:10px 12px;text-align:right;font-size:12px;color:${EMAIL_BRAND.muted};text-transform:uppercase;letter-spacing:0.04em;">Est.</th>
          <th style="padding:10px 12px;text-align:right;font-size:12px;color:${EMAIL_BRAND.muted};text-transform:uppercase;letter-spacing:0.04em;">Days</th>
        </tr>
      </thead>
      <tbody>${featureRows || `<tr><td colspan="3" style="padding:12px;font-size:14px;">No features selected</td></tr>`}</tbody>
    </table>

    <div style="background:#ecfeff;border:1px solid #a5f3fc;border-radius:12px;padding:16px 18px;margin:0 0 16px;">
      <p style="margin:0 0 8px;font-size:14px;line-height:1.5;"><strong>Our timeline:</strong> ${formatMoneyZar(quote.totals.basePriceZar, quote.currency)} · ~${Math.round(quote.totals.estimatedDays)} days</p>
      <p style="margin:0;font-size:14px;line-height:1.5;"><strong>Your target timeline:</strong> ${formatMoneyZar(quote.totals.adjustedPriceZar, quote.currency)} · ~${quote.totals.effectiveDesiredDays} days</p>
    </div>

    <p style="margin:0 0 16px;font-size:13px;color:${EMAIL_BRAND.muted};line-height:1.55;">${escapeHtml(quoteAssumptionsNote(quote))}</p>

    <div style="background:${EMAIL_BRAND.paper};border:1px solid ${EMAIL_BRAND.border};border-radius:12px;padding:16px 18px;margin:0 0 16px;">
      <p style="margin:0 0 8px;font-size:12px;color:${EMAIL_BRAND.muted};font-weight:600;">Your notes</p>
      <p style="margin:0;font-size:14px;line-height:1.55;white-space:pre-wrap;color:${EMAIL_BRAND.text};">${escapeHtml(projectDetails)}</p>
    </div>

    <p style="margin:0;font-size:15px;line-height:1.65;color:${EMAIL_BRAND.text};">
      Over the next two weeks I will send a few short notes on scoping, rebuild traps, and when a senior technical partner beats a cheap build. You can unsubscribe anytime.
    </p>`;

  return wrapBrandedEmail({
    firstName,
    preheader: `Your scope summary · ${formatMoneyZar(quote.totals.adjustedPriceZar, quote.currency)} ballpark`,
    bodyHtml,
    primaryCta: { label: 'Update my quote', href: `${SITE_URL}/get-a-quote` },
    secondaryCta: {
      label: 'How I work as technical co-founder',
      href: `${SITE_URL}/technical-cofounder`,
    },
  });
}
