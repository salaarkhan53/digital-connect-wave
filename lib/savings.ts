/**
 * Savings estimator.
 *
 * Deliberately compares an in-house cost you enter against an outsourced rate
 * you also enter. It does NOT embed a Digital Connect Wave price — we have no
 * confirmed rate card, and inventing one would turn an estimate into a quote.
 *
 * Both defaults are labelled on screen as editable US market estimates.
 * REVIEW: confirm the defaults with DCW. See content/REVIEW.md.
 */

export const WEEKS_PER_YEAR = 52;

export const defaults = {
  seats: 10,
  hoursPerWeek: 40,
  /** Fully-loaded in-house cost per agent hour (wage + overhead + benefits). */
  inHouseRate: 28,
  /** A typical outsourced blended rate. Adjust to any quote you hold. */
  outsourcedRate: 15,
} as const;

export const limits = {
  seats: { min: 1, max: 150, step: 1 },
  hoursPerWeek: { min: 5, max: 80, step: 5 },
  inHouseRate: { min: 15, max: 75, step: 1 },
  outsourcedRate: { min: 5, max: 60, step: 1 },
} as const;

export type SavingsInput = {
  seats: number;
  hoursPerWeek: number;
  inHouseRate: number;
  outsourcedRate: number;
};

export type SavingsResult = {
  annualHours: number;
  inHouseAnnual: number;
  outsourcedAnnual: number;
  savings: number;
  savingsPercent: number;
};

const clamp = (n: number, min: number, max: number) =>
  Math.min(max, Math.max(min, Number.isFinite(n) ? n : min));

export function calculateSavings(input: SavingsInput): SavingsResult {
  const seats = clamp(input.seats, limits.seats.min, limits.seats.max);
  const hours = clamp(input.hoursPerWeek, limits.hoursPerWeek.min, limits.hoursPerWeek.max);
  const inRate = clamp(input.inHouseRate, limits.inHouseRate.min, limits.inHouseRate.max);
  const outRate = clamp(
    input.outsourcedRate,
    limits.outsourcedRate.min,
    limits.outsourcedRate.max,
  );

  const annualHours = seats * hours * WEEKS_PER_YEAR;
  const inHouseAnnual = annualHours * inRate;
  const outsourcedAnnual = annualHours * outRate;
  const savings = inHouseAnnual - outsourcedAnnual;

  return {
    annualHours,
    inHouseAnnual,
    outsourcedAnnual,
    savings,
    // Guard the divide: inHouseAnnual is only zero if every input bottomed out.
    savingsPercent: inHouseAnnual > 0 ? (savings / inHouseAnnual) * 100 : 0,
  };
}

const usd = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
});

export const formatUsd = (n: number) => usd.format(Math.round(n));
