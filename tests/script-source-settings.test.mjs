import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

const source = fs.readFileSync('modules/script-source-settings.js', 'utf8');
const app = fs.readFileSync('app.js', 'utf8');
const html = fs.readFileSync('index.html', 'utf8');
const sw = fs.readFileSync('sw.js', 'utf8');
const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
assert.match(app, /scriptSourceSettings\.bindSourceSelection\(/);
assert.match(app, /scriptSourceSettings\.bindUpload\(/);
assert.match(app, /scriptSourceSettings\.bindUrlFetch\(/);
assert.doesNotMatch(app, /scriptSourceSelect\.addEventListener\('change'/);
assert.doesNotMatch(app, /uploadInput\.addEventListener\('change'/);
assert.doesNotMatch(app, /loadUrlBtn\.addEventListener\('click'/);
assert.ok(app.indexOf('bindTransitionDurationControls') < app.indexOf('scriptSourceSettings.bindSourceSelection('));
assert.ok(app.indexOf('scriptSourceSettings.bindSourceSelection(') < app.indexOf('scriptSourceSettings.bindUpload('));
assert.ok(app.indexOf('scriptSourceSettings.bindUpload(') < app.indexOf('scriptSourceSettings.bindUrlFetch('));
assert.ok(app.indexOf('scriptSourceSettings.bindUrlFetch(') < app.indexOf('bindCareDurationControls'));
assert.ok(app.indexOf('scriptSourceSettings.bindSourceSelection(') < app.indexOf('bindCareDurationControls'));
assert.match(html, /modules\/script-source-settings\.js\?v=1\.0[\s\S]*?app\.js\?v=4\.12/);
assert.match(sw, /chakra-v5\.310[\s\S]*?modules\/script-source-settings\.js\?v=1\.0/);
assert.equal(packageJson.scripts['test:script-source-settings'], 'node tests/script-source-settings.test.mjs');

const context = vm.createContext({});
vm.runInContext(source, context);
const api = context.ChakraScriptSourceSettings;
assert.ok(Object.isFrozen(api));

function fixture() {
    const calls = [];
    const panel = { style: {} };
    let change;
    const select = { addEventListener(type, handler) { assert.equal(type, 'change'); change = handler; } };
    const document = { getElementById(id) { return id === 'script-source-select' ? select : id === 'custom-script-ui' ? panel : null; } };
    const state = { scriptSource: 'default' };
    const storage = { setItem(key, value) { calls.push(['save', key, value]); } };
    const meditation = { scripts: { old: true } };
    assert.equal(api.bindSourceSelection({
        document, state, storage, meditation,
        isDemoScriptSelected() { calls.push(['is-demo']); return state.scriptSource === 'custom'; },
        applyDemoCoreDurationPreset() { calls.push(['apply-demo']); },
        restorePreDemoCoreDuration() { calls.push(['restore-duration']); },
        updateSessionEstimate() { calls.push(['estimate']); }
    }), true);
    return { calls, panel, state, meditation, selectChange: value => change({ target: { value } }) };
}

const custom = fixture();
custom.selectChange('custom');
assert.equal(custom.state.scriptSource, 'custom');
assert.equal(custom.panel.style.display, 'flex');
assert.equal(custom.meditation.scripts, null);
assert.deepEqual(JSON.parse(JSON.stringify(custom.calls)), [
    ['is-demo'], ['apply-demo'], ['estimate'], ['save', 'chakra_script_source', 'custom']
]);

const standard = fixture();
standard.selectChange('default');
assert.equal(standard.panel.style.display, 'none');
assert.equal(standard.meditation.scripts, null);
assert.deepEqual(JSON.parse(JSON.stringify(standard.calls)), [
    ['is-demo'], ['restore-duration'], ['estimate'], ['save', 'chakra_script_source', 'default']
]);

const emptyDocument = { getElementById() { return null; } };
assert.equal(api.bindSourceSelection({
    document: emptyDocument, state: {}, storage: { setItem() {} }, meditation: {},
    isDemoScriptSelected() {}, applyDemoCoreDurationPreset() {}, restorePreDemoCoreDuration() {}, updateSessionEstimate() {}
}), false, 'a missing optional selector remains a no-op');

assert.throws(() => api.bindSourceSelection({ document: {}, state: {}, storage: {}, meditation: {} }), /require a document/);

function uploadFixture(validation = { valid: true }) {
    const calls = [];
    let change;
    let reader;
    const upload = { addEventListener(type, handler) { assert.equal(type, 'change'); change = handler; } };
    const status = { style: {}, textContent: '' };
    const document = { getElementById(id) { return id === 'upload-script-file' ? upload : id === 'script-status' ? status : null; } };
    class Reader {
        readAsText(file) { calls.push(['read', file.name]); reader = this; }
    }
    const state = { customScript: { old: true } };
    const storage = { setItem(key, value) { calls.push(['persist', key, JSON.parse(value)]); } };
    const meditation = { scripts: { cached: true } };
    api.bindUpload({
        document, state, storage, meditation, FileReaderCtor: Reader,
        validateScriptBundle(bundle, options) { calls.push(['validate', bundle]); calls.push(['options', options]); return validation; },
        getChecked(id) { calls.push(['checked', id]); return id === 'high-energy-toggle'; },
        applyDemoCoreDurationPreset() { calls.push(['preset']); return false; },
        restorePreDemoCoreDuration() { calls.push(['restore']); },
        updateSessionEstimate() { calls.push(['estimate']); },
        getDemoScriptTimingMessage() { return 'Demo timing'; }
    });
    return { calls, document, status, state, meditation, change: files => change({ target: { files } }), getReader: () => reader };
}

const validUpload = uploadFixture();
validUpload.change([{ name: 'custom.json' }]);
const uploaded = { sections: [{ title: 'Welcome' }] };
validUpload.getReader().onload({ target: { result: JSON.stringify(uploaded) } });
assert.deepEqual(JSON.parse(JSON.stringify(validUpload.state.customScript)), uploaded);
assert.equal(validUpload.meditation.scripts, null);
assert.equal(validUpload.status.textContent, 'Script uploaded successfully!');
assert.equal(validUpload.status.style.color, '#4ade80');
assert.deepEqual(validUpload.calls.map(call => call[0]), ['read', 'checked', 'checked', 'validate', 'options', 'persist', 'preset', 'restore', 'estimate']);

const rejectedUpload = uploadFixture({ valid: false, missing: ['opening', 'chakra', 'closing'] });
rejectedUpload.change([{ name: 'invalid.json' }]);
rejectedUpload.getReader().onload({ target: { result: JSON.stringify({ invalid: true }) } });
assert.deepEqual(JSON.parse(JSON.stringify(rejectedUpload.state.customScript)), { old: true }, 'invalid uploads must preserve the active custom script');
assert.deepEqual(rejectedUpload.calls.map(call => call[0]), ['read', 'checked', 'checked', 'validate', 'options'], 'invalid uploads must not persist, refresh, or invalidate cached content');
assert.deepEqual(rejectedUpload.meditation.scripts, { cached: true });
assert.equal(rejectedUpload.status.textContent, 'Error: Invalid JSON file.');
assert.equal(rejectedUpload.status.style.color, '#f87171');

const malformedUpload = uploadFixture();
malformedUpload.change([{ name: 'broken.json' }]);
malformedUpload.getReader().onload({ target: { result: '{' } });
assert.deepEqual(JSON.parse(JSON.stringify(malformedUpload.state.customScript)), { old: true }, 'malformed JSON must preserve prior settings');
assert.deepEqual(malformedUpload.calls.map(call => call[0]), ['read']);
assert.equal(malformedUpload.status.textContent, 'Error: Invalid JSON file.');

const noFileUpload = uploadFixture();
noFileUpload.change([]);
assert.deepEqual(noFileUpload.calls, [], 'empty file selection is a no-op');

function urlFixture({ fetchImpl, validation = { valid: true }, isDemo = false } = {}) {
    const calls = [];
    let click;
    const input = { value: '' };
    const button = { addEventListener(type, handler) { assert.equal(type, 'click'); click = handler; } };
    const status = { style: {}, textContent: '' };
    const document = { getElementById(id) { return id === 'script-url-input' ? input : id === 'load-script-url' ? button : id === 'script-status' ? status : null; } };
    const state = { customScript: { old: true } };
    const storage = { setItem(key, value) { calls.push(['persist', key, JSON.parse(value)]); } };
    const meditation = { scripts: { cached: true } };
    api.bindUrlFetch({
        document, state, storage, meditation,
        fetchImpl: fetchImpl || (async url => { calls.push(['fetch', url]); return { ok: true, async json() { return { sections: [{ url }] }; } }; }),
        validateScriptBundle(bundle, options) { calls.push(['validate', bundle]); calls.push(['options', options]); return validation; },
        getChecked(id) { calls.push(['checked', id]); return id === 'high-energy-toggle'; },
        applyDemoCoreDurationPreset() { calls.push(['preset']); return isDemo; },
        restorePreDemoCoreDuration() { calls.push(['restore']); },
        updateSessionEstimate() { calls.push(['estimate']); },
        getDemoScriptTimingMessage() { return 'Demo timing'; }
    });
    return { calls, input, status, state, storage, meditation, click: () => click() };
}

const emptyUrl = urlFixture();
await emptyUrl.click();
assert.deepEqual(emptyUrl.calls, [], 'an empty URL remains a no-op');
assert.deepEqual(emptyUrl.state.customScript, { old: true });

const validUrl = urlFixture();
validUrl.input.value = ' https://example.test/script.json ';
await validUrl.click();
assert.deepEqual(JSON.parse(JSON.stringify(validUrl.state.customScript)), { sections: [{ url: 'https://example.test/script.json' }] });
assert.equal(validUrl.meditation.scripts, null);
assert.equal(validUrl.status.textContent, 'Script loaded from URL successfully!');
assert.deepEqual(validUrl.calls.map(call => call[0]), ['fetch', 'checked', 'checked', 'validate', 'options', 'persist', 'preset', 'restore', 'estimate']);

const demoUrl = urlFixture({ isDemo: true });
demoUrl.input.value = 'https://example.test/demo.json';
await demoUrl.click();
assert.equal(demoUrl.status.textContent, 'Demo timing');

const httpFailure = urlFixture({ fetchImpl: async () => ({ ok: false, status: 404 }) });
httpFailure.input.value = 'https://example.test/missing.json';
await httpFailure.click();
assert.deepEqual(httpFailure.state.customScript, { old: true });
assert.deepEqual(httpFailure.meditation.scripts, { cached: true });
assert.equal(httpFailure.calls.some(call => call[0] === 'persist'), false);
assert.equal(httpFailure.status.textContent, 'Error: HTTP 404');
assert.equal(httpFailure.status.style.color, '#f87171');

const invalidUrl = urlFixture({ validation: { valid: false, missing: ['opening', 'chakra', 'closing'] } });
invalidUrl.input.value = 'https://example.test/invalid.json';
await invalidUrl.click();
assert.deepEqual(invalidUrl.state.customScript, { old: true });
assert.deepEqual(invalidUrl.meditation.scripts, { cached: true });
assert.equal(invalidUrl.calls.some(call => call[0] === 'persist'), false);
assert.equal(invalidUrl.status.textContent, 'Error: Missing required sections: opening, chakra, closing');

const invalidJsonUrl = urlFixture({ fetchImpl: async () => ({ ok: true, async json() { throw new SyntaxError('Invalid JSON response'); } }) });
invalidJsonUrl.input.value = 'https://example.test/broken.json';
await invalidJsonUrl.click();
assert.deepEqual(invalidJsonUrl.state.customScript, { old: true });
assert.deepEqual(invalidJsonUrl.meditation.scripts, { cached: true });
assert.equal(invalidJsonUrl.calls.some(call => call[0] === 'persist'), false);
assert.match(invalidJsonUrl.status.textContent, /^Error: Invalid JSON response$/);

function deferred() {
    let resolve;
    let reject;
    const promise = new Promise((res, rej) => { resolve = res; reject = rej; });
    return { promise, resolve, reject };
}

const pendingByUrl = new Map();
const concurrent = urlFixture({ fetchImpl: url => {
    const request = deferred();
    pendingByUrl.set(url, request);
    return request.promise;
} });
concurrent.input.value = 'https://example.test/older.json';
const olderLoad = concurrent.click();
concurrent.input.value = 'https://example.test/newer.json';
const newerLoad = concurrent.click();
pendingByUrl.get('https://example.test/newer.json').resolve({ ok: true, async json() { return { name: 'newer' }; } });
await newerLoad;
assert.deepEqual(concurrent.state.customScript, { name: 'newer' });
pendingByUrl.get('https://example.test/older.json').resolve({ ok: true, async json() { return { name: 'older' }; } });
await olderLoad;
assert.deepEqual(concurrent.state.customScript, { name: 'newer' }, 'a late older response cannot replace the latest request');
assert.equal(concurrent.status.textContent, 'Script loaded from URL successfully!');

const staleFailureRequests = new Map();
const staleFailure = urlFixture({ fetchImpl: url => {
    const request = deferred();
    staleFailureRequests.set(url, request);
    return request.promise;
} });
staleFailure.input.value = 'https://example.test/old-failure.json';
const oldFailureLoad = staleFailure.click();
staleFailure.input.value = 'https://example.test/success.json';
const successLoad = staleFailure.click();
staleFailureRequests.get('https://example.test/success.json').resolve({ ok: true, async json() { return { name: 'winner' }; } });
await successLoad;
staleFailureRequests.get('https://example.test/old-failure.json').reject(new Error('stale failure'));
await oldFailureLoad;
assert.deepEqual(staleFailure.state.customScript, { name: 'winner' });
assert.equal(staleFailure.status.textContent, 'Script loaded from URL successfully!', 'a stale rejection cannot overwrite latest status');
console.log('Script source settings checks passed');
