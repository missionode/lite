import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

const source = fs.readFileSync('modules/care-preference-hydration.js', 'utf8');
const app = fs.readFileSync('app.js', 'utf8');
const html = fs.readFileSync('index.html', 'utf8');
const sw = fs.readFileSync('sw.js', 'utf8');
const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
assert.match(app, /carePreferenceHydration\.hydrate\(\{ state, syncChecked \}\)/);
assert.match(html, /modules\/care-preference-hydration\.js\?v=1\.0[\s\S]*?app\.js\?v=3\.90/);
assert.match(sw, /chakra-v5\.286[\s\S]*?modules\/care-preference-hydration\.js\?v=1\.0/);
assert.equal(packageJson.scripts['test:care-preference-hydration'], 'node tests/care-preference-hydration.test.mjs');

const context = vm.createContext({});
vm.runInContext(source, context);
const api = context.ChakraCarePreferenceHydration;
assert.ok(Object.isFrozen(api));
const sequence = [];
api.hydrate({
    state: { perinealCareEnabled: true, assistedBathingEnabled: false, massageEnabled: true },
    syncChecked(id, value) { sequence.push([id, value]); }
});
assert.deepEqual(JSON.parse(JSON.stringify(sequence)), [
    ['perineal-care-toggle', true],
    ['assisted-bathing-toggle', false],
    ['massage-toggle', true]
]);
assert.throws(() => api.hydrate({}), /requires state/);
assert.throws(() => api.hydrate({ state: {} }), /requires checkbox synchronization/);

const loadPreferences = app.slice(app.indexOf('function loadPreferences()'), app.indexOf('function checkFirstTime()'));
assert.ok(loadPreferences.indexOf("syncChecked('bath-session-toggle'") < loadPreferences.indexOf('carePreferenceHydration.hydrate('));
assert.ok(loadPreferences.indexOf('carePreferenceHydration.hydrate(') < loadPreferences.indexOf("document.getElementById('yoga-sub-options')"));
console.log('Care preference hydration passed: exact control mapping, order and offline delivery.');
