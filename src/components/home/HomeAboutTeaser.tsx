import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { ScrollReveal } from '../ScrollReveal';
import { HOME_PORTRAIT, HOME_PORTRAIT_ALT } from '../../lib/home-images';

export function HomeAboutTeaser() {
  return (
    <ScrollReveal>
      <section
        id="about"
        className="scroll-mt-24 border-t border-border py-20 md:py-28"
        aria-labelledby="about-heading"
      >
        <div className="mx-auto grid max-w-6xl gap-12 px-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(260px,0.9fr)] lg:items-center">
          <div>
            <p className="font-technical text-xs font-semibold uppercase tracking-[0.24em] text-accent">
              Story
            </p>
            <h2
              id="about-heading"
              className="mt-3 font-display text-mega-sm font-bold text-foreground"
            >
              Architect in the boardroom and the IDE
            </h2>
            <p className="mt-6 font-technical text-lg leading-relaxed text-muted-foreground">
              I turn business ideas into working digital products without agency overhead.
              AI specialist and cloud architect based in Queenstown, Eastern Cape, with about
              ten years shipping across web, mobile, and cloud.
            </p>
            <p className="mt-4 font-technical text-base leading-relaxed text-muted-foreground">
              I work with founders and teams who want one senior partner accountable for
              architecture, delivery, and what happens after launch.
            </p>
            <Link
              to="/about"
              className="interactive-link mt-8 inline-flex items-center gap-2 font-technical text-sm font-semibold text-primary hover:underline underline-offset-4"
            >
              Full story
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          </div>

          <div className="relative mx-auto w-full max-w-sm lg:mx-0 lg:max-w-none">
            <div
              className="pointer-events-none absolute -left-4 -top-4 h-full w-full rounded-2xl border border-primary/20"
              aria-hidden
            />
            <figure className="portrait-frame rotate-2 motion-reduce:rotate-0">
              <img
                src={HOME_PORTRAIT}
                alt={HOME_PORTRAIT_ALT}
                width={640}
                height={640}
                loading="lazy"
                decoding="async"
                className="relative z-0 aspect-square w-full object-cover object-[center_15%]"
              />
              <figcaption className="sr-only">{HOME_PORTRAIT_ALT}</figcaption>
            </figure>
            <p className="mt-4 text-center font-technical text-xs uppercase tracking-[0.2em] text-muted-foreground lg:text-left">
              Queenstown · Eastern Cape
            </p>
          </div>
        </div>
      </section>
    </ScrollReveal>
  );
}
