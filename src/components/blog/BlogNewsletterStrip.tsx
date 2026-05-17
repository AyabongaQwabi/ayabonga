import { FormEvent, useId, useState } from 'react';
import { MessageCircle } from 'lucide-react';
import { QUOTE_PAGE, WHATSAPP_URL } from '../../lib/site-config';
import { TransitionLink } from '../ui/TransitionLink';
import { cn } from '../../lib/utils';

const BLOG_UPDATES_EMAIL = 'aya@qwabi.co.za';

type SubmitStatus = 'idle' | 'success' | 'error';

export function BlogNewsletterStrip() {
  const emailId = useId();
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<SubmitStatus>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage('');
    const trimmed = email.trim();

    if (!trimmed) {
      setStatus('error');
      setErrorMessage('Enter your email to subscribe.');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      setStatus('error');
      setErrorMessage('Enter a valid email address.');
      return;
    }

    const subject = encodeURIComponent('Blog updates');
    const body = encodeURIComponent(
      `Please add me to new post updates:\n\n${trimmed}`,
    );
    window.location.href = `mailto:${BLOG_UPDATES_EMAIL}?subject=${subject}&body=${body}`;
    setStatus('success');

    if (process.env.NODE_ENV === 'development') {
      console.log('[BlogNewsletterStrip] Subscribe requested', { email: trimmed });
    }
  }

  return (
    <section
      className="border-t border-[var(--gold)]/10 bg-[var(--navy-dark)] py-16 md:py-20"
      aria-labelledby="blog-newsletter-heading"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center md:text-left">
          <h2
            id="blog-newsletter-heading"
            className="font-display text-display-md font-semibold leading-[var(--leading-display)] text-[var(--warm-white)]"
          >
            Get the thinking.
          </h2>
          <p className="mt-4 font-technical text-base leading-[var(--leading-body)] text-[var(--text-muted)] md:text-lg">
            New posts on engineering, systems, and product building in South Africa.
          </p>

          <form
            onSubmit={handleSubmit}
            className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-stretch"
            noValidate
          >
            <label htmlFor={emailId} className="sr-only">
              Email for blog updates
            </label>
            <input
              id={emailId}
              name="email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (status !== 'idle') setStatus('idle');
              }}
              placeholder="you@company.com"
              className={cn(
                'min-h-[48px] flex-1 rounded-lg border bg-[var(--navy)] px-4 py-3 font-technical text-base text-[var(--warm-white)] placeholder:text-[var(--text-muted)]',
                'border-[var(--gold)]/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--gold)]',
                status === 'error' && 'border-[var(--destructive)]/60',
              )}
              aria-invalid={status === 'error'}
              aria-describedby={
                status === 'error' ? 'blog-newsletter-error' : undefined
              }
            />
            <button
              type="submit"
              data-cursor="cta"
              className={cn(
                'inline-flex min-h-[48px] shrink-0 items-center justify-center rounded-lg px-6 py-3 font-technical text-sm font-semibold',
                'motion-safe:transition-colors motion-reduce:transition-none',
                'bg-[var(--gold)] text-[var(--navy-dark)] hover:bg-[var(--gold-dim)]',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--gold)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--navy-dark)]',
                'disabled:cursor-not-allowed disabled:opacity-60',
              )}
            >
              Subscribe
            </button>
          </form>

          {status === 'error' && errorMessage ? (
            <p
              id="blog-newsletter-error"
              role="alert"
              className="mt-3 text-left font-technical text-sm text-[var(--destructive)]"
            >
              {errorMessage}
            </p>
          ) : null}

          {status === 'success' ? (
            <p
              role="status"
              className="mt-3 text-left font-technical text-sm text-[var(--gold)]"
            >
              Your mail app should open. Send the message to finish subscribing.
            </p>
          ) : null}

          <p className="mt-6 font-technical text-sm text-[var(--text-muted)]">
            Prefer a conversation?{' '}
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-[var(--gold)] hover:underline"
            >
              <MessageCircle className="h-3.5 w-3.5" aria-hidden />
              WhatsApp
            </a>{' '}
            or{' '}
            <TransitionLink
              to={QUOTE_PAGE}
              className="text-[var(--gold)] hover:underline"
            >
              scope and pricing
            </TransitionLink>
            .
          </p>
        </div>
      </div>
    </section>
  );
}
