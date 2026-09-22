import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { complianceItems } from '@/content/compliance';
import { Icon } from '@/components/ui/Icon';
import { Reveal } from '@/components/ui/Reveal';

/**
 * Placed immediately under the hero, because in Medicare and Final Expense
 * compliance is the first objection, not the last.
 *
 * Every claim here is worded as a practice rather than a held certification.
 * See content/REVIEW.md before changing any of this copy.
 */
export function ComplianceBar() {
  return (
    <section
      id="trust"
      className="relative border-y border-white/10 bg-surface/60"
      aria-labelledby="compliance-heading"
    >
      <Reveal className="shell py-14 md:py-16">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p
              data-reveal
              className="text-xs font-medium uppercase tracking-[0.18em] text-spark/80"
            >
              How we stay clean
            </p>
            <h2
              id="compliance-heading"
              data-reveal
              className="mt-3 max-w-xl text-[length:var(--text-h3)] font-semibold text-white"
            >
              Compliance is the constraint we build around, not the box we tick last.
            </h2>
          </div>

          <Link
            data-reveal
            href="/compliance"
            className="group inline-flex min-h-[44px] items-center gap-2 text-sm font-medium text-white/70 transition-colors duration-[160ms] hover:text-spark"
          >
            How it works
            <ArrowUpRight
              className="size-4 transition-transform duration-[280ms] group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              strokeWidth={2}
              aria-hidden="true"
            />
          </Link>
        </div>

        <ul className="mt-10 grid gap-x-8 gap-y-7 sm:grid-cols-2 lg:grid-cols-3">
          {complianceItems.map((item) => (
            <li key={item.title} data-reveal className="flex gap-3.5">
              <span
                className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-lg border border-blue/25 bg-blue/10 text-blue-bright"
                aria-hidden="true"
              >
                <Icon name={item.icon} className="size-4.5" />
              </span>
              <div>
                <h3 className="font-display text-base font-medium text-white">{item.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-white/50">{item.body}</p>
              </div>
            </li>
          ))}
        </ul>
      </Reveal>
    </section>
  );
}
