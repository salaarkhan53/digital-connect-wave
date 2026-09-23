import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { roles } from '@/content/careers';
import { Reveal } from '@/components/ui/Reveal';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Button } from '@/components/ui/Button';

/** Roles by name only — no location, no responsibilities. */
export function CareersTeaser() {
  return (
    <section className="relative border-t border-white/10 bg-void" aria-labelledby="careers-heading">
      <Reveal className="shell section">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.15fr] lg:gap-16">
          <div>
            <SectionHeading
              tone="dark"
              eyebrow="Careers"
              title={<span id="careers-heading">Together we build success.</span>}
              lede="We hire for attitude and train for the campaign. Promotion runs on performance, not on how long you have been here."
            />
            <div data-reveal className="mt-10">
              <Button href="/careers">See open roles</Button>
            </div>
          </div>

          <ul data-reveal className="border-t border-white/10">
            {roles.map((role) => (
              <li key={role.slug}>
                <Link
                  href={`/careers/apply?role=${role.slug}`}
                  className="group flex items-center justify-between gap-4 border-b border-white/10 py-5 transition-colors duration-[280ms] hover:border-white/25"
                >
                  <span className="font-display text-lg font-medium text-white/75 transition-colors duration-[280ms] group-hover:text-white">
                    {role.title}
                  </span>
                  <span className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.14em] text-white/55 transition-colors duration-[280ms] group-hover:text-spark">
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
        </div>
      </Reveal>
    </section>
  );
}
