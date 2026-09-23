import Image from 'next/image';
import { contact } from '@/content/contact';
import { Button } from '@/components/ui/Button';
import { Reveal } from '@/components/ui/Reveal';
import { asset } from '@/lib/asset';

/** The closing call to action. Reused at the foot of every page. */
export function CTABand({
  title = "Let's talk outcomes.",
  lede = 'Tell us the campaign, the volume and the standard you are held to. We will tell you honestly whether we are the right team for it.',
}: {
  title?: string;
  lede?: string;
}) {
  return (
    <section className="relative isolate overflow-hidden border-t border-white/10 bg-void">
      {/* The mark rising out of the bottom edge, barely lit. */}
      <Image
        src={asset("/brand/mark.webp")}
        alt=""
        width={1200}
        height={648}
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-40 left-1/2 -z-10 w-[min(64rem,130%)] max-w-none -translate-x-1/2 opacity-[0.1] blur-[1px] select-none"
      />
      <div className="mesh-field absolute inset-0 -z-20" aria-hidden="true" />

      <Reveal className="shell section text-center">
        <h2
          data-reveal
          className="mx-auto max-w-3xl text-[length:var(--text-h1)] font-semibold text-white"
        >
          {title}
        </h2>
        <p data-reveal className="mx-auto mt-6 max-w-xl text-[length:var(--text-lede)] text-white/55">
          {lede}
        </p>

        <div data-reveal className="mt-10 flex flex-wrap items-center justify-center gap-3">
          <Button href="/contact">Start a conversation</Button>
          <a
            href={contact.phoneHref}
            className="inline-flex min-h-[44px] items-center rounded-full px-5 py-3 text-sm font-medium text-white/70 transition-colors duration-[160ms] hover:text-spark"
          >
            or call {contact.phoneDisplay}
          </a>
        </div>
      </Reveal>
    </section>
  );
}
