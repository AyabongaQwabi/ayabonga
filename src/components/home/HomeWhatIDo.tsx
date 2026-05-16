import { Link } from 'react-router-dom';
import { ArrowRight, Brain, Cloud, Code2 } from 'lucide-react';
import { ScrollReveal } from '../ScrollReveal';

const capabilities = [
  {
    icon: Brain,
    title: 'AI & intelligent products',
    copy: 'LLM features, assistants, and automation with guardrails, evals, and human handoff when it matters.',
    accent: 'border-amber-500/20 hover:border-amber-500/40',
    iconWrap: 'bg-primary/10 text-primary',
    tags: ['OpenAI', 'LangChain', 'Python'],
  },
  {
    icon: Cloud,
    title: 'Cloud architecture',
    copy: 'GCP, AWS, and Azure systems that scale: serverless, Kubernetes, and infrastructure you can operate.',
    accent: 'border-primary/20 hover:border-primary/50',
    iconWrap: 'bg-primary/10 text-primary',
    tags: ['GCP', 'AWS', 'Azure'],
  },
  {
    icon: Code2,
    title: 'Full-stack delivery',
    copy: 'React, Next.js, Node, TypeScript, and mobile when the product needs to ship on every screen.',
    accent: 'border-accent/25 hover:border-accent/50',
    iconWrap: 'bg-accent/15 text-accent',
    tags: ['React', 'Next.js', 'Supabase'],
  },
] as const;

export function HomeWhatIDo() {
  return (
    <ScrollReveal>
      <section
        id="expertise"
        className="scroll-mt-24 border-t border-border py-20 md:py-28"
        aria-labelledby="expertise-heading"
      >
        <div className="mx-auto max-w-6xl px-6">
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="font-technical text-xs font-semibold uppercase tracking-[0.24em] text-primary">
                What I do
              </p>
              <h2
                id="expertise-heading"
                className="mt-3 font-display text-mega-sm font-bold text-foreground"
              >
                Three lanes,<br className="hidden sm:block" /> one owner
              </h2>
            </div>
            <Link
              to="/services"
              className="interactive-link inline-flex shrink-0 items-center gap-2 font-technical text-sm font-semibold text-primary hover:underline underline-offset-4"
            >
              All services
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          </div>

          <ScrollReveal stagger className="mt-12 grid gap-4 md:grid-cols-3">
            {capabilities.map(({ icon: Icon, title, copy, accent, iconWrap, tags }) => (
              <article
                key={title}
                className={`interactive-card group rounded-2xl border bg-card/80 p-6 backdrop-blur-sm ${accent}`}
              >
                <div
                  className={`mb-5 flex h-12 w-12 items-center justify-center rounded-xl ${iconWrap} transition-transform group-hover:scale-105 motion-reduce:group-hover:scale-100`}
                >
                  <Icon className="h-6 w-6" aria-hidden />
                </div>
                <h3 className="font-display text-xl font-semibold text-foreground">{title}</h3>
                <p className="mt-3 font-technical text-sm leading-relaxed text-muted-foreground">
                  {copy}
                </p>
                <ul className="mt-5 flex flex-wrap gap-2" aria-label={`${title} stack`}>
                  {tags.map((tag) => (
                    <li
                      key={tag}
                      className="rounded-full border border-border/80 bg-secondary/50 px-2.5 py-1 font-technical text-xs text-muted-foreground"
                    >
                      {tag}
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </ScrollReveal>
        </div>
      </section>
    </ScrollReveal>
  );
}
