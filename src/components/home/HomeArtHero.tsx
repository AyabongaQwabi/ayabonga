import { Link } from 'react-router-dom';
import { ArrowDown, ArrowRight, MessageCircle } from 'lucide-react';
import { WHATSAPP_URL } from '../../lib/site-config';
import { HOME_WIDE_HERO, HOME_WIDE_HERO_ALT } from '../../lib/home-images';

type HomeArtHeroProps = {
  onScrollTo: (id: string) => void;
};

const ctaBase =
  'interactive-button inline-flex items-center justify-center gap-2 min-h-[44px] px-5 py-3 rounded-xl font-semibold text-sm md:text-base';

export function HomeArtHero({ onScrollTo }: HomeArtHeroProps) {
  return (
    <section
      id="hero"
      className="relative flex min-h-[100svh] flex-col justify-end overflow-hidden scroll-mt-0"
      aria-labelledby="home-hero-title"
    >
      <img
        src={HOME_WIDE_HERO}
        alt={HOME_WIDE_HERO_ALT}
        width={1920}
        height={1080}
        fetchPriority="high"
        decoding="async"
        className="absolute inset-0 h-full w-full scale-105 object-cover object-[center_20%] grayscale contrast-[1.12] brightness-[0.55]"
      />

      <div
        className="pointer-events-none absolute inset-0 bg-[#0A192F]/75 mix-blend-multiply"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-[#0A192F] via-[#0A192F]/40 to-[#059669]/25"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#0A192F] via-transparent to-[#0A192F]/30"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -right-1/4 top-1/4 h-[28rem] w-[28rem] rounded-full bg-primary/10 blur-3xl motion-reduce:blur-none"
        aria-hidden
      />
      <div className="home-grain pointer-events-none absolute inset-0" aria-hidden />

      <div className="relative z-10 mx-auto w-full max-w-6xl px-6 pb-14 pt-28 md:pb-20 md:pt-32">
        <p className="home-hero-enter font-technical text-xs font-medium uppercase tracking-[0.28em] text-primary/90 md:text-sm">
          Technical partner · South Africa
        </p>

        <h1
          id="home-hero-title"
          className="home-hero-enter home-hero-enter-delay-1 mt-6 font-display text-mega font-bold text-foreground"
        >
          <span className="block">Ayabonga</span>
          <span className="block text-gradient">Qwabi</span>
        </h1>

        <p className="home-hero-enter home-hero-enter-delay-2 mt-6 max-w-xl font-technical text-lg leading-relaxed text-foreground/85 md:text-xl text-pretty">
          Senior engineering for founders who need scalable product assets, not another
          junior-built MVP that breaks at scale.
        </p>

        <div className="home-hero-enter home-hero-enter-delay-3 mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className={`${ctaBase} bg-[#25D366] text-white hover:bg-[#128C7E] shadow-lg shadow-black/30`}
          >
            <MessageCircle className="h-5 w-5 shrink-0" aria-hidden />
            Start a conversation
          </a>
          <button
            type="button"
            onClick={() => onScrollTo('work')}
            className={`${ctaBase} border border-primary/40 bg-primary/10 text-foreground backdrop-blur-sm hover:border-primary/70 hover:bg-primary/15`}
          >
            Selected work
            <ArrowRight className="h-4 w-4 shrink-0" aria-hidden />
          </button>
          <Link
            to="/get-a-quote"
            className={`${ctaBase} border border-border/80 bg-secondary/60 text-foreground hover:border-primary/30`}
          >
            Scope & pricing
          </Link>
        </div>

        <button
          type="button"
          onClick={() => onScrollTo('manifesto')}
          className="interactive-link group mt-14 inline-flex items-center gap-2 font-technical text-sm text-muted-foreground hover:text-foreground"
        >
          <span>Scroll</span>
          <ArrowDown
            className="h-4 w-4 animate-bounce motion-reduce:animate-none"
            aria-hidden
          />
        </button>
      </div>
    </section>
  );
}
