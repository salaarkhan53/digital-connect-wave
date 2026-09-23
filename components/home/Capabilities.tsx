import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { capabilities } from '@/content/capabilities';
import { Icon } from '@/components/ui/Icon';
import { Reveal } from '@/components/ui/Reveal';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Button } from '@/components/ui/Button';

export function Capabilities() {
  return (
    <section className="band-mist" aria-labelledby="capabilities-heading">
      <Reveal className="shell section">
        <SectionHeading
          eyebrow="Capabilities"
          title={
            <span id="capabilities-heading">
              Human expertise, connected to the right technology.
            </span>
          }
          lede="Eight services, run by named teams against a documented process. Take one, or take the whole desk."
        />

        <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {capabilities.map((cap) => (
            <li key={cap.slug} data-reveal>
              <Link
                href={`/capabilities/${cap.slug}`}
                className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-[color:var(--color-hairline)] bg-white p-6 transition-[border-color,transform,box-shadow] duration-[280ms] [transition-timing-function:cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-1 hover:border-blue/45 hover:shadow-[0_24px_50px_-28px_rgb(12_123_240/0.55)]"
              >
                {/* Brand wash that fades up from the bottom on hover. */}
                <span
                  className="pointer-events-none absolute inset-0 bg-gradient-to-t from-blue/[0.07] to-transparent opacity-0 transition-opacity duration-[280ms] group-hover:opacity-100"
                  aria-hidden="true"
                />

                <span
                  className="relative flex size-11 items-center justify-center rounded-xl border border-blue/20 bg-blue/[0.07] text-blue-ink transition-colors duration-[280ms] group-hover:border-blue/45 group-hover:bg-blue group-hover:text-white"
                  aria-hidden="true"
                >
                  <Icon name={cap.icon} className="size-5" />
                </span>

                <h3 className="relative mt-5 font-display text-lg font-medium text-ink">
                  {cap.title}
                </h3>
                <p className="relative mt-2.5 flex-1 text-sm leading-relaxed text-muted">
                  {cap.promise}
                </p>

                <span className="relative mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-blue-ink">
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

        <div data-reveal className="mt-9">
          <Button href="/capabilities" variant="light">
            All capabilities
          </Button>
        </div>
      </Reveal>
    </section>
  );
}
