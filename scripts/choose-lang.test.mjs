import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import vm from 'node:vm';

/** Runs the real chooseLang out of public/index.html, without the redirect around it. */
function loadChooseLang() {
  const html = readFileSync(new URL('../public/index.html', import.meta.url), 'utf8');
  const script = /<script id="choose-lang">([\s\S]*?)<\/script>/.exec(html)?.[1];
  assert.ok(script, 'the choose-lang script is in public/index.html');
  const fn = script.slice(0, script.indexOf('(function ()'));
  const context = {};
  vm.runInNewContext(`${fn}; this.chooseLang = chooseLang;`, context);
  return context.chooseLang;
}

const chooseLang = loadChooseLang();

test('a choice made with the language button wins over everything', () => {
  assert.equal(chooseLang('NEXT_LOCALE=en', ['th-TH'], 'Asia/Bangkok'), 'en');
  assert.equal(chooseLang('a=1; NEXT_LOCALE=th', ['en-US'], 'Europe/London'), 'th');
});

test('Thai anywhere in the browser languages reads Thai, even after English', () => {
  assert.equal(chooseLang('', ['en-US', 'th'], 'Europe/London'), 'th');
  assert.equal(chooseLang('', ['th-TH', 'en'], 'UTC'), 'th');
});

test('a Thai clock reads Thai when the browser lists no Thai', () => {
  assert.equal(chooseLang('', ['en-US', 'en'], 'Asia/Bangkok'), 'th');
});

test('everyone else reads English', () => {
  assert.equal(chooseLang('', ['en-US'], 'America/New_York'), 'en');
  assert.equal(chooseLang('', ['ja-JP'], 'Asia/Tokyo'), 'en');
  assert.equal(chooseLang(undefined, undefined, undefined), 'en');
});

test('a subtag that only contains "th" is not Thai', () => {
  assert.equal(chooseLang('', ['zh-TH'], 'UTC'), 'en');
});

test('an unknown stored choice falls through to the other signals', () => {
  assert.equal(chooseLang('NEXT_LOCALE=fr', ['en-US'], 'Asia/Bangkok'), 'th');
});
