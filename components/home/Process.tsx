'use client';

import Image from 'next/image';
import { useRef, useState } from 'react';
import { process } from '@/content/process';
import { gsap, useGSAP } from '@/lib/gsap';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Reveal } from '@/components/ui/Reveal';
import { asset } from '@/lib/asset';

/**
 * The delivery model.
 *
 * Below `lg` it is a plain stacked list — every step readable, nothing hidden,
 * no scroll trickery on the devices least able to afford it. From `lg` up it
 * becomes a pinned scene where the active step advances and a progress line
 * draws down the rail.
 *
 * This is the only pinned section on the site. Pinning fights native scroll,
 * so more than one or two per page makes everything feel sticky.
 */
export function Process() {
  const root = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      // Height matters as much as width: pinning a scene taller than the
      // viewport crops it, so short windows keep the plain scrolling layout.
      mm.add(
        '(min-width: 1024px) and (min-height: 820px) and (prefers-reduced-motion: no-preference)',
        () => {
          const el = root.current;
          if (!el) return;

          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: el,
              start: 'top top+=72',
              // 220px of scroll per step. At 300 the scene held the page still
            // long enough to read as though nothing were happening.
            end: () => `+=${process.length * 220}`,
              pin: true,
              scrub: 0.6,
              invalidateOnRefresh: true,
              onUpdate: (self) => {
                const i = Math.min(
                  process.length - 1,
                  Math.floor(self.progress * process.length),
                );
                setActive(i);
              },
            },
          });

          tl.to('[data-rail]', { scaleY: 1, ease: 'none' });

          return () => {
            tl.kill();
          };
        },
      );

      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section className="band-mist" aria-label="How we work" id="process">
      {/* ------------------------------------------------ mobile / tablet */}
      <Reveal className="shell section [@media(min-width:1024px)_and_(min-height:820px)]:hidden">
        <SectionHeading
          eyebrow="How we work"
          title="Five steps, every campaign, no exceptions."
          lede="The order matters. Most failed campaigns skipped step one and discovered it at step four."
        />

        <ol className="mt-9 space-y-4">
          {process.map((step, i) => (
            <li
              key={step.id}
              data-reveal
              className="rounded-2xl border border-[color:var(--color-hairline)] bg-white p-6"
            >
              <p className="flex items-center gap-3">
                <span
                  className="flex size-8 items-center justify-center rounded-full bg-blue text-xs font-medium tabular-nums text-white"
                  aria-hidden="true"
                >
                  {i + 1}
                </span>
                <span className="font-display text-lg font-medium text-ink">{step.title}</span>
              </p>
              <p className="mt-3 text-sm leading-relaxed text-muted body-justify">{step.detail}</p>

              {step.image && (
                /* A fixed height, not an aspect ratio: this list also runs on
                   a wide-but-short desktop, where 3:2 made the illustration
                   taller than the card it sat in. */
                <div className="relative mt-4 h-44 sm:h-52">
                  <Image
                    src={asset(step.image)}
                    alt=""
                    fill
                    sizes="(min-width: 1024px) 0px, 90vw"
                    className="object-contain object-center"
                  />
                </div>
              )}
            </li>
          ))}
        </ol>
      </Reveal>

      {/* ------------------------------------------------------- desktop */}
      <div ref={root} className="hidden [@media(min-width:1024px)_and_(min-height:820px)]:block">
        <div className="shell py-12">
          <SectionHeading
            eyebrow="How we work"
            title="Five steps, every campaign, no exceptions."
            lede="The order matters. Most failed campaigns skipped step one and discovered it at step four."
          />

          <div className="mt-9 grid grid-cols-[20rem_1fr] gap-16">
            <ol className="relative">
              <span
                className="absolute left-[15px] top-2 h-[calc(100%-2.5rem)] w-px bg-[color:var(--color-hairline)]"
                aria-hidden="true"
              />
              <span
                data-rail
                className="absolute left-[15px] top-2 h-[calc(100%-2.5rem)] w-px origin-top scale-y-0 bg-gradient-to-b from-blue to-spark"
                aria-hidden="true"
              />

              {process.map((step, i) => {
                const reached = i <= active;
                return (
                  <li key={step.id} className="relative pb-5 pl-11">
                    <span
                      className={`absolute left-0 top-0.5 flex size-8 items-center justify-center rounded-full border text-xs font-medium tabular-nums transition-colors duration-[280ms] ${
                        reached
                          ? 'border-blue bg-blue text-white'
                          : 'border-[color:var(--color-hairline)] bg-white text-muted'
                      }`}
                      aria-hidden="true"
                    >
                      {i + 1}
                    </span>

                    <button
                      type="button"
                      onClick={() => setActive(i)}
                      aria-current={active === i ? 'step' : undefined}
                      className={`cursor-pointer text-left font-display text-lg font-medium transition-colors duration-[280ms] ${
                        active === i ? 'text-ink' : 'text-muted hover:text-ink'
                      }`}
                    >
                      {step.title}
                    </button>
                    <p className="max-w-xs text-sm leading-relaxed text-muted body-justify">{step.summary}</p>
                  </li>
                );
              })}
            </ol>

            <div className="relative min-h-[16rem] rounded-2xl border border-[color:var(--color-hairline)] bg-white">
              {process.map((step, i) => (
                <div
                  key={step.id}
                  className="absolute inset-0 flex flex-col p-8 transition-opacity duration-[620ms] [transition-timing-function:cubic-bezier(0.16,1,0.3,1)]"
                  style={{
                    opacity: active === i ? 1 : 0,
                    pointerEvents: active === i ? 'auto' : 'none',
                  }}
                  // The mobile list above is the accessible copy of this
                  // content, so the inactive panels stay out of the tree.
                  aria-hidden={active === i ? undefined : 'true'}
                >
                  <p className="font-display text-xs font-medium uppercase tracking-[0.18em] text-blue-ink">
                    Step {i + 1}
                  </p>
                  <h3 className="mt-3 text-[length:var(--text-h3)] font-semibold text-ink">
                    {step.title}
                  </h3>
                  {/* Full panel measure, so the detail settles on two lines. */}
                  <p className="mt-3 text-[length:var(--text-lede)] leading-relaxed text-muted body-justify">
                    {step.detail}
                  </p>

                  {step.image && (
                    /*
                       The illustrations are cut-out PNGs, so `contain` leaves no
                       visible letterbox against the white panel, and the art can
                       take whatever height the pinned scene has left without
                       being cropped.
                    */
                    <div className="relative mt-5 min-h-0 flex-1">
                      <Image
                        src={asset(step.image)}
                        alt=""
                        fill
                        sizes="(min-width: 1024px) 48rem, 0px"
                        className="object-contain object-center"
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
