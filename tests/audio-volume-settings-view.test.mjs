import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

const source = fs.readFileSync('modules/audio-volume-settings-view.js', 'utf8');
const app = fs.readFileSync('app.js', 'utf8');
const html = fs.readFileSync('index.html', 'utf8');
const sw = fs.readFileSync('sw.js', 'utf8');
const ids = [
    'vol-voice', 'settings-vol-voice', 'vol-drone', 'settings-vol-drone',
    'vol-bell', 'settings-vol-bell', 'vol-mantra', 'settings-vol-mantra',
    'vol-music', 'settings-vol-music', 'settings-vol-video',
    'settings-vol-visualization', 'vol-visualization'
];
const elements = Object.fromEntries(ids.map(id => [id, { value: '', listeners: {}, addEventListener(type, listener) { this.listeners[type] = listener; } }]));
const storageValues = new Map();
const storage = { setItem(key, value) { storageValues.set(key, String(value)); } };
const audioEvents = [];
const gain = name => ({ gain: { setValueAtTime(value, time) { audioEvents.push([name, value, time]); } } });
const audio = {
    ctx: { currentTime: 17 },
    voiceGain: gain('voice'), masterGain: gain('drone'), bellGain: gain('bell'),
    mantraGain: gain('mantra'), mantraLoop: {},
    setBackgroundMusicVolume(...args) { audioEvents.push(['music', ...args]); },
    setJourneyVideoPreludeVolume(value) { audioEvents.push(['video', value]); },
    setVisualizationAmbienceVolume(value) { audioEvents.push(['visualization', value]); }
};
const context = vm.createContext({ window: {} });
context.window.window = context.window;
vm.runInContext(source, context);
context.window.ChakraAudioVolumeSettingsView.bind({ document: { getElementById: id => elements[id] ?? null }, state: {
    volVoice: 0.8, volDrone: 0.2, volBell: 0.4, volMantra: 0.5,
    volMusic: 0.35, volVideo: 0.6, volVisualizationAmbience: 0.1
}, storage, audio });

function input(id, value) {
    const element = elements[id];
    element.listeners.input({ target: { value } });
}

input('vol-voice', '0.3');
assert.equal(elements['settings-vol-voice'].value, '0.3', 'paired voice sliders stay synchronized');
assert.equal(storageValues.get('chakra_vol_voice'), '0.3');
assert.deepEqual(audioEvents.at(-1), ['voice', 0.3, 17]);
input('settings-vol-drone', '0.15');
assert.equal(elements['vol-drone'].value, '0.15');
assert.equal(storageValues.get('chakra_vol_drone'), '0.15');
assert.deepEqual(audioEvents.at(-1), ['drone', 0.15, 17]);
input('vol-bell', '0.25');
assert.deepEqual(audioEvents.at(-1), ['bell', 0.25, 17]);
input('vol-mantra', '0.45');
assert.deepEqual(audioEvents.at(-1), ['mantra', 0.45, 17]);
input('vol-music', '0.2');
assert.equal(elements['settings-vol-music'].value, '0.2');
assert.deepEqual(audioEvents.at(-1), ['music', 0.2, 0.35], 'music receives previous gain for its existing transition behavior');
input('settings-vol-video', '0.55');
assert.deepEqual(audioEvents.at(-1), ['video', 0.55]);
input('settings-vol-visualization', '0.12');
assert.equal(elements['vol-visualization'].value, '0.12');
assert.deepEqual(audioEvents.at(-1), ['visualization', 0.12]);
assert.equal(storageValues.get('chakra_vol_visualizationambience'), '0.12', 'existing saved-key spelling is preserved');

assert.match(app, /ChakraAudioVolumeSettingsView\.bind\(\{ document, state, storage: localStorage, audio \}\)/);
assert.doesNotMatch(app, /const syncVolume = \(key, value, elements\)/);
assert.ok(html.indexOf('modules/audio-volume-settings-view.js?v=1.0') < html.indexOf('app.js?v=4.12'));
assert.match(sw, /modules\/audio-volume-settings-view\.js\?v=1\.0/);
console.log('Audio volume settings view passed: paired sliders, persistence keys and seven live audio routes.');
