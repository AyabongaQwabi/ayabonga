import { Link } from 'react-router-dom';
import { MessageCircle } from 'lucide-react';
import { TrustPageLayout } from '../components/TrustPageLayout';
import { buildProfilePageSchema } from '../lib/entity-schema';
import {
  AUTHOR_EMAIL,
  AUTHOR_EXPERIENCE_YEARS,
  AUTHOR_JOB_TITLE,
  AUTHOR_LOCATION,
  AUTHOR_PROFILE_IMAGE,
  AUTHOR_SAME_AS,
} from '../lib/author-profile';
import { SITE_NAME, WHATSAPP_URL } from '../lib/site-config';

const shippedWork = [
  {
    name: 'Laundry Marketplace',
    url: 'https://laundry.qwabi.co.za/',
    note: 'Marketplace for local laundry providers',
  },
  {
    name: 'ClinicPlus',
    url: 'https://clinicplusbookings.co.za/',
    note: 'Clinic appointment booking for occupational health',
  },
  {
    name: 'Queens Connect',
    url: 'https://queensconnect.qwabi.co.za/',
    note: 'Community AI assistant for Queenstown',
  },
  {
    name: 'Kingly',
    url: 'https://kingly.qwabi.co.za/',
    note: 'AI tooling for developer documentation and prompts',
  },
];

export default function About() {
  return (
    <TrustPageLayout
      title={`About ${SITE_NAME} | Senior product engineer`}
      description={`About ${SITE_NAME}: ${AUTHOR_JOB_TITLE} in ${AUTHOR_LOCATION}. Product engineering, AI, and cloud work for South African founders.`}
      canonicalPath="/about"
      jsonLd={buildProfilePageSchema()}
    >
      <div className="not-prose flex flex-col sm:flex-row gap-6 mb-10">
        <img
          src={AUTHOR_PROFILE_IMAGE}
          alt={`Portrait of ${SITE_NAME}`}
          width={128}
          height={128}
          className="w-28 h-28 rounded-xl object-cover border border-border"
        />
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">{SITE_NAME}</h1>
          <p className="text-primary font-medium">{AUTHOR_JOB_TITLE}</p>
          <p className="text-sm text-muted-foreground mt-1">{AUTHOR_LOCATION}</p>
        </div>
      </div>

      <p>
        I am a product engineer and cloud architect with about {AUTHOR_EXPERIENCE_YEARS} years in
        software. I help founders turn ideas into working apps, platforms, and AI tools without
        agency overhead or the junior-dev lottery.
      </p>

      <p>
        My stack is mostly React, Next.js, Node.js, TypeScript, and Python, with cloud work on GCP,
        AWS, and Azure. I use Supabase and Firebase when a project needs a fast, real-time backend.
      </p>

      <h2>Selected shipped work</h2>
      <ul>
        {shippedWork.map((item) => (
          <li key={item.url}>
            <a href={item.url} target="_blank" rel="noopener noreferrer">
              {item.name}
            </a>
            {' — '}
            {item.note}
          </li>
        ))}
      </ul>

      <h2>Writing</h2>
      <p>
        I publish notes on product engineering, AI, cloud architecture, and Eastern Cape culture and
        history. Some posts are hands-on build logs; others are researched explainers. See{' '}
        <Link to="/editorial">editorial standards</Link> for how I treat sources and updates.
      </p>

      <h2>Contact</h2>
      <p>
        <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer">
          <MessageCircle className="inline w-4 h-4 me-1" aria-hidden />
          WhatsApp
        </a>
        {' · '}
        <a href={`mailto:${AUTHOR_EMAIL}`}>{AUTHOR_EMAIL}</a>
      </p>

      <h2>Profiles</h2>
      <ul>
        {AUTHOR_SAME_AS.map((url) => (
          <li key={url}>
            <a href={url} target="_blank" rel="noopener noreferrer">
              {url.replace(/^https?:\/\/(www\.)?/, '')}
            </a>
          </li>
        ))}
      </ul>
    </TrustPageLayout>
  );
}
