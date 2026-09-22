import Image from 'next/image';
import Link from 'next/link';
import { Mail, MapPin, Phone } from 'lucide-react';
import { footerNav, site, socials } from '@/content/site';
import { contact } from '@/content/contact';
import { Wordmark } from '@/components/brand/Wordmark';

export function Footer() {
  return (
    <footer className="relative isolate overflow-hidden border-t border-white/10 bg-void">
      {/* The mark, enormous and barely there, bleeding off the bottom edge. */}
      <Image
        src="/brand/mark.webp"
        alt=""
        width={1200}
        height={648}
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-24 left-1/2 -z-10 w-[min(72rem,140%)] max-w-none -translate-x-1/2 opacity-[0.07] select-none"
      />

      <div className="shell py-16 md:py-20">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_2fr]">
          <div>
            <Wordmark />
            <p className="mt-6 max-w-sm text-sm leading-relaxed text-white/55">
              {site.description}
            </p>

            <ul className="mt-8 space-y-3 text-sm">
              <li>
                <a
                  href={contact.phoneHref}
                  className="inline-flex min-h-[44px] items-center gap-3 text-white/75 transition-colors duration-[160ms] hover:text-spark"
                >
                  <Phone className="size-4 shrink-0 text-blue-bright" strokeWidth={1.5} aria-hidden="true" />
                  {contact.phoneDisplay}
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${contact.email}`}
                  className="inline-flex min-h-[44px] items-center gap-3 break-all text-white/75 transition-colors duration-[160ms] hover:text-spark"
                >
                  <Mail className="size-4 shrink-0 text-blue-bright" strokeWidth={1.5} aria-hidden="true" />
                  {contact.email}
                </a>
              </li>
              <li className="flex items-start gap-3 py-2 text-white/55">
                <MapPin className="mt-0.5 size-4 shrink-0 text-blue-bright" strokeWidth={1.5} aria-hidden="true" />
                <address className="not-italic leading-relaxed">
                  {contact.addressLines.map((line) => (
                    <span key={line} className="block">
                      {line}
                    </span>
                  ))}
                </address>
              </li>
            </ul>
          </div>

          <div className="grid gap-10 sm:grid-cols-3">
            {footerNav.map((group) => (
              <div key={group.title}>
                <h2 className="font-display text-xs font-medium uppercase tracking-[0.18em] text-white/55">
                  {group.title}
                </h2>
                <ul className="mt-4 space-y-1">
                  {group.links.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="inline-block py-1.5 text-sm text-white/65 transition-colors duration-[160ms] hover:text-white"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="rule-fade mt-14" />

        <div className="flex flex-col gap-4 pt-6 text-xs text-white/55 sm:flex-row sm:items-center sm:justify-between">
          <p>
            &copy; {new Date().getFullYear()} {site.name}. All rights reserved.
          </p>
          <p className="font-display tracking-[0.14em] uppercase text-white/55">
            {site.tagline}
          </p>
          {/* socials is intentionally empty until real profile URLs are supplied. */}
          {socials.length > 0 && (
            <ul className="flex gap-3">
              {socials.map((s) => (
                <li key={s.href}>
                  <a href={s.href} className="text-white/50 hover:text-spark" aria-label={s.label}>
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </footer>
  );
}
