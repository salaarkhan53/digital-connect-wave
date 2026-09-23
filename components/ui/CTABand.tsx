import Image from 'next/image';
import { contact } from '@/content/contact';
import { Button } from '@/components/ui/Button';
import { Reveal } from '@/components/ui/Reveal';
import { asset } from '@/lib/asset';

/**
 * The closing call to action, at the foot of every page.
 *
 * The artwork runs the full width of the band while the copy stays on a narrow
 * measure. Held as a contained panel it read as an island: the copy was the
 * right width, but the dark margin around it was dead space on any wide screen.
 * Full-bleed keeps the measure and removes the void.
 */
export function CTABand({
  title = "Let's talk outcomes.",
  lede = 'Tell us the campaign, the volume and the standard you are held to. We will tell you honestly whether we are the right team for it.',
}: {
  title?: string;
  lede?: string;
}) {
  return (
    <section className="relative isolate overflow-hidden border-t border-white/10">
      <Image
        src={asset('/brand/cta.webp')}
        alt=""
        fill
        sizes="100vw"
        aria-hidden="true"
        className="-z-20 object-cover"
      />
      {/*
        The artwork is brightest through its upper middle, exactly where the
        heading sits, so this darkens it enough to keep white type clear of it
        without flattening the waves. It also deepens toward the edges, which
        stops the band fighting the footer below it.
      */}
      <div
        className="absolute inset-0 -z-10"
        style={{
          background:
            'radial-gradient(70% 90% at 50% 45%, rgb(5 7 14 / 0.42), rgb(5 7 14 / 0.86) 100%)',
        }}
        aria-hidden="true"
      />

      {/* The mark, barely lit, anchored off the right edge as texture. */}
      <Image
        src={asset('/brand/symbol-bg.webp')}
        alt=""
        width={480}
        height={296}
        aria-hidden="true"
        className="pointer-events-none absolute -right-20 top-1/2 -z-10 w-[min(34rem,55%)] max-w-none -translate-y-1/2 opacity-[0.09] select-none"
      />

      <Reveal className="shell py-16 text-center md:py-20">
        <h2
          data-reveal
          className="mx-auto max-w-2xl text-[length:var(--text-h1)] font-semibold text-white drop-shadow-[0_2px_14px_rgb(3_10_28/0.65)]"
        >
          {title}
        </h2>
        <p
          data-reveal
          className="mx-auto mt-5 max-w-xl text-[length:var(--text-lede)] leading-relaxed text-white/80"
        >
          {lede}
        </p>

        <div data-reveal className="mt-9 flex flex-wrap items-center justify-center gap-3">
          <Button href="/contact">Start a conversation</Button>
          <a
            href={contact.phoneHref}
            className="inline-flex min-h-[44px] items-center rounded-full px-5 py-3 text-sm font-medium text-white/85 transition-colors duration-[160ms] hover:text-spark"
          >
            or call {contact.phoneDisplay}
          </a>
        </div>
      </Reveal>
    </section>
  );
}
