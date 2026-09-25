import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

const source = fs.readFileSync('modules/session-mode-hydration.js', 'utf8');
const app = fs.readFileSync('app.js', 'utf8');
const html = fs.readFileSync('index.html', 'utf8');
const serviceWorker = fs.readFileSync('sw.js', 'utf8');
const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
assert.match(app, /sessionModeHydration\.resetPreparationSelections\(\{ storage: localStorage, syncChecked \}\)/);
assert.match(app, /sessionModeHydration\.resetExclusiveModes\(\{ storage: localStorage, syncChecked \}\)/);
assert.ok(app.indexOf('resetPreparationSelections({ storage: localStorage') < app.indexOf("syncChecked('no-frequency-mode-toggle'"));
assert.ok(app.indexOf("syncChecked('eyes-close-mode-toggle'") < app.indexOf('resetExclusiveModes({ storage: localStorage'));
assert.match(html, /modules\/session-mode-hydration\.js\?v=1\.0[\s\S]*?app\.js\?v=3\.94/);
assert.match(serviceWorker, /chakra-v5\.290[\s\S]*?modules\/session-mode-hydration\.js\?v=1\.0/);
assert.equal(packageJson.scripts['test:session-mode-hydration'], 'node tests/session-mode-hydration.test.mjs');

const context = vm.createContext({});
vm.runInContext(source, context);
const hydration = context.ChakraSessionModeHydration;
assert.ok(Object.isFrozen(hydration));

const events = [];
const storage = { removeItem(key) { events.push(['remove', key]); } };
const syncChecked = (id, checked) => events.push(['check', id, checked]);
hydration.resetPreparationSelections({ storage, syncChecked });
assert.deepEqual(events, [
    ['remove', 'chakra_reverse_journey'],
    ['remove', 'chakra_box_meditation'],
    ['remove', 'chakra_hooponopono'],
    ['check', 'box-breathing-experience-toggle', false],
    ['check', 'hooponopono-experience-toggle', false]
]);

events.length = 0;
hydration.resetExclusiveModes({ storage, syncChecked });
assert.deepEqual(events, [
    ['remove', 'chakra_bg_music_mode'],
    ['remove', 'chakra_high_energy'],
    ['remove', 'chakra_sleep_experience'],
    ['check', 'music-only-toggle', false],
    ['check', 'high-energy-toggle', false],
    ['check', 'sleep-mode-toggle', false]
]);

assert.throws(() => hydration.resetPreparationSelections({}), /requires storage and checkbox synchronization services/);
assert.throws(() => hydration.resetExclusiveModes({ storage }), /requires storage and checkbox synchronization services/);
console.log('Session-only mode hydration contract passed: retired keys, reset controls, lifecycle order and service validation.');
