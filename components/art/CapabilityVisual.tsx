import Image from 'next/image';
import type { Capability } from '@/content/types';
import { Icon } from '@/components/ui/Icon';
import { asset } from '@/lib/asset';

/**
 * The visual for a capability.
 *
 * Renders supplied artwork where it exists and a generated brand panel where
 * it does not, so every capability has something deliberate rather than an
 * empty box. The fallback is built from the capability's own icon, which keeps
 * each one distinguishable without inventing imagery for it.
 *
 * Decorative in every position it is used: the capability name is always set
 * as text beside it.
 */
export function CapabilityVisual({
  capability,
  index,
  sizes = '(min-width: 1024px) 34rem, 90vw',
  priority = false,
}: {
  capability: Capability;
  index: number;
  sizes?: string;
  priority?: boolean;
}) {
  if (capability.image) {
    return (
      <>
        <Image
          src={asset(capability.image)}
          alt=""
          fill
          sizes={sizes}
          priority={priority}
          className="object-cover"
        />
        <div
          className="absolute inset-0 bg-gradient-to-t from-void/70 via-void/10 to-transparent"
          aria-hidden="true"
        />
      </>
    );
  }

  // Each capability lands on its own point of the brand's blue range.
  const hue = 204 + ((index * 13) % 28);

  return (
    <div className="absolute inset-0 overflow-hidden bg-void" aria-hidden="true">
      <div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(75% 65% at 50% 32%, hsl(${hue} 95% 48% / 0.42), transparent 72%),
                       radial-gradient(50% 50% at 88% 92%, hsl(${hue + 18} 100% 62% / 0.22), transparent 70%)`,
        }}
      />
      <div className="grid-lines absolute inset-0 opacity-50" />

      {/* Concentric rings behind the mark, echoing the logo's signal waves. */}
      <svg
        className="absolute left-1/2 top-1/2 w-[86%] -translate-x-1/2 -translate-y-1/2 opacity-40"
        viewBox="0 0 100 100"
        fill="none"
      >
        {[22, 32, 42].map((r) => (
          <circle
            key={r}
            cx="50"
            cy="50"
            r={r}
            stroke={`hsl(${hue + 20} 100% 76%)`}
            strokeWidth="0.35"
            strokeDasharray="1.4 2.6"
          />
        ))}
      </svg>

      {/* The capability's own icon, large enough to read as artwork. */}
      <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-spark/80 drop-shadow-[0_0_38px_rgb(46_168_255/0.55)]">
        <Icon name={capability.icon} className="size-24 sm:size-28" strokeWidth={1} />
      </span>

      <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-void to-transparent" />
    </div>
  );
}
