import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

const readText = (path) => fs.readFileSync(new URL(path, import.meta.url), 'utf8');
const demo = JSON.parse(readText('../demo-script.json'));
const app = readText('../app.js');

assert.match(demo._demo?.purpose_en || '', /client-facing guided demonstration/i);
assert.match(demo._demo?.purpose_ml || '', /പ്രദർശനം/);
assert.equal(demo.high_energy.name, 'High Energy Journey');
assert.equal(JSON.stringify(demo).match(/\btest\b/gi), null, 'Demo narration must not expose internal test terminology.');

const validatorStart = app.indexOf('function getScriptPath(');
const validatorEnd = app.indexOf('let piperVoiceRegistry', validatorStart);
assert.ok(validatorStart >= 0 && validatorEnd > validatorStart, 'Script validator source must remain extractable.');
const { validateScriptBundle } = vm.runInNewContext(
    `let languageRegistry = [];\n${app.slice(validatorStart, validatorEnd)}\n({ validateScriptBundle });`,
);

const demoTimingStart = app.indexOf("const DEMO_SCRIPT_ID = 'stakeholder-client-demo';");
const demoTimingEnd = app.indexOf('let piperVoiceRegistry', demoTimingStart);
assert.ok(demoTimingStart >= 0 && demoTimingEnd > demoTimingStart, 'Demo timing helper source must remain extractable.');
const { getDemoCoreDurationMinutes } = vm.runInNewContext(
    `${app.slice(demoTimingStart, demoTimingEnd)}\n({ getDemoCoreDurationMinutes });`,
);
assert.equal(getDemoCoreDurationMinutes(demo), 0.5, 'The recognised demo script must request a 30-second core duration.');
assert.equal(getDemoCoreDurationMinutes({ _demo: { id: 'other-demo', recommendedCoreDurationSeconds: 30 } }), null, 'Only the recognised demo metadata may change the core duration.');
assert.match(app, /function getDemoScriptTimingMessage\(\)[\s\S]*?Demo journey ready — 30 seconds per selected chakra\./, 'A stale locale cache must receive a client-facing demo status fallback.');

const durationSyncStart = app.indexOf('function syncCorePracticeDuration(value)');
const durationSyncEnd = app.indexOf('function applyDemoCoreDurationPreset()', durationSyncStart);
assert.ok(durationSyncStart >= 0 && durationSyncEnd > durationSyncStart, 'Demo duration sync source must remain extractable.');
assert.doesNotMatch(app.slice(durationSyncStart, durationSyncEnd), /updateSessionEstimate\(\)/, 'Startup demo timing must not call the lobby-scoped session estimator before handlers are attached.');

for (const languages of [['en', 'ml'], ['en', 'ml', 'ru', 'hi']]) {
    const result = validateScriptBundle(demo, { languages, allowLanguageFallback: true, highEnergy: true, corpse: true, bath: true, perinealCare: true, assistedBathing: true, massage: true, yoga: true, hooponopono: true });
    assert.equal(result.valid, true, `Demo script must validate for ${languages.join(', ')}: ${result.missing.join(', ')}`);
}

console.log('Demo script contract passed.');
