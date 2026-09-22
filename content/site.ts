import { capabilities } from './capabilities';
import { industries } from './industries';

/**
 * Brand, navigation and SEO defaults. Every page reads its metadata from here.
 */
export const site = {
  name: 'Digital Connect Wave',
  shortName: 'DCW',
  tagline: "Connecting Tomorrow's Possibilities",
  /** REVIEW: confirm the production domain before launch. */
  url: 'https://www.digitalconnectwave.net',
  description:
    'Digital Connect Wave runs the contact operations behind US brands: inbound support, outbound campaigns, lead generation and compliance-led verification, built on documented process and recorded QA.',
} as const;

export type NavChild = { label: string; href: string; blurb?: string };
export type NavItem = {
  label: string;
  href: string;
  /** Renders as a mega-menu panel when present. */
  children?: NavChild[];
  featured?: { label: string; href: string; blurb: string };
};

export const nav: NavItem[] = [
  {
    label: 'Capabilities',
    href: '/capabilities',
    children: capabilities.map((c) => ({
      label: c.title,
      href: `/capabilities/${c.slug}`,
      blurb: c.promise,
    })),
    featured: {
      label: 'How we work',
      href: '/about#process',
      blurb: 'Discover, Build, Train, Launch, Optimize — the five steps every campaign runs through.',
    },
  },
  {
    label: 'Industries',
    href: '/industries',
    children: industries.map((i) => ({
      label: i.title,
      href: `/industries/${i.slug}`,
      blurb: i.summary,
    })),
    featured: {
      label: 'Compliance',
      href: '/compliance',
      blurb: 'How QA monitoring, script adherence and audit trails actually work here.',
    },
  },
  {
    label: 'Company',
    href: '/about',
    children: [
      { label: 'About', href: '/about', blurb: 'Who we are and what we hold ourselves to.' },
      { label: 'Compliance', href: '/compliance', blurb: 'Process, monitoring and audit trail.' },
      { label: 'Careers', href: '/careers', blurb: 'Open roles and how we promote.' },
    ],
  },
  { label: 'Contact', href: '/contact' },
];

/** Footer link groups. */
export const footerNav = [
  {
    title: 'Capabilities',
    links: capabilities.slice(0, 5).map((c) => ({ label: c.title, href: `/capabilities/${c.slug}` })),
  },
  {
    title: 'Industries',
    links: industries.slice(0, 5).map((i) => ({ label: i.title, href: `/industries/${i.slug}` })),
  },
  {
    title: 'Company',
    links: [
      { label: 'About', href: '/about' },
      { label: 'Compliance', href: '/compliance' },
      { label: 'Careers', href: '/careers' },
      { label: 'Contact', href: '/contact' },
    ],
  },
];

/**
 * REVIEW: no social accounts have been confirmed for Digital Connect Wave.
 * Leaving this empty renders no social row, which is correct until real
 * profile URLs are supplied. Do not link to the source companies' accounts.
 */
export const socials: { label: string; href: string; icon: string }[] = [];
