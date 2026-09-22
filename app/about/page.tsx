import type { Metadata } from 'next';
import { timeline } from '@/content/timeline';
import { principles } from '@/content/principles';
import { process } from '@/content/process';
import { stats } from '@/content/stats';
import { PageHero } from '@/components/ui/PageHero';
import { Reveal } from '@/components/ui/Reveal';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Counter } from '@/components/ui/Counter';
import { CTABand } from '@/components/ui/CTABand';

export const metadata: Metadata = {
  title: 'About',
  description:
    'Digital Connect Wave runs contact operations for US businesses. How we started, what we hold ourselves to, and the five steps every campaign goes through.',
};

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="About"
        title="We run the calls your brand is judged on."
        lede="Which is why the boring parts — documented process, recorded QA, named ownership — are the parts we talk about first."
      />

      {/* ----------------------------------------------- mission / vision */}
      <section className="band-light">
        <Reveal className="shell section">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
            <div>
              <h2
                data-reveal
                className="font-display text-xs font-medium uppercase tracking-[0.18em] text-blue-ink"
              >
                Mission
              </h2>
              <p
                data-reveal
                className="mt-4 text-[length:var(--text-h3)] font-semibold leading-tight text-ink"
              >
                Help clients shape their future through practical solutions,
                dependable service and operational discipline.
              </p>
            </div>
            <div>
              <h2
                data-reveal
                className="font-display text-xs font-medium uppercase tracking-[0.18em] text-blue-ink"
              >
                Vision
              </h2>
              <p
                data-reveal
                className="mt-4 text-[length:var(--text-h3)] font-semibold leading-tight text-ink"
              >
                To be the contact partner US businesses recommend without being
                asked to — and the employer people stay at.
              </p>
            </div>
          </div>

          <ul className="mt-16 grid gap-6 border-t border-[color:var(--color-hairline)] pt-12 sm:grid-cols-2 lg:grid-cols-4">
            {stats.slice(0, 4).map((stat) => (
              <li key={stat.id} data-reveal>
                <p className="font-display text-[clamp(2rem,1.6rem+1.4vw,2.75rem)] font-semibold leading-none text-ink">
                  {stat.display ? (
                    stat.display
                  ) : (
                    <Counter
                      value={stat.value}
                      decimals={stat.id === 'rating' ? 2 : 0}
                      suffix={stat.suffix}
                    />
                  )}
                </p>
                <p className="mt-3 text-sm font-medium text-ink">{stat.label}</p>
                <p className="mt-1 text-sm text-muted">{stat.detail}</p>
              </li>
            ))}
          </ul>
        </Reveal>
      </section>

      {/* ------------------------------------------------------- timeline */}
      <section className="bg-void">
        <Reveal className="shell section">
          <SectionHeading
            tone="dark"
            eyebrow="The short version"
            title="Built one process at a time."
            lede="Structure first, headcount second. It is slower at the start and the only thing that holds at scale."
          />

          <ol className="mt-14 grid gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10 sm:grid-cols-2 lg:grid-cols-5">
            {timeline.map((entry) => (
              <li key={entry.year} data-reveal className="bg-void p-6">
                <p className="font-display text-2xl font-semibold text-spark">{entry.year}</p>
                <h3 className="mt-3 font-display text-base font-medium text-white">
                  {entry.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-white/50">{entry.body}</p>
              </li>
            ))}
          </ol>
        </Reveal>
      </section>

      {/* -------------------------------------------------------- process */}
      <section className="band-mist" id="process">
        <Reveal className="shell section">
          <SectionHeading
            eyebrow="How we work"
            title="Five steps, every campaign, no exceptions."
            lede="The order matters. Most failed campaigns skipped step one and found out at step four."
          />

          <ol className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {process.map((step, i) => (
              <li
                key={step.id}
                data-reveal
                className="rounded-2xl border border-[color:var(--color-hairline)] bg-white p-6"
              >
                <span
                  className="flex size-8 items-center justify-center rounded-full bg-blue text-xs font-medium tabular-nums text-white"
                  aria-hidden="true"
                >
                  {i + 1}
                </span>
                <h3 className="mt-4 font-display text-base font-medium text-ink">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{step.detail}</p>
              </li>
            ))}
          </ol>
        </Reveal>
      </section>

      {/* ----------------------------------------------------- principles */}
      <section className="band-light">
        <Reveal className="shell section">
          <SectionHeading
            eyebrow="How we operate"
            title="Six rules we do not trade against."
            lede="These are the ones that have actually cost us work. That is how you know they are real."
          />

          <ol className="mt-14 grid gap-x-10 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
            {principles.map((principle, i) => (
              <li key={principle.title} data-reveal>
                <p className="font-display text-sm font-medium tabular-nums text-blue-ink/40" aria-hidden="true">
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

      <CTABand />
    </>
  );
}
