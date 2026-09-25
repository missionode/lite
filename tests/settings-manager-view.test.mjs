import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

const moduleSource = fs.readFileSync('modules/settings-manager-view.js', 'utf8');
const html = fs.readFileSync('index.html', 'utf8');
const sw = fs.readFileSync('sw.js', 'utf8');

function setup({ unlocked = false, confirm = true } = {}) {
    const elements = new Map();
    const navigations = [];
    const anchors = [];
    const urls = [];
    const statuses = [];
    let reloads = 0;
    const makeElement = () => ({
        textContent: '',
        files: [],
        listeners: {},
        addEventListener(type, listener) { this.listeners[type] = listener; },
        click() { this.clicked = true; }
    });
    const document = {
        getElementById(id) {
            if (!elements.has(id)) elements.set(id, makeElement());
            return elements.get(id);
        },
        createElement() { const anchor = makeElement(); anchors.push(anchor); return anchor; }
    };
    const window = {
        Blob,
        URL: {
            createObjectURL(blob) { urls.push({ blob, revoked: false }); return `blob:test-${urls.length}`; },
            revokeObjectURL(url) { const item = urls.find(entry => `blob:test-${urls.indexOf(entry) + 1}` === url); if (item) item.revoked = true; }
        },
        confirm: () => confirm,
        location: { reload() { reloads += 1; } }
    };
    const backup = {
        FORMAT: 'chakra-meditation-settings', VERSION: 1,
        collectManagedSettings: () => ({ chakra_voice: 'piper:test' }),
        parseSettingsBackup: text => {
            if (text === 'invalid') throw new Error('Invalid backup');
            return { chakra_voice: text };
        },
        replaceManagedSettings: settings => statuses.push(['replace', settings])
    };
    const context = vm.createContext({ window });
    window.window = window;
    window.document = document;
    vm.runInContext(moduleSource, context);
    const configScreen = { id: 'config' };
    const settingsManagerScreen = { id: 'manage' };
    window.ChakraSettingsManagerView.bind({
        document, window, configScreen, settingsManagerScreen,
        showScreen: screen => navigations.push(screen),
        advancedFeaturesUnlocked: () => unlocked,
        backup,
        t: key => key
    });
    return { elements, navigations, anchors, urls, statuses, configScreen, settingsManagerScreen, get reloads() { return reloads; } };
}

const app = setup();
app.elements.get('settings-manager-status').textContent = 'old status';
app.elements.get('open-settings-manager').listeners.click();
assert.equal(app.navigations[0], app.settingsManagerScreen);
assert.equal(app.elements.get('settings-manager-status').textContent, '');
app.elements.get('close-settings-manager').listeners.click();
assert.equal(app.navigations[1], app.configScreen);
app.elements.get('export-settings').listeners.click();
assert.equal(app.urls.length, 0, 'Export is a no-op until the shared Advanced Features gate is unlocked.');
await app.elements.get('import-settings').listeners.click();
assert.equal(app.elements.get('settings-manager-status').textContent, 'ui.settingsImportChooseFile');

const unlocked = setup({ unlocked: true });
unlocked.elements.get('export-settings').listeners.click();
assert.equal(unlocked.anchors[0].download, 'chakra-meditation-settings.json');
assert.equal(unlocked.anchors[0].href, 'blob:test-1');
assert.equal(unlocked.urls[0].revoked, true);
assert.equal(unlocked.elements.get('settings-manager-status').textContent, 'ui.settingsExported');
const exported = JSON.parse(await unlocked.urls[0].blob.text());
assert.equal(exported.format, 'chakra-meditation-settings');
assert.deepEqual(JSON.parse(JSON.stringify(exported.settings)), { chakra_voice: 'piper:test' });

const importApp = setup({ confirm: false });
const cancelledFile = importApp.elements.get('import-settings-file');
cancelledFile.files = [{ text: async () => 'settings' }];
await importApp.elements.get('import-settings').listeners.click();
assert.equal(importApp.statuses.length, 0, 'Cancelled replacement leaves saved settings untouched.');
assert.equal(importApp.reloads, 0);
const invalid = setup();
invalid.elements.get('import-settings-file').files = [{ text: async () => 'invalid' }];
await invalid.elements.get('import-settings').listeners.click();
assert.equal(invalid.elements.get('settings-manager-status').textContent, 'Invalid backup');
const accepted = setup();
accepted.elements.get('import-settings-file').files = [{ text: async () => 'settings' }];
await accepted.elements.get('import-settings').listeners.click();
assert.deepEqual(accepted.statuses[0], ['replace', { chakra_voice: 'settings' }]);
assert.equal(accepted.elements.get('settings-manager-status').textContent, 'ui.settingsImported');
assert.equal(accepted.reloads, 1);

assert.ok(html.indexOf('modules/settings-manager-view.js?v=1.0') < html.indexOf('app.js?v=4.12'));
assert.match(sw, /chakra-v5\.310[\s\S]*?modules\/settings-manager-view\.js\?v=1\.0/);
assert.doesNotMatch(fs.readFileSync('app.js', 'utf8'), /settingsManagerButton\?\.addEventListener|id="export-settings"'\)\?\.addEventListener/);
console.log('Settings manager view passed: public navigation/import, Advanced Features-only export, cancellation, validation and replacement.');
