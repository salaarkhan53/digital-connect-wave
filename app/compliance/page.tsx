import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowUpRight, ShieldAlert } from 'lucide-react';
import { complianceItems } from '@/content/compliance';
import { kpis } from '@/content/kpis';
import { Icon } from '@/components/ui/Icon';
import { PageHero } from '@/components/ui/PageHero';
import { Reveal } from '@/components/ui/Reveal';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { CTABand } from '@/components/ui/CTABand';

export const metadata: Metadata = {
  title: 'Compliance',
  description:
    'How Digital Connect Wave runs compliant contact operations: documented scripts, DNC scrubbing, recorded QA monitoring, audit trails and consent capture built into the talk path.',
};

export default function CompliancePage() {
  return (
    <>
      <PageHero
        eyebrow="Compliance"
        title="The part most vendors skip in the pitch."
        lede="In Medicare and Final Expense, compliance is not a feature of the service. It is the service. Here is exactly how it works on our floor."
      />

      <section className="band-light">
        <Reveal className="shell section">
          <ul className="grid gap-x-10 gap-y-12 sm:grid-cols-2">
            {complianceItems.map((item, i) => (
              <li key={item.title} data-reveal>
                <div className="flex items-center gap-4">
                  <span
                    className="flex size-11 shrink-0 items-center justify-center rounded-xl border border-blue/20 bg-blue/[0.07] text-blue-ink"
                    aria-hidden="true"
                  >
                    <Icon name={item.icon} className="size-5" />
                  </span>
                  <span
                    className="font-display text-sm font-medium tabular-nums text-muted"
                    aria-hidden="true"
                  >
                    {String(i + 1).padStart(2, '0')}
                  </span>
                </div>
                <h2 className="mt-5 font-display text-xl font-medium text-ink">{item.title}</h2>
                <p className="mt-3 leading-relaxed text-muted body-justify">{item.body}</p>
              </li>
            ))}
          </ul>
        </Reveal>
      </section>

      {/* ----------------------------------------------- what gets reported */}
      <section className="band-mist">
        <Reveal className="shell section">
          <SectionHeading
            eyebrow="Reporting"
            title="What lands in your inbox."
            lede="Compliance you cannot see is compliance you cannot rely on. These are reported whether or not the numbers flatter us."
          />

          <ul className="mt-9 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {kpis.map((kpi) => (
              <li
                key={kpi.label}
                data-reveal
                className="rounded-2xl border border-[color:var(--color-hairline)] bg-white p-6"
              >
                <h3 className="font-display text-base font-medium text-ink">{kpi.label}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{kpi.body}</p>
              </li>
            ))}
          </ul>
        </Reveal>
      </section>

      {/* ------------------------------------------------------ the caveat */}
      <section className="relative isolate overflow-hidden bg-void">
        <div
          className="grid-lines absolute inset-0 -z-10 opacity-40 [mask-image:radial-gradient(70%_70%_at_50%_50%,#000,transparent)]"
          aria-hidden="true"
        />

        <Reveal className="shell section-tight">
          {/*
            This is the most important paragraph on the page, so it is set as a
            statement rather than centred body copy floating in a dark band. The
            heading carries the weight; the detail sits beside it.
          */}
          <div
            data-reveal
            className="relative overflow-hidden rounded-3xl border border-white/12 bg-surface/50"
          >
            <span
              className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-blue via-spark to-blue/20"
              aria-hidden="true"
            />

            <div className="grid gap-8 p-8 sm:p-10 lg:grid-cols-[1fr_1.35fr] lg:gap-14">
              <div>
                <span
                  className="flex size-12 items-center justify-center rounded-2xl border border-blue/25 bg-blue/10 text-blue-bright"
                  aria-hidden="true"
                >
                  <ShieldAlert className="size-6" strokeWidth={1.5} />
                </span>
                <h2 className="mt-5 text-[length:var(--text-h3)] font-semibold text-white">
                  What we are not claiming
                </h2>
              </div>

              <div>
                <p className="body-justify leading-relaxed text-white/70">
                  Everything above describes how we work, not a certificate
                  hanging on a wall. If your procurement process needs a formal
                  attestation such as HIPAA, SOC 2 or PCI DSS, ask us directly
                  and we will tell you plainly what we hold and what we do not.
                </p>
                <p className="mt-4 font-display text-[length:var(--text-lede)] leading-relaxed text-white">
                  We would rather lose a deal than imply something we cannot
                  evidence.
                </p>

                <Link
                  href="/contact"
                  className="group mt-7 inline-flex min-h-[44px] items-center gap-2 text-sm font-medium text-spark"
                >
                  Ask us what we hold
                  <ArrowUpRight
                    className="size-4 transition-transform duration-[280ms] [transition-timing-function:cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 motion-reduce:transition-none"
                    strokeWidth={2}
                    aria-hidden="true"
                  />
                </Link>
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      <CTABand
        title="Bring us your compliance requirements."
        lede="Send the script, the disclosure list and the standard you are audited against. We will tell you whether we can run it before we talk about price."
      />
    </>
  );
}
