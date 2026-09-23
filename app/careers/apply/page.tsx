import type { Metadata } from 'next';
import { Suspense } from 'react';
import { Check } from 'lucide-react';
import { contact } from '@/content/contact';
import { PageHero } from '@/components/ui/PageHero';
import { Reveal } from '@/components/ui/Reveal';
import { ApplicationForm } from '@/components/careers/ApplicationForm';

export const metadata: Metadata = {
  title: 'Apply',
  description:
    'Apply to Digital Connect Wave. Send your CV and we will come back to you about the campaign, the shift and the numbers.',
  // An application form has nothing to offer a search result.
  robots: { index: false, follow: true },
};

const whatHappens = [
  'We read it and come back to you, whether or not it is a yes.',
  'A short call about the campaign, the shift and the numbers.',
  'Campaign-specific training, completed before you go live.',
];

export default function ApplyPage() {
  return (
    <>
      <PageHero
        eyebrow="Careers"
        title="Apply to join the floor."
        lede="Send your CV and the basics. Freshers and experienced agents both have a route here."
        breadcrumb={[
          { label: 'Home', href: '/' },
          { label: 'Careers', href: '/careers' },
        ]}
      />

      <section className="band-light">
        <Reveal className="shell section">
          <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr] lg:gap-16">
            <div data-reveal>
              {/* The form reads the role from the URL, so it needs a boundary. */}
              <Suspense
                fallback={
                  <div className="h-[40rem] rounded-2xl border border-[color:var(--color-hairline)] bg-white" />
                }
              >
                <ApplicationForm />
              </Suspense>
            </div>

            <aside data-reveal className="lg:sticky lg:top-28 lg:self-start">
              <div className="rounded-2xl border border-[color:var(--color-hairline)] bg-mist p-6">
                <h2 className="font-display text-lg font-medium text-ink">
                  What happens next
                </h2>
                <ul className="mt-5 space-y-3.5">
                  {whatHappens.map((step) => (
                    <li key={step} className="flex items-start gap-3 text-sm text-muted">
                      <Check
                        className="mt-0.5 size-4 shrink-0 text-blue-ink"
                        strokeWidth={2.5}
                        aria-hidden="true"
                      />
                      {step}
                    </li>
                  ))}
                </ul>

                <p className="body-justify mt-6 border-t border-[color:var(--color-hairline)] pt-5 text-sm leading-relaxed text-muted">
                  Prefer email? Send your CV to{' '}
                  <a
                    href={`mailto:${contact.email}`}
                    className="font-medium text-blue-ink underline decoration-blue-ink/30 underline-offset-4"
                  >
                    {contact.email}
                  </a>{' '}
                  with the role in the subject line and it reaches the same place.
                </p>
              </div>
            </aside>
          </div>
        </Reveal>
      </section>
    </>
  );
}
