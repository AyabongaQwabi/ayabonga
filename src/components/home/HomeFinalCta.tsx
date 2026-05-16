import { Link } from 'react-router-dom';
import { Mail, MessageCircle } from 'lucide-react';
import { ScrollReveal } from '../ScrollReveal';
import { WHATSAPP_URL } from '../../lib/site-config';

export function HomeFinalCta() {
  return (
    <ScrollReveal>
      <section
        id="contact"
        className="scroll-mt-24 border-t border-border py-20 md:py-32"
        aria-labelledby="contact-heading"
      >
        <div className="mx-auto max-w-6xl px-6">
          <div className="relative overflow-hidden rounded-3xl border border-primary/25 bg-gradient-to-br from-secondary via-card to-[#0A192F] px-6 py-14 md:px-14 md:py-20">
            <div
              className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-primary/10 blur-3xl motion-reduce:blur-none"
              aria-hidden
            />
            <div
              className="pointer-events-none absolute -bottom-16 -left-16 h-56 w-56 rounded-full bg-accent/15 blur-3xl motion-reduce:blur-none"
              aria-hidden
            />

            <p className="relative font-technical text-xs font-semibold uppercase tracking-[0.28em] text-primary">
              Let&apos;s build
            </p>
            <h2
              id="contact-heading"
              className="relative mt-4 max-w-3xl font-display text-mega-sm font-bold text-foreground text-balance"
            >
              Need a technical partner who stays after launch?
            </h2>
            <p className="relative mt-6 max-w-xl font-technical text-base leading-relaxed text-muted-foreground md:text-lg">
              Message me with what you run today, what is fragile, and where the product
              needs to go. I will reply with fit, a realistic scope, and what I would tackle
              first.
            </p>

            <div className="relative mt-10 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="interactive-button inline-flex min-h-[48px] items-center justify-center gap-2 rounded-xl bg-[#25D366] px-6 py-3.5 font-technical text-sm font-semibold text-white hover:bg-[#128C7E] md:text-base"
              >
                <MessageCircle className="h-5 w-5" aria-hidden />
                WhatsApp
              </a>
              <a
                href="mailto:aya@qwabi.co.za"
                className="interactive-button inline-flex min-h-[48px] items-center justify-center gap-2 rounded-xl border border-border bg-background/40 px-6 py-3.5 font-technical text-sm font-semibold text-foreground backdrop-blur-sm hover:border-primary/40 md:text-base"
              >
                <Mail className="h-5 w-5" aria-hidden />
                aya@qwabi.co.za
              </a>
              <Link
                to="/get-a-quote"
                className="interactive-button inline-flex min-h-[48px] items-center justify-center rounded-xl bg-primary px-6 py-3.5 font-technical text-sm font-semibold text-primary-foreground hover:bg-primary/90 md:text-base"
              >
                Scope & pricing tool
              </Link>
            </div>
          </div>
        </div>
      </section>
    </ScrollReveal>
  );
}
