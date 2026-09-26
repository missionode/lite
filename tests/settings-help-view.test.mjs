import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';

const html = readFileSync('index.html', 'utf8');
const worker = readFileSync('sw.js', 'utf8');
assert.ok(html.indexOf('modules/settings-help-view.js?v=1.0') < html.indexOf('app.js?v='), 'help module must load before the app');
assert.match(worker, /modules\/settings-help-view\.js\?v=1\.0/, 'help module must be precached offline');

const events = new Map();
const classes = new Set(['hidden']);
let focusCount = 0;
const elements = new Map([
    ['settings-help-modal', { classList: { add: key => classes.add(key), remove: key => classes.delete(key) } }],
    ['settings-help-button', { addEventListener: (type, fn) => events.set(type, fn) }],
    ['settings-help-close', { addEventListener: (type, fn) => events.set(`${type}:close`, fn), focus: () => focusCount++ }]
]);
const context = { document: { getElementById: id => elements.get(id) || null } };
vm.runInNewContext(readFileSync('modules/settings-help-view.js', 'utf8'), context);
context.ChakraSettingsHelpView.bind();
events.get('click')();
assert.equal(classes.has('hidden'), false, 'open removes the hidden state');
assert.equal(focusCount, 1, 'opening moves focus to the close control');
events.get('click:close')();
assert.equal(classes.has('hidden'), true, 'close restores the hidden state');
console.log('Settings help view passed: open, focus and close behavior.');
