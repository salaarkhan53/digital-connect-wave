import Image from 'next/image';
import Link from 'next/link';
import { asset } from '@/lib/asset';

/**
 * The lockup is assembled rather than shipped as one image: the mark is the
 * brand PNG, the wordmark is live text. That keeps it crisp at every size and
 * lets it invert for the light sections, which a flat PNG of black type cannot.
 *
 * Swap in an official SVG lockup here if one is supplied.
 */
export function Wordmark({
  tone = 'dark',
  className = '',
  href = '/',
}: {
  /** `dark` = placed on the dark canvas; `light` = placed on white. */
  tone?: 'dark' | 'light';
  className?: string;
  href?: string | null;
}) {
  const inner = (
    <span className={`flex items-center gap-2.5 ${className}`}>
      <Image
        src={asset("/brand/symbol-sm.webp")}
        alt=""
        width={320}
        height={196}
        priority
        className="h-8 w-auto shrink-0 sm:h-9"
        aria-hidden="true"
      />
      <span className="flex flex-col leading-none">
        <span className="font-display text-[0.9rem] font-bold tracking-[-0.01em] sm:text-base">
          <span className={tone === 'dark' ? 'text-white' : 'text-ink'}>DIGITAL</span>{' '}
          <span className="text-blue-bright">CONNECT WAVE</span>
        </span>
        <span
          className={`mt-1 hidden text-[0.5625rem] font-medium uppercase tracking-[0.18em] sm:block ${
            tone === 'dark' ? 'text-white/55' : 'text-muted'
          }`}
        >
          Connecting Tomorrow&apos;s Possibilities
        </span>
      </span>
    </span>
  );

  if (!href) return inner;

  return (
    // No aria-label here: the visible wordmark text is the accessible name.
    // An aria-label that does not contain the visible text fails WCAG 2.5.3.
    <Link href={href} className="inline-flex rounded-lg">
      {inner}
    </Link>
  );
}
