import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowUpRight, Check } from 'lucide-react';
import { capabilities } from '@/content/capabilities';
import { Icon } from '@/components/ui/Icon';
import { PageHero } from '@/components/ui/PageHero';
import { Reveal } from '@/components/ui/Reveal';
import { CTABand } from '@/components/ui/CTABand';

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

      <section className="band-light">
        <Reveal className="shell section">
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {capabilities.map((cap) => (
              <li key={cap.slug} data-reveal>
                <a
                  href={`#${cap.slug}`}
                  className="group flex h-full flex-col rounded-2xl border border-[color:var(--color-hairline)] bg-white p-5 transition-[border-color,transform] duration-[280ms] [transition-timing-function:cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-0.5 hover:border-blue/40"
                >
                  <span
                    className="flex size-10 items-center justify-center rounded-lg border border-blue/20 bg-blue/[0.07] text-blue-ink"
                    aria-hidden="true"
                  >
                    <Icon name={cap.icon} className="size-4.5" />
                  </span>
                  <span className="mt-4 font-display text-base font-medium text-ink">
                    {cap.title}
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </Reveal>
      </section>

      {capabilities.map((cap, i) => (
        <section
          key={cap.slug}
          id={cap.slug}
          className={i % 2 === 0 ? 'band-mist' : 'band-light'}
          aria-labelledby={`${cap.slug}-heading`}
        >
          <Reveal className="shell section scroll-mt-24">
            <div className="grid gap-10 lg:grid-cols-[1.1fr_1fr] lg:gap-16">
              <div>
                <p
                  data-reveal
                  className="font-display text-xs font-medium uppercase tracking-[0.18em] text-blue-ink"
                >
                  {String(i + 1).padStart(2, '0')} — Capability
                </p>
                <h2
                  id={`${cap.slug}-heading`}
                  data-reveal
                  className="mt-4 text-[length:var(--text-h2)] font-semibold text-ink"
                >
                  {cap.title}
                </h2>
                <p
                  data-reveal
                  className="mt-5 text-[length:var(--text-lede)] leading-relaxed text-muted"
                >
                  {cap.body}
                </p>

                <p data-reveal className="mt-7 text-sm text-muted">
                  <span className="font-medium text-ink">Who it is for: </span>
                  {cap.forWho}
                </p>

                <Link
                  data-reveal
                  href={`/capabilities/${cap.slug}`}
                  className="group mt-7 inline-flex min-h-[44px] items-center gap-2 text-sm font-medium text-blue-ink"
                >
                  Full detail
                  <ArrowUpRight
                    className="size-4 transition-transform duration-[280ms] group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    strokeWidth={2}
                    aria-hidden="true"
                  />
                </Link>
              </div>

              <ul
                data-reveal
                className="space-y-3 rounded-2xl border border-[color:var(--color-hairline)] bg-white p-7 lg:self-start"
              >
                {cap.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3 text-sm text-ink">
                    <Check
                      className="mt-0.5 size-4 shrink-0 text-blue-ink"
                      strokeWidth={2.5}
                      aria-hidden="true"
                    />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </section>
      ))}

      <CTABand />
    </>
  );
}
