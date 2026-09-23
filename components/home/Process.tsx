'use client';

import Image from 'next/image';
import { useRef, useState } from 'react';
import { process } from '@/content/process';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Reveal } from '@/components/ui/Reveal';
import { asset } from '@/lib/asset';

/**
 * The delivery model, as a tab set: the five steps on the left, the selected
 * step's detail and illustration on the right. Discover is open by default.
 *
 * This was a GSAP-pinned scene that advanced on scroll, gated to windows at
 * least 1024x820, with a stacked list of all five steps everywhere else. Two
 * problems with that. The gate is a height most laptops miss once the browser
 * chrome is counted, so the common case was the stacked fallback: five full
 * illustrations down the page, which is a lot of home page for one section.
 * And pinning meant the section could only be read by scrolling through it,
 * never by picking the step you wanted.
 *
 * One layout now, driven by clicks rather than scroll position, so it behaves
 * the same at every window size and takes roughly a screen instead of five.
 */
export function Process() {
  const [active, setActive] = useState(0);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);

  /** Roving focus, so the arrow keys move between steps like a real tab set. */
  const onKeyDown = (e: React.KeyboardEvent) => {
    const last = process.length - 1;
    let next: number | null = null;

    if (e.key === 'ArrowDown' || e.key === 'ArrowRight') next = active === last ? 0 : active + 1;
    else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') next = active === 0 ? last : active - 1;
    else if (e.key === 'Home') next = 0;
    else if (e.key === 'End') next = last;

    if (next === null) return;
    e.preventDefault();
    setActive(next);
    tabs.current[next]?.focus();
  };

  return (
    <section className="band-mist" aria-label="How we work" id="process">
      <Reveal className="shell section">
        {/* Wider than the default measure so the title holds one line. */}
        <SectionHeading
          className="max-w-4xl"
          eyebrow="How we work"
          title="Five steps, every campaign, no exceptions."
          lede="The order matters. Most failed campaigns skipped step one and discovered it at step four."
        />

        <div className="mt-9 grid gap-5 lg:grid-cols-[17rem_1fr] lg:gap-10 xl:gap-12">
          {/*
            One tablist for every size rather than a desktop copy and a mobile
            copy: duplicating it would put the five steps into the
            accessibility tree twice. It is a vertical rail from `lg` and a
            horizontally scrolling strip below that.
          */}
          <div
            data-reveal
            role="tablist"
            aria-orientation="vertical"
            aria-label="Delivery steps"
            className="-mx-[var(--gutter)] flex snap-x snap-mandatory gap-2 overflow-x-auto px-[var(--gutter)] pb-2 lg:mx-0 lg:block lg:overflow-visible lg:px-0 lg:pb-0"
          >
            {process.map((step, i) => {
              const selected = active === i;
              return (
                <button
                  key={step.id}
                  ref={(el) => {
                    tabs.current[i] = el;
                  }}
                  type="button"
                  role="tab"
                  id={`process-tab-${step.id}`}
                  aria-selected={selected}
                  aria-controls={`process-panel-${step.id}`}
                  tabIndex={selected ? 0 : -1}
                  onClick={() => setActive(i)}
                  onKeyDown={onKeyDown}
                  className={`group relative block shrink-0 snap-start rounded-xl border px-3 py-2.5 text-left transition-colors duration-[280ms] lg:w-full lg:rounded-none lg:border-0 lg:bg-transparent lg:px-0 lg:pb-5 lg:pl-11 lg:pt-0 ${
                    selected
                      ? 'border-blue/30 bg-white'
                      : 'border-transparent hover:border-[color:var(--color-hairline)]'
                  }`}
                >
                  {/*
                    The rail is a segment per step rather than one line scaled
                    to the active index: each segment spans exactly the step it
                    belongs to, so the fill lands on the numbers whatever height
                    the summaries take.
                  */}
                  {i < process.length - 1 && (
                    <span
                      className={`absolute bottom-0 left-[15px] top-8 hidden w-px transition-colors duration-[420ms] lg:block ${
                        i < active ? 'bg-blue' : 'bg-[color:var(--color-hairline)]'
                      }`}
                      aria-hidden="true"
                    />
                  )}

                  <span className="flex items-center gap-2.5 lg:block">
                    {/*
                      Filled up to the active step on the rail, where it reads
                      as progress along a line, but only the selected one on
                      the strip, where five filled circles in a row just look
                      like five selected tabs.
                    */}
                    <span
                      className={`flex size-8 shrink-0 items-center justify-center rounded-full border text-xs font-medium tabular-nums transition-colors duration-[280ms] lg:absolute lg:left-0 lg:top-0.5 ${
                        selected
                          ? 'border-blue bg-blue text-white'
                          : i < active
                            ? 'border-[color:var(--color-hairline)] bg-white text-muted lg:border-blue lg:bg-blue lg:text-white'
                            : 'border-[color:var(--color-hairline)] bg-white text-muted group-hover:border-blue/40'
                      }`}
                      aria-hidden="true"
                    >
                      {i + 1}
                    </span>

                    <span
                      className={`font-display text-base font-medium transition-colors duration-[280ms] lg:text-lg ${
                        selected ? 'text-ink' : 'text-muted group-hover:text-ink'
                      }`}
                    >
                      {step.title}
                    </span>
                  </span>

                  {/* Room for this only on the rail; the strip would grow past
                      a phone's width and the panel repeats the point anyway. */}
                  <span className="mt-1 hidden max-w-xs text-sm leading-relaxed text-muted lg:block">
                    {step.summary}
                  </span>
                </button>
              );
            })}
          </div>

          {/*
            The panels are stacked rather than swapped so the box keeps one
            height: switching steps must not move the rest of the page.
          */}
          <div
            data-reveal
            className="relative min-h-[27rem] rounded-2xl border border-[color:var(--color-hairline)] bg-white sm:min-h-[26rem] lg:min-h-[31rem]"
          >
            {process.map((step, i) => {
              const selected = active === i;
              return (
                <div
                  key={step.id}
                  role="tabpanel"
                  id={`process-panel-${step.id}`}
                  aria-labelledby={`process-tab-${step.id}`}
                  /*
                    `inert` rather than `hidden`, which is what a tab set
                    normally uses: `hidden` is display:none, and there is no
                    cross-fade between two panels when one of them is not
                    being painted. `inert` takes the inactive panels out of
                    the accessibility tree and out of the tab order just the
                    same, while leaving them on screen to fade.
                  */
                  inert={!selected}
                  tabIndex={selected ? 0 : -1}
                  className="absolute inset-0 flex flex-col p-6 transition-opacity duration-[420ms] [transition-timing-function:cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none sm:p-7"
                  style={{ opacity: selected ? 1 : 0 }}
                >
                  <p className="text-xs font-medium uppercase tracking-[0.18em] text-blue-ink">
                    Step {i + 1}
                  </p>
                  <h3 className="mt-3 text-[length:var(--text-h3)] font-semibold text-ink">
                    {step.title}
                  </h3>
                  <p className="mt-3 text-[length:var(--text-lede)] leading-relaxed text-muted body-justify">
                    {step.detail}
                  </p>

                  {step.image && (
                    /*
                      The illustrations are cut-outs on transparent ground, so
                      `contain` leaves no letterbox against the white panel and
                      the art takes whatever height the panel has left.

                      Discover loads eagerly because it is what the panel shows
                      on arrival, and it used to sit blank for a second or two
                      while a lazy fetch finished. The other four start as soon
                      as the section nears the viewport, well before anyone has
                      clicked a second step.
                    */
                    <div className="relative mt-5 min-h-0 flex-1">
                      <Image
                        src={asset(step.image)}
                        alt=""
                        fill
                        sizes="(min-width: 1024px) 56rem, 90vw"
                        loading={i === 0 ? 'eager' : 'lazy'}
                        className="object-contain object-center"
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </Reveal>
    </section>
  );
}
