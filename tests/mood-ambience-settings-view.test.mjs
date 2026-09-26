import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

const source = fs.readFileSync(new URL('../modules/mood-ambience-settings-view.js', import.meta.url), 'utf8');
const app = fs.readFileSync(new URL('../app.js', import.meta.url), 'utf8');
const html = fs.readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const serviceWorker = fs.readFileSync(new URL('../sw.js', import.meta.url), 'utf8');
assert.match(app, /const moodAmbienceSettingsView = window\.ChakraMoodAmbienceSettingsView/);
assert.match(app, /function syncPleasureAmbienceControl\(\)\s*\{\s*moodAmbienceSettingsView\.sync\(/);
assert.match(app, /moodAmbienceSettingsView\.bindUrlLoader\(/);
assert.match(app, /moodAmbienceSettingsView\.bindControls\(/);
assert.doesNotMatch(app, /loadPleasureAmbienceUrlButton\?\.addEventListener\('click'/);
assert.match(html, /modules\/mood-ambience-settings-view\.js\?v=1\.0[\s\S]*?app\.js\?v=4.12/);
assert.match(serviceWorker, /chakra-v5.310[\s\S]*?modules\/mood-ambience-settings-view\.js\?v=1\.0/);

const context = vm.createContext({ URL });
vm.runInContext(source, context);
const view = context.ChakraMoodAmbienceSettingsView;
assert.ok(Object.isFrozen(view));

function element({ min = '', max = '', value = '' } = {}) {
    return {
        hidden: false, disabled: false, checked: false, value, textContent: '', min, max,
        style: { color: '', values: {}, setProperty(name, v) { this.values[name] = v; } },
        dataset: {}
    };
}

const ids = [
    'mood-relaxation-ambience-section', 'mood-relaxation-intention-toggle',
    'mood-relaxation-ambience-level-control', 'pleasure-ambience-intensity-control',
    'pleasure-ambience-intensity', 'pleasure-ambience-url-control', 'pleasure-ambience-url',
    'pleasure-ambience-blur-control', 'pleasure-ambience-blur-toggle',
    'pleasure-ambience-blur-level-control', 'pleasure-ambience-blur-level',
    'pleasure-ambience-blur-level-value', 'mood-relaxation-ambience-level',
    'mood-relaxation-ambience-level-value', 'pleasure-ambience-url-status'
];
const elements = Object.fromEntries(ids.map(id => [id, element()]));
elements['pleasure-ambience-blur-level'] = element({ min: '0', max: '100' });
elements['mood-relaxation-ambience-level'] = element({ min: '0', max: '7' });
const document = { getElementById(id) { return elements[id] || null; } };
const state = {
    advancedFeaturesUnlocked: true, noFrequencyMode: true, moodRelaxationIntentionEnabled: true,
    pleasureAmbienceIntensity: 'immersive', pleasureAmbienceUrl: 'https://example.test/ambience.mp3',
    pleasureAmbienceBlur: true, pleasureAmbienceBlurAmount: 0.35, pleasureAmbienceGain: 0.05
};

view.sync({ document, state, audioUnavailable: true, formatLevel: gain => `${(gain * 100).toFixed(1)}%`, unavailableMessage: 'Source unavailable' });
assert.equal(elements['mood-relaxation-ambience-section'].hidden, false, 'Advanced Features unlock shows the Lobby section');
assert.equal(elements['mood-relaxation-ambience-level-control'].hidden, false);
assert.equal(elements['pleasure-ambience-intensity'].value, 'immersive');
assert.equal(elements['pleasure-ambience-url'].value, state.pleasureAmbienceUrl);
assert.equal(elements['pleasure-ambience-blur-toggle'].checked, true);
assert.equal(elements['pleasure-ambience-blur-level'].value, '35');
assert.equal(elements['pleasure-ambience-blur-level'].style.values['--range-fill'], '35.0%');
assert.equal(elements['pleasure-ambience-blur-level-value'].textContent, '35%');
assert.equal(elements['mood-relaxation-ambience-level'].value, '5.0');
assert.equal(elements['mood-relaxation-ambience-level'].style.values['--range-fill'], '71.4%');
assert.equal(elements['mood-relaxation-ambience-level'].disabled, true, 'No Frequency and missing audio disable the gain control');
assert.equal(elements['pleasure-ambience-url-status'].textContent, 'Source unavailable');
assert.equal(elements['pleasure-ambience-url-status'].hidden, false, 'missing local files keep replacement guidance visible');

state.advancedFeaturesUnlocked = false;
state.moodRelaxationIntentionEnabled = false;
state.noFrequencyMode = false;
view.sync({ document, state, audioUnavailable: false, formatLevel: gain => `${Math.round(gain * 100)}%`, unavailableMessage: 'Source unavailable' });
assert.equal(elements['mood-relaxation-ambience-section'].hidden, true);
assert.equal(elements['mood-relaxation-ambience-level-control'].hidden, true);
assert.equal(elements['mood-relaxation-ambience-level'].disabled, false);
assert.equal(elements['pleasure-ambience-url-status'].hidden, true);
assert.equal(elements['pleasure-ambience-url-status'].textContent, '');
assert.equal(elements['pleasure-ambience-url-status'].dataset.availability, undefined);

assert.throws(() => view.sync({}), /requires document/);

function urlLoaderFixture({ loadPleasureAmbienceUrl, noFrequencyMode = false } = {}) {
    let click;
    const calls = [];
    const url = element({ value: 'https://example.test/ambience.mp3' });
    const button = { disabled: false, addEventListener(type, handler) { assert.equal(type, 'click'); click = handler; } };
    const status = element();
    const doc = { getElementById(id) { return id === 'pleasure-ambience-url' ? url : id === 'load-pleasure-ambience-url' ? button : id === 'pleasure-ambience-url-status' ? status : null; } };
    const state = { noFrequencyMode };
    view.bindUrlLoader({
        document: doc, state,
        audio: { loadPleasureAmbienceUrl: loadPleasureAmbienceUrl || (async value => calls.push(['load', value])) },
        translate(key) { return ({
            'ui.pleasureAmbienceUrlLoading': 'Loading ambience',
            'ui.pleasureAmbienceUrlLoaded': 'Ambience loaded',
            'ui.pleasureAmbienceUrlCleared': 'Default ambience restored',
            'ui.pleasureAmbienceUrlError': 'Ambience error: {error}'
        })[key]; },
        syncControl() { calls.push(['sync']); }
    });
    return { calls, url, button, status, click: () => click() };
}

let resolveLoad;
const loading = urlLoaderFixture({ loadPleasureAmbienceUrl: value => {
    loading.calls.push(['load', value]);
    return new Promise(resolve => { resolveLoad = resolve; });
} });
const pendingLoad = loading.click();
assert.equal(loading.button.disabled, true, 'the Load button stays disabled while the audio engine loads');
assert.equal(loading.status.textContent, 'Loading ambience');
assert.equal(loading.status.style.color, 'rgba(255, 255, 255, 0.72)');
resolveLoad();
await pendingLoad;
assert.equal(loading.status.textContent, 'Ambience loaded');
assert.equal(loading.status.style.color, '#4ade80');
assert.equal(loading.button.disabled, false);

const clear = urlLoaderFixture();
clear.url.value = '';
await clear.click();
assert.deepEqual(JSON.parse(JSON.stringify(clear.calls)), [['load', '']]);
assert.equal(clear.status.textContent, 'Default ambience restored', 'empty URL means restore default ambience');

const failed = urlLoaderFixture({
    noFrequencyMode: true,
    loadPleasureAmbienceUrl: async () => { throw new Error('CORS denied'); }
});
await failed.click();
assert.equal(failed.status.textContent, 'Ambience error: CORS denied');
assert.equal(failed.status.style.color, '#f87171');
assert.deepEqual(JSON.parse(JSON.stringify(failed.calls)), [['sync']], 'failure re-syncs the saved control state');
assert.equal(failed.button.disabled, true, 'the button remains disabled when No Frequency is active');

assert.throws(() => view.bindUrlLoader({}), /requires a document/);

const handlers = new Map();
const controlElements = Object.fromEntries([
    'mood-relaxation-intention-toggle', 'pleasure-ambience-intensity', 'mood-relaxation-ambience-level',
    'pleasure-ambience-blur-toggle', 'pleasure-ambience-blur-level'
].map(id => [id, { checked: false, value: '', addEventListener(type, fn) { handlers.set(`${id}:${type}`, fn); } }]));
const calls = [];
const saved = new Map();
const controlsState = {
    advancedFeaturesUnlocked: false, noFrequencyMode: false, moodRelaxationIntentionEnabled: false,
    pleasureAmbienceBlur: false, pleasureAmbienceIntensity: 'medium', pleasureAmbienceGain: 0.04,
    pleasureAmbienceBlurAmount: 0.2, bgMusicMode: false
};
let confirmation = false;
view.bindControls({
    document: { getElementById: id => controlElements[id] || null }, state: controlsState,
    storage: { setItem(key, value) { calls.push(`storage:${key}`); saved.set(key, String(value)); } },
    audio: {
        setPleasureAmbienceBlur: value => calls.push(`blur:${value}`),
        startPleasureAmbience: () => calls.push('start'), stopPleasureAmbience: () => calls.push('stop'),
        setPleasureAmbienceIntensity: value => calls.push(`intensity:${value}`),
        setPleasureAmbienceGain: value => calls.push(`gain:${value}`)
    },
    meditation: { isMeditationActive: true }, window: { confirm: message => { calls.push(`confirm:${message}`); return confirmation; } },
    translate: key => key, syncControl: () => calls.push('sync'),
    normalizeIntensity: value => value === 'soft' ? 'soft' : 'medium',
    clampGain: value => Math.max(0, Math.min(1, value)), clampBlurAmount: value => Math.max(0, Math.min(1, value)), threshold: 0.05
});
const fire = (id, type, target) => handlers.get(`${id}:${type}`)({ target });
controlElements['mood-relaxation-intention-toggle'].checked = true;
fire('mood-relaxation-intention-toggle', 'change', controlElements['mood-relaxation-intention-toggle']);
assert.equal(controlElements['mood-relaxation-intention-toggle'].checked, false, 'locked mode restores prior toggle state');
assert.deepEqual(calls.splice(0), []);
controlsState.advancedFeaturesUnlocked = true;
controlElements['mood-relaxation-intention-toggle'].checked = true;
fire('mood-relaxation-intention-toggle', 'change', controlElements['mood-relaxation-intention-toggle']);
assert.equal(controlsState.pleasureAmbienceBlur, true);
assert.deepEqual(calls.splice(0), ['blur:true', 'sync', 'start']);
controlElements['pleasure-ambience-intensity'].value = 'soft';
fire('pleasure-ambience-intensity', 'change', controlElements['pleasure-ambience-intensity']);
assert.deepEqual(calls.splice(0), ['intensity:soft', 'sync']);
controlElements['mood-relaxation-ambience-level'].value = '6';
fire('mood-relaxation-ambience-level', 'input', controlElements['mood-relaxation-ambience-level']);
assert.equal(controlsState.pleasureAmbienceGain, 0.04, 'denied above-threshold volume remains unchanged');
assert.deepEqual(calls.splice(0), ['confirm:ui.pleasureAmbienceAboveFiveConfirm', 'sync']);
confirmation = true;
fire('mood-relaxation-ambience-level', 'input', controlElements['mood-relaxation-ambience-level']);
assert.equal(controlsState.pleasureAmbienceGain, 0.06);
assert.equal(saved.get('chakra_pleasure_ambience_gain'), '0.06');
assert.deepEqual(calls.splice(0), ['confirm:ui.pleasureAmbienceAboveFiveConfirm', 'storage:chakra_pleasure_ambience_gain', 'sync', 'gain:0.06']);
controlElements['pleasure-ambience-blur-toggle'].checked = true;
fire('pleasure-ambience-blur-toggle', 'change', controlElements['pleasure-ambience-blur-toggle']);
assert.deepEqual(calls.splice(0), ['blur:true']);
controlElements['pleasure-ambience-blur-level'].value = '35';
fire('pleasure-ambience-blur-level', 'input', controlElements['pleasure-ambience-blur-level']);
assert.equal(controlsState.pleasureAmbienceBlurAmount, 0.35);
assert.equal(saved.get('chakra_pleasure_ambience_blur_amount'), '0.35');
assert.deepEqual(calls.splice(0), ['storage:chakra_pleasure_ambience_blur_amount', 'sync', 'blur:true']);
const profiles = { gentle: { blurMultiplier: 1 }, deep: { blurMultiplier: 0.4 } };
const gainPolicy = { fallback: 0.003, minimum: 0.002, maximum: 0.07 };
assert.equal(view.clampGain(Number.NaN, gainPolicy), 0.003);
assert.equal(view.clampGain(1, gainPolicy), 0.07);
assert.equal(view.clampLevel(-1, 0, 1, 0.5), 0);
assert.equal(view.normalizeUrl(' javascript:alert(1) ', 'https://example.test/'), '');
assert.equal(view.normalizeUrl('/ambience.mp3', 'https://example.test/'), 'https://example.test/ambience.mp3');
assert.equal(view.clampBlurAmount(Number.NaN, { fallback: 0.35, minimum: 0.1, maximum: 0.65 }), 0.35);
assert.equal(view.clampBlurAmount(1, { fallback: 0.35, minimum: 0.1, maximum: 0.65 }), 0.65);
assert.equal(view.normalizeIntensity('unknown', profiles), 'gentle');
assert.equal(view.intensityProfile('deep', profiles), profiles.deep);
assert.deepEqual(JSON.parse(JSON.stringify(view.blurMix({ enabled: true, amount: 0.5, intensity: 'deep', profiles, clampAmount: value => value }))), { dry: 0.8, wet: 0.2 });
assert.equal(view.formatLevel(0.005, gainPolicy), '0.5%');
console.log('Mood ambience settings view passed: advanced/No Frequency gates, gain confirmation, intensity, blur, preference persistence and URL recovery.');
