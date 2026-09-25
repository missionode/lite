import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

const source = fs.readFileSync('modules/appearance-preference-hydration.js', 'utf8');
const app = fs.readFileSync('app.js', 'utf8');
const html = fs.readFileSync('index.html', 'utf8');
const sw = fs.readFileSync('sw.js', 'utf8');
const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
assert.match(app, /appearancePreferenceHydration\.hydrateEffect\(/);
assert.match(app, /appearancePreferenceHydration\.hydrateBrightness\(/);
assert.match(html, /modules\/appearance-preference-hydration\.js\?v=1\.0[\s\S]*?app\.js\?v=4\.06/);
assert.match(sw, /chakra-v5\.302[\s\S]*?modules\/appearance-preference-hydration\.js\?v=1\.0/);
assert.equal(packageJson.scripts['test:appearance-preference-hydration'], 'node tests/appearance-preference-hydration.test.mjs');

const context = vm.createContext({});
vm.runInContext(source, context);
const api = context.ChakraAppearancePreferenceHydration;
assert.ok(Object.isFrozen(api));
const events = [];
api.hydrateEffect({
    state: { visualEffect: 'soft-glow' },
    syncValue(id, value) { events.push(['sync', id, value]); },
    applyImageEffect() { events.push(['effect']); }
});
const properties = new Map();
api.hydrateBrightness({
    state: { brightness: 0.82 },
    syncValue(id, value) { events.push(['sync', id, value]); },
    document: { getElementById(id) { assert.equal(id, 'app'); return { style: { setProperty(name, value) { properties.set(name, value); } } }; } }
});
assert.deepEqual(JSON.parse(JSON.stringify(events)), [
    ['sync', 'visual-effect-select', 'soft-glow'],
    ['effect'],
    ['sync', 'brightness-slider', 0.82]
]);
assert.equal(properties.get('--app-brightness'), '0.82');
assert.throws(() => api.hydrateEffect({}), /requires state/);
assert.throws(() => api.hydrateBrightness({ state: {}, syncValue() {} }), /requires a document/);

const loadPreferences = app.slice(app.indexOf('function loadPreferences()'), app.indexOf('function checkFirstTime()'));
assert.ok(loadPreferences.indexOf('appearancePreferenceHydration.hydrateEffect(') < loadPreferences.indexOf('timingPreferenceHydration.hydrateJourney('));
assert.ok(loadPreferences.indexOf('timingPreferenceHydration.hydrateJourney(') < loadPreferences.indexOf('appearancePreferenceHydration.hydrateBrightness('));
console.log('Appearance preference hydration passed: effect application, brightness CSS, startup order and offline delivery.');
