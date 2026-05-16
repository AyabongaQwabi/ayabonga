import { ExternalLink } from 'lucide-react';
import ProjectCard from '../ProjectCard';
import { ScrollReveal } from '../ScrollReveal';

export type HomeProject = {
  title: string;
  description: string;
  url: string;
  tech: string[];
};

type HomeSelectedWorkProps = {
  projects: HomeProject[];
};

export function HomeSelectedWork({ projects }: HomeSelectedWorkProps) {
  return (
    <ScrollReveal>
      <section
        id="work"
        className="scroll-mt-24 border-t border-border py-20 md:py-28"
        aria-labelledby="work-heading"
      >
        <div className="mx-auto max-w-6xl px-6">
          <p className="font-technical text-xs font-semibold uppercase tracking-[0.24em] text-primary">
            Selected work
          </p>
          <h2
            id="work-heading"
            className="mt-3 max-w-3xl font-display text-mega-sm font-bold text-foreground text-balance"
          >
            Products in production,<br /> not pitch decks
          </h2>
          <p className="mt-6 max-w-2xl font-technical text-base leading-relaxed text-muted-foreground">
            Marketplaces, health bookings, campus fintech, and community AI. Built to survive
            real users, local payments, and long-term ownership.
          </p>

          <div className="mt-12 grid gap-6 md:grid-cols-2">
            {projects.map((project) => (
              <div key={project.title} className="group">
                <p className="mb-2 font-technical text-xs font-semibold uppercase tracking-wider text-accent">
                  {project.tech.slice(0, 2).join(' · ')}
                </p>
                <ProjectCard
                  title={project.title}
                  description={project.description}
                  url={project.url}
                  tech={project.tech}
                />
              </div>
            ))}
          </div>
        </div>
      </section>
    </ScrollReveal>
  );
}

export function HomeCollaborations({
  collaborations,
}: {
  collaborations: { name: string; url: string }[];
}) {
  return (
    <ScrollReveal>
      <section
        id="collaborations"
        className="scroll-mt-24 border-t border-border py-16 md:py-20"
        aria-labelledby="collab-heading"
      >
        <div className="mx-auto max-w-6xl px-6">
          <h2
            id="collab-heading"
            className="font-technical text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground"
          >
            Collaborations
          </h2>
          <ScrollReveal stagger className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {collaborations.map((collab) => (
              <a
                key={collab.name}
                href={collab.url}
                target="_blank"
                rel="noopener noreferrer"
                className="interactive-card group flex items-center justify-between rounded-xl border border-border bg-card/60 px-4 py-4 font-technical text-sm font-medium text-muted-foreground hover:border-primary/40 hover:text-primary"
              >
                <span>{collab.name}</span>
                <ExternalLink
                  className="h-4 w-4 opacity-50 transition-opacity group-hover:opacity-100"
                  aria-hidden
                />
              </a>
            ))}
          </ScrollReveal>
        </div>
      </section>
    </ScrollReveal>
  );
}
