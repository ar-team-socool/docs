import { generateStaticParamsFor, importPage } from 'nextra/pages';
import { useMDXComponents as getMDXComponents } from '../../../mdx-components';
import { LANGS } from '../../dictionaries';
import { pagePath } from '../../site';

export const generateStaticParams = generateStaticParamsFor('mdxPath', 'lang');

export const dynamicParams = false;

export async function generateMetadata(props) {
  const params = await props.params;
  const { metadata } = await importPage(params.mdxPath, params.lang);
  // Every page exists in both languages under the same path, so search engines are told the pair.
  return {
    ...metadata,
    alternates: {
      canonical: pagePath(params.lang, params.mdxPath),
      languages: Object.fromEntries(LANGS.map((lang) => [lang, pagePath(lang, params.mdxPath)])),
    },
  };
}

const Wrapper = getMDXComponents().wrapper;

export default async function Page(props) {
  const params = await props.params;
  const { default: MDXContent, toc, metadata, sourceCode } = await importPage(
    params.mdxPath,
    params.lang,
  );
  return (
    <Wrapper toc={toc} metadata={metadata} sourceCode={sourceCode}>
      <MDXContent {...props} params={params} />
    </Wrapper>
  );
}
