'use client';

import { useRef, type ElementType, type ReactNode } from 'react';
import { gsap, ScrollTrigger, useGSAP } from '@/lib/gsap';
import { duration, ease, revealStart, stagger } from '@/lib/motion';

/**
 * The standard scroll reveal: children fade and rise once on enter.
 *
 * Children are hidden by CSS only when JS is present and only inside this
 * component's own [data-reveal-root], so without JavaScript — or in a section
 * that forgot to wrap its content — everything renders plainly rather than
 * vanishing. Under reduced motion the tween is skipped and the final state is
 * set immediately.
 */
export function Reveal({
  children,
  as: Tag = 'div',
  className = '',
  delay = 0,
  each = stagger.normal,
  y = 24,
  once = true,
}: {
  children: ReactNode;
  as?: ElementType;
  className?: string;
  delay?: number;
  each?: number;
  y?: number;
  once?: boolean;
}) {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;

      const targets = gsap.utils.toArray<HTMLElement>('[data-reveal]', el);
      if (!targets.length) return;

      const mm = gsap.matchMedia();

      mm.add(
        {
          motion: '(prefers-reduced-motion: no-preference)',
          reduced: '(prefers-reduced-motion: reduce)',
        },
        (ctx) => {
          const { reduced } = ctx.conditions as { reduced: boolean };

          if (reduced) {
            gsap.set(targets, { opacity: 1, y: 0 });
            targets.forEach((t) => t.classList.add('is-in'));
            return;
          }

          gsap.fromTo(
            targets,
            { opacity: 0, y },
            {
              opacity: 1,
              y: 0,
              duration: duration.slow,
              ease: ease.out,
              delay,
              stagger: each,
              // Clear the inline opacity once done so .is-in holds the state.
              onStart: () => targets.forEach((t) => t.classList.add('is-in')),
              scrollTrigger: {
                trigger: el,
                start: revealStart,
                toggleActions: once ? 'play none none none' : 'play none none reverse',
                once,
              },
            },
          );
        },
      );

      return () => mm.revert();
    },
    { scope: ref },
  );

  return (
    // @ts-expect-error -- polymorphic ref, narrowed by the caller's `as`
    <Tag ref={ref} className={className} data-reveal-root="">
      {children}
    </Tag>
  );
}

/** Re-measure after fonts and art settle, so pinned sections start correctly. */
export function useScrollRefresh() {
  useGSAP(() => {
    const refresh = () => ScrollTrigger.refresh();
    if (document.fonts?.ready) void document.fonts.ready.then(refresh);
    window.addEventListener('load', refresh, { once: true });
    return () => window.removeEventListener('load', refresh);
  }, []);
}
