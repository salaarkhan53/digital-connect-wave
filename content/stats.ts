import type { Stat } from './types';

/**
 * REVIEW: every figure below is inherited from the source sites, not supplied
 * by Digital Connect Wave. All are `verified: false` and head content/REVIEW.md.
 * Replace or remove before launch.
 */
export const stats: Stat[] = [
  {
    id: 'professionals',
    value: 700,
    suffix: '+',
    label: 'Active professionals',
    detail: 'Agents, team leads and QA staff across live campaigns.',
    verified: false,
  },
  {
    id: 'coverage',
    value: 24,
    display: '24/5',
    label: 'Operational coverage',
    detail: 'Desks staffed across US business hours and beyond.',
    verified: false,
  },
  {
    id: 'clients',
    value: 1200,
    suffix: '+',
    label: 'Clients served',
    detail: 'Campaigns delivered for brands across eight verticals.',
    verified: false,
  },
  {
    id: 'rating',
    value: 4.99,
    suffix: '★',
    label: 'Average client rating',
    detail: 'Measured across completed engagements.',
    verified: false,
  },
  {
    id: 'founded',
    value: 2022,
    display: '2022',
    label: 'Operating since',
    detail: 'Built from a single campaign into a multi-vertical operation.',
    verified: false,
  },
];
