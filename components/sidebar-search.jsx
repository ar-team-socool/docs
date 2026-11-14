'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

/**
 * Puts the search box at the top of the desktop sidebar, where Vercel's docs keep it.
 *
 * The theme draws search only in the top bar (desktop) and the mobile menu, and the sidebar is part of
 * each page, so it is replaced on every navigation. One host element is kept and moved into whichever
 * sidebar is on screen; the top bar's own box is hidden on desktop by CSS.
 */
export function SidebarSearch({ children }) {
  const [host, setHost] = useState(null);

  useEffect(() => {
    const element = document.createElement('div');
    element.className = 'ar-sidebar-search';
    const place = () => {
      const sidebar = document.querySelector('aside.nextra-sidebar');
      if (sidebar && element.parentElement !== sidebar) sidebar.prepend(element);
    };
    place();
    setHost(element);
    const observer = new MutationObserver(place);
    observer.observe(document.body, { childList: true, subtree: true });
    return () => {
      observer.disconnect();
      element.remove();
    };
  }, []);

  return host ? createPortal(children, host) : null;
}
