import { kpis } from '@/content/kpis';
import { Reveal } from '@/components/ui/Reveal';
import { SectionHeading } from '@/components/ui/SectionHeading';

/**
 * Replaces the usual case-study carousel.
 *
 * There are no verified client results to publish, and inventing them would be
 * exactly the "honest positioning" failure the company names as a principle.
 * So this section states what an engagement is measured on instead — which is
 * more useful to a buyer than a competitor's anonymised percentage anyway.
 */
export function Measured() {
  return (
    <section className="relative isolate overflow-hidden bg-void" aria-labelledby="measured-heading">
      <div
        className="grid-lines absolute inset-0 -z-10 opacity-50 [mask-image:radial-gradient(60%_60%_at_30%_30%,#000,transparent)]"
        aria-hidden="true"
      />

      <Reveal className="shell section">
        <SectionHeading
          tone="dark"
          eyebrow="Accountability"
          title={<span id="measured-heading">What we&apos;re measured on.</span>}
          lede="Agreed at Discover, reported throughout, and shown to you whether or not the numbers flatter us."
        />

        <ul className="mt-14 grid gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10 sm:grid-cols-2 lg:grid-cols-3">
          {kpis.map((kpi, i) => (
            <li
              key={kpi.label}
              data-reveal
              className="group relative bg-void p-7 transition-colors duration-[280ms] hover:bg-surface"
            >
              <span
                className="font-display text-xs font-medium tabular-nums text-white/55"
                aria-hidden="true"
              >
                {String(i + 1).padStart(2, '0')}
              </span>
              <h3 className="mt-4 font-display text-xl font-medium text-white">
                {kpi.label}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-white/50">{kpi.body}</p>

              <span
                className="absolute bottom-0 left-0 h-px w-full origin-left scale-x-0 bg-gradient-to-r from-blue to-spark transition-transform duration-[620ms] [transition-timing-function:cubic-bezier(0.16,1,0.3,1)] group-hover:scale-x-100"
                aria-hidden="true"
              />
            </li>
          ))}
        </ul>
      </Reveal>
    </section>
  );
}
