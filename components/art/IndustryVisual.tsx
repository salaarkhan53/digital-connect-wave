import Image from 'next/image';
import type { Industry } from '@/content/types';
import { MeshPanel } from '@/components/art/MeshPanel';
import { asset } from '@/lib/asset';

/**
 * The visual for a vertical.
 *
 * Uses the supplied photography where it exists and falls back to the
 * generated brand art otherwise, so a vertical without a photo degrades to
 * something deliberate instead of leaving a hole. Technology & SaaS is
 * currently the only one without.
 *
 * Decorative in every position it is used: the industry name is always
 * rendered as text beside it, so the alt stays empty rather than repeating it.
 */
export function IndustryVisual({
  industry,
  index,
  sizes = '(min-width: 1024px) 22rem, 100vw',
  priority = false,
}: {
  industry: Industry;
  /** Seeds the fallback art so neighbouring panels do not look identical. */
  index: number;
  sizes?: string;
  priority?: boolean;
}) {
  if (!industry.image) {
    return <MeshPanel seed={index} className="absolute inset-0" />;
  }

  return (
    <>
      <Image
        src={asset(industry.image)}
        alt=""
        fill
        sizes={sizes}
        priority={priority}
        className="object-cover"
      />
      {/* Sits the photograph on the brand palette and keeps any text above it
          legible, since the images vary in how bright their lower half is. */}
      <div
        className="absolute inset-0 bg-gradient-to-t from-void via-void/35 to-void/10"
        aria-hidden="true"
      />
      <div
        className="absolute inset-0 mix-blend-soft-light"
        style={{
          background:
            'radial-gradient(70% 60% at 50% 30%, rgb(12 123 240 / 0.45), transparent 75%)',
        }}
        aria-hidden="true"
      />
    </>
  );
}
