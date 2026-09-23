import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { industries } from '@/content/industries';
import { IndustryVisual } from '@/components/art/IndustryVisual';
import { PageHero } from '@/components/ui/PageHero';
import { Reveal } from '@/components/ui/Reveal';
import { CTABand } from '@/components/ui/CTABand';
import { LightBand } from '@/components/ui/LightBand';

export const metadata: Metadata = {
  title: 'Industries',
  description:
    'Nine verticals we already know the script for: insurance, Medicare, Final Expense, healthcare billing, financial services, retail, telecom, technology and home services.',
};

export default function IndustriesPage() {
  return (
    <>
      <PageHero
        eyebrow="Industries"
        title="Nine verticals we already know the script for."
        lede="Each one has its own objections, its own compliance load and its own idea of what a good call sounds like. We do not start from scratch on any of them."
      />

      <LightBand>
        <Reveal className="shell section">
          <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {industries.map((industry, i) => (
              <li key={industry.slug} data-reveal>
                <Link
                  href={`/industries/${industry.slug}`}
                  className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-[color:var(--color-hairline)] bg-void transition-[border-color,transform,box-shadow] duration-[280ms] [transition-timing-function:cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-1 hover:border-blue/50 hover:shadow-[0_24px_50px_-28px_rgb(12_123_240/0.6)]"
                >
                  <div className="relative aspect-[4/5] overflow-hidden">
                    <IndustryVisual
                      industry={industry}
                      index={i}
                      sizes="(min-width: 1024px) 22rem, (min-width: 640px) 45vw, 90vw"
                    />
                  </div>

                  <div className="flex flex-1 flex-col p-6">
                    <h2 className="font-display text-lg font-medium text-white">
                      {industry.title}
                    </h2>
                    <p className="mt-2 flex-1 text-sm leading-relaxed text-white/50">
                      {industry.summary}
                    </p>
                    <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-spark">
                      Explore
                      <ArrowUpRight
                        className="size-4 transition-transform duration-[280ms] group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                        strokeWidth={2}
                        aria-hidden="true"
                      />
                    </span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </Reveal>
      </LightBand>

      <CTABand />
    </>
  );
}
