import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';

const html = readFileSync('index.html', 'utf8');
const worker = readFileSync('sw.js', 'utf8');
assert.ok(html.indexOf('modules/visual-comfort-settings-view.js?v=1.0') < html.indexOf('app.js?v='), 'comfort module must load before app');
assert.match(worker, /modules\/visual-comfort-settings-view\.js\?v=1\.0/, 'comfort module must be precached offline');

const events = new Map();
const vars = [];
const bodyClasses = [];
const elements = new Map();
for (const id of ['brightness-slider', 'eyes-close-mode-toggle', 'audio-filters-toggle']) {
    elements.set(id, { addEventListener(type, handler) { events.set(`${id}:${type}`, handler); } });
}
elements.set('app', { style: { setProperty: (...args) => vars.push(args) } });
const calls = [];
const context = {
    document: { getElementById: id => elements.get(id) || null, body: { classList: { toggle: (...args) => bodyClasses.push(args) } } },
    localStorage: { setItem: (...args) => calls.push(['storage', ...args]) }
};
vm.runInNewContext(readFileSync('modules/visual-comfort-settings-view.js', 'utf8'), context);
const state = { brightness: 1, eyesCloseMode: false, audioFilters: false };
const view = context.ChakraVisualComfortSettingsView.create({ state, audio: {
    toggleEyesCloseMode: value => calls.push(['eyes', value]),
    toggleAudioFilters: value => calls.push(['filters', value])
} });
view.bindBrightness();
view.bindJourneyComfort();
events.get('brightness-slider:input')({ target: { value: '0.6' } });
events.get('eyes-close-mode-toggle:change')({ target: { checked: true } });
events.get('audio-filters-toggle:change')({ target: { checked: true } });
assert.equal(state.brightness, 0.6);
assert.deepEqual(vars, [['--app-brightness', '0.6']]);
assert.equal(state.eyesCloseMode, true);
assert.equal(state.audioFilters, true);
assert.deepEqual(bodyClasses, [['eyes-close-mode', true]]);
assert.deepEqual(calls, [
    ['storage', 'chakra_brightness', 0.6],
    ['storage', 'chakra_eyes_close_mode', true], ['eyes', true],
    ['storage', 'chakra_audio_filters', true], ['filters', true]
]);
console.log('Visual comfort settings view passed: brightness, eyes-close and audio-filter side effects.');
