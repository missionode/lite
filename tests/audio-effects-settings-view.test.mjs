import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

const moduleSource = fs.readFileSync('modules/audio-effects-settings-view.js', 'utf8');
const appSource = fs.readFileSync('app.js', 'utf8');
const html = fs.readFileSync('index.html', 'utf8');
const sw = fs.readFileSync('sw.js', 'utf8');
const elements = new Map();
const presets = ['soft', 'shringara', 'balanced', 'clear'].map(name => {
    const button = { dataset: { voicePreset: name }, listeners: {}, classes: new Set(['mixer-preset-active']),
        addEventListener(type, handler) { this.listeners[type] = handler; } };
    button.classList = {
        remove: className => button.classes.delete(className),
        toggle: (className, force) => force ? button.classes.add(className) : button.classes.delete(className)
    };
    return button;
});
const document = {
    getElementById(id) {
        if (!elements.has(id)) elements.set(id, { value: '', listeners: {}, addEventListener(type, handler) { this.listeners[type] = handler; } });
        return elements.get(id);
    },
    querySelectorAll(selector) { return selector === '[data-voice-preset]' ? presets : []; }
};
const saved = new Map();
const storage = { setItem(key, value) { saved.set(key, String(value)); } };
const calls = [];
const state = { voiceClarity: 50, voiceWarmth: 50, voicePace: 1, voiceEcho: 'light', musicEcho: 'off', spatialMode: 'off' };
const audio = {
    setVoiceTuning: (...args) => calls.push(['voice', ...args]),
    setVoiceEcho: value => calls.push(['voiceEcho', value]),
    setMusicEcho: value => calls.push(['musicEcho', value]),
    setSpatialMode: value => calls.push(['spatial', value])
};
const synced = [];
const normalizeSpatialMode = value => ['off', 'stereo', 'headphones', 'room'].includes(value) ? value : 'off';
const context = vm.createContext({ window: {} });
context.window.window = context.window;
vm.runInContext(moduleSource, context);
context.window.ChakraAudioEffectsSettingsView.bind({
    document, state, storage, audio, normalizeSpatialMode,
    syncValue: (id, value) => { synced.push([id, value]); document.getElementById(id).value = value; }
});

function dispatch(id, type, value) {
    document.getElementById(id).listeners[type]({ target: { value } });
}

dispatch('voice-clarity', 'input', '68');
assert.equal(state.voiceClarity, 68);
assert.equal(saved.get('chakra_voice_clarity'), '68');
assert.deepEqual(calls.at(-1), ['voice', 50, 68]);
assert.ok(presets.every(button => !button.classes.has('mixer-preset-active')));
dispatch('voice-warmth', 'input', '73');
assert.deepEqual(calls.at(-1), ['voice', 73, 68]);
dispatch('voice-pace', 'input', '0.93');
assert.equal(saved.get('chakra_voice_pace'), '0.93');
dispatch('voice-echo', 'change', 'spacious');
dispatch('music-echo', 'change', 'light');
assert.deepEqual(calls.slice(-2), [['voiceEcho', 'spacious'], ['musicEcho', 'light']]);
dispatch('spatial-mode', 'change', 'room');
assert.deepEqual(synced.slice(-2), [['spatial-mode', 'room'], ['mixer-spatial-mode', 'room']]);
assert.equal(saved.get('chakra_spatial_mode'), 'room');
assert.deepEqual(calls.at(-1), ['spatial', 'room']);
dispatch('mixer-spatial-mode', 'change', 'not-a-mode');
assert.equal(state.spatialMode, 'off');
assert.equal(document.getElementById('spatial-mode').value, 'off');

presets[1].listeners.click();
assert.equal(state.voiceClarity, 28);
assert.equal(state.voiceWarmth, 82);
assert.equal(state.voicePace, 0.92);
assert.equal(saved.get('chakra_voice_clarity'), '28');
assert.equal(document.getElementById('voice-pace').value, 0.92);
assert.deepEqual(calls.at(-1), ['voice', 82, 28]);
assert.equal(presets[1].classes.has('mixer-preset-active'), true);
assert.equal(presets[0].classes.has('mixer-preset-active'), false);
presets[1].dataset.voicePreset = 'missing';
presets[1].listeners.click();
assert.equal(state.voiceClarity, 28, 'unknown presets are ignored');

assert.match(appSource, /ChakraAudioEffectsSettingsView\.bind\(\{ document, state, storage: localStorage, audio, normalizeSpatialMode, syncValue \}\)/);
assert.doesNotMatch(appSource, /const voicePresets = \{/);
assert.ok(html.indexOf('modules/audio-effects-settings-view.js?v=1.0') < html.indexOf('app.js?v=4.12'));
assert.match(sw, /modules\/audio-effects-settings-view\.js\?v=1\.0/);
console.log('Audio effects settings view passed: voice tuning, echo, spatial selection and presets.');
