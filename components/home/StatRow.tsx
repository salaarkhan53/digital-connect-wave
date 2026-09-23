import { stats } from '@/content/stats';
import { Counter } from '@/components/ui/Counter';
import { Reveal } from '@/components/ui/Reveal';
import { LightBand } from '@/components/ui/LightBand';

/**
 * The headline figures. Scroll-snapped horizontally on small screens so the
 * row never forces the page sideways, a plain grid from `md` up.
 *
 * REVIEW: every figure here is `verified: false`. See content/REVIEW.md.
 */
export function StatRow() {
  return (
    <LightBand aria-label="Key figures">
      <Reveal className="shell section">
        <ul
          className="-mx-[var(--gutter)] flex snap-x snap-mandatory gap-4 overflow-x-auto px-[var(--gutter)] pb-4 md:mx-0 md:grid md:grid-cols-3 md:gap-6 md:overflow-visible md:px-0 md:pb-0 lg:grid-cols-5"
        >
          {stats.map((stat) => (
            <li
              key={stat.id}
              data-reveal
              className="group relative w-[15rem] shrink-0 snap-start overflow-hidden rounded-2xl border border-[color:var(--color-hairline)] bg-white p-6 transition-[border-color,box-shadow] duration-[280ms] [transition-timing-function:cubic-bezier(0.16,1,0.3,1)] hover:border-blue/40 hover:shadow-[0_18px_40px_-24px_rgb(12_123_240/0.5)] md:w-auto"
            >
              {/* A sliver of brand colour that grows on hover. */}
              <span
                className="absolute inset-x-0 top-0 h-[3px] origin-left scale-x-0 bg-gradient-to-r from-blue to-spark transition-transform duration-[620ms] [transition-timing-function:cubic-bezier(0.16,1,0.3,1)] group-hover:scale-x-100"
                aria-hidden="true"
              />

              <p className="font-display text-[clamp(2.25rem,1.8rem+1.6vw,3rem)] font-semibold leading-none text-ink">
                {stat.display ? (
                  stat.display
                ) : (
                  <Counter
                    value={stat.value}
                    decimals={stat.id === 'rating' ? 2 : 0}
                    prefix={stat.prefix}
                    suffix={stat.suffix}
                  />
                )}
              </p>
              <h3 className="mt-4 font-display text-sm font-medium text-ink">{stat.label}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-muted">{stat.detail}</p>
            </li>
          ))}
        </ul>
      </Reveal>
    </LightBand>
  );
}
