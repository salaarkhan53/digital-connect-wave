'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { ArrowUpRight, ChevronDown, Menu, X } from 'lucide-react';
import { nav } from '@/content/site';
import { contact } from '@/content/contact';
import { Wordmark } from '@/components/brand/Wordmark';
import { Button } from '@/components/ui/Button';
import { MenuArt } from '@/components/art/MenuArt';

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [drawer, setDrawer] = useState(false);
  const pathname = usePathname();
  const navRef = useRef<HTMLElement>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Solidify the bar once the hero is behind it. The initial read happens on
  // the next frame rather than synchronously inside the effect, which would
  // trigger a second render before the browser has painted the first.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    const frame = requestAnimationFrame(onScroll);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  // Any navigation closes everything. Adjusted during render rather than in an
  // effect, so the menu is already closed on the first paint of the new route
  // instead of flicking shut a frame later.
  const [lastPath, setLastPath] = useState(pathname);
  if (pathname !== lastPath) {
    setLastPath(pathname);
    setOpenMenu(null);
    setDrawer(false);
  }

  // Escape closes; the drawer also locks the page behind it.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      setOpenMenu(null);
      setDrawer(false);
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);

  useEffect(() => {
    document.body.style.overflow = drawer ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [drawer]);

  // Close the panel when focus leaves the nav entirely — keyboard users need
  // this, since there is no pointerleave to rely on.
  const onBlurCapture = (e: React.FocusEvent) => {
    if (!navRef.current?.contains(e.relatedTarget as Node)) setOpenMenu(null);
  };

  const openWithCancel = (label: string) => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setOpenMenu(label);
  };
  const closeSoon = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    // Small grace period so the cursor can cross the gap into the panel.
    closeTimer.current = setTimeout(() => setOpenMenu(null), 120);
  };

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,backdrop-filter] duration-[280ms] [transition-timing-function:cubic-bezier(0.16,1,0.3,1)] ${
        scrolled || openMenu
          ? 'border-b border-white/10 bg-void/85 backdrop-blur-xl'
          : 'border-b border-transparent bg-transparent'
      }`}
    >
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-blue focus:px-4 focus:py-2 focus:text-sm focus:text-white"
      >
        Skip to content
      </a>

      <div className="shell flex h-[var(--header-h)] items-center justify-between gap-6">
        <Wordmark />

        {/* ---------------------------------------------------- desktop nav */}
        <nav
          ref={navRef}
          aria-label="Main"
          onBlurCapture={onBlurCapture}
          className="hidden items-center gap-1 lg:flex"
        >
          {nav.map((item, navIndex) => {
            const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
            if (!item.children) {
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className={`rounded-full px-4 py-2 text-sm font-medium transition-colors duration-[160ms] ${
                    active ? 'text-spark' : 'text-white/75 hover:text-white'
                  }`}
                >
                  {item.label}
                </Link>
              );
            }

            const expanded = openMenu === item.label;
            return (
              <div
                key={item.label}
                className="relative"
                onPointerEnter={() => openWithCancel(item.label)}
                onPointerLeave={closeSoon}
              >
                <button
                  type="button"
                  aria-expanded={expanded}
                  aria-controls={`menu-${item.label}`}
                  onClick={() => setOpenMenu(expanded ? null : item.label)}
                  className={`flex min-h-[44px] cursor-pointer items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium transition-colors duration-[160ms] ${
                    expanded || active ? 'text-spark' : 'text-white/75 hover:text-white'
                  }`}
                >
                  {item.label}
                  <ChevronDown
                    className={`size-3.5 transition-transform duration-[280ms] ${expanded ? 'rotate-180' : ''}`}
                    strokeWidth={2}
                    aria-hidden="true"
                  />
                </button>

                <div
                  id={`menu-${item.label}`}
                  hidden={!expanded}
                  className={`absolute left-1/2 top-[calc(100%+0.5rem)] -translate-x-1/2 ${
                    item.featured ? 'w-[min(56rem,90vw)]' : 'w-[min(32rem,90vw)]'
                  }`}
                >
                  <div className="overflow-hidden rounded-2xl border border-white/10 bg-surface/95 shadow-[0_24px_60px_-12px_rgb(0_0_0/0.7)] backdrop-blur-xl">
                    <div
                      className={`grid gap-6 p-6 ${
                        item.featured ? 'md:grid-cols-[1.6fr_1fr]' : ''
                      }`}
                    >
                      <ul className={`grid gap-1 ${item.featured ? 'sm:grid-cols-2' : ''}`}>
                        {item.children.map((child) => (
                          <li key={child.href}>
                            <Link
                              href={child.href}
                              className="block rounded-xl px-3 py-2.5 transition-colors duration-[160ms] hover:bg-white/[0.06]"
                            >
                              <span className="block text-sm font-medium text-white">
                                {child.label}
                              </span>
                              {child.blurb && (
                                <span className="mt-0.5 block text-xs leading-relaxed text-white/50">
                                  {child.blurb}
                                </span>
                              )}
                            </Link>
                          </li>
                        ))}
                      </ul>

                      {item.featured && (
                        <Link
                          href={item.featured.href}
                          className="group relative flex min-h-[15rem] flex-col justify-end overflow-hidden rounded-xl border border-white/10 bg-surface p-5 transition-colors duration-[280ms] hover:border-spark/45"
                        >
                          <MenuArt seed={navIndex} image={item.featured.image} />

                          <span className="relative flex items-center gap-1.5 font-display text-lg text-white">
                            {item.featured.label}
                            <ArrowUpRight
                              className="size-4 -translate-x-1 text-spark opacity-0 transition-all duration-[280ms] group-hover:translate-x-0 group-hover:opacity-100 motion-reduce:transition-none"
                              strokeWidth={2.5}
                              aria-hidden="true"
                            />
                          </span>
                          <span className="relative mt-1.5 text-xs leading-relaxed text-white/60">
                            {item.featured.blurb}
                          </span>
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </nav>

        <div className="hidden lg:block">
          <Button href="/contact" className="px-5 py-2.5 text-sm">
            Let&apos;s talk
          </Button>
        </div>

        {/* ------------------------------------------------- drawer toggle */}
        <button
          type="button"
          onClick={() => setDrawer((v) => !v)}
          aria-expanded={drawer}
          aria-controls="mobile-drawer"
          aria-label={drawer ? 'Close menu' : 'Open menu'}
          className="flex size-11 cursor-pointer items-center justify-center rounded-full border border-white/15 text-white lg:hidden"
        >
          {drawer ? <X className="size-5" aria-hidden="true" /> : <Menu className="size-5" aria-hidden="true" />}
        </button>
      </div>

      {/* ---------------------------------------------------- mobile drawer */}
      <div
        id="mobile-drawer"
        hidden={!drawer}
        className="mesh-field fixed inset-0 top-[var(--header-h)] z-40 overflow-y-auto border-t border-white/10 bg-void/98 backdrop-blur-xl lg:hidden"
      >
        <nav aria-label="Mobile" className="shell flex flex-col gap-8 py-8">
          {nav.map((item) => (
            <div key={item.label}>
              <Link
                href={item.href}
                className="font-display text-2xl text-white"
              >
                {item.label}
              </Link>
              {item.children && (
                <ul className="mt-3 grid gap-0.5 border-l border-white/10 pl-4">
                  {item.children.map((child) => (
                    <li key={child.href}>
                      <Link
                        href={child.href}
                        className="block min-h-[44px] py-2.5 text-sm text-white/65"
                      >
                        {child.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}

          <div className="mt-2 flex flex-col gap-3 border-t border-white/10 pt-6">
            <Button href="/contact">Let&apos;s talk outcomes</Button>
            <a
              href={contact.phoneHref}
              className="min-h-[44px] py-2 text-sm text-white/60"
            >
              {contact.phoneDisplay}
            </a>
          </div>
        </nav>
      </div>
    </header>
  );
}
