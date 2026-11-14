'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { SITE_URL } from '../app/site';

/**
 * The address to share for the page being read: the same path with no language in it, which sends
 * each reader to their own (`scripts/neutral-links.mjs`). `/th/ar-launcher/play` → `/ar-launcher/play`.
 */
function neutralUrl(pathname, hash = '') {
  const rest = pathname.split('/').slice(2).join('/');
  return `${SITE_URL}/${rest}${hash}`;
}

async function copy(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    // An older or locked-down browser: fall back to a selection the page makes itself.
    const area = document.createElement('textarea');
    area.value = text;
    area.setAttribute('readonly', '');
    area.style.cssText = 'position:fixed;opacity:0';
    document.body.appendChild(area);
    area.select();
    const done = document.execCommand('copy');
    area.remove();
    return done;
  }
}

/** A short-lived note that says the link was copied. */
function useCopiedNote() {
  const [shown, setShown] = useState(false);
  const timer = useRef(null);
  const show = () => {
    setShown(true);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setShown(false), 1800);
  };
  useEffect(() => () => clearTimeout(timer.current), []);
  return [shown, show];
}

/** Under the table of contents: copy this page's shareable address. */
export function CopyPageLink({ label, done }) {
  const pathname = usePathname();
  const [shown, show] = useCopiedNote();
  return (
    <button
      type="button"
      className="ar-copy-link"
      onClick={async () => {
        if (await copy(neutralUrl(pathname))) show();
      }}
    >
      <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
        <path
          d="M6.5 9.5a3 3 0 0 0 4.24 0l2.12-2.12a3 3 0 0 0-4.24-4.24L7.5 4.26M9.5 6.5a3 3 0 0 0-4.24 0L3.14 8.62a3 3 0 0 0 4.24 4.24l1.12-1.12"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
      <span aria-live="polite">{shown ? done : label}</span>
    </button>
  );
}

/**
 * The `#` beside a heading copies that section's shareable address as it jumps there, and a note
 * says so. The theme draws those links (`a.subheading-anchor`), so one listener serves them all.
 */
export function HeadingLinkCopier({ done }) {
  const pathname = usePathname();
  const [shown, show] = useCopiedNote();
  useEffect(() => {
    const onClick = (event) => {
      const anchor = event.target instanceof Element ? event.target.closest('a.subheading-anchor') : null;
      if (!anchor) return;
      const hash = anchor.getAttribute('href') ?? '';
      void copy(neutralUrl(pathname, hash)).then((ok) => ok && show());
    };
    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, [pathname]);
  return (
    <div className={shown ? 'ar-toast ar-toast-shown' : 'ar-toast'} role="status" aria-live="polite">
      {shown ? done : ''}
    </div>
  );
}
