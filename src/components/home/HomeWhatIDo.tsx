import { useEffect, useRef } from 'react';
import { lineReveal, scrambleDecode, staggerCards, whenMotionReady } from '../../lib/animations';

const services = [
  {
    num: '01',
    title: 'Product Engineering',
    copy: 'Full-stack delivery from schema to UI. React, Node, TypeScript, and AI features that ship with tests and observability.',
  },
  {
    num: '02',
    title: 'Technical Leadership',
    copy: 'Hands-on direction for founders and small teams: roadmap calls, code review, hiring signal, and decisions that stick.',
  },
  {
    num: '03',
    title: 'Architecture & Systems Design',
    copy: 'GCP, AWS, and Azure patterns that scale. Serverless, Kubernetes, and infrastructure you can operate after launch.',
  },
  {
    num: '04',
    title: 'MVP to Scale',
    copy: 'Phase-one builds with a path to production traffic, local payments, and the second version already in mind.',
  },
] as const;

export function HomeWhatIDo() {
  const sectionRef = useRef<HTMLElement>(null);
  const labelRef = useRef<HTMLParagraphElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const cleanups: Array<() => void> = [];
    let cancelled = false;

    void whenMotionReady().then(() => {
      if (cancelled) return;
      if (labelRef.current) scrambleDecode(labelRef.current, { delay: 0.2 });
      if (headingRef.current) {
        const cleanup = lineReveal(headingRef.current);
        if (cleanup) cleanups.push(cleanup);
      }
      if (sectionRef.current) {
        const cleanup = staggerCards(sectionRef.current, '[data-service-item]', {
          stagger: 0.12,
          y: 28,
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
      id="expertise"
      className="scroll-mt-24 bg-[var(--slate)] py-[clamp(80px,12vw,180px)]"
      aria-labelledby="expertise-heading"
    >
      <div className="mx-auto max-w-6xl px-6">
        <p
          ref={labelRef}
          data-section-label
          className="font-technical text-label-sm uppercase tracking-[var(--tracking-label)] text-[var(--text-muted)]"
        >
          What I do
        </p>
        <h2
          id="expertise-heading"
          ref={headingRef}
          className="mt-6 max-w-3xl font-display text-display-md font-semibold text-[var(--warm-white)]"
        >
          Four ways I partner with teams
        </h2>

        <ol className="mt-16 list-none space-y-14 md:space-y-20">
          {services.map(({ num, title, copy }, index) => (
            <li
              key={num}
              data-service-item
              className={`group relative border-l-2 border-transparent pl-6 transition-[border-color] duration-200 ease-out hover:border-[var(--gold)] md:pl-8 ${
                index % 2 === 0 ? 'md:ml-[15%]' : 'md:mr-[10%] md:ml-0'
              }`}
            >
              <span
                className="font-display text-display-md font-semibold text-transparent transition-colors duration-200 group-hover:text-[var(--gold)]"
                style={{ WebkitTextStroke: '1.5px var(--gold)' }}
                aria-hidden
              >
                {num}
              </span>
              <h3 className="mt-2 font-display text-heading-lg font-semibold text-[var(--warm-white)]">
                {title}
              </h3>
              <p className="mt-4 max-w-xl font-technical text-base leading-[var(--leading-body)] text-[var(--text-muted)]">
                {copy}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
