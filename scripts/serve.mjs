import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { extname, join, normalize } from 'node:path';
import { fileURLToPath } from 'node:url';

/**
 * Serves `out/` the way GitHub Pages does, so a local check means something: under the same base
 * path the build was made for, `/x` answered by `x.html` or `x/index.html`, and a 404 page.
 *
 * Usage: `node scripts/serve.mjs [port] [basePath]`, the base path matching `PAGES_BASE_PATH` at
 * build time.
 */
const root = fileURLToPath(new URL('../out/', import.meta.url));
const port = Number(process.argv[2] ?? 3211);
const base = process.argv[3] ?? process.env.PAGES_BASE_PATH ?? '';

const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.woff2': 'font/woff2',
  '.txt': 'text/plain; charset=utf-8',
  '.wasm': 'application/wasm',
};

async function file(path) {
  try {
    return (await stat(path)).isFile() ? path : null;
  } catch {
    return null;
  }
}

createServer(async (req, res) => {
  const url = new URL(req.url, 'http://local');
  let path = decodeURIComponent(url.pathname);
  if (base && !path.startsWith(base)) return res.writeHead(404).end('outside the base path');
  path = normalize(path.slice(base.length)).replace(/^[\\/]+/, '');
  if (path.includes('..')) return res.writeHead(400).end();

  const hit =
    (await file(join(root, path))) ??
    (await file(join(root, `${path}.html`))) ??
    (await file(join(root, path, 'index.html')));
  const target = hit ?? join(root, '404.html');
  const body = await readFile(target).catch(() => Buffer.from('not found'));
  res
    .writeHead(hit ? 200 : 404, { 'content-type': TYPES[extname(target)] ?? 'application/octet-stream' })
    .end(body);
}).listen(port, '127.0.0.1', () => console.log(`http://127.0.0.1:${port}${base}/`));
