import type { Principle } from './types';

/** The six operating standards the company holds itself to. */
export const principles: Principle[] = [
  {
    title: 'Performance over promises',
    body: 'Advancement is based on results, not tenure. The same standard applies to what we tell clients we can do.',
  },
  {
    title: 'People are the product',
    body: 'In this business the agent is the service. Training and retention are operational priorities, not HR overhead.',
  },
  {
    title: 'Compliance is not optional',
    body: 'We decline work that cannot be run compliantly. That has cost us campaigns, and it is still the rule.',
  },
  {
    title: 'Visible operations',
    body: 'Reporting is built to surface problems early rather than to look good in a monthly deck.',
  },
  {
    title: 'Build to scale',
    body: 'Structure comes before headcount. Adding people to an undefined process only makes the problem larger.',
  },
  {
    title: 'Honest positioning',
    body: 'No inflated numbers, no borrowed credentials, no client logos we have not earned.',
  },
];
