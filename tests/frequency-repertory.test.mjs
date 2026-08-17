import assert from 'node:assert/strict';
import fs from 'node:fs';

const page = fs.readFileSync(new URL('../docs/repertory.html', import.meta.url), 'utf8');
const index = fs.readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const serviceWorker = fs.readFileSync(new URL('../sw.js', import.meta.url), 'utf8');
const scripts = JSON.parse(fs.readFileSync(new URL('../scripts.json', import.meta.url), 'utf8'));
const en = JSON.parse(fs.readFileSync(new URL('../locales/en.json', import.meta.url), 'utf8'));
const ml = JSON.parse(fs.readFileSync(new URL('../locales/ml.json', import.meta.url), 'utf8'));

assert.match(page, /<title>Sound Shot Repertory<\/title>/, 'the repertory should have a meaningful document title');
const inlineScript = page.match(/<script>([\s\S]*?)<\/script>/)?.[1];
assert.ok(inlineScript, 'the repertory should include its rendering script');
assert.doesNotThrow(() => new Function(inlineScript), 'the repertory rendering script should compile');
assert.match(page, /fetch\('\.\.\/scripts\.json',\{cache:'no-store'\}\)/, 'the repertory should read the active script bundle instead of duplicating frequencies');
assert.match(page, /const CHAKRA_ORDER = \['root','sacral','solar','heart','throat','thirdeye','crown'\]/, 'all seven Meditation Shot stages should be listed in order');
assert.match(page, /data\.high_energy\?\.frequency/, 'High Energy Shot should read its active JSON frequency');
assert.match(page, /data\.sound_shots\?\.anesthetic\?\.frequency/, 'Anesthetic Shot should read its active JSON frequency');
assert.match(page, /data\.sleep_mode\?\.stages/, 'Sleep Shot should read all active JSON stages');
assert.match(page, /chakra_display_language/, 'the repertory should follow and update the app display language');
assert.match(page, /href="\.\.\/index\.html"/, 'the repertory should provide a Return to Room action');

const configuredUses = [
  ...['root', 'sacral', 'solar', 'heart', 'throat', 'thirdeye', 'crown'].map(key => scripts[key].frequency),
  scripts.high_energy.frequency,
  scripts.sound_shots.anesthetic.frequency,
  ...scripts.sleep_mode.stages.map(stage => stage.frequency),
];
assert.equal(configuredUses.length, 14, 'the current repertory should contain fourteen configured frequency uses');
assert.equal(new Set(configuredUses).size, 12, 'the current repertory should contain twelve distinct frequency values');
assert.match(index, /href="\.\/docs\/repertory\.html"[^>]*data-i18n="ui\.frequencyRepertory"/, 'Sound Shot options should link to the repertory');
assert.match(serviceWorker, /'\.\/docs\/repertory\.html'/, 'the repertory should be available from the installed PWA cache');
for (const locale of [en, ml]) {
  assert.ok(locale.ui.frequencyRepertory?.trim(), 'the repertory link should be localized');
}

console.log('Frequency repertory contract passed for all active Sound Shot frequencies.');
