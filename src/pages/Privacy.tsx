import { TrustPageLayout } from '../components/TrustPageLayout';
import { AUTHOR_EMAIL, ORGANIZATION_NAME } from '../lib/author-profile';
import { absoluteUrl, SITE_NAME } from '../lib/site-config';
import { buildSimplePageGraph } from '../lib/entity-schema';

export default function Privacy() {
  const title = `Privacy | ${SITE_NAME}`;
  const description = `How ${SITE_NAME} handles personal information on qwabi.co.za, in line with POPIA (Protection of Personal Information Act).`;

  return (
    <TrustPageLayout
      title={title}
      description={description}
      canonicalPath="/privacy"
      jsonLd={buildSimplePageGraph({
        name: title,
        description,
        canonical: absoluteUrl('/privacy'),
      })}
    >
      <h1>Privacy</h1>
      <p>
        <strong>Last updated:</strong> May 2026. This notice covers {SITE_NAME} ({ORGANIZATION_NAME})
        on qwabi.co.za.
      </p>

      <h2>What we collect</h2>
      <ul>
        <li>
          <strong>Contact forms and WhatsApp:</strong> whatever you choose to send when you reach out.
        </li>
        <li>
          <strong>Quote tool:</strong> scope answers you submit on /get-a-quote (processed to generate a
          summary; see that flow for email delivery if enabled).
        </li>
        <li>
          <strong>Analytics:</strong> Google Analytics (GA4) and Vercel Analytics may collect usage data
          such as pages viewed, device type, and approximate location.
        </li>
        <li>
          <strong>Comments:</strong> Disqus may set cookies and process data if you use comments on
          blog posts.
        </li>
      </ul>

      <h2>Why we use it</h2>
      <p>
        To respond to enquiries, improve the site, understand which content is useful, and operate
        comments. We do not sell your personal information.
      </p>

      <h2>Retention</h2>
      <p>
        Enquiry and quote data is kept only as long as needed for the conversation or project, unless
        law requires longer retention.
      </p>

      <h2>Your rights (South Africa)</h2>
      <p>
        Under POPIA you may request access, correction, or deletion of personal information we hold
        about you. Email{' '}
        <a href={`mailto:${AUTHOR_EMAIL}`}>{AUTHOR_EMAIL}</a> with the subject line &quot;POPIA
        request&quot;.
      </p>

      <h2>Third parties</h2>
      <p>
        Hosting and analytics may process data outside South Africa under their own terms (Vercel,
        Google). Disqus is governed by its privacy policy when you comment.
      </p>

      <h2>Changes</h2>
      <p>We will update this page when practices change. Material changes will be noted here.</p>
    </TrustPageLayout>
  );
}
