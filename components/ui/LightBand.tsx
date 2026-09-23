import type { ComponentPropsWithoutRef } from 'react';
import { ParticleField } from '@/components/art/ParticleField';

/**
 * A white editorial band with the interactive dot field behind it.
 *
 * Every plain white section on the site goes through here rather than writing
 * `band-light` directly, so the field is defined once and none of them can end
 * up with it missing or doubled. It takes whatever a `<section>` takes.
 *
 * `isolate` matters: the field sits at `-z-10` inside this stacking context,
 * which puts it behind the band's own content but keeps it from falling
 * behind the band's background.
 */
export function LightBand({
  className = '',
  children,
  ...props
}: ComponentPropsWithoutRef<'section'>) {
  return (
    <section className={`band-light relative isolate ${className}`} {...props}>
      <ParticleField tone="light" />
      {children}
    </section>
  );
}
