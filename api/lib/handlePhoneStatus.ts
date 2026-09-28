import { Resend } from 'resend';

const TO = 'ayastracker@gmail.com';
const FROM =
  process.env.RESEND_FROM_EMAIL || 'Ayabonga Qwabi <onboarding@qwabi.co.za>';

export type PhoneStatusResponse =
  | { status: 200; body: { ok: true } }
  | { status: number; body: { error: string } };

function getResend(): Resend | null {
  const key = process.env.RESEND_API_KEY?.trim();
  if (!key) return null;
  return new Resend(key);
}

export async function handlePhoneStatus(text: string): Promise<PhoneStatusResponse> {
  const body = text.trim();
  if (!body) {
    return { status: 400, body: { error: 'Request body is required' } };
  }

  const resend = getResend();
  if (!resend) {
    return { status: 503, body: { error: 'Email service is not configured' } };
  }

  const sentAt = new Date().toISOString();
  const subject = `Phone status · ${sentAt}`;

  const { error } = await resend.emails.send({
    from: FROM,
    to: [TO],
    subject,
    text: body,
  });

  if (error) {
    console.error('[handlePhoneStatus] Email send failed', error);
    return {
      status: 400,
      body: { error: error.message || 'Failed to send email' },
    };
  }

  return { status: 200, body: { ok: true } };
}
