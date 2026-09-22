'use client';

import { useState } from 'react';
import { Pause, Play } from 'lucide-react';
import { industries } from '@/content/industries';
import { capabilities } from '@/content/capabilities';

const rowA = industries.map((i) => i.title);
const rowB = capabilities.map((c) => c.title);

function Row({
  items,
  reverse = false,
  paused,
}: {
  items: string[];
  reverse?: boolean;
  paused: boolean;
}) {
  return (
    <div className="flex overflow-hidden [mask-image:linear-gradient(to_right,transparent,#000_8%,#000_92%,transparent)]">
      {/* Two identical tracks so the loop has no visible seam. */}
      {[0, 1].map((copy) => (
        <ul
          key={copy}
          aria-hidden={copy === 1 ? 'true' : undefined}
          className={`flex shrink-0 items-center gap-10 pr-10 ${
            reverse ? 'animate-[marquee-rev_38s_linear_infinite]' : 'animate-[marquee_38s_linear_infinite]'
          } motion-reduce:animate-none`}
          style={{ animationPlayState: paused ? 'paused' : 'running' }}
        >
          {items.map((label) => (
            <li
              key={label}
              className="flex shrink-0 items-center gap-10 font-display text-lg font-medium whitespace-nowrap text-white/55 md:text-xl"
            >
              {label}
              <span className="size-1 rounded-full bg-blue-bright/50" aria-hidden="true" />
            </li>
          ))}
        </ul>
      ))}
    </div>
  );
}

/**
 * Decorative ticker of the verticals and services.
 *
 * It scrolls automatically, so it needs a way to stop: it pauses on hover and
 * on keyboard focus, exposes an explicit pause control, and renders completely
 * still under prefers-reduced-motion.
 */
export function ProofMarquee() {
  const [paused, setPaused] = useState(false);

  return (
    <section
      aria-label="Industries and services we cover"
      className="relative border-b border-white/10 bg-void py-10"
      onPointerEnter={() => setPaused(true)}
      onPointerLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
    >
      <div className="flex flex-col gap-5">
        <Row items={rowA} paused={paused} />
        <Row items={rowB} reverse paused={paused} />
      </div>

      <div className="shell mt-8 flex justify-center">
        <button
          type="button"
          onClick={() => setPaused((v) => !v)}
          aria-pressed={paused}
          className="inline-flex min-h-[44px] cursor-pointer items-center gap-2 rounded-full border border-white/12 px-4 py-2 text-xs font-medium text-white/50 transition-colors duration-[160ms] hover:border-white/25 hover:text-white/80"
        >
          {paused ? (
            <Play className="size-3.5" strokeWidth={2} aria-hidden="true" />
          ) : (
            <Pause className="size-3.5" strokeWidth={2} aria-hidden="true" />
          )}
          {paused ? 'Resume' : 'Pause'} scrolling
        </button>
      </div>
    </section>
  );
}
