import type { TimelineEntry } from './types';

/**
 * REVIEW: the shape of this history is inherited from the source sites and has
 * NOT been confirmed as Digital Connect Wave's own. Every entry is
 * `verified: false`. Confirm or replace before launch. No geography here by
 * instruction — this is a US-market site.
 */
export const timeline: TimelineEntry[] = [
  {
    year: '2022',
    title: 'Founded',
    body: 'Started with a single campaign, a small floor and a written process. The process is the part that scaled.',
    verified: false,
  },
  {
    year: '2023',
    title: 'Structure before headcount',
    body: 'Team leads, QA scorecards and reporting cadence were formalised, ahead of taking on more volume.',
    verified: false,
  },
  {
    year: '2024',
    title: 'Campaign expansion',
    body: 'Insurance, Medicare and Final Expense campaigns moved from pilot to steady-state operations.',
    verified: false,
  },
  {
    year: '2025',
    title: 'Multi-vertical delivery',
    body: 'Healthcare billing, B2B outreach and support desks ran alongside the core insurance campaigns.',
    verified: false,
  },
  {
    year: '2026',
    title: 'Where we are now',
    body: 'A multi-vertical contact operation serving US businesses, with compliance and QA as the constraints we build around.',
    verified: false,
  },
];
