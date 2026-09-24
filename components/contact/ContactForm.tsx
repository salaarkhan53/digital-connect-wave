'use client';

import { useSearchParams } from 'next/navigation';
import { useMemo, useState, cloneElement, isValidElement } from 'react';
import { Check, Loader2 } from 'lucide-react';
import { capabilities } from '@/content/capabilities';
import { contact } from '@/content/contact';
import { ActionButton } from '@/components/ui/Button';
import { nameError } from '@/lib/validate';

/**
 * Enquiries go through Web3Forms to the same inbox as job applications. The
 * site is a static export with no server of its own, so a form endpoint is the
 * only way an enquiry actually reaches anyone.
 *
 * The access key is a public identifier by design and is shared with the
 * careers form; it is registered against the destination address, not against
 * a particular form.
 */
const ENDPOINT = 'https://api.web3forms.com/submit';
const ACCESS_KEY = process.env.NEXT_PUBLIC_WEB3FORMS_KEY ?? '';

type Status = 'idle' | 'sending' | 'sent' | 'failed';
type Errors = Partial<Record<'name' | 'email' | 'message', string>>;

const field =
  'mt-2 w-full rounded-xl border border-[color:var(--color-hairline)] bg-white px-4 py-3 ' +
  'text-sm text-ink placeholder:text-muted/60 transition-colors duration-[160ms] ' +
  'focus:border-blue hover:border-muted/40';

