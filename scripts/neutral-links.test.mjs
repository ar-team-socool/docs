import assert from 'node:assert/strict';
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { test } from 'node:test';
import vm from 'node:vm';
import { chooseLangSource, writeNeutralLinks } from './neutral-links.mjs';

const indexHtml = readFileSync(new URL('../public/index.html', import.meta.url), 'utf8');

/** A build output with a home and two pages per language. */
function fakeOut() {
  const out = mkdtempSync(join(tmpdir(), 'ar-docs-out-'));
  for (const lang of ['th', 'en']) {
    writeFileSync(join(out, `${lang}.html`), '<html></html>');
    mkdirSync(join(out, lang, 'ar-launcher'), { recursive: true });
    writeFileSync(join(out, lang, 'ar-launcher.html'), '<html></html>');
    writeFileSync(join(out, lang, 'ar-launcher', 'play.html'), '<html></html>');
  }
  return out;
}

/** Runs a written page's script with a stated reader, and answers where it sends them. */
function destination(html, reader) {
  const script = /<script>([\s\S]*?)<\/script>/.exec(html)[1];
  let replaced = null;
  vm.runInNewContext(script, {
    navigator: { languages: reader.languages, language: reader.languages[0] },
    document: { cookie: reader.cookie ?? '' },
    Intl: { DateTimeFormat: () => ({ resolvedOptions: () => ({ timeZone: reader.timeZone }) }) },
    location: { search: reader.search ?? '', hash: reader.hash ?? '', replace: (to) => (replaced = to) },
  });
  return replaced;
}

test('every page gets one neutral address, the home excepted', () => {
  const out = fakeOut();
  try {
    assert.deepEqual(writeNeutralLinks(out, indexHtml), ['ar-launcher', 'ar-launcher/play']);
    readFileSync(join(out, 'ar-launcher.html'), 'utf8');
    readFileSync(join(out, 'ar-launcher', 'play.html'), 'utf8');
  } finally {
    rmSync(out, { recursive: true, force: true });
  }
});

test('a neutral address sends each reader to their language, keeping the section', () => {
  const out = fakeOut();
  try {
    writeNeutralLinks(out, indexHtml);
    const page = readFileSync(join(out, 'ar-launcher', 'play.html'), 'utf8');
    assert.equal(
      destination(page, { languages: ['en-US', 'th'], timeZone: 'UTC', hash: '#connect' }),
      '/th/ar-launcher/play#connect',
    );
    assert.equal(
      destination(page, { languages: ['en-US'], timeZone: 'America/New_York', hash: '#connect' }),
      '/en/ar-launcher/play#connect',
    );
    assert.equal(
      destination(page, { languages: ['th-TH'], timeZone: 'Asia/Bangkok', cookie: 'NEXT_LOCALE=en' }),
      '/en/ar-launcher/play',
    );
  } finally {
    rmSync(out, { recursive: true, force: true });
  }
});

test('the base path is kept in front of the language', () => {
  const out = fakeOut();
  try {
    writeNeutralLinks(out, indexHtml, '/docs');
    const page = readFileSync(join(out, 'ar-launcher.html'), 'utf8');
    assert.equal(destination(page, { languages: ['en'], timeZone: 'UTC' }), '/docs/en/ar-launcher');
  } finally {
    rmSync(out, { recursive: true, force: true });
  }
});

test('the rule is the one in public/index.html, read rather than copied', () => {
  const out = fakeOut();
  try {
    writeNeutralLinks(out, indexHtml);
    const page = readFileSync(join(out, 'ar-launcher.html'), 'utf8');
    assert.ok(page.includes(chooseLangSource(indexHtml)));
  } finally {
    rmSync(out, { recursive: true, force: true });
  }
});

test('a page whose path would collide is refused rather than overwritten', () => {
  const out = fakeOut();
  try {
    writeFileSync(join(out, 'ar-launcher.html'), 'already here');
    assert.throws(() => writeNeutralLinks(out, indexHtml), /already exists/);
  } finally {
    rmSync(out, { recursive: true, force: true });
  }
});
