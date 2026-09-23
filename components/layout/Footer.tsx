import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight, Mail, MapPin, Phone } from 'lucide-react';
import { footerNav, site, socials } from '@/content/site';
import { contact } from '@/content/contact';
import { Wordmark } from '@/components/brand/Wordmark';
import { BackToTop } from '@/components/layout/BackToTop';
import { Reveal } from '@/components/ui/Reveal';
import { asset } from '@/lib/asset';

/**
 * The three ways to reach us, as a row rather than a stacked list.
 *
 * Stacked, they made the left column roughly twice the height of the link
 * columns beside it, and that mismatch is what left the band of dead space
 * across the bottom of the footer. Spread across the full width they balance
 * the grid and read as the primary action they actually are.
 */
const channels = [
  {
    icon: Phone,
    label: 'Call the floor',
    value: contact.phoneDisplay,
    href: contact.phoneHref,
    note: 'Weekdays, US hours',
  },
  {
    icon: Mail,
    label: 'Email us',
    value: contact.email,
    href: `mailto:${contact.email}`,
    note: 'Answered within one working day',
  },
  {
    icon: MapPin,
    label: 'Headquarters',
    value: contact.addressLines[0],
    href: null,
    note: contact.addressLines[1],
  },
];

const cardShell =
  'group flex h-full items-start gap-4 rounded-2xl border border-white/10 bg-white/[0.025] p-4 sm:p-5 ' +
  'transition-[border-color,background-color,transform] duration-[280ms] ' +
  '[transition-timing-function:cubic-bezier(0.16,1,0.3,1)]';

