'use client';

import { useRef } from 'react';
import { ArrowDown } from 'lucide-react';
import { gsap, SplitText, useGSAP } from '@/lib/gsap';
import { duration, ease, stagger } from '@/lib/motion';
import { Button } from '@/components/ui/Button';
import { HeroSymbol } from '@/components/symbol/HeroSymbol';

export function Hero() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add(
        {
          motion: '(prefers-reduced-motion: no-preference)',
          reduced: '(prefers-reduced-motion: reduce)',
        },
        (ctx) => {
          const { reduced } = ctx.conditions as { reduced: boolean };
          const stage = gsap.utils.toArray<HTMLElement>('[data-stage]', root.current!);

          const headline = root.current!.querySelector<HTMLElement>('[data-headline]');

          if (reduced) {
            gsap.set([...stage, headline].filter(Boolean), { opacity: 1, y: 0 });
            return;
          }

          const tl = gsap.timeline({ defaults: { ease: ease.out } });
          let split: InstanceType<typeof SplitText> | null = null;

          if (headline) {
            // Split by line first so wrapping stays natural, then by char.
            split = new SplitText(headline, {
              type: 'lines,chars',
              linesClass: 'overflow-hidden pb-[0.08em]',
            });
            // The headline itself is revealed the instant its characters start
            // moving — CSS held it hidden until now.
            tl.set(headline, { opacity: 1 });
            tl.from(split.chars, {
              yPercent: 110,
              opacity: 0,
              duration: duration.slow,
              stagger: stagger.chars,
            });
          }

          // fromTo, not from: CSS already set these to opacity 0, so `from`
          // would animate from 0 to 0.
          tl.fromTo(
            stage,
            { opacity: 0, y: 22 },
            { opacity: 1, y: 0, duration: duration.slow, stagger: stagger.normal },
            '-=0.35',
          );

          return () => {
            // Restore the original text nodes so screen readers and the DOM
            // are left exactly as they were.
            split?.revert();
          };
        },
      );

      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section
      ref={root}
      className="relative isolate flex min-h-[100svh] items-center overflow-hidden pt-[var(--header-h)]"
    >
      {/* Backdrop: brand glow over a faint engineering grid. */}
      <div className="mesh-field absolute inset-0 -z-20" aria-hidden="true" />
      <div
        className="grid-lines absolute inset-0 -z-20 opacity-60 [mask-image:radial-gradient(70%_60%_at_50%_40%,#000_30%,transparent_100%)]"
        aria-hidden="true"
      />

      <div className="shell grid w-full items-center gap-6 py-6 lg:grid-cols-[1.05fr_0.95fr] lg:gap-10 lg:py-12">
        {/* ------------------------------------------------------- copy */}
        <div className="relative z-10 max-w-2xl">
          <p
            data-stage
            className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.04] px-3.5 py-1.5 text-xs font-medium tracking-[0.12em] uppercase text-white/60"
          >
            <span className="size-1.5 rounded-full bg-spark" aria-hidden="true" />
            US contact operations
          </p>

          <h1
            data-headline
            className="mt-5 text-[length:var(--text-display)] font-semibold text-white"
          >
            Connecting tomorrow&apos;s possibilities.
          </h1>

          <p data-stage className="mt-5 max-w-xl text-[length:var(--text-lede)] text-white/60">
            We run the contact operations behind US brands: inbound support,
            outbound campaigns, qualified pipeline and compliance-led
            verification, built on documented process and recorded QA.
          </p>

          <div data-stage className="mt-7 flex flex-wrap items-center gap-3">
            <Button href="/contact">Let&apos;s talk outcomes</Button>
            <Button href="/capabilities" variant="ghost" icon={false}>
              See what we run
            </Button>
          </div>
        </div>

        {/* ----------------------------------------------------- symbol */}
        {/*
          From `lg` the mark leaves the grid entirely and is positioned against
          the section instead.

          Held in its column it rendered at barely two thirds of the width
          beside the copy. Simply widening the column is not the fix: a grid
          track sized to the mark starves the headline, which at 1920 broke
          "Connecting" across three lines. Out of flow it can be as large as
          the section allows and still cannot touch the copy's measure.

          The 1.3 ratio is the mark's own: it measures 2.06 by 1.59 world
          units. Matching the box to it means the mask's horizontal and
          vertical limits bind at the same camera distance, so neither axis is
          wasting room the other one needs. Sized from width, not height,
          because driven by height it outgrows the horizontal space on a 1366
          screen and slides under the headline; `max-h` then catches the short
          wide windows where 1.3 of the width would be taller than the hero.

          `overflow-hidden` on the section catches the bleed past the right
          gutter, which is intentional.
        */}
        <div
          data-stage
          className="relative mx-auto aspect-[4/3] max-h-[26vh] w-full max-w-[34rem] sm:max-h-[40vh] lg:absolute lg:inset-y-0 lg:right-0 lg:my-auto lg:aspect-[1.3/1] lg:max-h-[88vh] lg:w-[min(51vw,64rem)] lg:max-w-none"
        >
          <HeroSymbol className="absolute inset-0" />
        </div>
      </div>

      {/* --------------------------------------------------- scroll cue */}
      <a
        href="#trust"
        data-stage
        className="absolute bottom-7 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 text-[0.6875rem] font-medium uppercase tracking-[0.2em] text-white/55 transition-colors duration-[280ms] hover:text-spark md:flex"
      >
        Scroll
        <ArrowDown className="size-4 motion-safe:animate-bounce" strokeWidth={1.5} aria-hidden="true" />
      </a>
    </section>
  );
}
