import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

const source = fs.readFileSync('modules/timing-settings-view.js', 'utf8');
const app = fs.readFileSync('app.js', 'utf8');
const html = fs.readFileSync('index.html', 'utf8');
const serviceWorker = fs.readFileSync('sw.js', 'utf8');
const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
assert.match(app, /ChakraTimingSettingsView\.bindTransitionDurationControls\(/);
assert.match(app, /ChakraTimingSettingsView\.bindCareDurationControls\(/);
assert.match(app, /ChakraTimingSettingsView\.bindJourneyDurationControl\(/);
assert.match(app, /ChakraTimingSettingsView\.bindHighEnergyDurationControl\(/);
assert.ok(app.indexOf('bindTransitionDurationControls(') < app.indexOf('scriptSourceSettings.bindSourceSelection(')
    && app.indexOf('scriptSourceSettings.bindSourceSelection(') < app.indexOf('bindCareDurationControls('),
'transition and care listener attachment stay on their original sides of custom-script handlers');
assert.ok(html.indexOf('modules/timing-settings-view.js?v=1.0') < html.indexOf('app.js?v=4.12'));
assert.match(serviceWorker, /chakra-v5\.310[\s\S]*?modules\/timing-settings-view\.js\?v=1\.0/);
assert.equal(packageJson.scripts['test:timing-settings-view'], 'node tests/timing-settings-view.test.mjs');

const context = vm.createContext({});
vm.runInContext(source, context);
const view = context.ChakraTimingSettingsView;
assert.ok(Object.isFrozen(view));

class Input {
    listeners = new Map();
    addEventListener(type, callback) {
        const callbacks = this.listeners.get(type) || [];
        callbacks.push(callback);
        this.listeners.set(type, callbacks);
    }
    emit(type, value) {
        (this.listeners.get(type) || []).forEach(callback => callback({ target: { value } }));
    }
}

const ids = [
    'time-icebreaker', 'time-emergence', 'time-breathing', 'time-corpse', 'time-interval',
    'time-yoga-prep', 'time-yoga-pose', 'time-bath', 'time-perineal-care', 'time-assisted-bathing'
];
const inputs = Object.fromEntries(ids.map(id => [id, new Input()]));
const state = {};
const stored = new Map();
const events = [];
const services = {
    document: { getElementById(id) { return inputs[id] || null; } },
    state,
    storage: { setItem(key, value) { events.push(['storage', key, String(value)]); stored.set(key, String(value)); } },
    setText(id, value) {
        events.push(['display', id, value]);
        assert.equal(state[stateKeyByDisplay[id]], expectedCurrentValue, 'state is updated before its display');
    },
    updateSessionEstimate() { events.push(['estimate']); }
};

const stateKeyByDisplay = {
    'display-icebreaker': 'timeIcebreaker', 'display-emergence': 'timeEmergence',
    'display-breathing': 'timeBreathing', 'display-corpse': 'timeCorpse',
    'display-interval': 'timeInterval', 'display-yoga-prep': 'timeYogaPrep',
    'display-yoga-pose': 'timeYogaPose', 'display-bath': 'timeBath',
    'display-perineal-care': 'timePerinealCare', 'display-assisted-bathing': 'timeAssistedBathing'
};
let expectedCurrentValue;
view.bindTransitionDurationControls(services);
view.bindCareDurationControls(services);
assert.deepEqual(events, [], 'binding does not write, display or recalculate immediately');

const cases = [
    ['time-icebreaker', 19.8, 'timeIcebreaker', 'display-icebreaker', 'chakra_time_icebreaker', '19s'],
    ['time-emergence', 27, 'timeEmergence', 'display-emergence', 'chakra_time_emergence', '27s'],
    ['time-breathing', 8, 'timeBreathing', 'display-breathing', 'chakra_time_breathing', '8s'],
    ['time-corpse', 93, 'timeCorpse', 'display-corpse', 'chakra_time_corpse', '93s'],
    ['time-interval', 14, 'timeInterval', 'display-interval', 'chakra_time_interval', '14s'],
    ['time-yoga-prep', 35, 'timeYogaPrep', 'display-yoga-prep', 'chakra_time_yoga_prep', '35s'],
    ['time-yoga-pose', 68, 'timeYogaPose', 'display-yoga-pose', 'chakra_time_yoga_pose', '68s'],
    ['time-bath', 599, 'timeBath', 'display-bath', 'chakra_time_bath', '9m'],
    ['time-perineal-care', 125, 'timePerinealCare', 'display-perineal-care', 'chakra_time_perineal_care', '2m'],
    ['time-assisted-bathing', 60, 'timeAssistedBathing', 'display-assisted-bathing', 'chakra_time_assisted_bathing', '1m']
];

for (const [controlId, rawValue, stateKey, displayId, storageKey, label] of cases) {
    events.length = 0;
    expectedCurrentValue = parseInt(rawValue);
    inputs[controlId].emit('input', String(rawValue));
    assert.equal(state[stateKey], expectedCurrentValue, `${controlId} keeps parseInt behavior`);
    assert.equal(stored.get(storageKey), String(expectedCurrentValue), `${controlId} keeps its saved key`);
    assert.deepEqual(events, [
        ['display', displayId, label],
        ['storage', storageKey, String(expectedCurrentValue)],
        ['estimate']
    ], `${controlId} keeps display → persistence → estimate ordering after state update`);
}

const beforeMissing = new Input();
assert.throws(() => view.bindTransitionDurationControls({
    ...services,
    document: { getElementById: id => id === 'time-icebreaker' ? beforeMissing : null }
}), /addEventListener/, 'required timing controls retain their existing initialization failure');

const storageFailureEvents = [];
view.bindCareDurationControls({
    ...services,
    storage: { setItem() { throw new Error('storage blocked'); } },
    setText(id, value) { storageFailureEvents.push([id, value]); },
    updateSessionEstimate() { storageFailureEvents.push(['estimate']); }
});
expectedCurrentValue = 301;
assert.throws(() => inputs['time-bath'].emit('input', '301'), /storage blocked/);
assert.deepEqual(storageFailureEvents, [['display-bath', '5m']], 'a storage exception prevents estimate refresh as before');

const journeyListeners = new Map();
const slider = {
    addEventListener(type, callback) { journeyListeners.set(`journey:${type}`, callback); },
    min: '1', max: '7', style: { setProperty(name, value) { this[name] = value; } }
};
const hrimSlider = {
    addEventListener(type, callback) { journeyListeners.set(`hrim:${type}`, callback); },
    min: '1', max: '30', style: { setProperty(name, value) { this[name] = value; } }
};
const timeOutput = { textContent: '' };
const additionalState = {};
const additionalStored = new Map();
const refreshes = [];
const additionalDocument = { getElementById(id) {
    return { 'time-per-chakra': slider, 'time-display': timeOutput, 'time-high-energy': hrimSlider }[id] || null;
} };
view.bindJourneyDurationControl({
    document: additionalDocument, state: additionalState, getChecked: id => id === 'shots-toggle',
    storage: { setItem: (key, value) => additionalStored.set(key, String(value)) },
    updateDroneSummary: () => refreshes.push('drone'), updateSessionEstimate: () => refreshes.push('estimate')
});
journeyListeners.get('journey:input')({ target: { value: '23.4', min: '1', max: '7', style: slider.style } });
assert.equal(additionalState.timeShot, 23.4);
assert.equal(timeOutput.textContent, '23 secs');
assert.equal(additionalStored.get('chakra_time_shot'), '23.4');
assert.equal(slider.style['--range-fill'], '373.3%');
assert.deepEqual(refreshes.splice(0), ['drone', 'estimate']);
view.bindHighEnergyDurationControl({
    document: additionalDocument, state: additionalState,
    storage: { setItem: (key, value) => additionalStored.set(key, String(value)) },
    setText: (id, text) => events.push(['display', id, text]),
    updateDroneSummary: () => refreshes.push('drone'), updateSessionEstimate: () => refreshes.push('estimate')
});
journeyListeners.get('hrim:input')({ target: { value: '12', min: '1', max: '30', style: hrimSlider.style } });
assert.equal(additionalState.timeHighEnergy, 12);
assert.equal(additionalStored.get('chakra_time_high_energy'), '12');
assert.equal(hrimSlider.style['--range-fill'], '37.9%');
assert.deepEqual(refreshes, ['drone', 'estimate']);

console.log('Timing settings view contract passed: transition, care, Chakra/Sleep/Shot and HRIM duration controls preserve values, labels, storage keys, fills and refresh ordering.');