export function Footer() {
  return (
    <footer className="relative isolate overflow-hidden border-t border-white/10 bg-surface/40">
      {/*
        A brand-coloured light travelling along the top edge. The footer also
        carries a border and a slightly lifted background: without them it sat
        dark-on-dark under any page ending in a dark section, and the boundary
        disappeared entirely.
      */}
      <div className="relative h-px w-full overflow-hidden bg-white/10" aria-hidden="true">
        <span className="footer-sweep absolute inset-y-0 w-1/3 bg-gradient-to-r from-transparent via-spark to-transparent" />
      </div>

      {/* The mark as texture, anchored right so it never sits behind a block of
          text and never dictates how tall the footer has to be. */}
      <Image
        src={asset('/brand/symbol-bg.webp')}
        alt=""
        width={480}
        height={296}
        aria-hidden="true"
        className="pointer-events-none absolute -right-28 -top-20 -z-10 w-[min(44rem,85%)] max-w-none opacity-[0.06] select-none"
      />
      <div className="mesh-field absolute inset-0 -z-20 opacity-50" aria-hidden="true" />

      <Reveal className="shell py-10 md:py-12">
        {/* ------------------------------------------------- contact strip */}
        <ul className="grid gap-3 sm:grid-cols-3">
          {channels.map((channel) => {
            const Icon = channel.icon;
            const inner = (
              <>
                <span
                  className="flex size-11 shrink-0 items-center justify-center rounded-xl border border-blue/25 bg-blue/10 text-blue-bright transition-colors duration-[280ms] group-hover:border-spark/50 group-hover:bg-spark/15 group-hover:text-spark"
                  aria-hidden="true"
                >
                  <Icon className="size-5" strokeWidth={1.5} />
                </span>

                <span className="min-w-0 flex-1">
                  <span className="flex items-center gap-1.5 text-[0.6875rem] font-medium uppercase tracking-[0.16em] text-white/45">
                    {channel.label}
                    {channel.href && (
                      <ArrowUpRight
                        className="size-3 -translate-x-1 opacity-0 transition-all duration-[280ms] group-hover:translate-x-0 group-hover:opacity-100 motion-reduce:transition-none"
                        strokeWidth={2.5}
                        aria-hidden="true"
                      />
                    )}
                  </span>
                  <span className="mt-1.5 block truncate font-display text-[0.95rem] font-medium text-white">
                    {channel.value}
                  </span>
                  <span className="mt-0.5 block truncate text-xs text-white/45">
                    {channel.note}
                  </span>
                </span>
              </>
            );

            return (
              <li key={channel.label} data-reveal>
                {channel.href ? (
                  <a
                    href={channel.href}
                    className={`${cardShell} hover:-translate-y-0.5 hover:border-spark/40 hover:bg-white/[0.05] motion-reduce:hover:translate-y-0`}
                  >
                    {inner}
                  </a>
                ) : (
                  <div className={cardShell}>{inner}</div>
                )}
              </li>
            );
          })}
        </ul>

        {/* --------------------------------------------- brand + navigation */}
        <div className="mt-10 grid gap-10 lg:grid-cols-[1.1fr_2fr] lg:gap-14">
          <div data-reveal>
            <Wordmark />
            <p className="mt-5 max-w-xs text-sm leading-relaxed text-white/50">
              Contact operations for US brands, built on documented process and
              recorded QA.
            </p>

            <Link
              href="/contact"
              className="group mt-6 inline-flex min-h-[44px] items-center gap-2 text-sm font-medium text-spark"
            >
              Start a conversation
              <ArrowUpRight
                className="size-4 transition-transform duration-[280ms] [transition-timing-function:cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 motion-reduce:transition-none"
                strokeWidth={2}
                aria-hidden="true"
              />
            </Link>
          </div>

          <nav aria-label="Footer" className="grid grid-cols-2 gap-x-6 gap-y-8 sm:grid-cols-3 sm:gap-8">
            {footerNav.map((group, i) => {
              // Three groups in two mobile columns leaves the last one alone on
              // its own row with an empty half beside it. The odd one out spans
              // the full width and lays its own links out two-up instead.
              const orphan = i === footerNav.length - 1 && footerNav.length % 2 === 1;
              return (
              <div
                key={group.title}
                data-reveal
                className={orphan ? 'col-span-2 sm:col-span-1' : undefined}
              >
                <h2 className="font-display text-[0.6875rem] font-medium uppercase tracking-[0.16em] text-white/45">
                  {group.title}
                </h2>
                <ul
                  className={`mt-3.5 space-y-0.5 ${
                    orphan ? 'grid grid-cols-2 gap-x-6 sm:block' : ''
                  }`}
                >
                  {group.links.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="group inline-flex items-center gap-1.5 py-1 text-sm text-white/65 transition-colors duration-[160ms] hover:text-white"
                      >
                        {/* A dash that grows into the link on hover. */}
                        <span
                          className="h-px w-0 bg-spark transition-[width] duration-[280ms] [transition-timing-function:cubic-bezier(0.16,1,0.3,1)] group-hover:w-3 motion-reduce:transition-none"
                          aria-hidden="true"
                        />
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              );
            })}
          </nav>
        </div>

        {/* ------------------------------------------------------ bottom bar */}
        <div className="mt-10 flex flex-col gap-5 border-t border-white/10 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-white/45">
            &copy; {new Date().getFullYear()} {site.name}. All rights reserved.
          </p>

          <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
            <p className="font-display text-[0.6875rem] uppercase tracking-[0.16em] text-white/35">
              {site.tagline}
            </p>

            {/* Empty until real profile URLs exist — see content/site.ts. */}
            {socials.length > 0 && (
              <ul className="flex gap-2">
                {socials.map((s) => (
                  <li key={s.href}>
                    <a
                      href={s.href}
                      aria-label={s.label}
                      className="flex size-9 items-center justify-center rounded-full border border-white/12 text-white/55 transition-colors duration-[160ms] hover:border-spark/50 hover:text-spark"
                    >
                      {s.label.charAt(0)}
                    </a>
                  </li>
                ))}
              </ul>
            )}

            <BackToTop />
          </div>
        </div>
      </Reveal>
    </footer>
  );
}
