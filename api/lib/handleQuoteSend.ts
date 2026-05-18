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
    process.env.NODE_ENV === 'development' ||
    process.env.VERCEL === '1' ||
    process.env.VERCEL_ENV === 'preview' ||
    process.env.VERCEL_ENV === 'production'
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
    console.log('[handleQuoteSend] upsertLeadContact successful for:', body.email);
  } catch (err) {
    console.error('[handleQuoteSend] Contact upsert skipped or failed', {
      email: body.email,
      err,
    });
  }
}

async function scheduleNurtureEmails(
  resend: Resend,
  body: SendQuoteRequestBody,
): Promise<void> {
  if (!NURTURE_ENABLED) {
    console.log('[handleQuoteSend] Nurture emails sequence is disabled via RESEND_NURTURE_ENABLED environment flag.');
    return;
  }

  const firstName = body.name.split(' ')[0] || body.name;
  const sequence = getFounderNurtureSequence(firstName);
  console.log('[handleQuoteSend] Scheduling nurture email sequence. Count:', sequence.length);
  for (const item of sequence) {
    const scheduledAt = scheduleAtDaysFromNow(item.delayDays);
    console.log('[handleQuoteSend] Sending scheduled nurture email:', {
      to: body.email,
      subject: item.subject,
      delayDays: item.delayDays,
      scheduledAt,
    });
    const { error } = await resend.emails.send({
      from: FROM,
      to: [body.email],
      subject: item.subject,
      html: item.html,
      text: item.text,
      scheduledAt,
    });

    if (error) {
      console.error('[handleQuoteSend] Nurture schedule failed:', {
        delayDays: item.delayDays,
        subject: item.subject,
        error,
      });
    } else {
      console.log('[handleQuoteSend] Nurture schedule successful for delayDays:', item.delayDays);
    }
  }
}

export async function handleQuoteSend(
  body: SendQuoteRequestBody | null,
): Promise<QuoteSendResponse> {
  console.log('[handleQuoteSend] Initiating quote export / send processing...', {
    hasBody: !!body,
    email: body?.email,
    name: body?.name,
    stage: body?.founderStage,
  });

  const resendKey = process.env.RESEND_API_KEY?.trim();
  console.log('[handleQuoteSend] RESEND_API_KEY checks:', {
    hasKey: !!resendKey,
    keyLength: resendKey ? resendKey.length : 0,
  });

  if (!resendKey) {
    console.error('[handleQuoteSend] RESEND_API_KEY is missing or empty.');
    return {
      status: 503,
      body: {
        error: 'Email service is not configured',
      },
    };
  }

  if (!body) {
    console.warn('[handleQuoteSend] Validation failed: body is null or undefined');
    return {
      status: 400,
      body: {
        error:
          'Name, email, project context (30+ characters), and a valid quote are required.',
      },
    };
  }

  if (!body.quote.features?.length) {
    console.warn('[handleQuoteSend] Validation failed: features array is empty or undefined', { features: body.quote.features });
    return {
      status: 400,
      body: {
        error: 'Select at least one feature before exporting your quote.',
      },
    };
  }

  console.log('[handleQuoteSend] Quote payload details:', {
    email: body.email,
    founderStage: body.founderStage,
    featureCount: body.quote.features.length,
    adjustedPriceZar: body.quote.totals.adjustedPriceZar,
  });

  const resend = getResend();
  if (!resend) {
    console.error('[handleQuoteSend] Failed to initialize Resend client with provided API key.');
    return {
      status: 503,
      body: { error: 'Email service is not configured' },
    };
  }

  try {
    console.log('[handleQuoteSend] 1. Upserting contact into Resend audience...', {
      email: body.email,
      audienceId: AUDIENCE_ID,
      segmentIds: [LEADS_SEGMENT_ID],
    });
    await upsertLeadContact(resend, body);

    console.log('[handleQuoteSend] 2. Sending project scope summary email to client...', {
      from: FROM,
      to: body.email,
      subject: 'Your project scope summary (qwabi.co.za)',
    });
    const { error: quoteError } = await resend.emails.send({
      from: FROM,
      to: [body.email],
      subject: 'Your project scope summary (qwabi.co.za)',
      html: buildQuoteEmailHtml(body),
      text: buildQuoteEmailText(body),
    });

    if (quoteError) {
      console.error('[handleQuoteSend] Project scope summary email sending failed:', quoteError);
      return {
        status: 400,
        body: { error: quoteError.message || 'Failed to send quote' },
      };
    }
    console.log('[handleQuoteSend] Project scope summary email sent successfully to client.');

    console.log('[handleQuoteSend] 3. Scheduling nurture emails. Nurture enabled:', NURTURE_ENABLED);
    await scheduleNurtureEmails(resend, body);
    console.log('[handleQuoteSend] Nurture sequence scheduling complete.');

    console.log('[handleQuoteSend] 4. Sending internal notification email...', {
      from: `Quote tool <onboarding@qwabi.co.za>`,
      to: NOTIFY_TO,
    });
    const internal = buildInternalLeadEmail(body);
    const fromAddress =
      FROM.match(/<([^>]+)>/)?.[1] || 'onboarding@qwabi.co.za';

    const { error: internalError } = await resend.emails.send({
      from: `Quote tool <${fromAddress}>`,
      to: [NOTIFY_TO],
      subject: internal.subject,
      text: internal.text,
      replyTo: body.email,
    });

    if (internalError) {
      console.warn('[handleQuoteSend] Internal notification email sending failed, but client email succeeded. Error:', internalError);
    } else {
      console.log('[handleQuoteSend] Internal notification email sent successfully.');
    }

    console.log('[handleQuoteSend] Process completed successfully.');
    return { status: 200, body: { ok: true } };
  } catch (err) {
    console.error('[handleQuoteSend] Unexpected exception during quote send process:', err);
    return { status: 500, body: { error: 'Failed to send email' } };
  }
}
