import type { Industry } from './types';

export const industries: Industry[] = [
  {
    slug: 'insurance',
    title: 'Insurance',
    summary: 'Compliance-led contact operations for carriers, agencies and IMOs.',
    body:
      'Insurance is the vertical where a contact centre is judged on its paperwork as much as its conversion. Our insurance teams work from approved scripts, capture disclosures in the required order, and leave an auditable record of every contact.',
    challenges: [
      'Disclosure capture that survives an audit',
      'Licensed-agent handover without dropped calls',
      'Consistent quality across high-volume campaigns',
    ],
    capabilities: ['sales-verification', 'lead-generation', 'inbound-support'],
  },
  {
    slug: 'medicare',
    title: 'Medicare',
    summary: 'Targeted, compliance-aware Medicare lead generation and live transfer.',
    body:
      'Medicare campaigns run against a narrow enrolment calendar and an unforgiving compliance standard. We staff for the seasonal spike, qualify against plan-specific criteria, and transfer live to a licensed closer while the prospect is still engaged.',
    challenges: [
      'Seasonal volume spikes around enrolment',
      'Eligibility qualification before transfer',
      'Documented consent on every contact',
    ],
    capabilities: ['lead-generation', 'sales-verification', 'outbound-campaigns'],
  },
  {
    slug: 'final-expense',
    title: 'Final Expense',
    summary: 'Qualified Final Expense prospects, handed over warm to your closers.',
    body:
      'Final Expense demands a particular kind of conversation: unhurried, respectful, and accurate about what the product does. We train specifically for that tone, qualify on age, health and budget criteria, and transfer only when the prospect is genuinely ready.',
    challenges: [
      'Tone and sensitivity on every call',
      'Qualification on age, health and budget',
      'Keeping closers on closing, not prospecting',
    ],
    capabilities: ['lead-generation', 'sales-verification', 'outbound-campaigns'],
  },
  {
    slug: 'healthcare',
    title: 'Healthcare & Billing',
    summary: 'Back-office capacity for providers, billers and revenue cycle teams.',
    body:
      'Revenue cycle work stalls in predictable places: eligibility, claim follow-up, records accuracy. We add trained capacity at exactly those points so ageing claims keep moving and your own team is free to work the exceptions.',
    challenges: [
      'Ageing claims and denial follow-up',
      'Eligibility and benefits verification at volume',
      'Records accuracy across systems',
    ],
    capabilities: ['medical-billing', 'customer-support', 'inbound-support'],
  },
  {
    slug: 'financial-services',
    title: 'Financial Services',
    summary: 'Regulated customer contact for lenders, brokers and fintech.',
    body:
      'Financial services conversations carry disclosure obligations and a low tolerance for improvisation. We run them from documented talk paths with monitoring on the back end, so what was said is always recoverable.',
    challenges: [
      'Disclosure and script adherence',
      'Identity and account verification',
      'Auditable records of every interaction',
    ],
    capabilities: ['sales-verification', 'customer-support', 'b2b-outreach'],
  },
  {
    slug: 'retail-ecommerce',
    title: 'Retail & E-commerce',
    summary: 'Order, returns and customer support that scales with your season.',
    body:
      'Retail volume is not flat, and staffing for the average means failing at the peak. We scale the desk against your calendar so response times hold through the season rather than collapsing in week one.',
    challenges: [
      'Seasonal peaks without seasonal quality drops',
      'Order, returns and delivery-status handling',
      'Multi-channel coverage',
    ],
    capabilities: ['customer-support', 'inbound-support', 'digital-marketing'],
  },
  {
    slug: 'telecom',
    title: 'Telecom',
    summary: 'Acquisition, retention and support for high-volume subscriber bases.',
    body:
      'Telecom lives on churn economics. We run retention and win-back campaigns with the save offers your team defines, and support queues that resolve rather than deflect.',
    challenges: [
      'Churn and win-back campaigns',
      'High-volume tier-one support',
      'Consistent handling across a large agent pool',
    ],
    capabilities: ['outbound-campaigns', 'customer-support', 'inbound-support'],
  },
  {
    slug: 'technology',
    title: 'Technology & SaaS',
    summary: 'Pipeline generation and customer support for software businesses.',
    body:
      'Software companies usually have the product and the list, and no time to work it. We run the outbound sequence into named accounts and staff the support queue, so the founding team stops doing both.',
    challenges: [
      'Named-account outbound at consistent volume',
      'Technical tier-one support coverage',
      'Trial-to-paid follow-up',
    ],
    capabilities: ['b2b-outreach', 'lead-generation', 'customer-support'],
  },
  {
    slug: 'home-services',
    title: 'Home Services',
    summary: 'Booked appointments and a support line that never rings out.',
    body:
      'In home services a missed call is a lost job, usually to whoever answered first. We answer the line, book against your calendar, and follow up the estimates that went quiet.',
    challenges: [
      'Missed calls converting to lost jobs',
      'Appointment setting against live capacity',
      'Estimate follow-up and reactivation',
    ],
    capabilities: ['inbound-support', 'outbound-campaigns', 'lead-generation'],
  },
];

export const industryBySlug = (slug: string) => industries.find((i) => i.slug === slug);
