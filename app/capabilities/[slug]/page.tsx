import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowUpRight, Check } from 'lucide-react';
import { capabilities, capabilityBySlug } from '@/content/capabilities';
import { industries } from '@/content/industries';
import { process } from '@/content/process';
import { Icon } from '@/components/ui/Icon';
import { PageHero } from '@/components/ui/PageHero';
import { Reveal } from '@/components/ui/Reveal';
import { SectionHeading } from '@/components/ui/SectionHeading';
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

  // Verticals that list this capability as one of theirs.
  const related = industries.filter((i) => i.capabilities.includes(cap.slug)).slice(0, 3);

  return (
    <>
      <PageHero
        eyebrow="Capability"
        title={cap.title}
        lede={cap.promise}
        breadcrumb={[
          { label: 'Home', href: '/' },
          { label: 'Capabilities', href: '/capabilities' },
        ]}
      />

      <section className="band-light">
        <Reveal className="shell section">
          <div className="grid gap-12 lg:grid-cols-[1.15fr_1fr] lg:gap-16">
            <div>
              <span
                data-reveal
                className="flex size-12 items-center justify-center rounded-xl border border-blue/20 bg-blue/[0.07] text-blue-ink"
                aria-hidden="true"
              >
                <Icon name={cap.icon} className="size-5" />
              </span>

              <p
                data-reveal
                className="mt-6 text-[length:var(--text-lede)] leading-relaxed text-ink body-justify"
              >
                {cap.body}
              </p>

              <div
                data-reveal
                className="mt-8 rounded-2xl border border-[color:var(--color-hairline)] bg-mist p-6"
              >
                <h2 className="font-display text-sm font-medium text-ink">Who it is for</h2>
                <p className="mt-2 text-sm leading-relaxed text-muted">{cap.forWho}</p>
              </div>
            </div>

            <div
              data-reveal
              className="rounded-2xl border border-[color:var(--color-hairline)] bg-white p-7 lg:self-start"
            >
              <h2 className="font-display text-lg font-medium text-ink">What you get</h2>
              <ul className="mt-5 space-y-3.5">
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
          </div>
        </Reveal>
      </section>

      {/* ------------------------------------------------------- process */}
      <section className="band-mist">
        <Reveal className="shell section">
          <SectionHeading
            eyebrow="How it runs"
            title="The same five steps, every time."
            lede="Nothing about this service is improvised. It goes through the process every other campaign goes through."
          />

          <ol className="mt-9 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {process.map((step, i) => (
              <li
                key={step.id}
                data-reveal
                className="rounded-2xl border border-[color:var(--color-hairline)] bg-white p-5"
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

      {/* ------------------------------------------------ related verticals */}
      {related.length > 0 && (
        <section className="band-light">
          <Reveal className="shell section">
            <SectionHeading
              eyebrow="Where it applies"
              title="Verticals that lean on this."
            />

            <ul className="mt-9 grid gap-4 sm:grid-cols-3">
              {related.map((industry) => (
                <li key={industry.slug} data-reveal>
                  <Link
                    href={`/industries/${industry.slug}`}
                    className="group flex h-full flex-col rounded-2xl border border-[color:var(--color-hairline)] bg-white p-6 transition-[border-color,transform] duration-[280ms] [transition-timing-function:cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-1 hover:border-blue/45"
                  >
                    <h3 className="font-display text-lg font-medium text-ink">{industry.title}</h3>
                    <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">
                      {industry.summary}
                    </p>
                    <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-blue-ink">
                      View
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
          </Reveal>
        </section>
      )}

      <CTABand title={`Need ${cap.title.toLowerCase()} running by next month?`} />
    </>
  );
}
