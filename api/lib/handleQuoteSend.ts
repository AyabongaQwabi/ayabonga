import { Resend } from 'resend';
import type { FounderStage, SendQuoteRequestBody } from './types';
import { buildQuoteEmailHtml, buildQuoteEmailText } from './quoteEmail';
import { buildInternalLeadEmail } from './internalLeadEmail';
import {
  getFounderNurtureSequence,
  scheduleAtDaysFromNow,
} from './founderNurtureEmails';

const FROM =
  process.env.RESEND_FROM_EMAIL || 'Ayabonga Qwabi <onboarding@qwabi.co.za>';
const NOTIFY_TO = process.env.NOTIFY_EMAIL || 'ayabonga@qwabi.co.za';
const AUDIENCE_ID =
  process.env.RESEND_AUDIENCE_ID || '5561a7a0-2f98-444a-93be-11440026e6f5';
const LEADS_SEGMENT_ID =
  process.env.RESEND_LEADS_SEGMENT_ID || '4ceb51ef-31b9-4051-baf3-a8e94fbc0c98';
const NURTURE_ENABLED = process.env.RESEND_NURTURE_ENABLED !== 'false';

const FOUNDER_STAGES = new Set<FounderStage>(['idea', 'mvp', 'live', 'rebuild']);

export function isDevLogEnv(): boolean {
  return (
    process.env.NODE_ENV === 'development' || process.env.VERCEL_ENV === 'preview'
  );
}

export function parseQuoteSendBody(
  raw: Record<string, unknown> | null | undefined,
): SendQuoteRequestBody | null {
  if (!raw) return null;

  const { name, email, founderStage, projectDetails, quote } = raw;

  if (!email || !name || !quote || typeof quote !== 'object') {
    return null;
  }

  const quoteObj = quote as SendQuoteRequestBody['quote'];
  if (!quoteObj?.totals) {
    return null;
  }

  const stage = FOUNDER_STAGES.has(founderStage as FounderStage)
    ? (founderStage as FounderStage)
    : 'mvp';
  const details =
    typeof projectDetails === 'string' && projectDetails.trim()
      ? projectDetails.trim()
      : '';

  if (details.length < 30) {
    return null;
  }

  return {
    name: String(name).trim(),
    email: String(email).trim().toLowerCase(),
    founderStage: stage,
    projectDetails: details,
    quote: quoteObj,
  };
}

export type QuoteSendResponse =
  | { status: 200; body: { ok: true } }
  | { status: number; body: { error: string } };

function getResend(): Resend | null {
  const key = process.env.RESEND_API_KEY;
  if (!key) return null;
  return new Resend(key);
}

async function upsertLeadContact(
  resend: Resend,
  body: SendQuoteRequestBody,
): Promise<void> {
  try {
    await resend.contacts.create({
      email: body.email,
      firstName: body.name.split(' ')[0],
      lastName: body.name.split(' ').slice(1).join(' ') || undefined,
      audienceId: AUDIENCE_ID,
      segmentIds: [LEADS_SEGMENT_ID],
    } as Parameters<typeof resend.contacts.create>[0]);
  } catch (err) {
    if (isDevLogEnv()) {
      console.log('[send] Contact upsert skipped or failed', {
        email: body.email,
        err,
      });
    }
  }
}

async function scheduleNurtureEmails(
  resend: Resend,
  body: SendQuoteRequestBody,
): Promise<void> {
  if (!NURTURE_ENABLED) return;

  const firstName = body.name.split(' ')[0] || body.name;
  const sequence = getFounderNurtureSequence(firstName);

  for (const item of sequence) {
    const scheduledAt = scheduleAtDaysFromNow(item.delayDays);
    const { error } = await resend.emails.send({
      from: FROM,
      to: [body.email],
      subject: item.subject,
      html: item.html,
      text: item.text,
      scheduledAt,
    });

    if (error && isDevLogEnv()) {
      console.log('[send] Nurture schedule failed', {
        delayDays: item.delayDays,
        subject: item.subject,
        error,
      });
    }
  }
}

export async function handleQuoteSend(
  body: SendQuoteRequestBody | null,
): Promise<QuoteSendResponse> {
  if (!process.env.RESEND_API_KEY?.trim()) {
    return {
      status: 503,
      body: {
        error: isDevLogEnv()
          ? 'RESEND_API_KEY is missing. Add it to .env.local (local) or Vercel env vars, then restart the dev server.'
          : 'Email service is not configured',
      },
    };
  }

  if (!body) {
    return {
      status: 400,
      body: {
        error:
          'Name, email, project context (30+ characters), and a valid quote are required.',
      },
    };
  }

  if (!body.quote.features?.length) {
    return {
      status: 400,
      body: {
        error: 'Select at least one feature before exporting your quote.',
      },
    };
  }

  const resend = getResend();
  if (!resend) {
    return {
      status: 503,
      body: { error: 'Email service is not configured' },
    };
  }

  if (isDevLogEnv()) {
    console.log('[send] Quote export request', {
      email: body.email,
      founderStage: body.founderStage,
      featureCount: body.quote.features.length,
      adjustedPriceZar: body.quote.totals.adjustedPriceZar,
    });
  }

  try {
    await upsertLeadContact(resend, body);

    const { error: quoteError } = await resend.emails.send({
      from: FROM,
      to: [body.email],
      subject: 'Your project scope summary (qwabi.co.za)',
      html: buildQuoteEmailHtml(body),
      text: buildQuoteEmailText(body),
    });

    if (quoteError) {
      if (isDevLogEnv()) {
        console.log('[send] Quote email error', quoteError);
      }
      return {
        status: 400,
        body: { error: quoteError.message || 'Failed to send quote' },
      };
    }

    await scheduleNurtureEmails(resend, body);

    const internal = buildInternalLeadEmail(body);
    const fromAddress =
      FROM.match(/<([^>]+)>/)?.[1] || 'onboarding@qwabi.co.za';

    await resend.emails.send({
      from: `Quote tool <${fromAddress}>`,
      to: [NOTIFY_TO],
      subject: internal.subject,
      text: internal.text,
      replyTo: body.email,
    });

    return { status: 200, body: { ok: true } };
  } catch (err) {
    if (isDevLogEnv()) {
      console.log('[send] Unexpected error', err);
    }
    return { status: 500, body: { error: 'Failed to send email' } };
  }
}
