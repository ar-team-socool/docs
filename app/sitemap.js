import { generateStaticParamsFor } from 'nextra/pages';
import { SITE_URL, pagePath } from './site';

export const dynamic = 'force-static';

/** Every page in both languages, written to sitemap.xml at build time. */
export default async function sitemap() {
  const params = await generateStaticParamsFor('mdxPath', 'lang')();
  return params.map(({ lang, mdxPath }) => ({ url: `${SITE_URL}${pagePath(lang, mdxPath)}` }));
}
