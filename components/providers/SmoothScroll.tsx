'use client';

import { useEffect } from 'react';
import Lenis from 'lenis';
import { ScrollTrigger, gsap } from '@/lib/gsap';
import { prefersReducedMotion } from '@/lib/motion';

/**
 * Lenis smooth scrolling, driven by GSAP's ticker so scroll-linked animation
 * and the scroll position can never drift apart.
 *
 * This enhances native scroll rather than replacing it: the wheel, keyboard,
 * scrollbar and anchor jumps all keep working, and the whole thing is skipped
 * for reduced-motion users and on touch devices, where native momentum is
 * better than anything we would simulate.
 */
declare global {
  interface Window {
    __lenis?: Lenis;
  }
}

export function SmoothScroll() {
  useEffect(() => {
    if (prefersReducedMotion()) return;

    const lenis = new Lenis({
      duration: 1.05,
      // Gentle exponential glide; long enough to feel smooth, short enough
      // that the page never feels like it is ignoring the wheel.
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      // Native momentum on touch beats a simulated one.
      syncTouch: false,
    });

    lenis.on('scroll', ScrollTrigger.update);

    // Published so in-page controls (back to top, anchor jumps) can drive the
    // same instance. Calling window.scrollTo while Lenis is running fights it —
    // two things animating one scroll position.
    window.__lenis = lenis;

    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(tick);
      delete window.__lenis;
      lenis.destroy();
    };
  }, []);

  return null;
}
