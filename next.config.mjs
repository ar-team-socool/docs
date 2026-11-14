import nextra from 'nextra';

const withNextra = nextra({
  search: { codeblocks: false },
  // A copy button on every code block, which Nextra leaves off unless asked.
  defaultShowCopyCode: true,
  // Nextra otherwise writes links without /th or /en and relies on its middleware to add one,
  // and a static site on GitHub Pages runs no middleware.
  unstable_shouldAddLocaleToLinks: true,
});

/**
 * GitHub Pages serves a project site under `/<repo>`, so the build takes that prefix from
 * `PAGES_BASE_PATH` (set by the deploy workflow) and serves from `/` when it is unset, which is
 * also what a custom domain needs.
 */
const basePath = process.env.PAGES_BASE_PATH ?? '';

export default withNextra({
  output: 'export',
  basePath,
  images: { unoptimized: true },
  reactStrictMode: true,
  // Nextra reads this to find content/<locale>/ and removes it before Next.js sees it.
  i18n: { locales: ['th', 'en'], defaultLocale: 'th' },
  // Every page sits under a [lang] root layout, so the 404 page needs a layout of its own.
  experimental: { globalNotFound: true },
});
