import { ScrollReveal } from '../ScrollReveal';

export function HomeManifesto() {
  return (
    <ScrollReveal>
      <section
        id="manifesto"
        className="scroll-mt-24 border-t border-border py-20 md:py-28"
        aria-labelledby="manifesto-heading"
      >
        <div className="mx-auto max-w-6xl px-6">
          <p
            id="manifesto-heading"
            className="font-technical text-xs font-semibold uppercase tracking-[0.24em] text-accent"
          >
            Positioning
          </p>
          <blockquote className="mt-6 max-w-4xl font-display text-manifesto font-semibold leading-tight text-foreground text-balance">
            I build digital products that hold up in production, with the same person
            at the architecture table and in the codebase.
          </blockquote>
          <p className="mt-8 max-w-2xl font-technical text-base leading-relaxed text-muted-foreground md:text-lg">
            Strategic craftsmanship, radical transparency, and African context. You get
            senior judgment on scope, stack, and what not to build yet.
          </p>
        </div>
      </section>
    </ScrollReveal>
  );
}
