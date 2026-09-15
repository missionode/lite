import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

const source = fs.readFileSync('app.js', 'utf8');
const start = source.indexOf('const SETTINGS_BACKUP_FORMAT');
const end = source.indexOf('// ── UTILS');
assert.ok(start >= 0 && end > start, 'Settings backup helpers must remain available before app initialization.');

function storageFrom(entries) {
    const values = new Map(entries);
    return {
        get length() { return values.size; },
        key(index) { return [...values.keys()][index] ?? null; },
        getItem(key) { return values.get(key) ?? null; },
        setItem(key, value) { values.set(key, String(value)); },
        removeItem(key) { values.delete(key); },
        entries: () => [...values.entries()]
    };
}

const storage = storageFrom([
    ['chakra_lang', 'en'],
    ['chakra_selected', '["root","heart"]'],
    ['unrelated_extension_data', 'keep']
]);
const helpers = vm.runInNewContext(`${source.slice(start, end)}; ({ collectManagedSettings, parseSettingsBackup, replaceManagedSettings })`, { Blob, localStorage: storage });

const settings = helpers.collectManagedSettings();
assert.deepEqual(JSON.parse(JSON.stringify(settings)), { chakra_lang: 'en', chakra_selected: '["root","heart"]' });
const validBackup = JSON.stringify({ format: 'chakra-meditation-settings', version: 1, settings });
assert.deepEqual(JSON.parse(JSON.stringify(helpers.parseSettingsBackup(validBackup))), JSON.parse(JSON.stringify(settings)));
assert.throws(() => helpers.parseSettingsBackup(JSON.stringify({ format: 'wrong', version: 1, settings })), /compatible/);
assert.throws(() => helpers.parseSettingsBackup(JSON.stringify({ format: 'chakra-meditation-settings', version: 1, settings: { unsafe_key: 'no' } })), /invalid/);

helpers.replaceManagedSettings({ chakra_voice: 'piper:test' });
assert.deepEqual(storage.entries().sort(), [['chakra_voice', 'piper:test'], ['unrelated_extension_data', 'keep']].sort());

const html = fs.readFileSync('index.html', 'utf8');
assert.doesNotMatch(html, /id="open-settings-manager"[^>]* hidden/, 'The Manage Settings CTA must be available without Advanced Features.');
assert.match(html, /id="open-settings-manager"[^>]*class="secondary-btn"/, 'The public Manage Settings CTA must remain clearly visible against the sky.');
assert.match(html, /id="export-settings"/, 'The manager needs export.');
assert.match(html, /id="import-settings"/, 'The manager needs import.');
assert.match(html, /id="settings-export-control"[^>]* hidden/, 'Export controls must start hidden until Advanced Features is unlocked.');
assert.doesNotMatch(html, /id="settings-import-control"[^>]* hidden/, 'Import controls must remain available without Advanced Features.');
assert.match(source, /settingsExportControl\.hidden = isLocked/, 'Export controls must follow the shared Advanced Features lock.');
assert.match(source, /document\.getElementById\('export-settings'\)\?\.addEventListener\('click', \(\) => \{\s*if \(!state\.advancedFeaturesUnlocked\) return;/, 'Export must reject locked direct calls.');
for (const locale of ['en', 'ml', 'ru', 'hi']) {
    const ui = JSON.parse(fs.readFileSync(`locales/${locale}.json`, 'utf8')).ui;
    for (const key of ['manageSettings', 'exportSettings', 'importSettings', 'settingsImportConfirm']) assert.ok(ui[key], `${locale} needs ${key}`);
}
console.log('Settings backup contract passed: scoped export, strict import, replacement and Advanced Features UI guard.');
