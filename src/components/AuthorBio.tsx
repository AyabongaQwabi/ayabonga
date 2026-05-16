import { Link } from 'react-router-dom';
import { MessageCircle } from 'lucide-react';
import {
  AUTHOR_BIO_LINKS,
  AUTHOR_JOB_TITLE,
  AUTHOR_LOCATION,
  AUTHOR_SHORT_BIO,
  AUTHOR_PROFILE_IMAGE,
} from '../lib/author-profile';
import { SITE_NAME } from '../lib/site-config';

export function AuthorBio() {
  return (
    <aside
      className="not-prose mt-16 rounded-xl border border-border bg-card/50 p-6 md:p-8"
      aria-labelledby="author-bio-heading"
    >
      <div className="flex flex-col sm:flex-row gap-6">
        <img
          src={AUTHOR_PROFILE_IMAGE}
          alt={`Portrait of ${SITE_NAME}`}
          width={96}
          height={96}
          className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl object-cover border border-border shrink-0"
          loading="lazy"
          decoding="async"
        />
        <div className="min-w-0 flex-1 space-y-3">
          <div>
            <h2
              id="author-bio-heading"
              className="text-lg font-semibold text-foreground"
            >
              Written by {SITE_NAME}
            </h2>
            <p className="text-sm text-primary font-medium mt-0.5">
              {AUTHOR_JOB_TITLE}
            </p>
            <p className="text-xs text-muted-foreground mt-1">{AUTHOR_LOCATION}</p>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {AUTHOR_SHORT_BIO}
          </p>
          <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm">
            <Link
              to={AUTHOR_BIO_LINKS.about}
              className="text-primary font-medium hover:underline underline-offset-4"
            >
              About me
            </Link>
            <Link
              to={AUTHOR_BIO_LINKS.writing}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              More writing
            </Link>
            <a
              href={AUTHOR_BIO_LINKS.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors"
            >
              <MessageCircle className="w-3.5 h-3.5" aria-hidden />
              WhatsApp
            </a>
            <a
              href={AUTHOR_BIO_LINKS.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              LinkedIn
            </a>
          </div>
        </div>
      </div>
    </aside>
  );
}
