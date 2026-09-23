import type { Role } from './types';

/**
 * Open roles. Titles only, by instruction: no location, no responsibilities,
 * no requirements, no salary band. Do not add those fields without being asked.
 */
export const roles: Role[] = [
  { slug: 'medicare-verifier', title: 'Medicare Verifier' },
  { slug: 'medicare-closer', title: 'Medicare Closer' },
  { slug: 'campaign-dialer', title: 'Campaign Dialer' },
  { slug: 'final-expense-verifier', title: 'Final Expense Verifier' },
  { slug: 'final-expense-closer', title: 'Final Expense Closer' },
];

/** Experience bands offered on the application form. */
export const experienceLevels = [
  'Fresh',
  '1 Year',
  '2 Years',
  '3 Years',
  '4+ Years',
] as const;

export type ExperienceLevel = (typeof experienceLevels)[number];

export const roleBySlug = (slug: string) => roles.find((r) => r.slug === slug);

/** Why-join copy for the careers page. Culture only, no location claims. */
export const careersIntro = {
  heading: 'Together we build success',
  lede:
    'We hire for attitude and train for the campaign. Freshers and experienced agents both have a route here, and the route is the same one: perform, get coached, move up.',
  points: [
    {
      title: 'Promotion on performance',
      body: 'Advancement is tied to results and QA scores, not to how long you have been on the floor.',
    },
    {
      title: 'Real training, not a script handoff',
      body: 'Campaign-specific onboarding is completed before you go live, and coaching continues after.',
    },
    {
      title: 'Named leadership',
      body: 'Every team has a supervisor who owns it. You always know who to go to.',
    },
    {
      title: 'A professional floor',
      body: 'Documented process, monitored quality, and a standard of conduct that holds on every campaign.',
    },
  ],
};
