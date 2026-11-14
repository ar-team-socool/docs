import Link from 'next/link';
import { fontClasses } from './fonts';
import './globals.css';

export const metadata = { title: 'ไม่พบหน้านี้ · Page not found' };

/** One 404 for the whole site: a missing page has no language to go by, so it speaks both. */
export default function GlobalNotFound() {
  return (
    <html lang="th" className={fontClasses} suppressHydrationWarning>
      <head>
        {/* The docs keep their theme in localStorage `theme` (next-themes) and default to dark. */}
        <script
          dangerouslySetInnerHTML={{
            __html:
              "try{var t=localStorage.getItem('theme');if(!t||t==='dark'||(t==='system'&&matchMedia('(prefers-color-scheme: dark)').matches))document.documentElement.classList.add('dark')}catch(e){document.documentElement.classList.add('dark')}",
          }}
        />
      </head>
      <body className="ar-not-found-page">
        <div className="ar-not-found">
          <p className="ar-not-found-code">404</p>
          <h1>ไม่พบหน้านี้</h1>
          <p>ลิงก์อาจพิมพ์ผิด หรือหน้านี้ถูกย้ายไปแล้ว</p>
          <h1 lang="en">Page not found</h1>
          <p lang="en">The link may be mistyped, or the page has moved.</p>
          <div className="ar-not-found-links">
            <Link href="/th">หน้าแรก</Link>
            <Link href="/en" lang="en">
              Home
            </Link>
          </div>
        </div>
      </body>
    </html>
  );
}
