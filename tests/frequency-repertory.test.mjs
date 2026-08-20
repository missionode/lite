import assert from 'node:assert/strict';
import fs from 'node:fs';

const page = fs.readFileSync(new URL('../docs/repertory.html', import.meta.url), 'utf8');
const app = fs.readFileSync(new URL('../app.js', import.meta.url), 'utf8');
const index = fs.readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const serviceWorker = fs.readFileSync(new URL('../sw.js', import.meta.url), 'utf8');
const scripts = JSON.parse(fs.readFileSync(new URL('../scripts.json', import.meta.url), 'utf8'));
const timing = JSON.parse(fs.readFileSync(new URL('../timing-config.json', import.meta.url), 'utf8'));
const catalog = JSON.parse(fs.readFileSync(new URL('../data/frequency-repertory.json', import.meta.url), 'utf8'));
const en = JSON.parse(fs.readFileSync(new URL('../locales/en.json', import.meta.url), 'utf8'));
const ml = JSON.parse(fs.readFileSync(new URL('../locales/ml.json', import.meta.url), 'utf8'));

assert.match(page, /<title>Sound Shot Repertory<\/title>/, 'the repertory should have a meaningful document title');
const inlineScript = page.match(/<script>([\s\S]*?)<\/script>/)?.[1];
assert.ok(inlineScript, 'the repertory should include its rendering script');
assert.doesNotThrow(() => new Function(inlineScript), 'the repertory rendering script should compile');

assert.equal(catalog.schemaVersion, 1, 'the reference catalog should use the supported schema');
assert.equal(catalog.source.url, 'https://share.gemini.google/Mw3YMZgwmsHQ', 'the supplied reference document should be attributed');
assert.equal(catalog.entries.length, 15, 'the catalog should contain five brainwave bands and ten tone references');
assert.deepEqual(
  catalog.entries.filter(entry => entry.kind === 'brainwave').map(entry => entry.frequencyLabel),
  ['0.5–3 Hz', '4–7 Hz', '8–12 Hz', '13–30 Hz', '30–100 Hz'],
  'all source brainwave bands should be present',
);
assert.deepEqual(
  catalog.entries.filter(entry => entry.kind !== 'brainwave').map(entry => entry.shotFrequency),
  [174, 285, 396, 417, 432, 528, 639, 741, 852, 963],
  'all source tone frequencies should be present in order',
);
for (const entry of catalog.entries) {
  assert.ok(entry.name.en?.trim() && entry.name.ml?.trim(), `${entry.id} should have bilingual names`);
  assert.ok(entry.focus.en?.trim() && entry.focus.ml?.trim(), `${entry.id} should have bilingual focus text`);
  assert.ok(entry.features.en?.trim() && entry.features.ml?.trim(), `${entry.id} should have bilingual features`);
  assert.ok(Number.isFinite(entry.shotFrequency) && entry.shotFrequency > 0 && entry.shotFrequency <= 20000, `${entry.id} should provide a safe Custom Shot handoff value`);
}
assert.ok(catalog.entries.some(entry => entry.shotFrequency === 285), '285 Hz should be added to the reference');
assert.ok(catalog.entries.some(entry => entry.shotFrequency === 432), '432 Hz should be added to the reference');

assert.match(page, /fetch\('\.\.\/scripts\.json',\{cache:'no-store'\}\)/, 'the repertory should verify the active script bundle');
assert.match(page, /fetch\('\.\.\/data\/frequency-repertory\.json',\{cache:'no-store'\}\)/, 'the repertory should load reference features from the catalog');
assert.match(page, /id="frequencySearch"[^>]*type="search"/, 'the repertory should provide a search control');
assert.match(page, /search\.addEventListener\('input'/, 'search should filter as the guide types');
assert.match(page, /searchableText\(entry\)\.includes\(needle\)/, 'search should include each entry’s reference content');
assert.match(page, /id="noResults"/, 'search should provide a clear empty state');
assert.match(page, /shotFrequency=\$\{encodeURIComponent\(entry\.shotFrequency\)\}&shotSource=repertory/, 'every repertory CTA should carry only the chosen frequency and source');
assert.match(page, /Prepare 1 sec Shot/, 'the CTA should state its one-second result');
assert.match(page, /not promises of a medical outcome/, 'reference associations should not be presented as medical guarantees');
assert.match(page, /chakra_display_language/, 'the repertory should follow and update the app display language');
assert.match(page, /href="\.\.\/index\.html"/, 'the repertory should provide a Return to Room action');

assert.match(app, /function prepareRepertoryShotFromUrl\(\)/, 'the Lobby should consume repertory handoffs');
assert.match(app, /source !== 'repertory'/, 'only an explicit repertory handoff should prepare a Shot');
assert.match(app, /frequency <= 0 \|\| frequency > 20000/, 'handoff frequencies should be validated');
assert.match(app, /shotTypeSelect\.value = 'custom'/, 'a repertory choice should become a Custom Shot');
assert.match(app, /frequencyInput\.value = String\(frequency\)/, 'the chosen frequency should be prefilled');
assert.match(app, /resetShotDurationForType\('custom'\)/, 'the Custom Shot duration should reset to its configured default');
assert.match(app, /shotsToggle\.dispatchEvent\(new Event\('change', \{ bubbles: true \}\)\)/, 'the handoff should use the normal safety confirmation');
assert.match(app, /if \(!shotsToggle\.checked\) return;/, 'a cancelled confirmation should stop the handoff');
assert.match(app, /showScreen\(lobbyScreen\)/, 'a confirmed repertory Shot should show the Lobby');
assert.equal(timing.journey.shotDuration.singleFrequencyDefault, 1, 'single-frequency Custom Shots should default to one second');

const configuredUses = [
  ...['root', 'sacral', 'solar', 'heart', 'throat', 'thirdeye', 'crown'].map(key => scripts[key].frequency),
  scripts.high_energy.frequency,
  scripts.sound_shots.anesthetic.frequency,
  ...scripts.sleep_mode.stages.map(stage => stage.frequency),
];
assert.equal(configuredUses.length, 14, 'Lite should still contain fourteen configured frequency uses');
assert.equal(new Set(configuredUses).size, 12, 'Lite should still contain twelve distinct configured values');
assert.match(index, /href="\.\/docs\/repertory\.html"[^>]*data-i18n="ui\.frequencyRepertory"/, 'Sound Shot options should link to the repertory');
assert.match(serviceWorker, /'\.\/docs\/repertory\.html'/, 'the repertory page should be available from the installed PWA cache');
assert.match(serviceWorker, /'\.\/data\/frequency-repertory\.json'/, 'the reference catalog should be available from the installed PWA cache');
for (const locale of [en, ml]) {
  assert.ok(locale.ui.frequencyRepertory?.trim(), 'the repertory link should be localized');
}

console.log('Frequency repertory, search and one-second Custom Shot handoff contracts passed.');
