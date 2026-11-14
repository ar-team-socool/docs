'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useRef } from 'react';
// The theme keeps the lit table-of-contents item in a store it does not export. This is the module
// its table of contents imports, so writing here moves the theme's own highlight and list scroll.
import { setActiveSlug, useActiveAnchor } from '../node_modules/nextra-theme-docs/dist/stores/index.js';

/** Keys that scroll the page, after which the page, not the last link pressed, decides. */
const SCROLL_KEYS = new Set(['ArrowUp', 'ArrowDown', 'PageUp', 'PageDown', 'Home', 'End', ' ']);

/** The table of contents' headings on the page, in order, as `[slug, element]`. */
function headings() {
  return [...document.querySelectorAll('nav.nextra-toc a[href^="#"]')]
    .map((a) => decodeURIComponent(a.getAttribute('href').slice(1)))
    .map((slug) => [slug, document.getElementById(slug)])
    .filter(([, el]) => el);
}

/**
 * The heading the reader has reached: the last one above a line a fifth of the way down the
 * window. Over the last window's worth of scrolling that line slides to the window's bottom edge,
 * so each heading in the final screen gets its turn and the bottom of the page lights the last one.
 * The theme's own rule only lights a heading that reaches the top fifth, which the headings in a
 * short final screen never do.
 */
function headingAtScroll() {
  const nav = parseFloat(getComputedStyle(document.body).getPropertyValue('--nextra-navbar-height')) || 0;
  const base = Math.max(nav, innerHeight * 0.2);
  const max = document.documentElement.scrollHeight - innerHeight;
  const reach = Math.min(innerHeight - base, max);
  const progress = reach > 0 ? Math.min(1, Math.max(0, (reach - (max - scrollY)) / reach)) : 0;
  const line = base + (innerHeight - base) * progress;
  let slug = '';
  for (const [s, el] of headings()) {
    if (el.getBoundingClientRect().top > line + 1) break;
    slug = s;
  }
  return slug;
}

/**
 * Decides which table-of-contents item is lit. A heading the reader jumps to by a link stays lit
 * until they scroll the page themselves, even when the page cannot scroll it to the top; otherwise
 * the item follows `headingAtScroll`.
 */
export function TocActiveHeading() {
  const pathname = usePathname();
  const active = useActiveAnchor();
  const chosen = useRef(null);

  const want = () => {
    const pick = chosen.current;
    if (pick && headings().some(([s]) => s === pick)) return pick;
    return headingAtScroll();
  };

  // The theme's observer still writes the store as headings cross its band; put the choice back.
  useEffect(() => {
    const slug = want();
    if (slug !== active) setActiveSlug(slug);
  }, [active]);

  useEffect(() => {
    const fromHash = () => (location.hash.length > 1 ? decodeURIComponent(location.hash.slice(1)) : null);
    chosen.current = fromHash();
    let frame = 0;
    const apply = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => setActiveSlug(want()));
    };
    const release = () => {
      chosen.current = null;
    };
    const onKey = (event) => {
      if (SCROLL_KEYS.has(event.key)) release();
    };
    const onClick = (event) => {
      const link = event.target.closest?.('a[href^="#"]');
      if (!link || link.getAttribute('href').length < 2) return;
      chosen.current = decodeURIComponent(link.getAttribute('href').slice(1));
      apply();
    };
    const onHash = () => {
      chosen.current = fromHash();
      apply();
    };
    addEventListener('scroll', apply, { passive: true });
    addEventListener('resize', apply);
    addEventListener('hashchange', onHash);
    addEventListener('wheel', release, { passive: true });
    addEventListener('touchstart', release, { passive: true });
    addEventListener('pointerdown', release);
    addEventListener('keydown', onKey);
    document.addEventListener('click', onClick, true);
    apply();
    const settled = setTimeout(apply, 300);
    return () => {
      removeEventListener('scroll', apply);
      removeEventListener('resize', apply);
      removeEventListener('hashchange', onHash);
      removeEventListener('wheel', release);
      removeEventListener('touchstart', release);
      removeEventListener('pointerdown', release);
      removeEventListener('keydown', onKey);
      document.removeEventListener('click', onClick, true);
      cancelAnimationFrame(frame);
      clearTimeout(settled);
    };
  }, [pathname]);

  return null;
}
