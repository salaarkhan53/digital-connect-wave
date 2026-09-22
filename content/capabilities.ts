import type { Capability } from './types';

/**
 * Service copy ported from the source sites, with all offshore framing removed.
 * Order here drives the capabilities grid and the mega-menu.
 */
export const capabilities: Capability[] = [
  {
    slug: 'inbound-support',
    title: 'Inbound Contact Centre',
    promise: 'Trained agents answering your customers, following your process, on your brand.',
    forWho: 'Businesses with steady inbound volume that needs consistent handling and coverage.',
    body:
      'Your inbound line is the first thing a customer hears, and it sets the tone for everything after it. We staff it with agents trained on your product and your escalation rules, working from your scripts rather than a generic playbook, so a caller cannot tell where our team ends and yours begins.',
    features: [
      'Customer enquiry handling',
      'Order and account support',
      'Escalation routing into your team',
      'Recorded call quality monitoring',
    ],
    icon: 'phone-incoming',
  },
  {
    slug: 'outbound-campaigns',
    title: 'Outbound Campaigns',
    promise: 'Dialer-driven outbound teams for sales, follow-up and campaign outreach.',
    forWho: 'Companies running acquisition or retention campaigns that need consistent contact volume.',
    body:
      'Outbound lives or dies on contact rate and consistency. We run dialer-driven teams against your list with defined talk paths, test the script variants that actually move conversion, and report the numbers weekly so you can see what is working before the month closes.',
    features: [
      'Sales and acquisition calling',
      'Appointment setting',
      'Follow-up and retention calls',
      'Script testing and refinement',
    ],
    icon: 'phone-outgoing',
  },
  {
    slug: 'customer-support',
    title: 'Customer Support Desk',
    promise: 'A dedicated support desk on your hours, with defined response standards.',
    forWho: 'Businesses that need reliable coverage without building an in-house desk.',
    body:
      'A dedicated desk means named people who know your product, not a shared pool rotating between accounts. We work to your response standards, your knowledge base and your hours, and report against them rather than against our own internal targets.',
    features: [
      'Extended-hours operational coverage',
      'Multi-channel handling',
      'Process and knowledge base adherence',
      'Performance reporting you can audit',
    ],
    icon: 'headset',
  },
  {
    slug: 'lead-generation',
    title: 'Lead Generation',
    promise: 'Qualified pipeline built by agents trained on your qualification criteria.',
    forWho: 'Sales teams that want to spend their time closing rather than prospecting.',
    body:
      'A lead that does not meet your criteria costs more than no lead at all, because your closers pay for it in wasted hours. We qualify against the conditions you define, hand over warm rather than cold, and track what converts so the criteria sharpen over time.',
    features: [
      'Prospect research and list building',
      'Qualification against your criteria',
      'Warm transfer or scheduled handover',
      'Conversion tracking end to end',
    ],
    icon: 'target',
  },
  {
    slug: 'sales-verification',
    title: 'Sales & Verification',
    promise: 'Compliance-led verification calling with documented scripts and a full audit trail.',
    forWho: 'Insurance and regulated sellers that need documented verification steps.',
    body:
      'In regulated sales the call recording is the evidence. Our verification teams work from approved scripts, capture the required disclosures in order, and leave a documented trail for every contact, so an audit is a retrieval exercise rather than an investigation.',
    features: [
      'Sales verification calling',
      'Compliance script adherence',
      'Documentation and audit trail',
      'Independent quality review',
    ],
    icon: 'shield-check',
  },
  {
    slug: 'medical-billing',
    title: 'Medical Billing Support',
    promise: 'Back-office billing capacity handled by teams trained on healthcare workflows.',
    forWho: 'Healthcare providers and billing companies that need added processing capacity.',
    body:
      'Billing backlogs are a cash-flow problem long before they become an admin problem. We add trained capacity to the parts of the cycle that stall — eligibility checks, claim follow-up, records accuracy — so ageing claims keep moving while your own team handles the exceptions.',
    features: [
      'Claims processing support',
      'Eligibility and benefits verification',
      'Follow-up on outstanding claims',
      'Records accuracy checks',
    ],
    icon: 'file-text',
  },
  {
    slug: 'b2b-outreach',
    title: 'B2B Outreach',
    promise: 'Outreach teams working named account lists into decision-maker conversations.',
    forWho: 'B2B companies selling into defined industries or named account lists.',
    body:
      'Enterprise lists do not respond to volume, they respond to sequence and relevance. We identify the decision maker, run multi-touch sequences against the account rather than the contact, and book the meeting your team actually wants to take.',
    features: [
      'Decision-maker identification',
      'Multi-touch outreach sequences',
      'Meeting booking',
      'Pipeline reporting',
    ],
    icon: 'building',
  },
  {
    slug: 'digital-marketing',
    title: 'Digital Marketing',
    promise: 'Demand generation that feeds the contact centre rather than running beside it.',
    forWho: 'Brands that want visibility and lead flow connected to the team that works the leads.',
    body:
      'Marketing and the contact centre usually report separately, which is why lead quality arguments never resolve. Running both under one roof means the team generating the lead hears the call that follows it, and the targeting tightens against what actually closed.',
    features: [
      'Paid and organic visibility',
      'Landing page and funnel build',
      'Lead capture wired into the dialer',
      'Reporting from click through to close',
    ],
    icon: 'megaphone',
  },
];

export const capabilityBySlug = (slug: string) =>
  capabilities.find((c) => c.slug === slug);
