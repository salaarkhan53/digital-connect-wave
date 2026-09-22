import localFont from 'next/font/local';

/**
 * Self-hosted from app/fonts (Fontshare, free for commercial use).
 * No third-party CDN request, and no layout shift.
 */

export const clashDisplay = localFont({
  src: [
    { path: './fonts/clash-display-500.woff2', weight: '500', style: 'normal' },
    { path: './fonts/clash-display-600.woff2', weight: '600', style: 'normal' },
    { path: './fonts/clash-display-700.woff2', weight: '700', style: 'normal' },
  ],
  variable: '--font-display',
  display: 'swap',
  fallback: ['ui-sans-serif', 'system-ui', 'sans-serif'],
});

export const satoshi = localFont({
  src: [
    { path: './fonts/satoshi-400.woff2', weight: '400', style: 'normal' },
    { path: './fonts/satoshi-500.woff2', weight: '500', style: 'normal' },
    { path: './fonts/satoshi-700.woff2', weight: '700', style: 'normal' },
  ],
  variable: '--font-body',
  display: 'swap',
  fallback: ['ui-sans-serif', 'system-ui', 'sans-serif'],
});
