import { Calendar, Clock, MessageCircle } from 'lucide-react';
import { cn } from '../lib/utils';
import {
  AUTHOR_BIO_LINKS,
  AUTHOR_JOB_TITLE,
  AUTHOR_LOCATION,
  AUTHOR_SHORT_BIO,
  AUTHOR_PROFILE_IMAGE,
} from '../lib/author-profile';
import { SITE_NAME } from '../lib/site-config';
import { TransitionLink } from './ui/TransitionLink';

export type AuthorBylineProps = {
  date: string;
  readTime?: string;
  className?: string;
};

export function AuthorByline({ date, readTime, className }: AuthorBylineProps) {
  return (
    <div
      className={cn(
        'not-prose flex flex-wrap items-center gap-3 sm:gap-4',
        className,
      )}
    >
      <TransitionLink
        to={AUTHOR_BIO_LINKS.about}
        className="group flex min-w-0 flex-1 items-center gap-3 rounded-xl sm:flex-initial focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--gold)]"
      >
        <img
          src={AUTHOR_PROFILE_IMAGE}
          alt={`Portrait of ${SITE_NAME}`}
          width={44}
          height={44}
          className="h-11 w-11 shrink-0 rounded-full border border-[var(--gold)]/20 object-cover group-hover:border-[var(--gold)]/50"
          loading="eager"
          decoding="async"
        />
        <span className="min-w-0 text-left">
          <span className="block font-technical text-sm font-semibold text-[var(--warm-white)] group-hover:text-[var(--gold)]">
            {SITE_NAME}
          </span>
          <span className="block font-technical text-xs font-medium text-[var(--gold)]">
            {AUTHOR_JOB_TITLE}
          </span>
        </span>
      </TransitionLink>
      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 font-technical text-sm text-[var(--text-muted)]">
        {date ? (
          <span className="inline-flex items-center gap-1.5">
            <Calendar className="h-3.5 w-3.5 shrink-0" aria-hidden />
            <time dateTime={date}>{date}</time>
          </span>
        ) : null}
        {readTime ? (
          <span className="inline-flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5 shrink-0" aria-hidden />
            {readTime}
          </span>
        ) : null}
      </div>
    </div>
  );
}

export function AuthorBio() {
  return (
    <aside
      className="not-prose mt-16 rounded-xl border border-[var(--gold)]/10 bg-[var(--slate)]/50 p-6 md:p-8"
      aria-labelledby="author-bio-heading"
    >
      <div className="flex flex-col gap-6 sm:flex-row">
        <img
          src={AUTHOR_PROFILE_IMAGE}
          alt={`Portrait of ${SITE_NAME}`}
          width={96}
          height={96}
          className="h-20 w-20 shrink-0 rounded-xl border border-[var(--gold)]/20 object-cover sm:h-24 sm:w-24"
          loading="lazy"
          decoding="async"
        />
        <div className="min-w-0 flex-1 space-y-3">
          <div>
            <h2
              id="author-bio-heading"
              className="font-display text-heading-md font-semibold text-[var(--warm-white)]"
            >
              Written by {SITE_NAME}
            </h2>
            <p className="mt-0.5 font-technical text-sm font-medium text-[var(--gold)]">
              {AUTHOR_JOB_TITLE}
            </p>
            <p className="mt-1 font-technical text-xs text-[var(--text-muted)]">
              {AUTHOR_LOCATION}
            </p>
          </div>
          <p className="font-technical text-sm leading-relaxed text-[var(--text-muted)]">
            {AUTHOR_SHORT_BIO}
          </p>
          <div className="flex flex-wrap gap-x-4 gap-y-2 font-technical text-sm">
            <TransitionLink
              to={AUTHOR_BIO_LINKS.about}
              className="font-medium text-[var(--gold)] hover:underline underline-offset-4"
            >
              About me
            </TransitionLink>
            <TransitionLink
              to={AUTHOR_BIO_LINKS.writing}
              className="text-[var(--text-muted)] hover:text-[var(--warm-white)]"
            >
              More writing
            </TransitionLink>
            <a
              href={AUTHOR_BIO_LINKS.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-[var(--text-muted)] hover:text-[var(--warm-white)]"
            >
              <MessageCircle className="h-3.5 w-3.5" aria-hidden />
              WhatsApp
            </a>
            <a
              href={AUTHOR_BIO_LINKS.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--text-muted)] hover:text-[var(--warm-white)]"
            >
              LinkedIn
            </a>
          </div>
        </div>
      </div>
    </aside>
  );
}
