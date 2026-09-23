import type { ProcessStep } from './types';

/** The five-step delivery model, used on the home page and /about. */
export const process: ProcessStep[] = [
  {
    id: 'discover',
    title: 'Discover',
    summary: 'We map the campaign goal and agree what success is measured on.',
    detail:
      'Before anyone dials, we agree the target, the qualification criteria and the metric the engagement will be judged on. Written down, so it cannot drift later.',
    image: '/process/discover.webp',
  },
  {
    id: 'build',
    title: 'Build',
    summary: 'Team structure, talk paths and reporting are defined up front.',
    detail:
      'We assemble the team, name the supervisor who owns it, and define the process and reporting cadence before the campaign exists rather than after it stalls.',
    image: '/process/build.webp',
  },
  {
    id: 'train',
    title: 'Train',
    summary: 'Campaign-specific onboarding, completed before go-live.',
    detail:
      'Agents are trained on your product, objections and compliance requirements specifically, not onboarded generically and handed a script on day one.',
    image: '/process/train.webp',
  },
  {
    id: 'launch',
    title: 'Launch',
    summary: 'The team goes live under direct supervisor oversight.',
    detail:
      'Launch runs with the supervisor on the floor and calls monitored from the first hour, so problems surface in days rather than at the end of the first month.',
    image: '/process/launch.webp',
  },
  {
    id: 'optimize',
    title: 'Optimize',
    summary: 'QA review and coaching cycles, continuously.',
    detail:
      'Recorded calls are reviewed against a scorecard, coaching is scheduled against what the reviews find, and script variants are tested rather than argued about.',
    image: '/process/optimize.webp',
  },
];
