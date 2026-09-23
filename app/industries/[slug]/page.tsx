import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowUpRight, TriangleAlert } from 'lucide-react';
import { industries, industryBySlug } from '@/content/industries';
import { capabilityBySlug } from '@/content/capabilities';
import { complianceItems } from '@/content/compliance';
import { Icon } from '@/components/ui/Icon';
import { IndustryVisual } from '@/components/art/IndustryVisual';
import { PageHero } from '@/components/ui/PageHero';
import { Reveal } from '@/components/ui/Reveal';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { CTABand } from '@/components/ui/CTABand';

export function generateStaticParams() {
  return industries.map((i) => ({ slug: i.slug }));
}

export async function generateMetadata(
  props: PageProps<'/industries/[slug]'>,
): Promise<Metadata> {
  const { slug } = await props.params;
  const industry = industryBySlug(slug);
  if (!industry) return {};
  return { title: industry.title, description: industry.summary };
}

export default async function IndustryPage(props: PageProps<'/industries/[slug]'>) {
  const { slug } = await props.params;
  const industry = industryBySlug(slug);
  if (!industry) notFound();

  const index = industries.findIndex((i) => i.slug === industry.slug);
  const caps = industry.capabilities
    .map((s) => capabilityBySlug(s))
    .filter((c): c is NonNullable<typeof c> => Boolean(c));

  return (
    <>
      <PageHero
        eyebrow="Industry"
        title={industry.title}
        lede={industry.summary}
        breadcrumb={[
          { label: 'Home', href: '/' },
          { label: 'Industries', href: '/industries' },
        ]}
      />

      <section className="band-light">
        <Reveal className="shell section">
          <div className="grid gap-12 lg:grid-cols-[1.15fr_1fr] lg:gap-16">
            <div>
              <p
                data-reveal
                className="text-[length:var(--text-lede)] leading-relaxed text-ink body-justify"
              >
                {industry.body}
              </p>

              <h2 data-reveal className="mt-10 font-display text-lg font-medium text-ink">
                What usually goes wrong
              </h2>
              <ul data-reveal className="mt-5 space-y-3">
                {industry.challenges.map((challenge) => (
                  <li key={challenge} className="flex items-start gap-3 text-sm text-muted">
                    <TriangleAlert
                      className="mt-0.5 size-4 shrink-0 text-blue-ink"
                      strokeWidth={1.75}
                      aria-hidden="true"
                    />
                    {challenge}
                  </li>
                ))}
              </ul>
            </div>

            <div
              data-reveal
              className="relative aspect-[4/5] overflow-hidden rounded-2xl border border-[color:var(--color-hairline)] bg-void lg:self-start"
              aria-hidden="true"
            >
              <IndustryVisual
                industry={industry}
                index={index}
                sizes="(min-width: 1024px) 28rem, 90vw"
                priority
              />
            </div>
          </div>
        </Reveal>
      </section>

      {/* -------------------------------------------- applied capabilities */}
      <section className="band-mist">
        <Reveal className="shell section">
          <SectionHeading
            eyebrow="What we run here"
            title="The services this vertical actually needs."
          />

          <ul className="mt-9 grid gap-4 sm:grid-cols-3">
            {caps.map((cap) => (
              <li key={cap.slug} data-reveal>
                <Link
                  href={`/capabilities/${cap.slug}`}
                  className="group flex h-full flex-col rounded-2xl border border-[color:var(--color-hairline)] bg-white p-6 transition-[border-color,transform] duration-[280ms] [transition-timing-function:cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-1 hover:border-blue/45"
                >
                  <span
                    className="flex size-10 items-center justify-center rounded-lg border border-blue/20 bg-blue/[0.07] text-blue-ink"
                    aria-hidden="true"
                  >
                    <Icon name={cap.icon} className="size-4.5" />
                  </span>
                  <h3 className="mt-4 font-display text-base font-medium text-ink">{cap.title}</h3>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-muted body-justify">{cap.promise}</p>
                  <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-blue-ink">
                    Explore
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

      {/* ---------------------------------------------------- compliance */}
      <section className="bg-void">
        <Reveal className="shell section">
          <SectionHeading
            tone="dark"
            eyebrow="Compliance"
            title="How we keep this campaign clean."
            lede="Every claim here is a practice we run, not a certification we are waving."
          />

          <ul className="mt-9 grid gap-x-8 gap-y-7 sm:grid-cols-2 lg:grid-cols-3">
            {complianceItems.slice(0, 3).map((item) => (
              <li key={item.title} data-reveal className="flex gap-3.5">
                <span
                  className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-lg border border-blue/25 bg-blue/10 text-blue-bright"
                  aria-hidden="true"
                >
                  <Icon name={item.icon} className="size-4.5" />
                </span>
                <div>
                  <h3 className="font-display text-base font-medium text-white">{item.title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-white/50 body-justify">{item.body}</p>
                </div>
              </li>
            ))}
          </ul>

          <div data-reveal className="mt-10">
            <Link
              href="/compliance"
              className="group inline-flex min-h-[44px] items-center gap-2 text-sm font-medium text-spark"
            >
              The full compliance picture
              <ArrowUpRight
                className="size-4 transition-transform duration-[280ms] group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                strokeWidth={2}
                aria-hidden="true"
              />
            </Link>
          </div>
        </Reveal>
      </section>

      <CTABand title={`Running a ${industry.title.toLowerCase()} campaign?`} />
    </>
  );
}
