/**
 * The confirmed contact record for Digital Connect Wave.
 *
 * The domain is digitalconnectwave.com. An earlier .net address was a
 * mistake and must not come back.
 * These values are supplied by the company and are the ONLY contact details
 * permitted anywhere in the site.
 */
export const contact = {
  verified: true,
  email: 'contact@digitalconnectwave.com',
  phoneDisplay: '+1 (325) 202-4836',
  phoneHref: 'tel:+13252024836',
  address: {
    street: '30 N Gould St, Ste R',
    city: 'Sheridan',
    state: 'WY',
    zip: '82801',
    country: 'United States',
  },
  addressLines: ['30 N Gould St, Ste R', 'Sheridan, WY 82801'],
  addressOneLine: '30 N Gould St, Ste R, Sheridan, WY 82801',
  mapQuery: '30 N Gould St Ste R, Sheridan, WY 82801',
} as const;

export const mailto = (subject?: string) =>
  subject
    ? `mailto:${contact.email}?subject=${encodeURIComponent(subject)}`
    : `mailto:${contact.email}`;
