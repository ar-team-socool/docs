import { useMDXComponents as getThemeComponents } from 'nextra-theme-docs';

const themeComponents = getThemeComponents();

/** MDX components for every page: the docs theme's, overridable per call. */
export function useMDXComponents(components) {
  return { ...themeComponents, ...components };
}
