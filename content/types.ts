/**
 * Shared shapes for the content layer.
 *
 * Every factual record carries `verified`. Anything `false` renders normally
 * but is listed in content/REVIEW.md and must be confirmed before launch.
 * Nothing in this layer may reference a location outside the United States.
 */

export type Verifiable = {
  /** true only for facts confirmed directly by Digital Connect Wave. */
  verified: boolean;
};

export type Stat = Verifiable & {
  id: string;
  value: number;
  /** Rendered after the counted value, e.g. "+" or "★". */
  suffix?: string;
  prefix?: string;
  label: string;
  detail: string;
  /** Skip the count-up and print `display` verbatim (for values like "24/5"). */
  display?: string;
};

export type Capability = {
  slug: string;
  title: string;
  /** One line, used on cards and as the page subhead. */
  promise: string;
  forWho: string;
  body: string;
  features: string[];
  /** Key into components/ui/Icon.tsx */
  icon: string;
};

export type Industry = {
  slug: string;
  title: string;
  summary: string;
  body: string;
  challenges: string[];
  /** Capability slugs most relevant to this vertical. */
  capabilities: string[];
  /**
   * Path under public/ for this vertical's photography, or undefined when none
   * has been supplied. Anything without one falls back to generated brand art,
   * so a missing photo degrades rather than leaving a hole.
   */
  image?: string;
};

export type ProcessStep = {
  id: string;
  title: string;
  summary: string;
  detail: string;
};

export type Principle = {
  title: string;
  body: string;
};

export type ComplianceItem = Verifiable & {
  title: string;
  body: string;
  icon: string;
};

export type Kpi = Verifiable & {
  label: string;
  body: string;
};

export type Role = {
  slug: string;
  title: string;
};

export type TimelineEntry = Verifiable & {
  year: string;
  title: string;
  body: string;
};
