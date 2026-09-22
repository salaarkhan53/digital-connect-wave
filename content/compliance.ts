import type { ComplianceItem } from './types';

/**
 * REVIEW: these are process-level statements, deliberately worded as practices
 * rather than as held certifications. Do NOT upgrade any of these to a
 * certification claim (HIPAA certified, SOC 2, PCI DSS) until Digital Connect
 * Wave confirms it holds that certification. See content/REVIEW.md.
 */
export const complianceItems: ComplianceItem[] = [
  {
    title: 'TCPA-aware calling',
    body: 'Consent capture and calling-window rules are built into the talk path, not left to agent judgement.',
    icon: 'shield-check',
    verified: false,
  },
  {
    title: 'DNC scrubbing',
    body: 'Lists are scrubbed against do-not-call registries and your own suppression files before a campaign dials.',
    icon: 'list-x',
    verified: false,
  },
  {
    title: 'Recorded QA monitoring',
    body: 'Calls are recorded and reviewed against a written scorecard, with coaching scheduled against what the reviews find.',
    icon: 'headphones',
    verified: false,
  },
  {
    title: 'Documented scripts',
    body: 'Agents work from approved talk paths. Script changes are versioned and signed off before they reach the floor.',
    icon: 'file-check',
    verified: false,
  },
  {
    title: 'Full audit trail',
    body: 'Every contact leaves a retrievable record, so an audit is a retrieval exercise rather than an investigation.',
    icon: 'archive',
    verified: false,
  },
  {
    title: 'HIPAA-conscious workflows',
    body: 'Healthcare campaigns run on minimum-necessary access with defined handling rules for protected information.',
    icon: 'lock',
    verified: false,
  },
];
