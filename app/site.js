/** Where the docs are published. GitHub Pages serves this custom domain at its root. */
export const SITE_URL = 'https://ar-docs.wip-town.com';

/** The site path of a page: `/th` for a language's home, `/th/ar-launcher/play` for the rest. */
export function pagePath(lang, mdxPath) {
  // A home page's segment arrives as '', which would end the path in '/' and miss th.html.
  return `/${[lang, ...(mdxPath ?? [])].filter(Boolean).join('/')}`;
}
