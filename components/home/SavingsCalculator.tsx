'use client';

import { useMemo, useState } from 'react';
import { Info } from 'lucide-react';
import {
  calculateSavings,
  defaults,
  formatUsd,
  limits,
  type SavingsInput,
} from '@/lib/savings';
import { Reveal } from '@/components/ui/Reveal';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Button } from '@/components/ui/Button';
import { LightBand } from '@/components/ui/LightBand';

type Field = keyof SavingsInput;

const fields: {
  key: Field;
  label: string;
  hint: string;
  format: (v: number) => string;
}[] = [
  {
    key: 'seats',
    label: 'Seats',
    hint: 'Agents you need covered.',
    format: (v) => String(v),
  },
  {
    key: 'hoursPerWeek',
    label: 'Hours per seat, per week',
    hint: 'Staffed hours, not headcount hours.',
    format: (v) => `${v} hrs`,
  },
  {
    key: 'inHouseRate',
    label: 'Your in-house cost per hour',
    hint: 'Fully loaded: wage, overhead, benefits, seat.',
    format: (v) => `$${v}/hr`,
  },
  {
    key: 'outsourcedRate',
    label: 'Outsourced rate per hour',
    hint: 'Adjust to any quote you are holding.',
    format: (v) => `$${v}/hr`,
  },
];

/**
 * The one interactive moment on the page.
 *
 * Every control is a range input paired with a number input, so it is fully
 * operable by keyboard and by typing rather than drag-only. All arithmetic is
 * client-side and bounds-checked in lib/savings.ts.
 */
export function SavingsCalculator() {
  const [input, setInput] = useState<SavingsInput>({ ...defaults });
  const result = useMemo(() => calculateSavings(input), [input]);

  const set = (key: Field) => (value: number) =>
    setInput((prev) => ({ ...prev, [key]: value }));

  const positive = result.savings > 0;

  // Carry the inputs through to the contact form so the enquiry arrives with
  // the context already attached.
  const quoteHref =
    `/contact?seats=${input.seats}&hours=${input.hoursPerWeek}` +
    `&rate=${input.inHouseRate}&target=${input.outsourcedRate}`;

  return (
    <LightBand aria-labelledby="savings-heading">
      <Reveal className="shell section">
        <SectionHeading
          eyebrow="Estimate"
          title={<span id="savings-heading">What does the desk actually cost you?</span>}
          lede="Put your own numbers in. Nothing is sent anywhere, and nothing here is a quote. It is arithmetic you can check."
        />

        <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_24rem] lg:items-start">
          {/* ------------------------------------------------------ inputs */}
          <div
            data-reveal
            className="rounded-2xl border border-[color:var(--color-hairline)] bg-white p-6 sm:p-8"
          >
            <div className="grid gap-7 sm:grid-cols-2">
              {fields.map((field) => {
                const bounds = limits[field.key];
                const value = input[field.key];
                const id = `calc-${field.key}`;
                return (
                  <div key={field.key}>
                    <label htmlFor={id} className="block text-sm font-medium text-ink">
                      {field.label}
                    </label>
                    <p className="mt-1 text-xs text-muted">{field.hint}</p>

                    <div className="mt-3 flex items-center gap-3">
                      <input
                        id={id}
                        type="range"
                        min={bounds.min}
                        max={bounds.max}
                        step={bounds.step}
                        value={value}
                        onChange={(e) => set(field.key)(Number(e.target.value))}
                        // Height, track and thumb come from the base rule in globals.css, which
                        // gives the element a 24px hit area without thickening the track.
                        className="flex-1 appearance-none bg-transparent"
                      />
                      <input
                        type="number"
                        aria-label={`${field.label}, exact value`}
                        min={bounds.min}
                        max={bounds.max}
                        step={bounds.step}
                        value={value}
                        onChange={(e) => set(field.key)(Number(e.target.value))}
                        className="w-20 rounded-lg border border-[color:var(--color-hairline)] px-2.5 py-2 text-sm tabular-nums text-ink focus:border-blue"
                      />
                    </div>

                    <p className="mt-1.5 text-xs font-medium tabular-nums text-blue-ink">
                      {field.format(value)}
                    </p>
                  </div>
                );
              })}
            </div>

            <p className="mt-8 flex items-start gap-2.5 rounded-xl bg-mist p-4 text-xs leading-relaxed text-muted body-justify">
              <Info className="mt-0.5 size-4 shrink-0 text-blue-ink" strokeWidth={1.5} aria-hidden="true" />
              <span>
                Assumes 52 staffed weeks a year and a like-for-like comparison of
                staffed hours. Defaults are US market estimates, not our rates. Change
                them to whatever your own figures are. This is an estimate,
                not a quote.
              </span>
            </p>
          </div>

          {/* ------------------------------------------------------ result */}
          <div
            data-reveal
            className="mesh-field relative overflow-hidden rounded-2xl border border-white/10 bg-void p-7 text-white lg:sticky lg:top-28"
          >
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-spark/80">
              {positive ? 'Estimated annual difference' : 'Estimated annual increase'}
            </p>

            <p
              className="mt-4 font-display text-[clamp(2.5rem,2rem+2.4vw,3.5rem)] font-semibold leading-none tabular-nums"
              // The figure changes as sliders move; announce it politely rather
              // than on every keystroke of a drag.
              aria-live="polite"
              aria-atomic="true"
            >
              {formatUsd(Math.abs(result.savings))}
            </p>

            <p className="mt-2 text-sm text-white/55">
              {positive
                ? `${result.savingsPercent.toFixed(0)}% less than running it in-house`
                : 'The outsourced rate you entered costs more than in-house'}
            </p>

            <dl className="mt-7 space-y-3 border-t border-white/10 pt-6 text-sm">
              <div className="flex justify-between gap-4">
                <dt className="text-white/50">Staffed hours a year</dt>
                <dd className="tabular-nums text-white/85">
                  {result.annualHours.toLocaleString('en-US')}
                </dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-white/50">In-house</dt>
                <dd className="tabular-nums text-white/85">{formatUsd(result.inHouseAnnual)}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-white/50">Outsourced</dt>
                <dd className="tabular-nums text-white/85">
                  {formatUsd(result.outsourcedAnnual)}
                </dd>
              </div>
            </dl>

            <div className="mt-8">
              <Button href={quoteHref} className="w-full">
                Get an exact quote
              </Button>
            </div>
          </div>
        </div>
      </Reveal>
    </LightBand>
  );
}
