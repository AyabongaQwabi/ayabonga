import { Link } from 'react-router-dom';
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

export type AuthorBylineProps = {
  date: string;
  readTime?: string;
  className?: string;
};

/** Compact author row for article headers (photo, name, date). */
export function AuthorByline({ date, readTime, className }: AuthorBylineProps) {
  return (
    <div
      className={cn(
        'not-prose flex flex-wrap items-center gap-3 sm:gap-4',
        className,
      )}
    >
      <Link
        to={AUTHOR_BIO_LINKS.about}
        className="group flex min-w-0 flex-1 items-center gap-3 rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background sm:flex-initial"
      >
        <img
          src={AUTHOR_PROFILE_IMAGE}
          alt={`Portrait of ${SITE_NAME}`}
          width={44}
          height={44}
          className="h-11 w-11 shrink-0 rounded-full border border-border object-cover motion-safe:transition-[box-shadow,border-color] motion-reduce:transition-none group-hover:border-primary/40"
          loading="eager"
          decoding="async"
        />
        <span className="min-w-0 text-left">
          <span className="block text-sm font-semibold text-foreground group-hover:text-primary motion-safe:transition-colors motion-reduce:transition-none">
            {SITE_NAME}
          </span>
          <span className="block text-xs text-primary font-medium">
            {AUTHOR_JOB_TITLE}
          </span>
        </span>
      </Link>
      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
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
