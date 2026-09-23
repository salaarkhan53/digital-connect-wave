'use client';

import { ArrowUp } from 'lucide-react';
import { prefersReducedMotion } from '@/lib/motion';

/**
 * Returns to the top through the Lenis instance when one is running, so the
 * page eases rather than two animations fighting over the scroll position.
 * Falls back to the native call when smooth scrolling is off.
 */
export function BackToTop() {
  const toTop = () => {
    const lenis = window.__lenis;
    if (lenis) {
      lenis.scrollTo(0, { duration: 1.1 });
      return;
    }
    window.scrollTo({
      top: 0,
      behavior: prefersReducedMotion() ? 'auto' : 'smooth',
    });
  };

  return (
    <button
      type="button"
      onClick={toTop}
      className="group inline-flex min-h-[44px] cursor-pointer items-center gap-2.5 rounded-full border border-white/12 px-4 py-2.5 text-xs font-medium uppercase tracking-[0.14em] text-white/55 transition-[color,border-color,background-color] duration-[280ms] [transition-timing-function:cubic-bezier(0.16,1,0.3,1)] hover:border-spark/50 hover:bg-white/[0.04] hover:text-white"
    >
      Back to top
      <ArrowUp
        className="size-3.5 transition-transform duration-[280ms] [transition-timing-function:cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-0.5 motion-reduce:transition-none"
        strokeWidth={2.5}
        aria-hidden="true"
      />
    </button>
  );
}
