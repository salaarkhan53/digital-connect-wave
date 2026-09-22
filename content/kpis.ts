import type { Kpi } from './types';

/**
 * What an engagement is measured on. Deliberately number-free: these describe
 * the metrics we report against, not results we are claiming. If DCW wants
 * published benchmark figures here, they need to come from real campaign data.
 * See content/REVIEW.md.
 */
export const kpis: Kpi[] = [
  {
    label: 'Contact rate',
    body: 'Reachable contacts per dialled record. The first number that tells you whether a list or a calling window is wrong.',
    verified: false,
  },
  {
    label: 'Conversion',
    body: 'Qualified outcomes per contact, measured against the criteria agreed at Discover rather than a generic definition.',
    verified: false,
  },
  {
    label: 'QA score',
    body: 'Recorded calls scored against a written rubric, sampled continuously rather than at month end.',
    verified: false,
  },
  {
    label: 'Compliance adherence',
    body: 'Disclosure capture and script adherence per reviewed call. Non-negotiable, and reported whether or not it flatters us.',
    verified: false,
  },
  {
    label: 'Speed to answer',
    body: 'How long a caller waits before a person picks up, tracked across the staffed window.',
    verified: false,
  },
  {
    label: 'Quality-adjusted volume',
    body: 'Throughput counted only where the QA score clears threshold, so volume cannot be bought with sloppy calls.',
    verified: false,
  },
];
