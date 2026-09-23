import { MapPin } from 'lucide-react';
import { contact } from '@/content/contact';
import { Reveal } from '@/components/ui/Reveal';
import { SectionHeading } from '@/components/ui/SectionHeading';

/**
 * US coverage, shown as time zones rather than as a map.
 *
 * A decorative map would only mark one pin — the Sheridan office — which says
 * nothing a visitor needs. What a buyer actually wants to know is whether the
 * desk is staffed when their customers call, so the section answers that.
 */
const zones = [
  { code: 'PT', name: 'Pacific', offset: -8 },
  { code: 'MT', name: 'Mountain', offset: -7 },
  { code: 'CT', name: 'Central', offset: -6 },
  { code: 'ET', name: 'Eastern', offset: -5 },
];

/** Staffed window, expressed in Eastern time and shifted per zone. */
const WINDOW_ET = { start: 8, end: 21 };
const ET_OFFSET = -5;

export function Coverage() {
  return (
    <section className="relative isolate overflow-hidden bg-void" aria-labelledby="coverage-heading">
      <div className="mesh-field absolute inset-0 -z-10 opacity-70" aria-hidden="true" />

      <Reveal className="shell section">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.1fr] lg:items-center lg:gap-16">
          <div>
            <SectionHeading
              tone="dark"
              eyebrow="Coverage"
              title={<span id="coverage-heading">Staffed across every US time zone.</span>}
              lede="Your customers do not all call at the same hour, and a desk that only covers one coast is a desk that misses half of them."
            />

            <div
              data-reveal
              className="mt-10 flex items-start gap-3.5 rounded-2xl border border-white/10 bg-surface/60 p-5"
            >
              <MapPin className="mt-0.5 size-5 shrink-0 text-blue-bright" strokeWidth={1.5} aria-hidden="true" />
              <div>
                <p className="font-display text-sm font-medium text-white">Headquarters</p>
                <address className="mt-1 text-sm not-italic leading-relaxed text-white/55 body-justify">
                  {contact.addressLines.map((line) => (
                    <span key={line} className="block">
                      {line}
                    </span>
                  ))}
                </address>
              </div>
            </div>
          </div>

          {/* --------------------------------------------- time zone bars */}
          <ul data-reveal className="space-y-3.5" aria-label="Staffed hours by time zone">
            {zones.map((zone, i) => {
              // Same staffed window everywhere, expressed on each zone's own
              // clock: Eastern is the reference, so shift by the difference.
              const shift = zone.offset - ET_OFFSET;
              const localStart = WINDOW_ET.start + shift;
              const localEnd = WINDOW_ET.end + shift;
              const left = (localStart / 24) * 100;
              const width = ((localEnd - localStart) / 24) * 100;

              return (
                <li key={zone.code}>
                  <div className="flex items-baseline justify-between gap-4 text-sm">
                    <span className="font-display font-medium text-white">
                      {zone.name}{' '}
                      <span className="text-white/55">{zone.code}</span>
                    </span>
                    <span className="tabular-nums text-white/55">
                      {formatHour(localStart)} – {formatHour(localEnd)}
                    </span>
                  </div>

                  <div className="relative mt-2 h-2.5 overflow-hidden rounded-full bg-white/[0.07]">
                    <span
                      className="absolute inset-y-0 rounded-full bg-gradient-to-r from-blue to-spark"
                      style={{
                        left: `${left}%`,
                        width: `${width}%`,
                        // Each bar wipes in a beat after the one above it.
                        animation: `coverage-wipe 900ms cubic-bezier(0.16,1,0.3,1) ${i * 110}ms both`,
                      }}
                      aria-hidden="true"
                    />
                  </div>
                </li>
              );
            })}

            <li className="pt-3 text-xs text-white/55">
              Local staffed window per zone. Extended and overnight coverage is
              available per campaign.
            </li>
          </ul>
        </div>
      </Reveal>
    </section>
  );
}

function formatHour(h: number) {
  const hour = ((h % 24) + 24) % 24;
  const suffix = hour >= 12 ? 'pm' : 'am';
  const display = hour % 12 === 0 ? 12 : hour % 12;
  return `${display}${suffix}`;
}
