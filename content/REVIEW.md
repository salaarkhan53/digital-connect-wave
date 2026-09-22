# Content review checklist

Everything on this list renders on the live site but has **not** been confirmed by
Digital Connect Wave. It came from the two source sites
([balitech.org](https://www.balitech.org/), [mastercontactcentre.com](https://www.mastercontactcentre.com/))
or from reasonable drafting. Confirm, change or delete each item before launch.

Search the codebase for `verified: false` to find every one of these in place.

---

## 1. Headline statistics — highest priority

`content/stats.ts`

| Figure | Where it shows | Status |
|---|---|---|
| 700+ active professionals | Home stat row, About | Inherited, unconfirmed |
| 24/5 operational coverage | Home stat row | Inherited, unconfirmed |
| 1200+ clients served | Home stat row | Inherited, unconfirmed |
| 4.99★ average client rating | Home stat row | Inherited, unconfirmed |
| Operating since 2022 | Home stat row, About timeline | Inherited, unconfirmed |

These are the four numbers a visitor will remember. If any is wrong, it is the
most damaging thing on the site. **Confirm or cut.**

## 2. Compliance statements — legally sensitive

`content/compliance.ts`

Six items: TCPA-aware calling, DNC scrubbing, recorded QA monitoring, documented
scripts, full audit trail, HIPAA-conscious workflows.

These are deliberately worded as **practices, not certifications**. Before
launch, confirm each practice is actually in place.

> **Do not** rewrite any of these as a held certification — "HIPAA certified",
> "SOC 2 compliant", "PCI DSS" — unless DCW holds that certification and can
> produce the attestation. The current wording is safe; upgrading it is not.

## 3. Company history

`content/timeline.ts`

Five entries, 2022 → 2026. The shape of this history is inherited and has not
been confirmed as DCW's own. Either replace with the real milestones or reduce
the About page to the founding year alone.

## 4. What we're measured on

`content/kpis.ts`

Six metrics, deliberately written **without numbers** so nothing is claimed.
Confirm these are the metrics DCW actually reports against. If you want
published benchmark figures here, they must come from real campaign data.

## 5. Leadership

`/about` renders no leadership section. The source site's CEO is not DCW's, so
no name was carried across. Supply real leadership details to add it.

## 6. Social accounts

`content/site.ts` → `socials` is intentionally empty, so no social row renders.
Supply real profile URLs to enable it. Do not link the source companies' accounts.

## 7. Domain

`content/site.ts` → `site.url` is set to `https://www.digitalconnectwave.net`,
inferred from the contact email. Confirm before launch — it feeds canonical
URLs, the sitemap and social share cards.

## 8. Savings calculator baseline

`lib/savings.ts` uses a labelled US market estimate for in-house cost per seat.
Supply DCW's real comparison baseline, or confirm the estimate is acceptable.
The assumption is shown on screen, so it is honest either way.

## 9. Careers applications

Apply buttons open a mailto to `Contact@digitalconnectwave.net` with the role in
the subject line. Change to an ATS or form endpoint if you have one.

## 10. Contact form delivery

`/contact` validates and shows a success state but **does not send anything** —
the submit handler is a marked TODO. Wire it to Formspree, Resend or an API
route before launch, or the form silently loses enquiries.

---

## Confirmed — do not change without instruction

- Email `Contact@digitalconnectwave.net`
- Phone `+1 (325) 202-4836`
- Address 30 N Gould St, Ste R, Sheridan, WY 82801
- US-market only. No reference to any offshore location anywhere in the site.
- Careers roles are titles only: no location, responsibilities, requirements or salary.
