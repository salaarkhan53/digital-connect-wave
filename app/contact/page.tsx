import type { Metadata } from 'next';
import { Suspense } from 'react';
import { Mail, MapPin, Phone } from 'lucide-react';
import { contact } from '@/content/contact';
import { PageHero } from '@/components/ui/PageHero';
import { Reveal } from '@/components/ui/Reveal';
import { ContactForm } from '@/components/contact/ContactForm';

export const metadata: Metadata = {
  title: 'Contact',
  description: `Talk to Digital Connect Wave. Call ${contact.phoneDisplay}, email ${contact.email}, or send the campaign details and we will come back within one working day.`,
};

export default function ContactPage() {
  const mapSrc = `https://www.google.com/maps?q=${encodeURIComponent(contact.mapQuery)}&output=embed`;

  return (
    <>
      <PageHero
        eyebrow="Contact"
        title="Tell us what needs running."
        lede="The more you can tell us about volume, hours and the standard you are held to, the more useful our first answer will be."
      />

      <section className="band-light">
        <Reveal className="shell section">
          <div className="grid gap-10 lg:grid-cols-[1.3fr_1fr] lg:gap-16">
            <div data-reveal>
              {/* The form reads the savings-calculator params from the URL. */}
              <Suspense
                fallback={
                  <div className="h-[32rem] rounded-2xl border border-[color:var(--color-hairline)] bg-white" />
                }
              >
                <ContactForm />
              </Suspense>
            </div>

            <div data-reveal className="space-y-4 lg:self-start">
              <a
                href={contact.phoneHref}
                className="group flex items-start gap-4 rounded-2xl border border-[color:var(--color-hairline)] bg-white p-6 transition-[border-color] duration-[280ms] hover:border-blue/45"
              >
                <span
                  className="flex size-11 shrink-0 items-center justify-center rounded-xl border border-blue/20 bg-blue/[0.07] text-blue-ink"
                  aria-hidden="true"
                >
                  <Phone className="size-5" strokeWidth={1.5} />
                </span>
                <span>
                  <span className="block font-display text-base font-medium text-ink">Call us</span>
                  <span className="mt-1 block text-sm text-muted">{contact.phoneDisplay}</span>
                </span>
              </a>

              <a
                href={`mailto:${contact.email}`}
                className="group flex items-start gap-4 rounded-2xl border border-[color:var(--color-hairline)] bg-white p-6 transition-[border-color] duration-[280ms] hover:border-blue/45"
              >
                <span
                  className="flex size-11 shrink-0 items-center justify-center rounded-xl border border-blue/20 bg-blue/[0.07] text-blue-ink"
                  aria-hidden="true"
                >
                  <Mail className="size-5" strokeWidth={1.5} />
                </span>
                <span className="min-w-0">
                  <span className="block font-display text-base font-medium text-ink">Email us</span>
                  <span className="mt-1 block break-all text-sm text-muted">{contact.email}</span>
                </span>
              </a>

              <div className="flex items-start gap-4 rounded-2xl border border-[color:var(--color-hairline)] bg-white p-6">
                <span
                  className="flex size-11 shrink-0 items-center justify-center rounded-xl border border-blue/20 bg-blue/[0.07] text-blue-ink"
                  aria-hidden="true"
                >
                  <MapPin className="size-5" strokeWidth={1.5} />
                </span>
                <div>
                  <p className="font-display text-base font-medium text-ink">Headquarters</p>
                  <address className="mt-1 text-sm not-italic leading-relaxed text-muted body-justify">
                    {contact.addressLines.map((line) => (
                      <span key={line} className="block">
                        {line}
                      </span>
                    ))}
                  </address>
                </div>
              </div>

              <div className="overflow-hidden rounded-2xl border border-[color:var(--color-hairline)]">
                <iframe
                  src={mapSrc}
                  title={`Map showing ${contact.addressOneLine}`}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="block h-64 w-full border-0"
                />
              </div>
            </div>
          </div>
        </Reveal>
      </section>
    </>
  );
}
