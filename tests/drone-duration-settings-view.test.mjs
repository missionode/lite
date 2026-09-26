import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

const source = fs.readFileSync(new URL('../modules/drone-duration-settings-view.js', import.meta.url), 'utf8');
const app = fs.readFileSync(new URL('../app.js', import.meta.url), 'utf8');
const html = fs.readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const serviceWorker = fs.readFileSync(new URL('../sw.js', import.meta.url), 'utf8');
assert.match(app, /const droneDurationSettingsView = window\.ChakraDroneDurationSettingsView/);
assert.match(app, /function syncDroneDurationModeControls\(\)\s*\{[\s\S]*?droneDurationSettingsView\.sync\(/);
assert.match(app, /droneDurationSettingsView\.bindSelection\(/);
assert.match(html, /modules\/drone-duration-settings-view\.js\?v=1\.0[\s\S]*?app\.js\?v=4.12/);
assert.match(serviceWorker, /chakra-v5.310[\s\S]*?modules\/drone-duration-settings-view\.js\?v=1\.0/);

const context = vm.createContext({});
vm.runInContext(source, context);
const view = context.ChakraDroneDurationSettingsView;
assert.ok(Object.isFrozen(view));

const options = ['beginner', 'intermediate', 'advanced', 'expert'].map(value => ({
    value, checked: false, disabled: false,
    addEventListener(type, fn) { selectionListeners.set(`${value}:${type}`, fn); }
}));
const hrimNote = { hidden: true };
const sleepNote = { hidden: true };
const summary = { textContent: '' };
const selectionListeners = new Map();
const document = {
    querySelectorAll(selector) {
        assert.equal(selector, 'input[name="drone-duration-mode"]');
        return options;
    },
    getElementById(id) {
        return { 'drone-duration-hrim-note': hrimNote, 'drone-duration-sleep-note': sleepNote, 'drone-duration-summary': summary }[id] || null;
    }
};

view.sync({ document, highEnergy: false, sleep: false, activeMode: 'beginner' });
assert.deepEqual(options.map(option => [option.checked, option.disabled]), [
    [true, false], [false, false], [false, false], [false, false]
]);
assert.equal(hrimNote.hidden, true);
assert.equal(sleepNote.hidden, true);

view.sync({ document, highEnergy: true, sleep: false, activeMode: 'intermediate' });
assert.deepEqual(options.map(option => [option.checked, option.disabled]), [
    [false, true], [true, false], [false, false], [false, false]
]);
assert.equal(hrimNote.hidden, false);
assert.equal(sleepNote.hidden, true);

view.sync({ document, highEnergy: false, sleep: true, activeMode: 'advanced' });
assert.equal(options[0].disabled, false, 'Sleep retains access to Beginner');
assert.equal(options[2].checked, true);
assert.equal(hrimNote.hidden, true);
assert.equal(sleepNote.hidden, false);
view.renderSummary({
    document,
    state: { timeHighEnergy: 4, timeSleepStage: 3, timePerChakra: 5, hrimDroneDurationMode: 'advanced', sleepDroneDurationMode: 'intermediate', droneDurationMode: 'beginner' },
    highEnergy: false, sleep: true,
    getDurationMs: (minutes, mode) => { assert.deepEqual([minutes, mode], [3, 'intermediate']); return 9500; },
    formatDuration: ms => `duration:${ms}`,
    translate: key => `${key} — {duration}`
});
assert.equal(summary.textContent, 'ui.droneDurationActiveSleep — duration:9500');

const selectedState = {};
const saved = new Map();
const modeCalls = [];
let activeToggle = 'high-energy-toggle';
view.bindSelection({
    document, state: selectedState, storage: { setItem(key, value) { saved.set(key, value); } },
    getChecked: id => id === activeToggle,
    normalizeHrim: value => `hrim:${value}`,
    normalizeSleep: value => `sleep:${value}`,
    normalizeStandard: value => `standard:${value}`,
    syncControls: () => modeCalls.push('sync'), updateSummary: () => modeCalls.push('summary')
});
selectionListeners.get('advanced:change')({ target: { checked: false, value: 'advanced' } });
assert.deepEqual(modeCalls, [], 'unchecked radio changes do not persist');
selectionListeners.get('advanced:change')({ target: { checked: true, value: 'advanced' } });
assert.equal(selectedState.hrimDroneDurationMode, 'hrim:advanced');
assert.equal(saved.get('chakra_hrim_drone_duration_mode'), 'hrim:advanced');
assert.deepEqual(modeCalls.splice(0), ['sync', 'summary']);
activeToggle = 'sleep-mode-toggle';
selectionListeners.get('expert:change')({ target: { checked: true, value: 'expert' } });
assert.equal(selectedState.sleepDroneDurationMode, 'sleep:expert');
assert.equal(saved.get('chakra_sleep_drone_duration_mode'), 'sleep:expert');
activeToggle = '';
selectionListeners.get('beginner:change')({ target: { checked: true, value: 'beginner' } });
assert.equal(selectedState.droneDurationMode, 'standard:beginner');
assert.equal(saved.get('chakra_drone_duration_mode'), 'standard:beginner');
assert.deepEqual(modeCalls, ['sync', 'summary', 'sync', 'summary']);

assert.throws(() => view.sync({}), /requires document and active mode/);
assert.throws(() => view.renderSummary({}), /requires state, document and timing\/localization services/);
console.log('Drone duration settings view passed: active selection, HRIM restriction and contextual notes.');
