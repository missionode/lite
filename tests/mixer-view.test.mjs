import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';

const html = readFileSync('index.html', 'utf8');
const worker = readFileSync('sw.js', 'utf8');
assert.ok(html.indexOf('modules/mixer-view.js?v=1.0') < html.indexOf('app.js?v='), 'mixer module must load before app');
assert.match(worker, /modules\/mixer-view\.js\?v=1\.0/, 'mixer module must be precached offline');

const events = new Map();
const classes = new Set(['hidden']);
let openFocus = 0;
let closeFocus = 0;
const elements = new Map([
    ['volume-mixer', { classList: { add: key => classes.add(key), remove: key => classes.delete(key) } }],
    ['btn-mixer', { addEventListener: (type, handler) => events.set('open', handler), focus: () => openFocus++ }],
    ['close-mixer', { addEventListener: (type, handler) => events.set('close', handler), focus: () => closeFocus++ }],
    ['close-mixer-bottom', { addEventListener: (type, handler) => events.set('close-bottom', handler) }]
]);
const context = { document: { getElementById: id => elements.get(id) || null } };
vm.runInNewContext(readFileSync('modules/mixer-view.js', 'utf8'), context);
const state = { noFrequencyMode: true, noMantraMode: false, spatialMode: 'headphones' };
const calls = [];
const view = context.ChakraMixerView.create({ state, syncChecked: (...args) => calls.push(args), syncValue: (...args) => calls.push(args) });
view.bind();
let stopped = 0;
events.get('open')({ stopPropagation: () => stopped++ });
assert.equal(stopped, 1);
assert.equal(classes.has('hidden'), false);
assert.deepEqual(calls, [['mixer-no-frequency-mode-toggle', true], ['mixer-no-mantra-mode-toggle', false], ['mixer-spatial-mode', 'headphones']]);
assert.equal(closeFocus, 1, 'opening focuses the close control');
events.get('close')({ stopPropagation: () => stopped++ });
assert.equal(classes.has('hidden'), true);
assert.equal(openFocus, 1, 'closing returns focus to the opener');
view.hide();
console.log('Mixer view passed: show/hide, synchronized controls and focus return.');
