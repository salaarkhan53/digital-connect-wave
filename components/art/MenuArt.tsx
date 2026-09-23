import Image from 'next/image';
import { asset } from '@/lib/asset';

/**
 * Artwork for the mega-menu's featured tile.
 *
 * The tile used to be an empty bordered box with its label pinned to the
 * bottom, so the whole upper half read as a hole in the panel. This fills it
 * with the brand's own language rather than a stock image: a gradient field,
 * the wireframe mark, and waves rippling out of it — the "wave" the company is
 * named for, and the same signal glyph that sits inside the logo's right loop.
 *
 * Everything here is CSS and one already-loaded image. The panel is
 * `display: none` when closed, so none of the animation runs until a menu is
 * actually open.
 */
export function MenuArt({ seed = 0 }: { seed?: number }) {
  // Each menu gets its own point on the brand's blue range, so the panels are
  // distinguishable without any of them leaving the palette.
  const hue = 206 + ((seed * 17) % 26);

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      <div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(72% 58% at 50% 34%, hsl(${hue} 95% 50% / 0.34), transparent 72%),
                       radial-gradient(55% 55% at 88% 96%, hsl(${hue + 16} 100% 64% / 0.18), transparent 70%)`,
        }}
      />

      <div className="grid-lines absolute inset-0 opacity-50" />

      {/* Waves rippling outward, staggered so one is always mid-flight. */}
      <svg
        className="absolute left-1/2 top-[36%] w-[62%] -translate-x-1/2 -translate-y-1/2"
        viewBox="0 0 100 100"
        fill="none"
      >
        {[0, 1, 2].map((i) => (
          <circle
            key={i}
            cx="50"
            cy="50"
            r="16"
            stroke={`hsl(${hue + 20} 100% 72%)`}
            strokeWidth="0.9"
            className="menu-ripple"
            style={{ animationDelay: `${i * 1.3}s` }}
          />
        ))}
      </svg>

      {/* The mark itself, drifting slowly under the ripples. */}
      <Image
        src={asset('/brand/symbol-bg.webp')}
        alt=""
        width={480}
        height={296}
        className="menu-drift absolute left-1/2 top-[36%] w-[64%] max-w-none -translate-x-1/2 -translate-y-1/2 opacity-[0.3]"
      />

      {/* Fade the base of the tile so the label always sits on solid ground. */}
      <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-surface via-surface/85 to-transparent" />
    </div>
  );
}
