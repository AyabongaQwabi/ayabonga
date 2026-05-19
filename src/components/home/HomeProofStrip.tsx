import { useEffect, useRef } from 'react';
import { countUp, wordReveal } from '../../lib/animations';

const stats = [
  { value: 10, suffix: '+', label: 'Years building production systems' },
  { value: 6, suffix: '+', label: 'Products shipped end to end' },
] as const;

export function HomeProofStrip() {
  const sectionRef = useRef<HTMLElement>(null);
  const statementRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    stats.forEach((stat, index) => {
      const el = sectionRef.current?.querySelector(`[data-stat-value="${index}"]`);
      if (el) countUp(el, stat.value, { suffix: stat.suffix, duration: 1.4 });
    });
    if (statementRef.current) {
      wordReveal(statementRef.current, { trigger: sectionRef.current ?? undefined });
    }
  }, []);

  return (
    <section
      ref={sectionRef}
      id="proof"
      className="scroll-mt-24 bg-[var(--navy)] py-[clamp(64px,10vw,120px)]"
      aria-labelledby="proof-heading"
    >
      <div className="mx-auto max-w-4xl px-6 text-center">
        <h2 id="proof-heading" className="sr-only">
          My Projects
        </h2>

        <ul className="grid gap-12 sm:grid-cols-2">
          {stats.map((stat, index) => (
            <li key={stat.label}>
              <p
                data-stat-value={index}
                className="font-display text-display-md font-semibold text-[var(--gold)]"
                aria-label={`${stat.value}${stat.suffix} ${stat.label}`}
              >
                0{stat.suffix}
              </p>
              <p className="mt-3 font-technical text-sm leading-relaxed text-[var(--text-muted)]">
                {stat.label}
              </p>
            </li>
          ))}
          <li className="sm:col-span-2">
            <p className="font-technical text-label-sm uppercase tracking-[var(--tracking-label)] text-[var(--text-muted)]">
              Based in South Africa · building globally
            </p>
          </li>
        </ul>

        <p
          ref={statementRef}
          className="mx-auto mt-14 max-w-2xl font-display text-heading-md font-medium leading-[var(--leading-editorial)] text-[var(--warm-white)]/90"
        >
          I partner with friends who need a senior engineer accountable from architecture through
          launch.
        </p>
      </div>
    </section>
  );
}
