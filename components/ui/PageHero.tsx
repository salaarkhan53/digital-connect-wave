import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import type { ReactNode } from 'react';
import { Reveal } from '@/components/ui/Reveal';

/** The dark masthead every inner page opens with. */
export function PageHero({
  eyebrow,
  title,
  lede,
  breadcrumb,
  children,
}: {
  eyebrow?: string;
  title: string;
  lede?: ReactNode;
  breadcrumb?: { label: string; href: string }[];
  children?: ReactNode;
}) {
  return (
    <section className="relative isolate overflow-hidden border-b border-white/10 bg-void pt-[var(--header-h)]">
      <div className="mesh-field absolute inset-0 -z-20" aria-hidden="true" />
      <div
        className="grid-lines absolute inset-0 -z-20 opacity-50 [mask-image:radial-gradient(60%_70%_at_30%_0%,#000,transparent)]"
        aria-hidden="true"
      />

      <Reveal className="shell py-16 md:py-24">
        {breadcrumb && breadcrumb.length > 0 && (
          <nav data-reveal aria-label="Breadcrumb" className="mb-8">
            <ol className="flex flex-wrap items-center gap-1.5 text-xs text-white/55">
              {breadcrumb.map((crumb) => (
                <li key={crumb.href} className="flex items-center gap-1.5">
                  <Link
                    href={crumb.href}
                    className="transition-colors duration-[160ms] hover:text-spark"
                  >
                    {crumb.label}
                  </Link>
                  <ChevronRight className="size-3" strokeWidth={2} aria-hidden="true" />
                </li>
              ))}
              <li className="text-white/70">{title}</li>
            </ol>
          </nav>
        )}

        {eyebrow && (
          <p
            data-reveal
            className="flex items-center gap-2.5 text-xs font-medium uppercase tracking-[0.18em] text-spark/80"
          >
            <span className="h-px w-6 bg-spark/50" aria-hidden="true" />
            {eyebrow}
          </p>
        )}

        <h1
          data-reveal
          className="mt-5 max-w-4xl text-[length:var(--text-h1)] font-semibold text-white"
        >
          {title}
        </h1>

        {lede && (
          <p
            data-reveal
            className="mt-6 max-w-2xl text-[length:var(--text-lede)] leading-relaxed text-white/55"
          >
            {lede}
          </p>
        )}

        {children && <div data-reveal className="mt-9">{children}</div>}
      </Reveal>
    </section>
  );
}
