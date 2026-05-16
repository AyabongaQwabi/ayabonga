import type { SendQuoteRequestBody } from './types';
import { formatMoneyZar, founderStageLabel } from './format';
import { buildQuoteEmailText } from './quoteEmail';

const SITE_URL = process.env.SITE_URL?.replace(/\/$/, '') || 'https://www.qwabi.co.za';
const WHATSAPP_NUMBER = process.env.WHATSAPP_NUMBER || '27603116777';

function leadScore(body: SendQuoteRequestBody): { label: string; reasons: string[] } {
  const reasons: string[] = [];
  let score = 0;

  if (body.quote.features.length >= 3) {
    score += 2;
    reasons.push('3+ features scoped');
  } else if (body.quote.features.length >= 1) {
    score += 1;
    reasons.push('Has feature selection');
  }

  if (body.projectDetails.trim().length >= 80) {
    score += 2;
    reasons.push('Detailed project notes');
  } else if (body.projectDetails.trim().length >= 40) {
    score += 1;
    reasons.push('Some project context');
  }

  if (body.founderStage === 'rebuild' || body.founderStage === 'live') {
    score += 2;
    reasons.push(`Stage: ${founderStageLabel(body.founderStage)}`);
  } else if (body.founderStage === 'mvp') {
    score += 1;
    reasons.push('Building MVP');
  }

  if (body.quote.totals.adjustedPriceZar >= 150_000) {
    score += 1;
    reasons.push('Estimate band R150k+');
  }

  let label = 'Low';
  if (score >= 5) label = 'High';
  else if (score >= 3) label = 'Medium';

  return { label, reasons };
}

export function buildInternalLeadEmail(body: SendQuoteRequestBody): {
  subject: string;
  text: string;
} {
  const { label, reasons } = leadScore(body);
  const waText = encodeURIComponent(
    `Hi ${body.name.split(' ')[0]}, I saw your quote on qwabi.co.za (${founderStageLabel(body.founderStage)}). Happy to review scope.`,
  );
  const waLink = `https://wa.me/${WHATSAPP_NUMBER}?text=${waText}`;

  const text = [
    `New quote lead · ${label} intent`,
    '',
    `Name: ${body.name}`,
    `Email: ${body.email}`,
    `Stage: ${founderStageLabel(body.founderStage)}`,
    `Score signals: ${reasons.join('; ') || 'none'}`,
    '',
    `Product: ${body.quote.projectTypes.join(', ') || 'n/a'}`,
    `Features: ${body.quote.features.length}`,
    `Adjusted est.: ${formatMoneyZar(body.quote.totals.adjustedPriceZar, body.quote.currency)} / ~${body.quote.totals.effectiveDesiredDays} days`,
    '',
    'Notes:',
    body.projectDetails,
    '',
    '--- Full quote ---',
    buildQuoteEmailText(body),
    '',
    `WhatsApp: ${waLink}`,
    `Quote tool: ${SITE_URL}/get-a-quote`,
  ].join('\n');

  return {
    subject: `[${label}] Quote lead: ${body.name} · ${founderStageLabel(body.founderStage)}`,
    text,
  };
}
