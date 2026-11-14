import { mkdirSync, readFileSync, readdirSync, statSync, writeFileSync, existsSync } from 'node:fs';
import { dirname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

/**
 * Writes a language-neutral address for every page, so a link can be shared without choosing a
 * language for the reader: `/ar-launcher/play` sends each reader to `/th/ar-launcher/play` or
 * `/en/ar-launcher/play` by the same rule as `/` (`public/index.html`), keeping the `#section`,
 * which is the same id in both languages.
 *
 * Runs after `next build` over `out/`. Each page becomes `out/<path>.html`, which GitHub Pages
 * serves at `/<path>`. The rule is read out of `public/index.html` rather than copied, so the
 * two cannot drift.
 */

const here = dirname(fileURLToPath(import.meta.url));
const LANGS = ['th', 'en'];

/** The `chooseLang` function from `public/index.html`, as source text. */
export function chooseLangSource(indexHtml) {
  const script = /<script id="choose-lang">([\s\S]*?)<\/script>/.exec(indexHtml)?.[1];
  const end = script?.indexOf('(function ()') ?? -1;
  if (!script || end < 0) throw new Error('public/index.html has no chooseLang function');
  return script.slice(0, end).trim();
}

/** Every page path under a language folder, without the language: '' for its home. */
export function pagePaths(outDir, lang) {
  const paths = [];
  if (existsSync(join(outDir, `${lang}.html`))) paths.push('');
  const root = join(outDir, lang);
  const walk = (dir) => {
    for (const name of readdirSync(dir)) {
      const full = join(dir, name);
      if (statSync(full).isDirectory()) walk(full);
      else if (name.endsWith('.html')) paths.push(relative(root, full).replace(/\\/g, '/').replace(/\.html$/, ''));
    }
  };
  if (existsSync(root)) walk(root);
  return paths;
}

/** The page written at a neutral address: pick the language, then replace the address. */
export function neutralPage(path, basePath, chooseLang) {
  const target = (lang) => `${basePath}/${lang}${path ? `/${path}` : ''}`;
  return `<!doctype html>
<html lang="th">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex">
<title>AR Team Docs</title>
<link rel="icon" href="${basePath}/icon.png" type="image/png" sizes="64x64">
<script>
${chooseLang}
(function () {
  var lang = 'th';
  try {
    var languages = navigator.languages && navigator.languages.length ? navigator.languages : [navigator.language];
    lang = chooseLang(document.cookie, languages, Intl.DateTimeFormat().resolvedOptions().timeZone);
  } catch (e) {}
  location.replace((lang === 'en' ? ${JSON.stringify(target('en'))} : ${JSON.stringify(target('th'))}) + location.search + location.hash);
})();
</script>
<noscript><meta http-equiv="refresh" content="0; url=${target('th')}"></noscript>
</head>
<body><p><a href="${target('th')}">ภาษาไทย</a> · <a href="${target('en')}">English</a></p></body>
</html>
`;
}

/** Write the neutral pages into `outDir`; answers the paths written. */
export function writeNeutralLinks(outDir, indexHtml, basePath = '') {
  const chooseLang = chooseLangSource(indexHtml);
  const paths = [...new Set(LANGS.flatMap((lang) => pagePaths(outDir, lang)))].filter(Boolean).sort();
  for (const path of paths) {
    if (LANGS.includes(path.split('/')[0])) throw new Error(`a page path starts with a language: ${path}`);
    const file = join(outDir, `${path}.html`);
    if (existsSync(file)) throw new Error(`${path}.html already exists in the build`);
    mkdirSync(dirname(file), { recursive: true });
    writeFileSync(file, neutralPage(path, basePath, chooseLang));
  }
  return paths;
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  const outDir = join(here, '..', 'out');
  const indexHtml = readFileSync(join(here, '..', 'public', 'index.html'), 'utf8');
  const written = writeNeutralLinks(outDir, indexHtml, process.env.PAGES_BASE_PATH ?? '');
  console.log(`neutral links: ${written.length} pages (${written.join(', ')})`);
}
