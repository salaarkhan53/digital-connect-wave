import { principles } from '@/content/principles';
import { Reveal } from '@/components/ui/Reveal';
import { SectionHeading } from '@/components/ui/SectionHeading';

export function Principles() {
  return (
    <section className="band-light" aria-labelledby="principles-heading">
      <Reveal className="shell section">
        <SectionHeading
          eyebrow="How we operate"
          title={<span id="principles-heading">Six rules we do not trade against.</span>}
          lede="These are the ones that have actually cost us work. That is how you know they are real."
        />

        <ol className="mt-14 grid gap-x-10 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
          {principles.map((principle, i) => (
            <li key={principle.title} data-reveal className="group">
              <p
                className="font-display text-sm font-medium tabular-nums text-blue-ink/40 transition-colors duration-[280ms] group-hover:text-blue-ink"
                aria-hidden="true"
              >
                {String(i + 1).padStart(2, '0')}
              </p>
              <h3 className="mt-3 font-display text-lg font-medium text-ink">
                {principle.title}
              </h3>
              <p className="mt-2.5 text-sm leading-relaxed text-muted">{principle.body}</p>
            </li>
          ))}
        </ol>
      </Reveal>
    </section>
  );
}
