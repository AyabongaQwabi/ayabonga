import { wrapBrandedEmail } from './emailLayout';

const SITE_URL = process.env.SITE_URL?.replace(/\/$/, '') || 'https://www.qwabi.co.za';

export type NurtureEmail = {
  subject: string;
  text: string;
  html: string;
  delayDays: number;
};

function wrapHtml(body: string, firstName: string, primaryCta?: { label: string; href: string }): string {
  return wrapBrandedEmail({
    firstName,
    bodyHtml: body,
    primaryCta,
  });
}

/** Emails 2–5 after the immediate quote export (email 1). */
export function getFounderNurtureSequence(firstName: string): NurtureEmail[] {
  const name = firstName || 'there';

  return [
    {
      delayDays: 2,
      subject: 'The rebuild tax most founders only see at month six',
      text: [
        `Hi ${name},`,
        '',
        'Cheap MVPs often work for the first five users. The cost shows up when real traffic, payments, or admin load hits.',
        '',
        'Three signs you are heading for a rebuild:',
        '1. No staging environment and deploys go straight to production.',
        '2. Auth and payments were bolted on late, not designed in.',
        '3. Nobody can explain your data model in one whiteboard sketch.',
        '',
        'If two of those are true, you are not failing. You just scoped for demo day, not launch day.',
        '',
        `I wrote more on this: ${SITE_URL}/blog/hidden-cost-junior-mvp`,
        '',
        'Ayabonga',
      ].join('\n'),
      html: wrapHtml(
        `<p style="font-size:15px;line-height:1.65;">Cheap MVPs often work for the first five users. The cost shows up when real traffic, payments, or admin load hits.</p>
        <p style="font-size:15px;line-height:1.65;"><strong>Three signs you are heading for a rebuild:</strong></p>
        <ol style="font-size:15px;line-height:1.7;padding-left:20px;">
          <li>No staging environment and deploys go straight to production.</li>
          <li>Auth and payments were bolted on late, not designed in.</li>
          <li>Nobody can explain your data model in one whiteboard sketch.</li>
        </ol>
        <p style="font-size:15px;line-height:1.65;">If two of those are true, you scoped for demo day, not launch day.</p>`,
        name,
        { label: 'Read: Junior-built MVPs and the rebuild tax', href: `${SITE_URL}/blog/hidden-cost-junior-mvp` },
      ),
    },
    {
      delayDays: 5,
      subject: 'Scope v1 in one page (before you hire anyone)',
      text: [
        `Hi ${name},`,
        '',
        'Before you compare quotes, lock these five lines:',
        '',
        '- User: who gets value in week one?',
        '- Job: what must they complete without help?',
        '- Out of scope: what are you explicitly not building?',
        '- Integrations: payments, SMS, maps, ERP, anything external.',
        '- Done: what does "shipped" mean (staging URL, test user, one real transaction)?',
        '',
        'Send that one-pager to every dev or agency. Quotes get comparable. Bad fits opt out early.',
        '',
        `Update your saved estimate: ${SITE_URL}/get-a-quote`,
        '',
        'Ayabonga',
      ].join('\n'),
      html: wrapHtml(
        `<p style="font-size:15px;line-height:1.65;">Before you compare quotes, lock these five lines on one page:</p>
        <ul style="font-size:15px;line-height:1.7;padding-left:20px;">
          <li><strong>User:</strong> who gets value in week one?</li>
          <li><strong>Job:</strong> what must they complete without help?</li>
          <li><strong>Out of scope:</strong> what are you not building?</li>
          <li><strong>Integrations:</strong> Paystack, SMS, maps, ERP, etc.</li>
          <li><strong>Done:</strong> staging URL, test user, one real transaction.</li>
        </ul>
        <p style="font-size:15px;line-height:1.65;">Send that to every dev or agency. Quotes get comparable. Bad fits opt out early.</p>`,
        name,
        { label: 'Update my quote', href: `${SITE_URL}/get-a-quote` },
      ),
    },
    {
      delayDays: 9,
      subject: 'When a senior technical partner beats a cheap build',
      text: [
        `Hi ${name},`,
        '',
        'Hire senior help when:',
        '- Money or user data is on the line (fintech, health, marketplaces).',
        '- You have a fixed launch date and no room for a rewrite.',
        '- You need one person to own architecture, delivery, and honest tradeoffs.',
        '',
        'A junior or template stack is fine for learning. It is expensive for revenue.',
        '',
        `How I work as technical co-founder (no equity): ${SITE_URL}/technical-cofounder`,
        '',
        'Ayabonga',
      ].join('\n'),
      html: wrapHtml(
        `<p style="font-size:15px;line-height:1.65;"><strong>Hire senior help when:</strong></p>
        <ul style="font-size:15px;line-height:1.7;padding-left:20px;">
          <li>Money or user data is on the line (fintech, health, marketplaces).</li>
          <li>You have a fixed launch date and no room for a rewrite.</li>
          <li>You need one person to own architecture, delivery, and tradeoffs.</li>
        </ul>
        <p style="font-size:15px;line-height:1.65;">A junior stack is fine for learning. It is expensive for revenue.</p>`,
        name,
        { label: 'Technical co-founder as a service', href: `${SITE_URL}/technical-cofounder` },
      ),
    },
    {
      delayDays: 14,
      subject: 'Next step for your build',
      text: [
        `Hi ${name},`,
        '',
        'If your quote export is still close to what you want to ship, the useful next step is a 20-minute scope call.',
        '',
        'Come with:',
        '- Your one-page scope (users, job, out of scope, integrations, done).',
        '- Your target launch window.',
        '- What you have already (designs, repo, partial build).',
        '',
        'Reply to this email with those three items, or update your quote and notes here:',
        SITE_URL + '/get-a-quote',
        '',
        'For quick questions, WhatsApp works, but scope context first saves us both time.',
        '',
        'Ayabonga',
      ].join('\n'),
      html: wrapHtml(
        `<p style="font-size:15px;line-height:1.65;">If your saved quote still matches what you want to ship, the useful next step is a 20-minute scope call.</p>
        <p style="font-size:15px;line-height:1.65;"><strong>Bring:</strong></p>
        <ul style="font-size:15px;line-height:1.7;padding-left:20px;">
          <li>One-page scope (users, job, out of scope, integrations, done).</li>
          <li>Target launch window.</li>
          <li>What you already have (designs, repo, partial build).</li>
        </ul>
        <p style="font-size:15px;line-height:1.65;">Reply with those three items, or add them in the quote tool.</p>
        <p style="font-size:14px;color:#64748b;margin-top:16px;">WhatsApp is fine for quick questions. Scope context first saves time for both of us.</p>`,
        name,
        { label: 'Update my quote', href: `${SITE_URL}/get-a-quote` },
      ),
    },
  ];
}

export function scheduleAtDaysFromNow(days: number): string {
  const d = new Date();
  d.setUTCDate(d.getUTCDate() + days);
  d.setUTCHours(9, 0, 0, 0);
  return d.toISOString();
}
