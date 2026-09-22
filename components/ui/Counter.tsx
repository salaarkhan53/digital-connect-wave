'use client';

import { useRef, useState } from 'react';
import { gsap, useGSAP } from '@/lib/gsap';
import { prefersReducedMotion } from '@/lib/motion';

/**
 * Counts up to `value` once the element scrolls into view.
 *
 * The final value is what renders on the server and what a reduced-motion or
 * no-JS visitor sees, so the number is never missing — only the animation is.
 */
export function Counter({
  value,
  decimals = 0,
  prefix = '',
  suffix = '',
  className = '',
}: {
  value: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const [display, setDisplay] = useState(() => value.toFixed(decimals));

  useGSAP(
    () => {
      const el = ref.current;
      if (!el || prefersReducedMotion()) return;

      const counter = { n: 0 };
      const tween = gsap.to(counter, {
        n: value,
        duration: 1.8,
        ease: 'power2.out',
        onUpdate: () => setDisplay(counter.n.toFixed(decimals)),
        scrollTrigger: { trigger: el, start: 'top 90%', once: true },
      });

      return () => {
        tween.kill();
      };
    },
    { scope: ref, dependencies: [value, decimals] },
  );

  return (
    <span ref={ref} className={className}>
      {prefix}
      {display}
      {suffix}
    </span>
  );
}
