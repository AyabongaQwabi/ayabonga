import { TrustPageLayout } from '../components/TrustPageLayout';
import { TransitionLink } from '../components/ui/TransitionLink';
import { AUTHOR_EMAIL } from '../lib/author-profile';
import { SITE_NAME } from '../lib/site-config';

export default function Editorial() {
  return (
    <TrustPageLayout
      title={`Editorial standards | ${SITE_NAME}`}
      description={`How ${SITE_NAME} researches, writes, and updates articles on qwabi.co.za.`}
      canonicalPath="/editorial"
    >
      <h1>Editorial standards</h1>

      <h2>Who writes here</h2>
      <p>
        All articles on this site are written by <TransitionLink to="/about">{SITE_NAME}</TransitionLink>, a working
        product engineer. See the about page for background and shipped work.
      </p>

      <h2>Types of posts</h2>
      <ul>
        <li>
          <strong>Build and product notes:</strong> based on systems I have designed, shipped, or
          maintained. These are first-hand where stated.
        </li>
        <li>
          <strong>Research explainers:</strong> compiled from public documentation, pricing pages,
          and reputable sources. I cite sources where practical (see in-article references). I do
          not claim hands-on use of every tool I compare unless the post says so.
        </li>
        <li>
          <strong>Culture and history:</strong> family, language, and heritage writing. Sourced where
          possible; corrections welcome.
        </li>
      </ul>

      <h2>Updates</h2>
      <p>
        Technical posts that depend on pricing, APIs, or regulations get a review when something
        material changes. If a post has a &quot;last updated&quot; line in the body, that date reflects
        the latest substantive edit.
      </p>

      <h2>Affiliations and conflicts</h2>
      <p>
        I build products for clients and my own ventures. I do not accept payment for favourable
        mentions in writing. Client work is disclosed when it is directly relevant to a story.
      </p>

      <h2>Corrections</h2>
      <p>
        If you spot an error, see the <TransitionLink to="/corrections">corrections</TransitionLink> page or email{' '}
        <a href={`mailto:${AUTHOR_EMAIL}`}>{AUTHOR_EMAIL}</a>.
      </p>
    </TrustPageLayout>
  );
}
