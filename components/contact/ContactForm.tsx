'use client';

import { useSearchParams } from 'next/navigation';
import { useMemo, useState } from 'react';
import { Check, Loader2 } from 'lucide-react';
import { capabilities } from '@/content/capabilities';
import { contact } from '@/content/contact';
import { ActionButton } from '@/components/ui/Button';

type Status = 'idle' | 'sending' | 'sent';
type Errors = Partial<Record<'name' | 'email' | 'message', string>>;

const field =
  'mt-2 w-full rounded-xl border border-[color:var(--color-hairline)] bg-white px-4 py-3 ' +
  'text-sm text-ink placeholder:text-muted/60 transition-colors duration-[160ms] ' +
  'focus:border-blue hover:border-muted/40';

export function ContactForm() {
  const params = useSearchParams();
  const [status, setStatus] = useState<Status>('idle');
  const [errors, setErrors] = useState<Errors>({});

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
    if (!email) next.email = 'We need an email to reply to.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) next.email = 'That email does not look right.';
    if (body.length < 10) next.message = 'A sentence or two about the campaign helps.';

    setErrors(next);
    if (Object.keys(next).length > 0) {
      // Move focus to the first problem rather than leaving it at the button.
      form.querySelector<HTMLElement>(`[name="${Object.keys(next)[0]}"]`)?.focus();
      return;
    }

    setStatus('sending');

    // TODO(delivery): no backend is wired up yet. Point this at an API route,
    // Formspree or Resend before launch — until then the form validates and
    // confirms but does not actually send. See content/REVIEW.md item 10.
    await new Promise((r) => setTimeout(r, 700));
    setStatus('sent');
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
        <h2 className="mt-5 font-display text-xl font-medium text-ink">Thanks — that is with us.</h2>
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
      className="rounded-2xl border border-[color:var(--color-hairline)] bg-white p-6 sm:p-8"
    >
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
          hint="Volume, hours, the standard you are held to — whatever you already know."
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
      {children}
      {/* Errors sit beside the field they belong to, not in a summary at the top. */}
      {error && (
        <p className="mt-2 text-xs font-medium text-red-600" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
