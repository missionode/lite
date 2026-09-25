import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

const source = fs.readFileSync('modules/script-preference-hydration.js', 'utf8');
const app = fs.readFileSync('app.js', 'utf8');
const html = fs.readFileSync('index.html', 'utf8');
const sw = fs.readFileSync('sw.js', 'utf8');
const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
assert.match(app, /scriptPreferenceHydration\.hydrate\(/);
assert.match(html, /modules\/script-preference-hydration\.js\?v=1\.0[\s\S]*?app\.js\?v=4\.01/);
assert.match(sw, /chakra-v5\.297[\s\S]*?modules\/script-preference-hydration\.js\?v=1\.0/);
assert.equal(packageJson.scripts['test:script-preference-hydration'], 'node tests/script-preference-hydration.test.mjs');

const context = vm.createContext({});
vm.runInContext(source, context);
const api = context.ChakraScriptPreferenceHydration;
assert.ok(Object.isFrozen(api));
const ui = { style: {} };
const status = { style: {}, textContent: '' };
const ids = [];
const document = { getElementById(id) { ids.push(id); return id === 'custom-script-ui' ? ui : id === 'script-status' ? status : null; } };
const events = [];
api.hydrate({
    state: { scriptSource: 'custom', customScript: { sections: [] } },
    syncValue(id, value) { events.push(['sync', id, value]); },
    document,
    isDemoScriptSelected() { return true; },
    getDemoScriptTimingMessage() { return 'Demo timing'; }
});
assert.deepEqual(JSON.parse(JSON.stringify(events)), [['sync', 'script-source-select', 'custom']]);
assert.equal(ui.style.display, 'flex');
assert.equal(status.textContent, 'Demo timing');
assert.equal(status.style.display, 'block');
assert.equal(status.style.color, '#4ade80');

api.hydrate({
    state: { scriptSource: 'default', customScript: { sections: [] } },
    syncValue() {}, document,
    isDemoScriptSelected() { return false; },
    getDemoScriptTimingMessage() { throw new Error('Must not be called for a custom script'); }
});
assert.equal(ui.style.display, 'none');
assert.equal(status.textContent, 'Custom script loaded and ready.');

const existingText = status.textContent;
api.hydrate({
    state: { scriptSource: 'default', customScript: null }, syncValue() {}, document,
    isDemoScriptSelected() { return false; }, getDemoScriptTimingMessage() { return ''; }
});
assert.equal(status.textContent, existingText, 'No loaded custom script must leave the previous status untouched.');
assert.throws(() => api.hydrate({}), /requires state/);
console.log('Script preference hydration passed: saved source, optional UI, status branch semantics and offline delivery.');
