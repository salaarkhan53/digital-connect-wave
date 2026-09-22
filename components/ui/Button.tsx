'use client';

import Link from 'next/link';
import { useRef, type ReactNode } from 'react';
import { ArrowRight } from 'lucide-react';
import { gsap, useGSAP } from '@/lib/gsap';
import { duration, ease, prefersReducedMotion } from '@/lib/motion';

type Variant = 'primary' | 'ghost' | 'light';

const base =
  'group relative inline-flex min-h-[44px] items-center justify-center gap-2 rounded-full ' +
  'px-6 py-3 text-[0.9375rem] font-medium cursor-pointer select-none ' +
  'transition-[background-color,color,border-color,box-shadow] duration-[280ms] ' +
  '[transition-timing-function:cubic-bezier(0.16,1,0.3,1)]';

const variants: Record<Variant, string> = {
  primary:
    'bg-blue text-white shadow-[0_0_0_0_rgb(46_168_255/0.5)] ' +
    'hover:bg-blue-bright hover:shadow-[0_8px_30px_-6px_rgb(46_168_255/0.55)]',
  ghost:
    'border border-white/20 text-white hover:border-spark/70 hover:bg-white/[0.06]',
  light:
    'border border-[color:var(--color-hairline)] bg-white text-ink hover:border-blue hover:text-blue-ink',
};

/**
 * Magnetic CTA. The button leans toward the cursor within its own bounds —
 * enough to feel responsive, small enough that it never fights the pointer.
 * Disabled entirely for touch pointers and reduced-motion users.
 */
export function Button({
  href,
  children,
  variant = 'primary',
  icon = true,
  className = '',
  magnetic = true,
  ...rest
}: {
  href: string;
  children: ReactNode;
  variant?: Variant;
  icon?: boolean;
  className?: string;
  magnetic?: boolean;
} & Omit<React.ComponentProps<typeof Link>, 'href' | 'className' | 'children'>) {
  const ref = useRef<HTMLAnchorElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el || !magnetic) return;
      if (prefersReducedMotion()) return;
      if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

      const quickX = gsap.quickTo(el, 'x', { duration: 0.5, ease: 'power3.out' });
      const quickY = gsap.quickTo(el, 'y', { duration: 0.5, ease: 'power3.out' });

      const onMove = (e: PointerEvent) => {
        const r = el.getBoundingClientRect();
        // Pull is capped at ~22% of the button's own size.
        quickX((e.clientX - (r.left + r.width / 2)) * 0.22);
        quickY((e.clientY - (r.top + r.height / 2)) * 0.22);
      };
      const onLeave = () => {
        quickX(0);
        quickY(0);
      };

      el.addEventListener('pointermove', onMove);
      el.addEventListener('pointerleave', onLeave);
      return () => {
        el.removeEventListener('pointermove', onMove);
        el.removeEventListener('pointerleave', onLeave);
      };
    },
    { scope: ref },
  );

  return (
    <Link
      ref={ref}
      href={href}
      className={`${base} ${variants[variant]} ${className}`}
      {...rest}
    >
      <span>{children}</span>
      {icon && (
        <ArrowRight
          className="size-4 transition-transform duration-[280ms] [transition-timing-function:cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-1"
          strokeWidth={2}
          aria-hidden="true"
        />
      )}
    </Link>
  );
}

/** Non-navigating variant, for the calculator and form actions. */
export function ActionButton({
  children,
  variant = 'primary',
  className = '',
  ...rest
}: {
  children: ReactNode;
  variant?: Variant;
  className?: string;
} & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={`${base} ${variants[variant]} ${className}`}
      style={{ transitionDuration: `${duration.normal}s`, transitionTimingFunction: ease.cssOut }}
      {...rest}
    >
      {children}
    </button>
  );
}
