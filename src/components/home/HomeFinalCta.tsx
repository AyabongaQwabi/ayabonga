import { useEffect, useRef } from 'react';
import { Mail, MessageCircle } from 'lucide-react';
import { lineReveal, scrambleDecode } from '../../lib/animations';
import { WHATSAPP_URL } from '../../lib/site-config';
import { TransitionLink } from '../ui/TransitionLink';

export function HomeFinalCta() {
  const labelRef = useRef<HTMLParagraphElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (labelRef.current) scrambleDecode(labelRef.current, { delay: 0.2 });
    if (headingRef.current) lineReveal(headingRef.current);
  }, []);

  return (
    <section
      id="contact"
      className="gold-band scroll-mt-24 py-24 md:py-32"
      aria-labelledby="contact-heading"
    >
      <div className="mx-auto max-w-7xl px-6">
        <p
          ref={labelRef}
          className="font-technical text-label-sm uppercase tracking-[var(--tracking-label)] gold-band-muted"
        >
          Let&apos;s build
        </p>
        <h2
          id="contact-heading"
          ref={headingRef}
          className="mt-6 max-w-3xl font-display text-display-md font-semibold text-[var(--gold-band-fg)]"
        >
          Ready to ship something that matters?
        </h2>
        <p className="gold-band-muted mt-6 max-w-xl font-technical text-base leading-relaxed md:text-lg">
          Message me with what you run today and where the product needs to go. I reply
          with fit, realistic scope, and what I would tackle first.
        </p>

        <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            data-cursor="cta"
            className="interactive-button inline-flex min-h-[48px] items-center justify-center gap-2 rounded-full bg-[var(--navy-dark)] px-6 py-3.5 font-technical text-sm font-semibold text-[var(--warm-white)]"
          >
            <MessageCircle className="h-5 w-5" aria-hidden />
            WhatsApp
          </a>
          <a
            href="mailto:aya@qwabi.co.za"
            data-cursor="cta"
            className="interactive-button inline-flex min-h-[48px] items-center justify-center gap-2 rounded-full border border-[var(--navy-dark)]/30 bg-transparent px-6 py-3.5 font-technical text-sm font-semibold text-[var(--navy-dark)]"
          >
            <Mail className="h-5 w-5" aria-hidden />
            aya@qwabi.co.za
          </a>
          <TransitionLink
            to="/get-a-quote"
            data-cursor="cta"
            className="interactive-button inline-flex min-h-[48px] items-center justify-center rounded-full border border-[var(--navy-dark)]/30 px-6 py-3.5 font-technical text-sm font-semibold text-[var(--navy-dark)]"
          >
            Scope and pricing
          </TransitionLink>
        </div>
      </div>
    </section>
  );
}
