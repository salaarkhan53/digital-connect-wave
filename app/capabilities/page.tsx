import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { capabilities } from '@/content/capabilities';
import { process } from '@/content/process';
import { Icon } from '@/components/ui/Icon';
import { CapabilityVisual } from '@/components/art/CapabilityVisual';
import { PageHero } from '@/components/ui/PageHero';
import { Reveal } from '@/components/ui/Reveal';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { CTABand } from '@/components/ui/CTABand';
import { LightBand } from '@/components/ui/LightBand';

export const metadata: Metadata = {
  title: 'Capabilities',
  description:
    'Eight contact-centre services run by named teams against a documented process: inbound, outbound, support, lead generation, verification, medical billing, B2B outreach and digital marketing.',
};

export default function CapabilitiesPage() {
  return (
    <>
      <PageHero
        eyebrow="Capabilities"
        title="Everything the desk needs to run."
        lede="Take one service or take the whole operation. Either way it runs on the same five-step process, the same QA scorecard and the same reporting."
      />

      {/*
        One card per capability, each linking to its own page.
        This page used to repeat all eight in full underneath the grid, which
        duplicated the detail pages word for word and made it several times
        longer than it needed to be for no extra information.
      */}
      <LightBand>
        <Reveal className="shell section">
          <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {capabilities.map((cap, i) => (
              <li key={cap.slug} data-reveal>
                <Link
                  href={`/capabilities/${cap.slug}`}
                  className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-[color:var(--color-hairline)] bg-white transition-[border-color,transform,box-shadow] duration-[280ms] [transition-timing-function:cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-1 hover:border-blue/45 hover:shadow-[0_24px_50px_-28px_rgb(12_123_240/0.55)]"
                >
                  <div className="relative aspect-[16/9] overflow-hidden">
                    <CapabilityVisual
                      capability={cap}
                      index={i}
                      frame="card"
                      sizes="(min-width: 1024px) 24rem, (min-width: 640px) 45vw, 90vw"
                      priority={i === 0}
                    />
                  </div>

                  <div className="flex flex-1 flex-col p-6">
                    <span className="font-display text-xs tabular-nums text-muted" aria-hidden="true">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <h2 className="mt-2 font-display text-lg font-medium text-ink">{cap.title}</h2>
                    <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">{cap.promise}</p>

                    <span className="mt-5 flex items-center justify-between border-t border-[color:var(--color-hairline)] pt-4">
                      <span className="text-xs text-muted">{cap.features.length} inclusions</span>
                      <span className="inline-flex items-center gap-1.5 text-sm font-medium text-blue-ink">
                        Explore
                        <ArrowUpRight
                          className="size-4 transition-transform duration-[280ms] group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                          strokeWidth={2}
                          aria-hidden="true"
                        />
                      </span>
                    </span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </Reveal>
      </LightBand>

      {/* ----------------------------------------------------------- process */}
      <section className="bg-void">
        <Reveal className="shell section">
          <SectionHeading
            tone="dark"
            eyebrow="However you combine them"
            title="Every service runs the same way."
            lede="One process, one QA scorecard, one reporting cadence. Take a single desk or the whole operation and none of that changes."
          />

          <ol className="mt-12 grid gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10 sm:grid-cols-2 lg:grid-cols-5">
            {process.map((step, i) => (
              <li key={step.id} data-reveal className="bg-void p-6">
                <span
                  className="flex size-8 items-center justify-center rounded-full border border-blue/40 bg-blue/15 text-xs font-medium tabular-nums text-spark"
                  aria-hidden="true"
                >
                  {i + 1}
                </span>
                <h3 className="mt-4 font-display text-base font-medium text-white">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-white/55">{step.summary}</p>
              </li>
            ))}
          </ol>

          <div data-reveal className="mt-10">
            <Link
              href="/about#process"
              className="group inline-flex min-h-[44px] items-center gap-2 text-sm font-medium text-spark"
            >
              How the process works
              <ArrowUpRight
                className="size-4 transition-transform duration-[280ms] [transition-timing-function:cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 motion-reduce:transition-none"
                strokeWidth={2}
                aria-hidden="true"
              />
            </Link>
          </div>
        </Reveal>
      </section>

      {/* -------------------------------------------------------- quick index */}
      <section className="band-mist">
        <Reveal className="shell section-tight">
          <h2
            data-reveal
            className="flex items-center gap-2.5 font-sans text-xs font-medium uppercase tracking-[0.18em] text-blue-ink"
          >
            <span className="h-px w-6 bg-blue/40" aria-hidden="true" />
            Jump to a service
          </h2>

          <ul className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {capabilities.map((cap) => (
              <li key={cap.slug} data-reveal>
                <Link
                  href={`/capabilities/${cap.slug}`}
                  className="group flex h-full items-center gap-3.5 rounded-2xl border border-[color:var(--color-hairline)] bg-white p-4 transition-[border-color,transform] duration-[280ms] [transition-timing-function:cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-0.5 hover:border-blue/45"
                >
                  <span
                    className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-blue/20 bg-blue/[0.07] text-blue-ink transition-colors duration-[280ms] group-hover:bg-blue group-hover:text-white"
                    aria-hidden="true"
                  >
                    <Icon name={cap.icon} className="size-4.5" />
                  </span>
                  <span className="flex-1 font-display text-sm font-medium text-ink">
                    {cap.title}
                  </span>
                  <ArrowUpRight
                    className="size-4 shrink-0 text-muted transition-all duration-[280ms] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-blue-ink"
                    strokeWidth={2}
                    aria-hidden="true"
                  />
                </Link>
              </li>
            ))}
          </ul>
        </Reveal>
      </section>

      <CTABand />
    </>
  );
}
