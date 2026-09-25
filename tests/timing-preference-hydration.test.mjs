import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

const source = fs.readFileSync('modules/timing-preference-hydration.js', 'utf8');
const app = fs.readFileSync('app.js', 'utf8');
const html = fs.readFileSync('index.html', 'utf8');
const serviceWorker = fs.readFileSync('sw.js', 'utf8');
const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
assert.match(app, /timingPreferenceHydration\.hydrateCore\(\{ state, document, setText \}\)/);
assert.match(app, /timingPreferenceHydration\.hydrateJourney\(\{ state, syncValue, setText \}\)/);
const loadPreferences = app.slice(app.indexOf('function loadPreferences()'), app.indexOf('function checkFirstTime()'));
assert.ok(loadPreferences.indexOf('timingPreferenceHydration.hydrateCore(') < loadPreferences.indexOf('syncDroneDurationModeControls();'));
assert.ok(loadPreferences.indexOf('syncDroneDurationModeControls();') < loadPreferences.indexOf('updateDroneDurationSummary();'));
assert.ok(loadPreferences.indexOf("yoga-experience-toggle'") < loadPreferences.indexOf('timingPreferenceHydration.hydrateJourney('));
assert.ok(loadPreferences.indexOf('timingPreferenceHydration.hydrateJourney(') < loadPreferences.indexOf('appearancePreferenceHydration.hydrateBrightness('));
assert.match(html, /modules\/timing-preference-hydration\.js\?v=1\.0[\s\S]*?app\.js\?v=3\.92/);
assert.match(serviceWorker, /chakra-v5\.288[\s\S]*?modules\/timing-preference-hydration\.js\?v=1\.0/);
assert.equal(packageJson.scripts['test:timing-preference-hydration'], 'node tests/timing-preference-hydration.test.mjs');

const context = vm.createContext({});
vm.runInContext(source, context);
const hydration = context.ChakraTimingPreferenceHydration;
assert.ok(Object.isFrozen(hydration));
const fillValues = new Map();
const sliders = Object.fromEntries([
    ['time-per-chakra', '1,7'],
    ['time-high-energy', '2,8']
].map(([id, bounds]) => {
    const [min, max] = bounds.split(',').map(Number);
    return [id, { min, max, value: null, style: { setProperty(name, value) { fillValues.set(`${id}:${name}`, value); } } }];
}));
const displays = [];
const document = { getElementById(id) { return sliders[id] || null; } };
const coreState = { timePerChakra: 4, timeHighEnergy: 5 };
hydration.hydrateCore({ state: coreState, document, setText(id, value) { displays.push([id, value]); } });
assert.equal(sliders['time-per-chakra'].value, 4);
assert.equal(sliders['time-high-energy'].value, 5);
assert.equal(fillValues.get('time-per-chakra:--range-fill'), '50.0%');
assert.equal(fillValues.get('time-high-energy:--range-fill'), '50.0%');
assert.deepEqual(displays, [['time-display', '4.0 mins'], ['high-energy-time-display', '5 mins']]);

const ordered = [];
const state = {
    timeIcebreaker: 20, timeEmergence: 35, timeBreathing: 40, timeCorpse: 90,
    timeInterval: 15, timeYogaPrep: 30, timeYogaPose: 75,
    timeBath: 599, timePerinealCare: 125, timeAssistedBathing: 60
};
hydration.hydrateJourney({
    state,
    syncValue(id, value) { ordered.push(['value', id, value]); },
    setText(id, value) { ordered.push(['text', id, value]); }
});
assert.deepEqual(JSON.parse(JSON.stringify(ordered)), [
    ['value', 'time-icebreaker', 20], ['text', 'display-icebreaker', '20s'],
    ['value', 'time-emergence', 35], ['text', 'display-emergence', '35s'],
    ['value', 'time-breathing', 40], ['text', 'display-breathing', '40s'],
    ['value', 'time-corpse', 90], ['text', 'display-corpse', '90s'],
    ['value', 'time-interval', 15], ['text', 'display-interval', '15s'],
    ['value', 'time-yoga-prep', 30], ['text', 'display-yoga-prep', '30s'],
    ['value', 'time-yoga-pose', 75], ['text', 'display-yoga-pose', '75s'],
    ['value', 'time-bath', 599], ['text', 'display-bath', '9m'],
    ['value', 'time-perineal-care', 125], ['text', 'display-perineal-care', '2m'],
    ['value', 'time-assisted-bathing', 60], ['text', 'display-assisted-bathing', '1m']
]);
assert.throws(() => hydration.hydrateCore({}), /requires state and display services/);
assert.throws(() => hydration.hydrateJourney({}), /requires state and display services/);
console.log('Timing preference hydration contract passed: core range fill, duration labels, ordered journey values and module delivery.');
