'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

const ONE_YEAR_S = 31_536_000;

/**
 * The right side of the top bar: switch to the other language on the same page, and the download
 * button. The choice is kept in `NEXT_LOCALE`, which `public/index.html` reads on the next visit.
 */
export function NavActions({ lang, other, label, shortLabel, download, downloadHref }) {
  const pathname = usePathname();
  const router = useRouter();
  const target = pathname.replace(new RegExp(`^/${lang}(?=/|$)`), `/${other}`);

  const switchLanguage = (event) => {
    document.cookie = `NEXT_LOCALE=${other}; max-age=${ONE_YEAR_S}; path=/; samesite=lax`;
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.button !== 0) return;
    event.preventDefault();
    // Headings carry the same ids in both languages, so the reader lands on the same section.
    router.push(`${target}${window.location.hash}`);
  };

  return (
    <div className="ar-nav-actions">
      <Link href={target} hrefLang={other} lang={other} onClick={switchLanguage} className="ar-btn">
        <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <circle cx="8" cy="8" r="6.25" stroke="currentColor" strokeWidth="1.5" />
          <path
            d="M1.75 8h12.5M8 1.75c1.7 1.8 2.5 3.9 2.5 6.25S9.7 12.45 8 14.25C6.3 12.45 5.5 10.35 5.5 8S6.3 3.55 8 1.75Z"
            stroke="currentColor"
            strokeWidth="1.5"
          />
        </svg>
        <span className="ar-long">{label}</span>
        <span className="ar-short">{shortLabel}</span>
      </Link>
      <a href={downloadHref} className="ar-btn ar-btn-primary">
        {download}
      </a>
    </div>
  );
}
