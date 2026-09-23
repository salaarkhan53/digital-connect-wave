import Image from 'next/image';
import { contact } from '@/content/contact';
import { Button } from '@/components/ui/Button';
import { Reveal } from '@/components/ui/Reveal';
import { asset } from '@/lib/asset';

/**
 * What actually happens if you get in touch.
 *
 * Three short lines rather than a claim about response times, because they
 * restate the lede as steps instead of promising anything new.
 */
const steps = [
  'Tell us the campaign, the volume and the standard you are held to.',
  'We scope the team, the process and the reporting against it.',
  'You get a straight answer on whether we are the right fit.',
];

/**
 * The closing call to action, at the foot of every page.
 *
 * Centred copy on a full-bleed band left the left and right thirds empty: the
 * artwork's interest is all in its corners and the copy sat on the flat middle
 * of it. It reads across the band now, copy on one side and what-happens-next
 * on the other, with the vertical padding cut back to match.
 *
 * Deliberately unlike the footer directly beneath it. The two used to share a
 * palette, a mesh and the same off-canvas mark, so the page ended in two
 * near-identical blue slabs. This one is the bright one; the footer went flat
 * and dark, and the boundary between them is now a real edge.
 */
export function CTABand({
  title = "Let's talk outcomes.",
  lede = 'Tell us what the campaign has to deliver. We will tell you honestly whether we are the right team for it.',
}: {
  title?: string;
  lede?: string;
}) {
  return (
    <section className="relative isolate overflow-hidden">
      <Image
        src={asset('/brand/cta.webp')}
        alt=""
        fill
        sizes="100vw"
        aria-hidden="true"
        className="-z-20 object-cover object-bottom"
      />

      {/*
        Weighted to the left, where the headline is, rather than the radial
        that used to sit over the middle. It keeps white type clear of the
        bright sweep without flattening the artwork on the side where the
        panel provides its own backing.
      */}
      <div
        className="absolute inset-0 -z-10"
        style={{
          background:
            'linear-gradient(100deg, rgb(4 8 22 / 0.80) 0%, rgb(4 8 22 / 0.58) 45%, rgb(4 8 22 / 0.30) 100%)',
        }}
        aria-hidden="true"
      />

      <Reveal className="shell grid items-center gap-10 py-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16 lg:py-14">
        <div>
          <p
            data-reveal
            className="inline-flex items-center gap-2.5 text-xs font-medium uppercase tracking-[0.18em] text-spark"
          >
            <span className="h-px w-6 bg-spark/60" aria-hidden="true" />
            Next step
          </p>

          <h2
            data-reveal
            className="mt-4 max-w-xl text-[length:var(--text-h1)] font-semibold text-white"
          >
            {title}
          </h2>

          <p
            data-reveal
            className="mt-4 max-w-lg text-[length:var(--text-lede)] leading-relaxed text-white/75"
          >
            {lede}
          </p>

          <div data-reveal className="mt-7 flex flex-wrap items-center gap-3">
            <Button href="/contact">Start a conversation</Button>
            <a
              href={contact.phoneHref}
              className="inline-flex min-h-[44px] items-center rounded-full border border-white/20 px-5 py-3 text-sm font-medium text-white/85 transition-colors duration-[160ms] hover:border-spark/60 hover:bg-white/[0.06] hover:text-spark"
            >
              or call {contact.phoneDisplay}
            </a>
          </div>
        </div>

        {/* The half of the band that used to be empty. */}
        <ol
          data-reveal
          className="rounded-2xl border border-white/15 bg-void/45 p-6 backdrop-blur-sm sm:p-7"
        >
          {steps.map((step, i) => (
            <li
              key={step}
              className="flex gap-4 border-t border-white/10 py-4 first:border-t-0 first:pt-0 last:pb-0"
            >
              <span
                className="flex size-8 shrink-0 items-center justify-center rounded-full border border-spark/40 bg-spark/10 text-xs font-medium tabular-nums text-spark"
                aria-hidden="true"
              >
                {i + 1}
              </span>
              <p className="text-sm leading-relaxed text-white/80">{step}</p>
            </li>
          ))}
        </ol>
      </Reveal>
    </section>
  );
}
