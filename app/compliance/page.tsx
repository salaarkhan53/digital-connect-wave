import type { Metadata } from 'next';
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
                    className="font-display text-sm font-medium tabular-nums text-blue-ink/40"
                    aria-hidden="true"
                  >
                    {String(i + 1).padStart(2, '0')}
                  </span>
                </div>
                <h2 className="mt-5 font-display text-xl font-medium text-ink">{item.title}</h2>
                <p className="mt-3 leading-relaxed text-muted">{item.body}</p>
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

          <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
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
      <section className="bg-void">
        <Reveal className="shell section">
          <div
            data-reveal
            className="mx-auto max-w-3xl rounded-2xl border border-white/10 bg-surface/60 p-8 text-center"
          >
            <h2 className="font-display text-xl font-medium text-white">
              What we are not claiming
            </h2>
            <p className="mt-4 leading-relaxed text-white/55">
              Everything above describes how we work, not a certificate hanging on
              a wall. If your procurement process needs a formal attestation —
              HIPAA, SOC 2, PCI DSS — ask us directly and we will tell you plainly
              what we hold and what we do not. We would rather lose a deal than
              imply something we cannot evidence.
            </p>
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
