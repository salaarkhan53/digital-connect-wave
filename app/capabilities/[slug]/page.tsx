import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowUpRight, Check, ChevronRight } from 'lucide-react';
import { capabilities, capabilityBySlug } from '@/content/capabilities';
import { industries } from '@/content/industries';
import { process } from '@/content/process';
import { Icon } from '@/components/ui/Icon';
import { CapabilityVisual } from '@/components/art/CapabilityVisual';
import { IndustryVisual } from '@/components/art/IndustryVisual';
import { Reveal } from '@/components/ui/Reveal';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Button } from '@/components/ui/Button';
import { CTABand } from '@/components/ui/CTABand';

export function generateStaticParams() {
  return capabilities.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata(
  props: PageProps<'/capabilities/[slug]'>,
): Promise<Metadata> {
  const { slug } = await props.params;
  const cap = capabilityBySlug(slug);
  if (!cap) return {};
  return { title: cap.title, description: cap.promise };
}

export default async function CapabilityPage(props: PageProps<'/capabilities/[slug]'>) {
  const { slug } = await props.params;
  const cap = capabilityBySlug(slug);
  if (!cap) notFound();

  const index = capabilities.findIndex((c) => c.slug === cap.slug);
  const related = industries.filter((i) => i.capabilities.includes(cap.slug)).slice(0, 3);
  // The rest of the range, so the page always offers somewhere to go next.
  const others = capabilities.filter((c) => c.slug !== cap.slug).slice(0, 4);

  return (
    <>
      {/* ------------------------------------------------------------ hero */}
      <section className="relative isolate overflow-hidden border-b border-white/10 bg-void pt-[var(--header-h)]">
        <div className="mesh-field absolute inset-0 -z-20" aria-hidden="true" />
        <div
          className="grid-lines absolute inset-0 -z-20 opacity-50 [mask-image:radial-gradient(60%_70%_at_25%_0%,#000,transparent)]"
          aria-hidden="true"
        />

        <Reveal className="shell grid items-center gap-10 py-12 md:py-16 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14">
          <div>
            <nav data-reveal aria-label="Breadcrumb" className="mb-7">
              <ol className="flex flex-wrap items-center gap-1.5 text-xs text-white/55">
                {[
                  { label: 'Home', href: '/' },
                  { label: 'Capabilities', href: '/capabilities' },
                ].map((crumb) => (
                  <li key={crumb.href} className="flex items-center gap-1.5">
                    <Link
                      href={crumb.href}
                      className="transition-colors duration-[160ms] hover:text-spark"
                    >
                      {crumb.label}
                    </Link>
                    <ChevronRight className="size-3" strokeWidth={2} aria-hidden="true" />
                  </li>
                ))}
                <li className="text-white/75">{cap.title}</li>
              </ol>
            </nav>

            <p
              data-reveal
              className="flex items-center gap-2.5 text-xs font-medium uppercase tracking-[0.18em] text-spark/80"
            >
              <span className="h-px w-6 bg-spark/50" aria-hidden="true" />
              Capability {String(index + 1).padStart(2, '0')}
            </p>

            <h1 data-reveal className="mt-5 text-[length:var(--text-h1)] font-semibold text-white">
              {cap.title}
            </h1>

            <p
              data-reveal
              className="mt-5 max-w-xl text-[length:var(--text-lede)] leading-relaxed text-white/70"
            >
              {cap.promise}
            </p>

            <div data-reveal className="mt-8 flex flex-wrap items-center gap-3">
              <Button href="/contact">Talk about this</Button>
              <Link
                href="/capabilities"
                className="inline-flex min-h-[44px] items-center rounded-full border border-white/20 px-5 py-3 text-sm font-medium text-white transition-colors duration-[160ms] hover:border-spark/60 hover:bg-white/[0.06]"
              >
                All capabilities
              </Link>
            </div>
          </div>

          <div
            data-reveal
            className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-white/12 lg:aspect-[5/4]"
          >
            <CapabilityVisual capability={cap} index={index} priority />
          </div>
        </Reveal>
      </section>

      {/* ----------------------------------------------- what it actually is */}
      <section className="band-light">
        <Reveal className="shell section">
          <div className="grid gap-10 lg:grid-cols-[1fr_0.85fr] lg:items-center lg:gap-16">
            <div>
              {/* Paired with the card's "Who it is for" so the two columns
                  read as a matched set rather than a block beside a box. */}
              <div data-reveal className="flex items-center gap-4">
                <span
                  className="flex size-12 shrink-0 items-center justify-center rounded-2xl border border-blue/20 bg-blue/[0.07] text-blue-ink"
                  aria-hidden="true"
                >
                  <Icon name={cap.icon} className="size-6" />
                </span>
                <h2 className="font-sans text-xs font-medium uppercase tracking-[0.18em] text-blue-ink">
                  What it is
                </h2>
              </div>

              <p
                data-reveal
                className="mt-6 text-[clamp(1.0625rem,0.95rem+0.7vw,1.4375rem)] leading-relaxed text-ink body-justify"
              >
                {cap.body}
              </p>
            </div>

            {/*
              The "who it is for" line is two sentences at most, so on its own
              it left the right-hand column mostly empty against a five-line
              body. The facts under it are the ones a reader actually wants at
              this point, and they fill the column rather than padding it.
            */}
            <div data-reveal>
              <div className="relative overflow-hidden rounded-2xl border border-[color:var(--color-hairline)] bg-mist p-7">
                <span
                  className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-blue to-spark"
                  aria-hidden="true"
                />
                <h2 className="font-sans text-xs font-medium uppercase tracking-[0.18em] text-blue-ink">
                  Who it is for
                </h2>
                <p className="mt-4 text-[length:var(--text-lede)] leading-relaxed text-ink">
                  {cap.forWho}
                </p>

                <dl className="mt-6 grid grid-cols-2 gap-x-6 gap-y-4 border-t border-[color:var(--color-hairline)] pt-5">
                  {[
                    ['Service', `${String(index + 1).padStart(2, '0')} of ${String(capabilities.length).padStart(2, '0')}`],
                    ['Inclusions', String(cap.features.length)],
                    ['Delivery', `${process.length}-step process`],
                    ['Quality', 'Recorded call QA'],
                  ].map(([label, value]) => (
                    <div key={label}>
                      <dt className="text-xs uppercase tracking-[0.14em] text-muted">{label}</dt>
                      <dd className="mt-1 font-display text-sm font-medium tabular-nums text-ink">
                        {value}
                      </dd>
                    </div>
                  ))}
                </dl>

                <Link
                  href="/contact"
                  className="group mt-6 inline-flex min-h-[44px] items-center gap-2 text-sm font-medium text-blue-ink"
                >
                  Ask about {cap.title.toLowerCase()}
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

      {/* ------------------------------------------------------ what you get */}
      <section className="band-mist">
        <Reveal className="shell section">
          <SectionHeading eyebrow="What you get" title="What the engagement includes." />

          {/*
            Every capability carries exactly four inclusions, and each is a
            short phrase. Laid out two-up they were 600px boxes holding three
            words, which read as empty space. Four-up with the mark stacked
            above the text fills the card instead of stranding it.
          */}
          <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {cap.features.map((feature, i) => (
              <li
                key={feature}
                data-reveal
                className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-[color:var(--color-hairline)] bg-white p-6 transition-[border-color,transform,box-shadow] duration-[280ms] [transition-timing-function:cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-1 hover:border-blue/40 hover:shadow-[0_22px_46px_-30px_rgb(12_123_240/0.5)]"
              >
                <span
                  className="pointer-events-none absolute right-4 top-3 font-display text-[2.75rem] leading-none tabular-nums text-[color:var(--color-hairline)] transition-colors duration-[280ms] group-hover:text-blue/25"
                  aria-hidden="true"
                >
                  {String(i + 1).padStart(2, '0')}
                </span>

                <span
                  className="flex size-10 items-center justify-center rounded-xl border border-blue/20 bg-blue/[0.07] text-blue-ink transition-colors duration-[280ms] group-hover:bg-blue group-hover:text-white"
                  aria-hidden="true"
                >
                  <Check className="size-5" strokeWidth={2.5} />
                </span>

                <p className="mt-5 font-display text-[1.0625rem] font-medium leading-snug text-ink">
                  {feature}
                </p>

                <span
                  className="mt-5 h-px w-8 bg-blue/30 transition-all duration-[280ms] [transition-timing-function:cubic-bezier(0.16,1,0.3,1)] group-hover:w-14 group-hover:bg-blue"
                  aria-hidden="true"
                />
              </li>
            ))}
          </ul>
        </Reveal>
      </section>

      {/* ------------------------------------------------------------ process */}
      <section className="band-light">
        <Reveal className="shell section">
          <SectionHeading
            eyebrow="How it runs"
            title="The same five steps, every time."
            lede="Nothing about this service is improvised. It goes through the process every other campaign goes through."
          />

          <ol className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {process.map((step, i) => (
              <li
                key={step.id}
                data-reveal
                className="relative rounded-2xl border border-[color:var(--color-hairline)] bg-mist p-5"
              >
                <span
                  className="flex size-8 items-center justify-center rounded-full bg-blue text-xs font-medium tabular-nums text-white"
                  aria-hidden="true"
                >
                  {i + 1}
                </span>
                <h3 className="mt-4 font-display text-base font-medium text-ink">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{step.summary}</p>
              </li>
            ))}
          </ol>
        </Reveal>
      </section>

      {/* -------------------------------------------------- related verticals */}
      {related.length > 0 && (
        <section className="bg-void">
          <Reveal className="shell section">
            <SectionHeading
              tone="dark"
              eyebrow="Where it applies"
              title="Verticals that lean on this."
            />

            <ul className="mt-12 grid gap-5 sm:grid-cols-3">
              {related.map((industry) => (
                <li key={industry.slug} data-reveal>
                  <Link
                    href={`/industries/${industry.slug}`}
                    className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-white/10 transition-[border-color,transform,box-shadow] duration-[280ms] [transition-timing-function:cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-1 hover:border-blue/50 hover:shadow-[0_24px_50px_-28px_rgb(12_123_240/0.6)]"
                  >
                    <div className="relative aspect-[16/11] overflow-hidden">
                      <IndustryVisual
                        industry={industry}
                        index={industries.indexOf(industry)}
                        sizes="(min-width: 640px) 22rem, 90vw"
                      />
                    </div>
                    <div className="flex flex-1 flex-col p-6">
                      <h3 className="font-display text-lg font-medium text-white">
                        {industry.title}
                      </h3>
                      <p className="mt-2 flex-1 text-sm leading-relaxed text-white/55">
                        {industry.summary}
                      </p>
                      <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-spark">
                        View
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
        </section>
      )}

      {/* ------------------------------------------------ keep looking around */}
      <section className="band-mist">
        <Reveal className="shell section-tight">
          <h2
            data-reveal
            className="flex items-center gap-2.5 font-sans text-xs font-medium uppercase tracking-[0.18em] text-blue-ink"
          >
            <span className="h-px w-6 bg-blue/40" aria-hidden="true" />
            Other capabilities
          </h2>

          <ul className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {others.map((other) => (
              <li key={other.slug} data-reveal>
                <Link
                  href={`/capabilities/${other.slug}`}
                  className="group flex h-full items-center gap-3.5 rounded-2xl border border-[color:var(--color-hairline)] bg-white p-4 transition-[border-color,transform] duration-[280ms] [transition-timing-function:cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-0.5 hover:border-blue/45"
                >
                  <span
                    className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-blue/20 bg-blue/[0.07] text-blue-ink transition-colors duration-[280ms] group-hover:bg-blue group-hover:text-white"
                    aria-hidden="true"
                  >
                    <Icon name={other.icon} className="size-4.5" />
                  </span>
                  <span className="flex-1 font-display text-sm font-medium text-ink">
                    {other.title}
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

      <CTABand title={`Need ${cap.title.toLowerCase()} running by next month?`} />
    </>
  );
}
