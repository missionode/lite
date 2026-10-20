import assert from 'node:assert/strict';
import fs from 'node:fs';

const read = path => fs.readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');
const html = read('index.html');
const session = read('modules/shot-session.js');
const visibility = read('modules/lobby-experience-visibility.js');
const PHI = (1 + Math.sqrt(5)) / 2;

// Golden Ratio Shot (owner, 2026-10-20): 432 Hz, then two golden-ratio steps up.
for (const file of ['scripts.json', 'demo-script.json', 'test-script.json']) {
  const frequencies = JSON.parse(read(file)).sound_shots.golden_ratio.frequencies;
  assert.equal(frequencies.length, 3, `${file}: three tones`);
  assert.equal(frequencies[0], 432, `${file}: starts at 432 Hz`);
  frequencies.forEach((frequency, index) => assert.ok(Math.abs(frequency - 432 * PHI ** index) < 0.01, `${file}: tone ${index + 1} is 432 × φ^${index}`));
}
assert.match(html, /<option value="golden_ratio" data-i18n="ui\.goldenRatioShot">Golden Ratio Shot<\/option>/);
assert.match(session, /type === 'golden_ratio'[\s\S]*?sound_shots\?\.golden_ratio\?\.frequencies/, 'each tone plays as its own stage');
assert.match(session, /stages\.length === 0 \|\| stages\.some/, 'missing data never starts an empty Shot');
assert.match(visibility, /golden_ratio: 'ui\.goldenRatioShotNote'/, 'the Lobby explains the sequence');
assert.match(visibility, /golden_ratio: 'ui\.activateGoldenRatioShot'/);
for (const language of ['en', 'ml', 'hi', 'ru', 'ta']) {
  const ui = JSON.parse(read(`locales/${language}.json`)).ui;
  for (const key of ['goldenRatioShot', 'goldenRatioShotNote', 'activateGoldenRatioShot']) assert.ok(ui[key]?.trim(), `${language} needs ui.${key}`);
  assert.match(ui.goldenRatioShotNote, /432 → 699 → 1131/, `${language} note names the tones`);
  assert.doesNotMatch(ui.goldenRatioShotNote, /heal|cure|ചികിത്സ|इलाज|лечит|குணப்படுத்து/i, `${language}: no healing claim`);
}
console.log('Golden Ratio Shot passed: 432 → 699 → 1131 Hz (×1.618), three stages, Lobby note, five languages, no healing claims.');
