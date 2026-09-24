'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useRef, useState } from 'react';
import { Check, FileText, Loader2, Upload } from 'lucide-react';
import { experienceLevels, roleBySlug, roles } from '@/content/careers';
import { contact } from '@/content/contact';
import { ActionButton } from '@/components/ui/Button';
import { nameError, normalizePhone, PHONE_ERROR } from '@/lib/validate';

/**
 * Job application form.
 *
 * Posts multipart to Web3Forms, which forwards the fields and the attached CV
 * to the address its access key is registered against. The site is a static
 * export with no server of its own, so the alternative would be no attachment
 * at all: a mailto link cannot carry a file.
 *
 * The access key is a public identifier by design (Web3Forms documents it as
 * safe to expose), which is why it travels as NEXT_PUBLIC_. Without it the
 * form refuses to pretend, and points the applicant at email instead.
 */
const ENDPOINT = 'https://api.web3forms.com/submit';
const ACCESS_KEY = process.env.NEXT_PUBLIC_WEB3FORMS_KEY ?? '';

/** Free plan ceiling. Anything larger is rejected by the API, so stop it here. */
const MAX_BYTES = 5 * 1024 * 1024;
const ACCEPT = ['.pdf', '.doc', '.docx'];
const ACCEPT_MIME = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
];

type Field = 'name' | 'email' | 'attachment' | 'city' | 'state' | 'phone' | 'experience';
type Errors = Partial<Record<Field, string>>;
type Status = 'idle' | 'sending' | 'sent' | 'failed';

const input =
  'mt-2 w-full rounded-xl border border-[color:var(--color-hairline)] bg-white px-4 py-3 ' +
  'text-sm text-ink placeholder:text-muted/60 transition-colors duration-[160ms] ' +
  'focus:border-blue hover:border-muted/40';

