import Image from 'next/image';
import { contact } from '@/content/contact';
import { Button } from '@/components/ui/Button';
import { Reveal } from '@/components/ui/Reveal';
import { asset } from '@/lib/asset';

/**
 * The closing call to action, at the foot of every page.
 *
 * A contained panel rather than a full-bleed band: at full width the copy sat
 * marooned in the middle of a very wide dark strip, and the artwork behind it
 * only reads as a composition when it has edges.
 */
export function CTABand({
  title = "Let's talk outcomes.",
  lede = 'Tell us the campaign, the volume and the standard you are held to. We will tell you honestly whether we are the right team for it.',
}: {
  title?: string;
  lede?: string;
}) {
  return (
    <section className="border-t border-white/10 bg-void py-16 md:py-20">
      <Reveal className="shell">
        <div
          data-reveal
          className="relative isolate mx-auto max-w-4xl overflow-hidden rounded-3xl border border-white/12 px-6 py-14 text-center sm:px-10 md:py-16"
        >
          <Image
            src={asset('/brand/cta.webp')}
            alt=""
            fill
            sizes="(min-width: 1024px) 56rem, 100vw"
            aria-hidden="true"
            className="-z-20 object-cover"
          />
          {/*
            The artwork is brightest through its upper middle, exactly where the
            heading sits. This darkens it enough to keep white type clear of it
            without flattening the waves.
          */}
          <div
            className="absolute inset-0 -z-10 bg-void/45"
            aria-hidden="true"
          />

          <h2 className="mx-auto max-w-2xl text-[length:var(--text-h1)] font-semibold text-white drop-shadow-[0_2px_12px_rgb(3_10_28/0.6)]">
            {title}
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-[length:var(--text-lede)] leading-relaxed text-white/80">
            {lede}
          </p>

          <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
            <Button href="/contact">Start a conversation</Button>
            <a
              href={contact.phoneHref}
              className="inline-flex min-h-[44px] items-center rounded-full px-5 py-3 text-sm font-medium text-white/85 transition-colors duration-[160ms] hover:text-spark"
            >
              or call {contact.phoneDisplay}
            </a>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
