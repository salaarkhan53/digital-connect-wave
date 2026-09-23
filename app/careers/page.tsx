import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { careersIntro, roles } from '@/content/careers';
import { contact, mailto } from '@/content/contact';
import { PageHero } from '@/components/ui/PageHero';
import { Reveal } from '@/components/ui/Reveal';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { CTABand } from '@/components/ui/CTABand';
import { LightBand } from '@/components/ui/LightBand';

export const metadata: Metadata = {
  title: 'Careers',
  description:
    'Open roles at Digital Connect Wave: Medicare Verifier, Medicare Closer, Campaign Dialer, Final Expense Verifier and Final Expense Closer.',
};

export default function CareersPage() {
  return (
    <>
      <PageHero
        eyebrow="Careers"
        title={careersIntro.heading}
        lede={careersIntro.lede}
      />

      {/* ---------------------------------------------------- why join us */}
      <LightBand>
        <Reveal className="shell section">
          <SectionHeading eyebrow="Why here" title="What you can expect from us." />

          <ul className="mt-9 grid gap-8 sm:grid-cols-2">
            {careersIntro.points.map((point) => (
              <li key={point.title} data-reveal>
                <h3 className="font-display text-lg font-medium text-ink">{point.title}</h3>
                <p className="mt-2.5 leading-relaxed text-muted body-justify">{point.body}</p>
              </li>
            ))}
          </ul>
        </Reveal>
      </LightBand>

      {/* -------------------------------------------------------- the roles */}
      <section className="bg-void" id="roles">
        <Reveal className="shell section">
          <SectionHeading
            tone="dark"
            eyebrow="Open roles"
            title="Currently hiring."
            lede="Apply with your CV and we will come back to you about the campaign, the shift and the numbers."
          />

          <ul className="mt-9 border-t border-white/10">
            {roles.map((role) => (
              <li key={role.slug}>
                <Link
                  href={`/careers/apply?role=${role.slug}`}
                  className="group flex items-center justify-between gap-6 border-b border-white/10 py-6 transition-colors duration-[280ms] hover:border-white/25"
                  data-reveal
                >
                  <span className="font-display text-[clamp(1.125rem,1rem+0.6vw,1.5rem)] font-medium text-white/80 transition-colors duration-[280ms] group-hover:text-white">
                    {role.title}
                  </span>
                  <span className="flex shrink-0 items-center gap-2 text-xs font-medium uppercase tracking-[0.14em] text-white/55 transition-colors duration-[280ms] group-hover:text-spark">
                    Apply
                    <ArrowUpRight
                      className="size-4 transition-transform duration-[280ms] group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                      strokeWidth={2}
                      aria-hidden="true"
                    />
                  </span>
                </Link>
              </li>
            ))}
          </ul>

          <p data-reveal className="mt-8 text-sm text-white/55">
            Prefer email? Send your CV to{' '}
            <a
              href={mailto()}
              className="text-spark underline decoration-spark/30 underline-offset-4 transition-colors duration-[160ms] hover:decoration-spark"
            >
              {contact.email}
            </a>
            . Put the role in the subject line and we will route it to the right
            team lead.
          </p>
        </Reveal>
      </section>

      <CTABand
        title="Not the right role?"
        lede="Send your CV anyway. Campaigns open at short notice and we would rather have you on file than miss you."
      />
    </>
  );
}
