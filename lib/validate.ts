/**
 * Field rules shared by the contact and careers forms, so the two cannot
 * disagree about what a name or a phone number is.
 */

/**
 * A person, city or state name: letters and the marks that go with them, plus
 * the punctuation real names actually contain. No digits.
 *
 * `\p{L}` and `\p{M}` rather than `A-Za-z`, so accented and non-Latin names are
 * accepted rather than rejected as malformed.
 */
const NAME_SHAPE = /^[\p{L}\p{M}][\p{L}\p{M}\s'’.\-]*$/u;

/**
 * Validates a name-like field.
 *
 * Returns an error message, or null when it is fine. Digits get their own
 * message because that is the mistake people actually make and "that does not
 * look right" would not tell them what to change.
 */
export function nameError(value: string, label: string): string | null {
  const v = value.trim();
  if (!v) return null; // presence is the caller's business
  if (/\d/.test(v)) return `${label} cannot contain numbers.`;
  if (v.length < 2) return `That ${label.toLowerCase()} looks too short.`;
  if (!NAME_SHAPE.test(v)) return `That does not look like a ${label.toLowerCase()}.`;
  return null;
}

/**
 * Normalizes a phone number to E.164, or null if it is not one we recognise.
 *
 * Accepts the two shapes that actually arrive: a US number, and the local
 * format people type when they are not in the US. A bare ten digits is read as
 * US, since that is the common case and the alternative readings are all
 * eleven or twelve digits long.
 */
export function normalizePhone(raw: string): string | null {
  const trimmed = raw.trim();
  const digits = trimmed.replace(/\D/g, '');

  if (trimmed.startsWith('+')) {
    if (/^1\d{10}$/.test(digits)) return `+${digits}`;
    if (/^92\d{10}$/.test(digits)) return `+${digits}`;
    return null;
  }

  if (/^\d{10}$/.test(digits)) return `+1${digits}`;
  if (/^1\d{10}$/.test(digits)) return `+${digits}`;
  if (/^92\d{10}$/.test(digits)) return `+${digits}`;
  // Local trunk form: a leading 0 replaced by the country code.
  if (/^0\d{10}$/.test(digits)) return `+92${digits.slice(1)}`;

  return null;
}

/**
 * The one message shown for a number we cannot read.
 *
 * Deliberately says nothing about which countries are accepted: this is a US
 * market site, and listing the formats in an error would put that detail in
 * front of every applicant who mistypes a digit.
 */
export const PHONE_ERROR = 'That does not look like a valid phone number.';
