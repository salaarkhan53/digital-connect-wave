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
import { LightBand } from '@/components/ui/LightBand';

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
        artOverlap
      />

      {/*
        No `section` padding at the top of this band: the artwork is positioned
        against the band edge, and any padding above it would push it down and
        break the overlap.
      */}
      <LightBand>
        <Reveal className="shell pb-[clamp(2.5rem,1.6rem+3.6vw,5rem)]">
          <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-start lg:gap-14">
            {/*
              The artwork rises exactly half its own height above the band edge,
              so it reads as half on the dark masthead and half on the white.
              This used to sit wholly inside the white band, which left the top
              right of the masthead empty and the left of the picture emptier.

              A percentage margin resolves against the column's width, and the
              aspect ratio fixes the height to a share of that same width, so
              "half" holds at every size with no magic pixel value: 4:3 is 0.75w
              tall, so half of it is 37.5% of w, and 5:4 is 0.8w, so 40%.

              It is ordered first in the markup because that is the order it
              wants below `lg`, where the columns stack; the grid places it on
              the right from `lg` up.
            */}
            {/* Capped while the columns are stacked, because the percentage
                margin is a share of this box's width: left to run the full
                width of a tablet it would be 500px tall and rise further into
                the masthead than there is masthead to rise into. */}
            <div className="mx-auto w-full max-w-[26rem] lg:col-start-2 lg:row-start-1 lg:max-w-none">
              <div
                data-reveal
                className="relative -mt-[37.5%] aspect-[4/3] overflow-hidden rounded-2xl border border-white/10 bg-void shadow-[0_34px_80px_-48px_rgb(5_7_14/0.85)] lg:-mt-[40%] lg:aspect-[5/4]"
                aria-hidden="true"
              >
                <IndustryVisual
                  industry={industry}
                  index={index}
                  scrim="plain"
                  sizes="(min-width: 1024px) 34rem, 26rem"
                  priority
                />
              </div>
            </div>

            {/* Its own top padding rather than the grid's: `items-start` is
                what keeps the artwork's overlap exact whatever length the
                copy runs to, so the copy has to space itself. */}
            <div className="lg:col-start-1 lg:row-start-1 lg:pt-12">
              <p
                data-reveal
                className="text-[clamp(1.0625rem,1rem+0.5vw,1.3125rem)] leading-relaxed text-ink body-justify"
              >
                {industry.body}
              </p>
            </div>
          </div>

          {/* Challenges read as a row of cards rather than a short bulleted list
              stranded under the copy. */}
          <div className="mt-14">
            <h2
              data-reveal
              className="flex items-center gap-2.5 font-sans text-xs font-medium uppercase tracking-[0.18em] text-blue-ink"
            >
              <span className="h-px w-6 bg-blue/40" aria-hidden="true" />
              What usually goes wrong
            </h2>

            <ul className="mt-6 grid gap-4 sm:grid-cols-3">
              {industry.challenges.map((challenge, i) => (
                <li
                  key={challenge}
                  data-reveal
                  className="group relative overflow-hidden rounded-2xl border border-[color:var(--color-hairline)] bg-mist p-6 transition-[border-color,transform] duration-[280ms] [transition-timing-function:cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-0.5 hover:border-blue/40"
                >
                  <span
                    className="flex size-10 items-center justify-center rounded-xl border border-blue/20 bg-white text-blue-ink"
                    aria-hidden="true"
                  >
                    <TriangleAlert className="size-5" strokeWidth={1.75} />
                  </span>
                  <p className="mt-4 leading-relaxed text-ink">{challenge}</p>
                  <span
                    className="pointer-events-none absolute right-5 top-5 font-display text-sm tabular-nums text-muted"
                    aria-hidden="true"
                  >
                    {String(i + 1).padStart(2, '0')}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      </LightBand>

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
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">{cap.promise}</p>
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
                  <p className="mt-1.5 text-sm leading-relaxed text-white/50">{item.body}</p>
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
