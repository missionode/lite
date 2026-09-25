import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

const source = fs.readFileSync('modules/mixer-preference-hydration.js', 'utf8');
const app = fs.readFileSync('app.js', 'utf8');
const html = fs.readFileSync('index.html', 'utf8');
const serviceWorker = fs.readFileSync('sw.js', 'utf8');
const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
assert.match(app, /mixerPreferenceHydration\.hydrate\(\{ state, syncValue \}\)/);
const loadPreferences = app.slice(app.indexOf('function loadPreferences()'), app.indexOf('function checkFirstTime()'));
assert.ok(loadPreferences.indexOf('updateDroneDurationSummary();') < loadPreferences.indexOf('mixerPreferenceHydration.hydrate('));
assert.ok(loadPreferences.indexOf('mixerPreferenceHydration.hydrate(') < loadPreferences.indexOf("setText('stat-journeys'"));
assert.match(html, /modules\/mixer-preference-hydration\.js\?v=1\.0[\s\S]*?app\.js\?v=3\.99/);
assert.match(serviceWorker, /chakra-v5\.295[\s\S]*?modules\/mixer-preference-hydration\.js\?v=1\.0/);
assert.equal(packageJson.scripts['test:mixer-preference-hydration'], 'node tests/mixer-preference-hydration.test.mjs');

const context = vm.createContext({});
vm.runInContext(source, context);
const hydration = context.ChakraMixerPreferenceHydration;
assert.ok(Object.isFrozen(hydration));
const state = Object.fromEntries([
    'volVoice', 'volDrone', 'volBell', 'volMantra', 'volMusic', 'volVideo',
    'volVisualizationAmbience', 'visualizationAmbience', 'voiceClarity', 'voiceWarmth',
    'voicePace', 'voiceEcho', 'musicEcho'
].map((key, index) => [key, `value-${index}`]));
const actual = [];
hydration.hydrate({ state, syncValue(id, value) { actual.push([id, value]); } });
assert.deepEqual(JSON.parse(JSON.stringify(actual)), [
    ['vol-voice', 'value-0'],
    ['vol-drone', 'value-1'],
    ['vol-bell', 'value-2'],
    ['vol-mantra', 'value-3'],
    ['vol-music', 'value-4'],
    ['settings-vol-video', 'value-5'],
    ['settings-vol-visualization', 'value-6'],
    ['vol-visualization', 'value-6'],
    ['visualization-ambience', 'value-7'],
    ['voice-clarity', 'value-8'],
    ['voice-warmth', 'value-9'],
    ['voice-pace', 'value-10'],
    ['voice-echo', 'value-11'],
    ['music-echo', 'value-12'],
    ['settings-vol-voice', 'value-0'],
    ['settings-vol-drone', 'value-1'],
    ['settings-vol-bell', 'value-2'],
    ['settings-vol-mantra', 'value-3'],
    ['settings-vol-music', 'value-4']
]);
assert.throws(() => hydration.hydrate({}), /requires state and a value-sync service/);
console.log('Mixer preference hydration contract passed: all 19 control/value pairs, duplicate Settings mirrors and startup ordering.');