export function ContactForm() {
  const params = useSearchParams();
  const [status, setStatus] = useState<Status>('idle');
  const [errors, setErrors] = useState<Errors>({});
  const [failure, setFailure] = useState('');

  /**
   * The savings calculator links here with its inputs attached, so the enquiry
   * arrives with the context the visitor already worked out.
   */
  const prefill = useMemo(() => {
    const seats = params.get('seats');
    const hours = params.get('hours');
    const rate = params.get('rate');
    const target = params.get('target');
    if (!seats || !hours) return '';
    return (
      `From the savings estimator: ${seats} seats, ${hours} hours per seat per week` +
      (rate ? `, in-house cost $${rate}/hr` : '') +
      (target ? `, target outsourced rate $${target}/hr` : '') +
      '.\n\n'
    );
  }, [params]);

  const [message, setMessage] = useState(prefill);

  /*
   * React's documented pattern for state that has to follow a prop-like value:
   * adjust it during render rather than in an effect. An effect here would run
   * after paint, so the visitor would briefly see an empty box before the
   * calculator's figures appeared in it.
   *
   * Anything they have typed since is kept — only a genuinely new prefill,
   * from arriving with different calculator inputs, replaces the draft.
   */
  const [lastPrefill, setLastPrefill] = useState(prefill);
  if (prefill !== lastPrefill) {
    setLastPrefill(prefill);
    setMessage(prefill);
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);

    const next: Errors = {};
    const name = String(data.get('name') ?? '').trim();
    const email = String(data.get('email') ?? '').trim();
    const body = String(data.get('message') ?? '').trim();

    if (!name) next.name = 'Please tell us who you are.';
    else {
      const problem = nameError(name, 'Your name');
      if (problem) next.name = problem;
    }
    if (!email) next.email = 'We need an email to reply to.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) next.email = 'That email does not look right.';
    if (body.length < 10) next.message = 'A sentence or two about the campaign helps.';

    setErrors(next);
    if (Object.keys(next).length > 0) {
      // Move focus to the first problem rather than leaving it at the button.
      form.querySelector<HTMLElement>(`[name="${Object.keys(next)[0]}"]`)?.focus();
      return;
    }

    data.set('subject', `Enquiry: ${data.get('service') || 'General'} - ${name}`);

    setStatus('sending');
    setFailure('');

    try {
      const res = await fetch(ENDPOINT, { method: 'POST', body: data });
      const json = (await res.json()) as { message?: string };
      if (!res.ok) throw new Error(json.message || `Could not send (${res.status}).`);
      setStatus('sent');
    } catch (err) {
      setStatus('failed');
      setFailure(
        err instanceof Error ? err.message : 'Something went wrong sending that.',
      );
    }
  }

  // Without a key the form cannot deliver, so it says so rather than taking an
  // enquiry into a void. See README, "Careers applications", for the setup.
  if (!ACCESS_KEY) {
    return (
      <div className="rounded-2xl border border-amber-400/40 bg-amber-50 p-8">
        <h2 className="font-display text-xl font-medium text-ink">
          The form is not connected yet
        </h2>
        <p className="body-justify mt-3 leading-relaxed text-muted">
          This form needs a Web3Forms access key before it can deliver anything,
          and it will not pretend to submit without one. In the meantime, email
          or call and you will reach the same people.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <a
            href={`mailto:${contact.email}`}
            className="inline-flex min-h-[44px] items-center rounded-full bg-blue px-6 py-3 text-sm font-medium text-white"
          >
            Email {contact.email}
          </a>
          <a
            href={contact.phoneHref}
            className="inline-flex min-h-[44px] items-center rounded-full border border-[color:var(--color-hairline)] px-6 py-3 text-sm font-medium text-ink"
          >
            {contact.phoneDisplay}
          </a>
        </div>
      </div>
    );
  }

  if (status === 'sent') {
    return (
      <div
        role="status"
        className="rounded-2xl border border-blue/30 bg-blue/[0.04] p-8 text-center"
      >
        <span
          className="mx-auto flex size-12 items-center justify-center rounded-full bg-blue text-white"
          aria-hidden="true"
        >
          <Check className="size-6" strokeWidth={2.5} />
        </span>
        <h2 className="mt-5 font-display text-xl font-medium text-ink">Thanks, that is with us.</h2>
        <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-muted">
          We answer business enquiries within one working day. If it is urgent,
          call{' '}
          <a href={contact.phoneHref} className="font-medium text-blue-ink">
            {contact.phoneDisplay}
          </a>{' '}
          and ask for the duty manager.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      noValidate
      className="glow-edge rounded-2xl border bg-white p-6 sm:p-8"
    >
      <input type="hidden" name="access_key" value={ACCESS_KEY} />
      <input type="hidden" name="from_name" value="Digital Connect Wave website" />
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
        <Field label="Your name" name="name" error={errors.name} required>
          <input id="name" name="name" type="text" autoComplete="name" className={field} />
        </Field>

        <Field label="Work email" name="email" error={errors.email} required>
          <input id="email" name="email" type="email" autoComplete="email" className={field} />
        </Field>

        <Field label="Company" name="company">
          <input id="company" name="company" type="text" autoComplete="organization" className={field} />
        </Field>

        <Field label="Phone" name="phone">
          <input id="phone" name="phone" type="tel" autoComplete="tel" className={field} />
        </Field>
      </div>

      <div className="mt-5">
        <Field label="What do you need run?" name="service">
          <select id="service" name="service" className={field} defaultValue="">
            <option value="">Not sure yet</option>
            {capabilities.map((cap) => (
              <option key={cap.slug} value={cap.title}>
                {cap.title}
              </option>
            ))}
          </select>
        </Field>
      </div>

      <div className="mt-5">
        <Field
          label="About the campaign"
          name="message"
          error={errors.message}
          required
          hint="Volume, hours, the standard you are held to: whatever you already know."
        >
          <textarea
            id="message"
            name="message"
            rows={5}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className={`${field} resize-y`}
          />
        </Field>
      </div>

      {status === 'failed' && (
        <p
          className="mt-6 rounded-xl border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700"
          role="alert"
        >
          {failure} You can also email {contact.email} directly.
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
            'Send enquiry'
          )}
        </ActionButton>
        <p className="text-xs text-muted">Answered within one working day.</p>
      </div>
    </form>
  );
}

function Field({
  label,
  name,
  error,
  hint,
  required,
  children,
}: {
  label: string;
  name: string;
  error?: string;
  hint?: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={name} className="text-sm font-medium text-ink">
        {label}
        {required && (
          <span className="ml-1 text-blue-ink" aria-hidden="true">
            *
          </span>
        )}
      </label>
      {hint && <p className="mt-1 text-xs text-muted">{hint}</p>}
      {/*
        The control is cloned so the error can be wired to it. `role="alert"`
        announces the message once when it appears, but a screen reader user
        who tabs back to the field afterwards got nothing: no invalid state and
        no way to reach the text. `aria-invalid` and `aria-describedby` fix
        both, and the id is derived from the field name so it stays unique.
      */}
      {isValidElement(children)
        ? cloneElement(children as React.ReactElement<Record<string, unknown>>, {
            'aria-invalid': error ? true : undefined,
            'aria-describedby': error ? `${name}-error` : undefined,
          })
        : children}
      {/* Errors sit beside the field they belong to, not in a summary at the top. */}
      {error && (
        <p id={`${name}-error`} className="mt-2 text-xs font-medium text-red-600" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
