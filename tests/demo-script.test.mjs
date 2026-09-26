import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

const readText = (path) => fs.readFileSync(new URL(path, import.meta.url), 'utf8');
const demo = JSON.parse(readText('../demo-script.json'));
const app = readText('../app.js');
const contentLocalization = readText('../modules/content-localization.js');
const sourceSettings = readText('../modules/script-source-settings.js');

assert.match(demo._demo?.purpose_en || '', /client-facing guided demonstration/i);
assert.match(demo._demo?.purpose_ml || '', /പ്രദർശനം/);
assert.equal(demo.high_energy.name, 'High Energy Journey');
assert.equal(JSON.stringify(demo).match(/\btest\b/gi), null, 'Demo narration must not expose internal test terminology.');

const validatorContext = vm.createContext({});
vm.runInContext(contentLocalization, validatorContext);
const { validateScriptBundle } = validatorContext.ChakraContentLocalization;

const sourceContext = vm.createContext({});
vm.runInContext(sourceSettings, sourceContext);
const sourceOwner = sourceContext.ChakraScriptSourceSettings;
assert.equal(sourceOwner.getDemoCoreDurationMinutes(demo, 'stakeholder-client-demo', 30), 0.5, 'The recognised demo script must request a 30-second core duration.');
assert.equal(sourceOwner.getDemoCoreDurationMinutes({ _demo: { id: 'other-demo', recommendedCoreDurationSeconds: 30 } }, 'stakeholder-client-demo', 30), null, 'Only the recognised demo metadata may change the core duration.');
assert.equal(sourceOwner.getDemoTimingMessage(key => key, 'ui.demoScriptTimingApplied', 'Demo journey ready — 30 seconds per selected chakra.'), 'Demo journey ready — 30 seconds per selected chakra.', 'A stale locale cache must receive client-facing fallback copy.');
assert.equal(sourceOwner.getDemoTimingMessage(() => 'Localized timing', 'ui.demoScriptTimingApplied', 'Fallback'), 'Localized timing');
assert.equal(sourceOwner.isDemoScriptSelected({ scriptSource: 'custom', customScript: demo }, 'stakeholder-client-demo', 30), true);
assert.equal(sourceOwner.isDemoScriptSelected({ scriptSource: 'default', customScript: demo }, 'stakeholder-client-demo', 30), false);

const durationSyncStart = app.indexOf('function syncCorePracticeDuration(value)');
const durationSyncEnd = app.indexOf('function applyDemoCoreDurationPreset()', durationSyncStart);
assert.ok(durationSyncStart >= 0 && durationSyncEnd > durationSyncStart, 'Demo duration sync adapter must remain available.');
assert.doesNotMatch(app.slice(durationSyncStart, durationSyncEnd), /updateSessionEstimate\(\)/, 'Startup demo timing must not call the lobby-scoped session estimator before handlers are attached.');

for (const languages of [['en', 'ml'], ['en', 'ml', 'ru', 'hi']]) {
    const result = validateScriptBundle(demo, { languages, allowLanguageFallback: true, highEnergy: true, corpse: true, bath: true, perinealCare: true, assistedBathing: true, massage: true, yoga: true, hooponopono: true });
    assert.equal(result.valid, true, `Demo script must validate for ${languages.join(', ')}: ${result.missing.join(', ')}`);
}

console.log('Demo script contract passed.');
