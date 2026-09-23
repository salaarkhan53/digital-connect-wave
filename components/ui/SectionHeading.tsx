import type { ReactNode } from 'react';

/**
 * The single section header used across the site. Having exactly one means the
 * eyebrow/title/lede rhythm is identical on every page.
 */
export function SectionHeading({
  eyebrow,
  title,
  lede,
  tone = 'light',
  align = 'left',
  className = '',
  children,
}: {
  eyebrow?: string;
  title: ReactNode;
  lede?: ReactNode;
  /** `light` = on a white band, `dark` = on the void. */
  tone?: 'light' | 'dark';
  align?: 'left' | 'center';
  className?: string;
  children?: ReactNode;
}) {
  const dark = tone === 'dark';
  return (
    <div
      className={`${align === 'center' ? 'mx-auto max-w-3xl text-center' : 'max-w-3xl'} ${className}`}
    >
      {eyebrow && (
        <p
          data-reveal
          className={`flex items-center gap-2.5 text-xs font-medium uppercase tracking-[0.18em] ${
            align === 'center' ? 'justify-center' : ''
          } ${dark ? 'text-spark/80' : 'text-blue-ink'}`}
        >
          <span
            className={`h-px w-6 ${dark ? 'bg-spark/50' : 'bg-blue/40'}`}
            aria-hidden="true"
          />
          {eyebrow}
        </p>
      )}

      <h2
        data-reveal
        className={`mt-4 text-[length:var(--text-h2)] font-semibold ${
          dark ? 'text-white' : 'text-ink'
        }`}
      >
        {title}
      </h2>

      {lede && (
        <p
          data-reveal
          className={`mt-5 text-[length:var(--text-lede)] leading-relaxed ${
            align === 'center' ? '' : 'body-justify'
          } ${dark ? 'text-white/55' : 'text-muted'}`}
        >
          {lede}
        </p>
      )}

      {children}
    </div>
  );
}
