import { TrustPageLayout } from '../components/TrustPageLayout';
import { AUTHOR_EMAIL } from '../lib/author-profile';
import { absoluteUrl, SITE_NAME } from '../lib/site-config';
import { buildSimplePageGraph } from '../lib/entity-schema';

export default function Corrections() {
  const title = `Corrections | ${SITE_NAME}`;
  const description = `How to report factual errors on ${SITE_NAME}'s site and how corrections are handled.`;

  return (
    <TrustPageLayout
      title={title}
      description={description}
      canonicalPath="/corrections"
      jsonLd={buildSimplePageGraph({
        name: title,
        description,
        canonical: absoluteUrl('/corrections'),
      })}
    >
      <h1>Corrections</h1>
      <p>
        Accuracy matters, especially on history, culture, and anything that affects technical or
        financial decisions.
      </p>

      <h2>How to report</h2>
      <p>
        Email <a href={`mailto:${AUTHOR_EMAIL}`}>{AUTHOR_EMAIL}</a> with:
      </p>
      <ul>
        <li>The URL of the page</li>
        <li>What is wrong and what it should say</li>
        <li>A source link if you have one</li>
      </ul>

      <h2>What we do</h2>
      <ul>
        <li>Clear factual errors are fixed in the article and noted when the change is significant.</li>
        <li>Disputed claims may get additional context rather than silent deletion.</li>
        <li>We aim to respond within a few working days.</li>
      </ul>

      <h2>Comments</h2>
      <p>
        Blog comments are hosted by Disqus. Moderation there is separate from on-page corrections.
      </p>
    </TrustPageLayout>
  );
}
