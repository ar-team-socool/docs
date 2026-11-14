import nextra from 'nextra';

const withNextra = nextra({
  search: { codeblocks: false },
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
});
