import { escapeHtml } from './format';

const SITE_URL = process.env.SITE_URL?.replace(/\/$/, '') || 'https://www.qwabi.co.za';

/** Matches site tokens: navy background, gold accent, cyan CTAs */
export const EMAIL_BRAND = {
  navy: '#0A192F',
  navyMuted: '#1E293B',
  gold: '#FFD700',
  cyan: '#0891b2',
  paper: '#f8fafc',
  card: '#ffffff',
  border: '#e2e8f0',
  text: '#0f172a',
  muted: '#64748b',
} as const;

export type BrandedEmailOptions = {
  firstName: string;
  preheader?: string;
  bodyHtml: string;
  primaryCta?: { label: string; href: string };
  secondaryCta?: { label: string; href: string };
};

function ctaButton(
  label: string,
  href: string,
  variant: 'primary' | 'secondary',
): string {
  const isPrimary = variant === 'primary';
  const bg = isPrimary ? EMAIL_BRAND.cyan : 'transparent';
  const color = isPrimary ? '#ffffff' : EMAIL_BRAND.cyan;
  const border = isPrimary ? 'none' : `2px solid ${EMAIL_BRAND.cyan}`;
  return `<a href="${href}" style="display:inline-block;background:${bg};color:${color};text-decoration:none;padding:12px 22px;border-radius:10px;font-weight:600;font-size:14px;border:${border};margin:4px 8px 4px 0;">${escapeHtml(label)}</a>`;
}

export function wrapBrandedEmail(options: BrandedEmailOptions): string {
  const firstName = escapeHtml(options.firstName || 'there');

  const ctas = [
    options.primaryCta
      ? ctaButton(options.primaryCta.label, options.primaryCta.href, 'primary')
      : '',
    options.secondaryCta
      ? ctaButton(options.secondaryCta.label, options.secondaryCta.href, 'secondary')
      : '',
  ]
    .filter(Boolean)
    .join('');

  const ctaBlock = ctas
    ? `<p style="margin:28px 0 12px;">${ctas}</p>`
    : '';

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta name="color-scheme" content="light" />
  <title>Ayabonga Qwabi</title>
</head>
<body style="margin:0;padding:0;font-family:Inter,system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;background:${EMAIL_BRAND.paper};color:${EMAIL_BRAND.text};-webkit-font-smoothing:antialiased;">
  ${options.preheader ? `<div style="display:none;max-height:0;overflow:hidden;opacity:0;mso-hide:all;">${escapeHtml(options.preheader)}</div>` : ''}
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${EMAIL_BRAND.paper};">
    <tr>
      <td align="center" style="padding:32px 16px;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;">
          <tr>
            <td style="background:${EMAIL_BRAND.navy};border-radius:16px 16px 0 0;padding:28px 28px 24px;border-bottom:3px solid ${EMAIL_BRAND.gold};">
              <p style="margin:0 0 6px;font-family:Outfit,system-ui,sans-serif;font-size:11px;font-weight:600;letter-spacing:0.12em;text-transform:uppercase;color:${EMAIL_BRAND.gold};">Ayabonga Qwabi</p>
              <p style="margin:0;font-family:Outfit,system-ui,sans-serif;font-size:20px;font-weight:600;color:#f8fafc;line-height:1.3;">Technical co-founder as a service</p>
            </td>
          </tr>
          <tr>
            <td style="background:${EMAIL_BRAND.card};padding:28px;border-left:1px solid ${EMAIL_BRAND.border};border-right:1px solid ${EMAIL_BRAND.border};">
              <p style="margin:0 0 16px;font-size:16px;line-height:1.6;color:${EMAIL_BRAND.text};">Hi ${firstName},</p>
              ${options.bodyHtml}
              ${ctaBlock}
            </td>
          </tr>
          <tr>
            <td style="background:${EMAIL_BRAND.navyMuted};border-radius:0 0 16px 16px;padding:20px 28px;border:1px solid ${EMAIL_BRAND.border};border-top:none;">
              <p style="margin:0 0 8px;font-size:13px;line-height:1.5;color:#cbd5e1;">
                <a href="${SITE_URL}" style="color:${EMAIL_BRAND.gold};text-decoration:none;font-weight:600;">qwabi.co.za</a>
                · Senior product engineering · Queenstown, South Africa
              </p>
              <p style="margin:0;font-size:12px;line-height:1.5;color:#94a3b8;">
                <a href="${SITE_URL}/get-a-quote" style="color:#7dd3fc;text-decoration:none;">Quote tool</a>
                &nbsp;·&nbsp;
                <a href="${SITE_URL}/technical-cofounder" style="color:#7dd3fc;text-decoration:none;">How I work</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}
