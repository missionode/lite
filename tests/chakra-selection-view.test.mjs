import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';

const html = readFileSync('index.html', 'utf8');
const worker = readFileSync('sw.js', 'utf8');
assert.ok(html.indexOf('modules/chakra-selection-view.js?v=1.0') < html.indexOf('app.js?v='), 'view module must load before the app');
assert.match(worker, /modules\/chakra-selection-view\.js\?v=1\.0/, 'view module must be precached offline');

const inputs = [
    { value: 'root', checked: true, addEventListener(type, handler) { this.handlers ||= {}; (this.handlers[type] ||= []).push(handler); }, closest() { return this.label; } },
    { value: 'heart', checked: false, addEventListener(type, handler) { this.handlers ||= {}; (this.handlers[type] ||= []).push(handler); }, closest() { return this.label; } }
];
const labels = inputs.map(() => ({ classes: new Set(), classList: {
    add(name) { this.owner.classes.add(name); },
    toggle(name, enabled) { enabled ? this.owner.classes.add(name) : this.owner.classes.delete(name); }
} }));
inputs.forEach((input, index) => { input.label = labels[index]; input.label.classList.owner = input.label; });
const writes = [];
const calls = [];
const context = {
    document: {
        querySelectorAll(selector) { return selector.endsWith(':checked') ? inputs.filter(input => input.checked) : inputs; }
    },
    localStorage: { setItem: (...args) => writes.push(args) }
};
vm.runInNewContext(readFileSync('modules/chakra-selection-view.js', 'utf8'), context);
const state = { selectedChakras: [] };
const view = context.ChakraSelectionView.create({ state, updateSessionEstimate: () => calls.push('estimate'), updateJourneyRoadmap: () => calls.push('roadmap') });
view.bindPersistence();
view.bindChipDisplay();
assert.ok(labels[0].classes.has('chip-active'), 'initially checked chakra receives its active display class');
inputs[1].checked = true;
inputs[1].handlers.change.forEach(handler => handler());
assert.ok(labels[1].classes.has('chip-active'), 'changing a chakra updates its display class');
assert.deepEqual(Array.from(state.selectedChakras), ['root', 'heart']);
assert.deepEqual(writes, [['chakra_selected', '["root","heart"]']]);
assert.deepEqual(calls, ['estimate', 'roadmap']);
console.log('Chakra selection view passed: display state, persistence and refresh ordering.');
