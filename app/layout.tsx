import type { Metadata } from 'next';
import { clashDisplay, satoshi } from './fonts';
import { site } from '@/content/site';
import { contact } from '@/content/contact';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { SmoothScroll } from '@/components/providers/SmoothScroll';
import './globals.css';

/** True for the GitHub Pages review build. */
const isPreview = process.env.NEXT_PUBLIC_PREVIEW === 'true';

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} — ${site.tagline}`,
    template: `%s — ${site.name}`,
  },
  description: site.description,
  openGraph: {
    type: 'website',
    siteName: site.name,
    title: `${site.name} — ${site.tagline}`,
    description: site.description,
    url: site.url,
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: `${site.name} — ${site.tagline}`,
    description: site.description,
  },
  /*
   * A review deployment is a work in progress carrying figures that are not
   * confirmed yet, so it tells crawlers to stay away. Production indexes
   * normally.
   */
  robots: isPreview
    ? { index: false, follow: false, nocache: true }
    : { index: true, follow: true },
};

/**
 * Structured data. Built from content/contact.ts so the address and phone can
 * never drift from what the pages render.
 */
const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'ProfessionalService',
  name: site.name,
  description: site.description,
  url: site.url,
  slogan: site.tagline,
  email: contact.email,
  telephone: contact.phoneHref.replace('tel:', ''),
  areaServed: { '@type': 'Country', name: 'United States' },
  address: {
    '@type': 'PostalAddress',
    streetAddress: contact.address.street,
    addressLocality: contact.address.city,
    addressRegion: contact.address.state,
    postalCode: contact.address.zip,
    addressCountry: 'US',
  },
};

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html
      lang="en"
      className={`${clashDisplay.variable} ${satoshi.variable} antialiased`}
      // The inline script below sets data-js on <html> before hydration, which
      // React would otherwise report as a server/client attribute mismatch.
      suppressHydrationWarning
    >
      <head>
        {/*
          Marks the document as JS-capable before first paint, which is what
          gates the reveal animations. Without it the page still renders — it
          just renders everything visible, which is the correct fallback.

          This sets a data attribute rather than a class: React owns the
          className on <html>, and mutating it here would trip a hydration
          mismatch on every load.
        */}
        <script
          dangerouslySetInnerHTML={{
            __html: `document.documentElement.dataset.js='1'`,
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="flex min-h-dvh flex-col">
        <SmoothScroll />
        <Header />
        <main id="main" className="flex-1">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
