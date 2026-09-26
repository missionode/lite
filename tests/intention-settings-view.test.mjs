import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';

const html = readFileSync('index.html', 'utf8');
const worker = readFileSync('sw.js', 'utf8');
assert.ok(html.indexOf('modules/intention-settings-view.js?v=1.0') < html.indexOf('app.js?v='), 'view module must load before the app');
assert.match(worker, /modules\/intention-settings-view\.js\?v=1\.0/, 'view module must be precached offline');

let inputHandler;
const values = [];
const context = {
    document: { getElementById: id => id === 'intention-input' ? { addEventListener(type, handler) { assert.equal(type, 'input'); inputHandler = handler; } } : null },
    localStorage: { setItem: (...args) => values.push(args) }
};
vm.runInNewContext(readFileSync('modules/intention-settings-view.js', 'utf8'), context);
const state = { intention: '' };
context.ChakraIntentionSettingsView.bind({ state });
inputHandler({ target: { value: 'clarity and calm' } });
assert.equal(state.intention, 'clarity and calm');
assert.deepEqual(values, [['chakra_intention', 'clarity and calm']]);
console.log('Intention settings view passed: input state and local persistence.');