export function ApplicationForm() {
  const params = useSearchParams();
  const formRef = useRef<HTMLFormElement>(null);

  const requested = params.get('role');
  const matched = requested ? roleBySlug(requested) : undefined;

  const [role, setRole] = useState(matched?.title ?? '');
  const [fileName, setFileName] = useState('');
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<Status>('idle');
  const [failure, setFailure] = useState('');

  function validate(data: FormData): Errors {
    const next: Errors = {};

    const name = String(data.get('name') ?? '').trim();
    const email = String(data.get('email') ?? '').trim();
    const city = String(data.get('city') ?? '').trim();
    const state = String(data.get('state') ?? '').trim();
    const phone = String(data.get('phone') ?? '').trim();
    const experience = String(data.get('experience') ?? '');
    const file = data.get('attachment');

    if (!name) next.name = 'Please tell us your name.';
    else {
      const problem = nameError(name, 'Your name');
      if (problem) next.name = problem;
    }
    if (!email) next.email = 'We need an email to reply to.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) next.email = 'That email does not look right.';

    if (!(file instanceof File) || file.size === 0) {
      next.attachment = 'Please attach your CV.';
    } else if (file.size > MAX_BYTES) {
      next.attachment = `That file is ${(file.size / 1024 / 1024).toFixed(1)} MB. The limit is 5 MB.`;
    } else {
      const name = file.name.toLowerCase();
      const okExt = ACCEPT.some((ext) => name.endsWith(ext));
      const okMime = ACCEPT_MIME.includes(file.type);
      if (!okExt && !okMime) next.attachment = 'PDF or Word document only.';
    }

    if (!city) next.city = 'Please tell us your city.';
    else {
      const problem = nameError(city, 'City');
      if (problem) next.city = problem;
    }
    if (!state) next.state = 'Please tell us your state.';
    else {
      const problem = nameError(state, 'State');
      if (problem) next.state = problem;
    }

    if (!phone) next.phone = 'We need a number to reach you on.';
    else if (!normalizePhone(phone)) next.phone = PHONE_ERROR;

    if (!experience) next.experience = 'Pick the closest band.';

    return next;
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);

    const next = validate(data);
    setErrors(next);
    if (Object.keys(next).length > 0) {
      const first = Object.keys(next)[0];
      form.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
      return;
    }

    // Tidy the values Web3Forms will put in the notification email.
    const phone = normalizePhone(String(data.get('phone') ?? ''));
    if (phone) data.set('phone', phone);
    data.set('subject', `Application: ${role || 'General'} - ${data.get('name')}`);

    setStatus('sending');
    setFailure('');

    try {
      const res = await fetch(ENDPOINT, { method: 'POST', body: data });
      const json = (await res.json()) as { message?: string };
      if (!res.ok) throw new Error(json.message || `Upload failed (${res.status}).`);
      setStatus('sent');
    } catch (err) {
      setStatus('failed');
      setFailure(
        err instanceof Error
          ? err.message
          : 'Something went wrong sending that. Please try again.',
      );
    }
  }

  /* ------------------------------------------------------- not connected */

  if (!ACCESS_KEY) {
    return (
      <div className="rounded-2xl border border-amber-400/40 bg-amber-50 p-8">
        <h2 className="font-display text-xl font-medium text-ink">
          Applications are not connected yet
        </h2>
        <p className="body-justify mt-3 leading-relaxed text-muted">
          This form needs a Web3Forms access key before it can deliver anything,
          and it will not pretend to submit without one. In the meantime, email
          your CV directly and we will pick it up.
        </p>
        <a
          href={`mailto:${contact.email}?subject=${encodeURIComponent(`Application: ${role || 'General'}`)}`}
          className="mt-6 inline-flex min-h-[44px] items-center gap-2 rounded-full bg-blue px-6 py-3 text-sm font-medium text-white"
        >
          Email {contact.email}
        </a>
      </div>
    );
  }

  /* -------------------------------------------------------------- sent */

  if (status === 'sent') {
    return (
      <div role="status" className="rounded-2xl border border-blue/30 bg-blue/[0.04] p-8 text-center">
        <span
          className="mx-auto flex size-12 items-center justify-center rounded-full bg-blue text-white"
          aria-hidden="true"
        >
          <Check className="size-6" strokeWidth={2.5} />
        </span>
        <h2 className="mt-5 font-display text-xl font-medium text-ink">
          Application received
        </h2>
        <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-muted">
          Thanks{role ? ` for applying for ${role}` : ''}. Your CV is with the
          team and we will come back to you about the campaign, the shift and
          the numbers.
        </p>
        <Link
          href="/careers"
          className="mt-6 inline-flex min-h-[44px] items-center text-sm font-medium text-blue-ink"
        >
          Back to open roles
        </Link>
      </div>
    );
  }

  /* -------------------------------------------------------------- form */

  return (
    <form
      ref={formRef}
      onSubmit={onSubmit}
      noValidate
      encType="multipart/form-data"
      className="glow-edge rounded-2xl border bg-white p-6 sm:p-8"
    >
      <input type="hidden" name="access_key" value={ACCESS_KEY} />
      <input type="hidden" name="from_name" value="Digital Connect Wave careers" />
      <input type="hidden" name="role" value={role} />
      {/* Honeypot. Hidden from people, filled in by bots. */}
      <input
        type="checkbox"
        name="botcheck"
        tabIndex={-1}
        autoComplete="off"
        className="hidden"
        style={{ display: 'none' }}
      />

      <div className="grid gap-5 sm:grid-cols-2">
        <Labelled label="Applying for" htmlFor="role-select">
          <select
            id="role-select"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className={input}
          >
            <option value="">General application</option>
            {roles.map((r) => (
              <option key={r.slug} value={r.title}>
                {r.title}
              </option>
            ))}
          </select>
        </Labelled>

        <Labelled label="Your name" htmlFor="name" required error={errors.name}>
          <input
            id="name"
            name="name"
            type="text"
            autoComplete="name"
            placeholder="E.g. Jordan Miller"
            className={input}
          />
        </Labelled>

        <Labelled label="Your email" htmlFor="email" required error={errors.email}>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="E.g. you@email.com"
            className={input}
          />
        </Labelled>

        <Labelled
          label="Phone"
          htmlFor="phone"
          required
          error={errors.phone}
        >
          <input
            id="phone"
            name="phone"
            type="tel"
            autoComplete="tel"
            placeholder="E.g. +1 307 555 0123"
            className={input}
          />
        </Labelled>
      </div>

      {/* --------------------------------------------------------- CV */}
      <div className="mt-5">
        <Labelled
          label="Upload CV"
          htmlFor="attachment"
          required
          error={errors.attachment}
          hint="PDF or Word document, up to 5 MB"
        >
          <div className="mt-2 flex flex-wrap items-center gap-3">
            <label
              htmlFor="attachment"
              className="inline-flex min-h-[44px] cursor-pointer items-center gap-2 rounded-xl border border-blue/30 bg-blue/[0.06] px-5 py-3 text-sm font-medium text-blue-ink transition-colors duration-[160ms] hover:border-blue hover:bg-blue/10"
            >
              <Upload className="size-4" strokeWidth={2} aria-hidden="true" />
              Choose file
            </label>
            <span className="flex items-center gap-2 text-sm text-muted">
              {fileName ? (
                <>
                  <FileText className="size-4 text-blue-ink" strokeWidth={1.75} aria-hidden="true" />
                  {fileName}
                </>
              ) : (
                'No file chosen'
              )}
            </span>
          </div>
          <input
            id="attachment"
            name="attachment"
            type="file"
            accept={[...ACCEPT, ...ACCEPT_MIME].join(',')}
            onChange={(e) => setFileName(e.target.files?.[0]?.name ?? '')}
            className="sr-only"
          />
        </Labelled>
      </div>

      {/* ----------------------------------------------------- address */}
      <div className="mt-5">
        <Labelled label="Street address" htmlFor="street" optional>
          <input
            id="street"
            name="street"
            type="text"
            autoComplete="address-line1"
            placeholder="E.g. 120 Main Street"
            className={input}
          />
        </Labelled>
      </div>

      <div className="mt-5 grid gap-5 sm:grid-cols-2">
        <Labelled label="City" htmlFor="city" required error={errors.city}>
          <input
            id="city"
            name="city"
            type="text"
            autoComplete="address-level2"
            placeholder="E.g. Sheridan"
            className={input}
          />
        </Labelled>

        <Labelled label="State" htmlFor="state" required error={errors.state}>
          <input
            id="state"
            name="state"
            type="text"
            autoComplete="address-level1"
            placeholder="E.g. Wyoming"
            className={input}
          />
        </Labelled>
      </div>

      {/* -------------------------------------------------- experience */}
      <fieldset className="mt-6">
        <legend className="text-sm font-medium text-ink">
          Years of experience
          <span className="ml-1 text-blue-ink" aria-hidden="true">
            *
          </span>
        </legend>

        <div className="mt-3 flex flex-wrap gap-2.5">
          {experienceLevels.map((level) => (
            <label
              key={level}
              className="group inline-flex min-h-[44px] cursor-pointer items-center gap-2.5 rounded-full border border-[color:var(--color-hairline)] px-4 py-2.5 text-sm text-ink transition-colors duration-[160ms] hover:border-blue has-[:checked]:border-blue has-[:checked]:bg-blue/[0.06] has-[:checked]:font-medium has-[:checked]:text-blue-ink"
            >
              <input
                type="radio"
                name="experience"
                value={level}
                className="size-4 accent-[color:var(--color-blue)]"
              />
              {level}
            </label>
          ))}
        </div>

        {errors.experience && (
          <p className="mt-2 text-xs font-medium text-red-600" role="alert">
            {errors.experience}
          </p>
        )}
      </fieldset>

      {status === 'failed' && (
        <p
          className="mt-6 rounded-xl border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700"
          role="alert"
        >
          {failure} You can also email your CV to {contact.email}.
        </p>
      )}

      <div className="mt-7 flex flex-wrap items-center gap-4">
        <ActionButton type="submit" disabled={status === 'sending'}>
          {status === 'sending' ? (
            <>
              <Loader2 className="size-4 animate-spin" strokeWidth={2} aria-hidden="true" />
              Sending
            </>
          ) : (
            'Submit application'
          )}
        </ActionButton>
        <p className="text-xs text-muted">We read every application.</p>
      </div>
    </form>
  );
}

function Labelled({
  label,
  htmlFor,
  required,
  optional,
  hint,
  error,
  children,
}: {
  label: string;
  htmlFor: string;
  required?: boolean;
  optional?: boolean;
  hint?: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={htmlFor} className="text-sm font-medium text-ink">
        {label}
        {required && (
          <span className="ml-1 text-blue-ink" aria-hidden="true">
            *
          </span>
        )}
        {optional && <span className="ml-1.5 font-normal text-muted">(optional)</span>}
      </label>
      {hint && <p className="mt-1 text-xs text-muted">{hint}</p>}
      {children}
      {error && (
        <p className="mt-2 text-xs font-medium text-red-600" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
