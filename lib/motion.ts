/**
 * One motion scale for the whole site.
 *
 * Using a single duration for every transition is the fastest way to make a
 * site feel synthetic, so these are graded by what the motion is doing:
 * feedback is fast, reveals are medium, scene changes are slow.
 */

export const duration = {
  /** Hover, press, focus — must feel instant. */
  fast: 0.16,
  /** State changes the eye should follow. */
  normal: 0.28,
  /** Entrances and reveals. */
  slow: 0.62,
  /** Full scene changes. */
  scene: 0.9,
} as const;

export const ease = {
  /** Default. Strong deceleration — reads as confident rather than bouncy. */
  out: 'expo.out',
  inOut: 'power2.inOut',
  /** For anything scrubbed by scroll position. */
  none: 'none',
  /** CSS equivalent of `ease.out`, for transitions we do not drive in JS. */
  cssOut: 'cubic-bezier(0.16, 1, 0.3, 1)',
} as const;

export const stagger = {
  tight: 0.04,
  normal: 0.08,
  loose: 0.12,
  /** Per-character, for headline splits. Anything larger reads as sluggish. */
  chars: 0.015,
} as const;

/** Shared reveal, matching the standard preset: y 24, power2.out, stagger 0.08. */
export const revealFrom = {
  opacity: 0,
  y: 24,
} as const;

export const revealTo = {
  opacity: 1,
  y: 0,
  duration: duration.slow,
  ease: ease.out,
} as const;

/** Where a reveal should fire relative to the viewport. */
export const revealStart = 'top 85%';

export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}
