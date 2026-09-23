'use client';

import Link from 'next/link';
import { useState } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { industries } from '@/content/industries';
import { IndustryVisual } from '@/components/art/IndustryVisual';
import { Reveal } from '@/components/ui/Reveal';
import { SectionHeading } from '@/components/ui/SectionHeading';

/**
 * Sutherland's hover-reveal industry grid, rebuilt as a list.
 *
 * The art panel follows the active row rather than sitting inside each cell,
 * which keeps one large image on screen instead of nine small ones. The active
 * row is driven by focus as well as hover, so keyboard users get the same
 * feedback rather than a dead list.
 */
export function Industries() {
  const [active, setActive] = useState(0);

  return (
    <section className="relative bg-void" aria-labelledby="industries-heading">
      <Reveal className="shell section">
        <SectionHeading
          tone="dark"
          eyebrow="Industries"
          title={<span id="industries-heading">Where we already know the script.</span>}
          lede="Nine verticals with their own objections, their own compliance load and their own idea of a good call."
        />

        <div className="mt-14 grid gap-10 lg:grid-cols-[1fr_22rem] lg:items-start">
          <ul data-reveal className="border-t border-white/10">
            {industries.map((industry, i) => (
              <li key={industry.slug}>
                <Link
                  href={`/industries/${industry.slug}`}
                  onPointerEnter={() => setActive(i)}
                  onFocus={() => setActive(i)}
                  className="group flex items-baseline gap-5 border-b border-white/10 py-5 transition-colors duration-[280ms] hover:border-white/25 sm:py-6"
                >
                  <span
                    className="font-display text-xs tabular-nums text-white/55 transition-colors duration-[280ms] group-hover:text-spark"
                    aria-hidden="true"
                  >
                    {String(i + 1).padStart(2, '0')}
                  </span>

                  <span className="flex-1">
                    <span className="flex items-center gap-2">
                      <span className="font-display text-[clamp(1.25rem,1rem+1vw,1.875rem)] font-medium text-white/70 transition-colors duration-[280ms] group-hover:text-white">
                        {industry.title}
                      </span>
                      <ArrowUpRight
                        className="size-4 -translate-x-1 text-spark opacity-0 transition-all duration-[280ms] group-hover:translate-x-0 group-hover:opacity-100"
                        strokeWidth={2}
                        aria-hidden="true"
                      />
                    </span>
                    <span className="mt-1 block max-w-xl text-sm leading-relaxed text-white/55 body-justify">
                      {industry.summary}
                    </span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>

          {/* The panel is decorative; the list above carries all the meaning. */}
          <div
            data-reveal
            className="relative hidden aspect-[4/5] overflow-hidden rounded-2xl border border-white/10 lg:block lg:sticky lg:top-28"
            aria-hidden="true"
          >
            {industries.map((industry, i) => (
              <div
                key={industry.slug}
                className="absolute inset-0 transition-opacity duration-[620ms] [transition-timing-function:cubic-bezier(0.16,1,0.3,1)]"
                style={{ opacity: active === i ? 1 : 0 }}
              >
                <IndustryVisual industry={industry} index={i} />
              </div>
            ))}

            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-void via-void/70 to-transparent p-6 pt-16">
              <p className="font-display text-xl font-medium text-white">
                {industries[active].title}
              </p>
              <p className="mt-2 text-sm leading-relaxed text-white/60 body-justify">
                {industries[active].summary}
              </p>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
