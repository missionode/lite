import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

const source = fs.readFileSync('app.js', 'utf8');
const moduleSource = fs.readFileSync('modules/settings-backup.js', 'utf8');

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
    ['chakra_visualization_ambience', 'space-race'],
    ['chakra_vol_visualization_ambience', '0.14'],
    ['unrelated_extension_data', 'keep']
]);
const context = vm.createContext({ Blob, localStorage: storage });
vm.runInContext(moduleSource, context);
const helpers = context.ChakraSettingsBackup;
assert.ok(Object.isFrozen(helpers), 'The settings backup module must expose a stable read-only API.');

const settings = helpers.collectManagedSettings();
assert.deepEqual(JSON.parse(JSON.stringify(settings)), {
    chakra_lang: 'en',
    chakra_selected: '["root","heart"]',
    chakra_visualization_ambience: 'space-race',
    chakra_vol_visualization_ambience: '0.14'
});
const validBackup = JSON.stringify({ format: 'chakra-meditation-settings', version: 1, settings });
assert.deepEqual(JSON.parse(JSON.stringify(helpers.parseSettingsBackup(validBackup))), JSON.parse(JSON.stringify(settings)));
assert.throws(() => helpers.parseSettingsBackup(JSON.stringify({ format: 'wrong', version: 1, settings })), /compatible/);
assert.throws(() => helpers.parseSettingsBackup(JSON.stringify({ format: 'chakra-meditation-settings', version: 1, settings: { unsafe_key: 'no' } })), /invalid/);

helpers.replaceManagedSettings({
    chakra_voice: 'piper:test',
    chakra_visualization_ambience: 'silence',
    chakra_vol_visualization_ambience: '0.08'
});
assert.deepEqual(storage.entries().sort(), [
    ['chakra_voice', 'piper:test'],
    ['chakra_visualization_ambience', 'silence'],
    ['chakra_vol_visualization_ambience', '0.08'],
    ['unrelated_extension_data', 'keep']
].sort());

const html = fs.readFileSync('index.html', 'utf8');
const serviceWorker = fs.readFileSync('sw.js', 'utf8');
assert.ok(
    html.indexOf('modules/settings-backup.js?v=1.0') < html.indexOf('app.js?v=3.90'),
    'The settings backup module must load before the application consumes its API.'
);
assert.ok(
    html.indexOf('modules/app-state.js?v=1.1') < html.indexOf('app.js?v=3.90'),
    'The state preference module must load before the application consumes its API.'
);
assert.match(serviceWorker, /\.\/modules\/settings-backup\.js\?v=1\.0/, 'The extracted runtime module must remain available offline.');
assert.match(serviceWorker, /\.\/modules\/app-state\.js\?v=1\.1/, 'The state preference module must remain available offline.');
assert.ok(
    html.indexOf('modules/content-localization.js?v=1.0') < html.indexOf('app.js?v=3.90'),
    'The content/localization module must load before the application consumes its API.'
);
assert.match(serviceWorker, /\.\/modules\/content-localization\.js\?v=1\.0/, 'The content/localization module must remain available offline.');
assert.ok(
    html.indexOf('modules/media-lifecycle.js?v=1.0') < html.indexOf('app.js?v=3.90'),
    'The media lifecycle module must load before the application consumes its API.'
);
assert.match(serviceWorker, /\.\/modules\/media-lifecycle\.js\?v=1\.0/, 'The media lifecycle module must remain available offline.');
assert.ok(
    html.indexOf('modules/piper-lifecycle.js?v=1.0') < html.indexOf('app.js?v=3.90'),
    'The Piper lifecycle module must load before the application consumes its API.'
);
assert.match(serviceWorker, /\.\/modules\/piper-lifecycle\.js\?v=1\.0/, 'The Piper lifecycle module must remain available offline.');
assert.ok(
    html.indexOf('modules/audio-route-lifecycle.js?v=1.0') < html.indexOf('app.js?v=3.90'),
    'The audio route lifecycle module must load before the application consumes its API.'
);
assert.match(serviceWorker, /\.\/modules\/audio-route-lifecycle\.js\?v=1\.0/, 'The audio route lifecycle module must remain available offline.');
assert.ok(
    html.indexOf('modules/journey-routing.js?v=1.2') < html.indexOf('app.js?v=3.90'),
    'The journey routing module must load before the app.',
);
assert.match(serviceWorker, /\.\/modules\/journey-routing\.js\?v=1\.2/, 'The journey routing module must remain available offline.');
assert.ok(
    html.indexOf('modules/practice-module-loader.js?v=1.0') < html.indexOf('app.js?v=3.90'),
    'The practice loader must load before the app requests selected practice modules.'
);
assert.match(serviceWorker, /\.\/modules\/body-scan-practice\.js\?v=1\.0/, 'The Body Scan practice module must remain available offline.');
assert.ok(
    html.indexOf('modules/yoga-experience-settings.js?v=1.0') < html.indexOf('app.js?v=3.90'),
    'The Yoga experience settings module must load before the app consumes it.'
);
assert.match(serviceWorker, /\.\/modules\/yoga-experience-settings\.js\?v=1\.0/, 'Yoga experience settings must remain available offline.');
assert.ok(html.indexOf('modules/locale-ui-renderer.js?v=1.0') < html.indexOf('app.js?v=3.90'), 'Locale UI rendering must load before the app uses it.');
assert.match(serviceWorker, /chakra-v5\.286[\s\S]*?\.\/modules\/locale-ui-renderer\.js\?v=1\.0/, 'Locale UI rendering must remain available offline.');
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
