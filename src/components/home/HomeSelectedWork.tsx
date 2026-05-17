import { useEffect, useRef, useState } from 'react';
import { ExternalLink } from 'lucide-react';
import { scrambleDecode, staggerCards, whenMotionReady } from '../../lib/animations';
import { TransitionLink } from '../ui/TransitionLink';

export type HomeProject = {
  title: string;
  description: string;
  url: string;
  tech: string[];
  featured?: boolean;
  wip?: boolean;
  relatedLinks?: { label: string; url: string }[];
};

type HomeSelectedWorkProps = {
  projects: HomeProject[];
};

export function HomeSelectedWork({ projects }: HomeSelectedWorkProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const labelRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const cleanups: Array<() => void> = [];
    let cancelled = false;

    void whenMotionReady().then(() => {
      if (cancelled) return;
      if (labelRef.current) scrambleDecode(labelRef.current, { delay: 0.2 });
      if (sectionRef.current) {
        const cleanup = staggerCards(sectionRef.current, '[data-project-row]', {
          stagger: 0.15,
          y: 24,
          duration: 0.65,
        });
        if (cleanup) cleanups.push(cleanup);
      }
    });

    return () => {
      cancelled = true;
      cleanups.forEach((fn) => fn());
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="work"
      className="scroll-mt-24 bg-[var(--navy-dark)] py-[clamp(80px,12vw,180px)]"
      aria-labelledby="work-heading"
    >
      <div className="mx-auto max-w-6xl px-6">
        <p
          ref={labelRef}
          id="work-heading"
          className="font-technical text-label-sm uppercase tracking-[var(--tracking-label)] text-[var(--text-muted)]"
        >
          Selected work
        </p>

        <ul className="mt-12 list-none divide-y divide-white/10">
          {projects.map((project) => (
            <ProjectRow key={project.title} project={project} />
          ))}
        </ul>
      </div>
    </section>
  );
}

function ProjectRow({ project }: { project: HomeProject }) {
  const [hovered, setHovered] = useState(false);
  const category = project.tech.slice(0, 2).join(' · ');
  const featured = Boolean(project.featured);
  const external = /^https?:\/\//i.test(project.url);

  const rowClass = [
    'group block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--gold)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--navy-dark)]',
    featured
      ? 'border-b border-[var(--gold)]/25 py-14 md:py-20'
      : 'py-10 md:py-14',
  ].join(' ');

  const hoverHandlers = {
    onMouseEnter: () => setHovered(true),
    onMouseLeave: () => setHovered(false),
    onFocus: () => setHovered(true),
    onBlur: () => setHovered(false),
  };

  return (
    <li data-project-row {...hoverHandlers}>
      <TransitionLink to={project.url} className={rowClass} data-cursor="project">
        <div className="flex flex-wrap items-baseline justify-between gap-3">
          <div className="flex flex-wrap items-center gap-3">
            <h3
              className={`font-display font-semibold text-[var(--warm-white)] transition-transform duration-200 ease-out group-hover:translate-x-2 motion-reduce:group-hover:translate-x-0 ${
                featured
                  ? 'text-display-lg md:text-[clamp(2rem,4vw,3.25rem)]'
                  : 'text-display-md'
              }`}
            >
              {project.title}
            </h3>
            {project.wip ? (
              <span className="rounded-full border border-[var(--gold)]/40 bg-[var(--gold)]/10 px-2.5 py-0.5 font-technical text-[0.65rem] uppercase tracking-[0.12em] text-[var(--gold)]">
                In progress
              </span>
            ) : null}
          </div>
          <p className="shrink-0 font-technical text-label-sm uppercase tracking-[var(--tracking-label)] text-[var(--text-muted)]">
            {category}
          </p>
        </div>
        <div
          className={`grid transition-[grid-template-rows,opacity] duration-200 ease-out ${
            hovered ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
          }`}
          aria-hidden={!hovered}
        >
          <p className="overflow-hidden pt-4 font-technical text-base leading-relaxed text-[var(--text-muted)]">
            {project.description}
          </p>
        </div>
        {external ? <span className="sr-only"> (opens in new tab)</span> : null}
      </TransitionLink>
      {project.relatedLinks && project.relatedLinks.length > 0 && hovered ? (
        <p className="-mt-2 flex flex-wrap gap-x-4 gap-y-2 pb-4 pl-0 font-technical text-sm md:pb-6">
          {project.relatedLinks.map((link) => (
            <TransitionLink
              key={link.url}
              to={link.url}
              className="interactive-link inline-flex items-center gap-1 text-[var(--gold)] hover:text-[var(--warm-white)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--gold)]"
            >
              {link.label}
              <ExternalLink className="h-3.5 w-3.5 opacity-70" aria-hidden />
            </TransitionLink>
          ))}
        </p>
      ) : null}
    </li>
  );
}

export function HomeCollaborations({
  collaborations,
}: {
  collaborations: { name: string; url: string }[];
}) {
  const sectionRef = useRef<HTMLElement>(null);
  const labelRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const cleanups: Array<() => void> = [];
    let cancelled = false;

    void whenMotionReady().then(() => {
      if (cancelled) return;
      if (labelRef.current) scrambleDecode(labelRef.current, { delay: 0.2 });
      if (sectionRef.current) {
        const cleanup = staggerCards(sectionRef.current, '[data-collab-link]', {
          stagger: 0.06,
          y: 12,
        });
        if (cleanup) cleanups.push(cleanup);
      }
    });

    return () => {
      cancelled = true;
      cleanups.forEach((fn) => fn());
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="collaborations"
      className="scroll-mt-24 border-t border-white/10 bg-[var(--navy)] py-16 md:py-20"
      aria-labelledby="collab-heading"
    >
      <div className="mx-auto max-w-6xl px-6">
        <h2
          id="collab-heading"
          ref={labelRef}
          className="font-technical text-label-sm uppercase tracking-[var(--tracking-label)] text-[var(--text-muted)]"
        >
          Collaborations
        </h2>
        <ul className="mt-8 flex flex-wrap gap-x-8 gap-y-4">
          {collaborations.map((collab) => (
            <li key={collab.name}>
              <a
                data-collab-link
                href={collab.url}
                target="_blank"
                rel="noopener noreferrer"
                className="interactive-link inline-flex items-center gap-2 font-display text-heading-md text-[var(--warm-white)]/85 hover:text-[var(--warm-white)]"
              >
                {collab.name}
                <ExternalLink className="h-4 w-4 opacity-50" aria-hidden />
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
