import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

const source = fs.readFileSync('modules/piper-lifecycle.js', 'utf8');
const context = vm.createContext({});
vm.runInContext(source, context);
const service = context.ChakraPiperLifecycle;
assert.ok(Object.isFrozen(service), 'Piper lifecycle should expose a stable API');
const profiles = service.voiceProfile;
assert.ok(Object.isFrozen(profiles), 'Piper voice policy should expose a stable API');
const registeredVoices = [
    { id: 'calm', language: 'en', gender: 'female', meditationPaceMultiplier: 0.8, meditationPaceMin: 0.62, meditationLengthScaleMax: 1.5 },
    { id: 'standard', language: 'en', gender: 'male' }
];
assert.equal(profiles.isPiperVoice('piper:calm'), true);
assert.equal(profiles.isPiperVoice('browser:Voice'), false);
assert.equal(profiles.voiceId('piper:calm'), 'calm');
assert.equal(profiles.voiceId('browser:Voice'), '');
assert.equal(profiles.definition(registeredVoices, 'piper:calm'), registeredVoices[0]);
assert.equal(profiles.definition(registeredVoices, 'piper:missing'), null);
assert.equal(profiles.paceMultiplier(registeredVoices[0]), 0.8);
assert.equal(profiles.paceMultiplier({ meditationPaceMultiplier: 2 }), 1);
assert.equal(profiles.effectivePace(0.5, registeredVoices[0]), 0.62);
assert.equal(profiles.effectivePace(2, registeredVoices[0]), 1.15);
const meditationSettings = profiles.meditationSettings(0.8, registeredVoices[0]);
assert.ok(Math.abs(meditationSettings.lengthScale - 1.5625) < 1e-12);
assert.equal(meditationSettings.lengthScaleMax, 1.5);
assert.equal(profiles.isFeminine('piper:calm', registeredVoices[0], () => null), true);
assert.equal(profiles.isFeminine('piper:unknown', null, () => ({ name: 'Samantha' })), false);
assert.equal(profiles.isFeminine('browser:Samantha', null, () => ({ name: 'Samantha' })), true);
assert.equal(profiles.isFeminine('browser:voice', null, () => ({ gender: 'male', name: 'Samantha' })), false);
assert.equal(profiles.browserVoiceIsFeminine('voice', { voiceGender: 'female' }), true);
assert.equal(profiles.browserVoiceIsFeminine('voice', { name: 'Unknown' }), false);
assert.equal(profiles.voiceMatchesLanguage({ lang: 'ml-IN' }, ['ml']), true);
assert.equal(profiles.voiceMatchesLanguage({ lang: 'en-US' }, ['ml']), false);
assert.equal(profiles.voiceMatchesLanguage(null, ['en']), false);
assert.equal(profiles.browserVoice('browser:Hindi', [
    { name: 'English', lang: 'en-US' }, { name: 'Hindi', lang: 'hi-IN' }
], ['ru']), null, 'browser voice matching must not cross the active locale');
assert.equal(profiles.browserVoice('browser:Hindi', [
    { name: 'English', lang: 'en-US' }, { name: 'Hindi', lang: 'hi-IN' }
], ['hi-IN']).name, 'Hindi');
assert.equal(profiles.selectVoice({
    currentValue: 'piper:calm', registry: registeredVoices, language: 'en', defaultVoiceId: 'standard', browserVoices: [], browserPrefixes: ['en']
}), 'piper:calm', 'a currently valid Piper selection should be retained');
assert.equal(profiles.selectVoice({
    currentValue: 'browser:Default', registry: registeredVoices, language: 'en', defaultVoiceId: 'standard', browserVoices: [], browserPrefixes: ['en']
}), 'piper:standard', 'the preferred local voice should take precedence when available');
assert.equal(profiles.selectVoice({
    currentValue: 'browser:Default', registry: [], language: 'ru', defaultVoiceId: 'missing',
    browserVoices: [{ name: 'Russian Natural', lang: 'ru-RU' }, { name: 'Russian Basic', lang: 'ru-RU' }], browserPrefixes: ['ru']
}), 'browser:Russian Natural', 'premium browser voices should be preferred within the selected language');
assert.equal(profiles.selectVoice({
    currentValue: 'browser:Existing', registry: [], language: 'ru', defaultVoiceId: '',
    browserVoices: [{ name: 'English', lang: 'en-US' }], browserPrefixes: ['ru']
}), null, 'no cross-language voice should be selected when the locale has no match');

const loaderWarnings = [];
assert.equal((await service.loadVoiceRegistry(async path => ({ ok: true, json: async () => ({ voices: [{ id: path }] }) }), { warn() {} }))[0].id, 'piper-models.json');
assert.equal((await service.loadVoiceRegistry(async () => ({ ok: true, json: async () => ({ voices: null }) }), { warn() {} })).length, 0);
assert.equal((await service.loadVoiceRegistry(async () => { throw new Error('offline'); }, { warn: (...args) => loaderWarnings.push(args) })).length, 0);
assert.equal(loaderWarnings.length, 1, 'a missing registry should preserve browser-voice fallback');

const voiceSelectOptions = [];
const voiceSelectForModule = {
    value: '', set innerHTML(_) { voiceSelectOptions.length = 0; }, get options() { return voiceSelectOptions; },
    appendChild(option) { voiceSelectOptions.push(option); }
};
const voiceDocument = { createElement(tag) { return { tag, appendChild(option) { (this.children ||= []).push(option); } }; } };
const availableBrowserVoices = [{ name: 'Hindi Voice', lang: 'hi-IN' }, { name: 'English Voice', lang: 'en-US' }];
let voiceRefresh;
let silentUtterances = 0;
const voiceWindow = { speechSynthesis: {
    getVoices: () => availableBrowserVoices, speak: utterance => { if (utterance.volume === 0) silentUtterances++; }
} };
let autoSelections = 0;
service.bindVoicePicker({
    document: voiceDocument, window: voiceWindow, state: { language: 'hi', voiceName: '', voices: [] },
    voiceSelect: voiceSelectForModule, piperVoices: [{ id: 'hi', language: 'hi', label: 'Hindi Local' }],
    voiceMatchesLanguage: voice => voice.lang.startsWith('hi'), autoSelectVoice: () => { autoSelections++; },
    SpeechSynthesisUtteranceCtor: function Utterance(text) { this.text = text; }
});
assert.equal(voiceSelectForModule.value, '');
assert.equal(voiceSelectOptions[0].value, 'piper:hi');
assert.equal(voiceSelectOptions[1].tag, 'optgroup');
assert.deepEqual([...voiceSelectOptions[1].children.map(option => option.value)], ['browser:Default', 'browser:Hindi Voice']);
assert.equal(autoSelections, 1, 'missing persisted choice should use app selection fallback');
assert.equal(silentUtterances, 1, 'browser voice discovery should retain its silent synthesis warm-up');
voiceRefresh = voiceWindow.speechSynthesis.onvoiceschanged;
assert.equal(typeof voiceRefresh, 'function');
voiceRefresh();
assert.equal(autoSelections, 2, 'late browser voice discovery should refresh the picker');

const workers = [];
class WorkerMock {
    constructor(url, options) {
        this.url = url;
        this.options = options;
        this.messages = [];
        this.terminated = false;
        workers.push(this);
    }
    postMessage(message) { this.messages.push(message); }
    terminate() { this.terminated = true; }
}

class Param {
    constructor() { this.value = 1; this.events = []; }
    setValueAtTime(value, time) { this.value = value; this.events.push(['set', value, time]); }
    linearRampToValueAtTime(value, time) { this.value = value; this.events.push(['ramp', value, time]); }
    cancelAndHoldAtTime(time) { this.events.push(['hold', time]); }
}
const sources = [];
const ctx = {
    currentTime: 4,
    destination: {},
    decodeAudioData: async value => value,
    createGain() { return { gain: new Param(), connect() {}, disconnect() {} }; },
    createBufferSource() {
        const node = {
            connect() {}, disconnect() {}, start() { this.started = true; },
            stop(time) { this.stoppedAt = time; }
        };
        sources.push(node);
        return node;
    }
};
const voiceGain = { gain: new Param() };
const playbackStates = [];
const audio = { ctx, voiceGain, setVoicePlaybackActive: (...args) => playbackStates.push(args) };
const statuses = [];
const piper = service.createPiperTTS(audio, {
    voiceIdFromValue: value => value.startsWith('piper:') ? value.slice(6) : '',
    getVoiceDefinition: id => ({ id, locale: 'en-US' }),
    setVoiceStatus: (...args) => statuses.push(args),
    translate: key => key,
    getMeditationSettings: () => ({ lengthScale: 1 }),
    getVoiceVolume: () => 0.8,
    WorkerConstructor: WorkerMock,
    WebAssemblyRuntime: {},
    clipFadeSeconds: 0.05,
    cancelFadeSeconds: 0.12
});

assert.equal(piper.isSupported(), true);
assert.equal(piper.configure('browser:test'), false);
assert.equal(piper.configure('piper:test'), true);
assert.equal(piper.voiceId, 'test');
assert.equal(piper.voiceDefinition.locale, 'en-US');

const warmup = piper.warmup();
assert.equal(workers.length, 1);
assert.equal(workers[0].url, './piper-worker.js');
assert.equal(workers[0].options.type, 'module');
assert.equal(workers[0].messages[0].type, 'warmup');
piper.handleWorkerMessage({ type: 'ready', requestId: workers[0].messages[0].requestId });
assert.equal(await warmup, true);

piper.setPaused(true);
const synthesis = piper.synthesize('Quiet sentence.');
assert.equal(workers[0].messages.length, 1, 'paused Piper cannot dispatch queued work');
piper.setPaused(false);
assert.equal(workers[0].messages.length, 2);
assert.equal(workers[0].messages[1].settings.lengthScale, 1);
piper.handleWorkerMessage({ type: 'audio', requestId: workers[0].messages[1].requestId, audio: 'blob' });
assert.equal(await synthesis, 'blob');

const samples = new Float32Array([0.1, -0.2, 0.15, -0.1]);
const buffer = { duration: 2, length: samples.length, numberOfChannels: 1, getChannelData: () => samples };
const playback = piper.playBuffer(buffer, 0.5);
assert.equal(sources[0].started, true);
assert.deepEqual(playbackStates[0], [true]);
assert.deepEqual(voiceGain.gain.events.at(-1), ['set', 0.4, 4]);
piper.cancel('test stop');
assert.equal(sources[0].stoppedAt, 4.14);
assert.deepEqual(playbackStates.at(-1), [false, 0.12]);
assert.equal(workers[0].terminated, true);
await playback;

const app = fs.readFileSync('app.js', 'utf8');
assert.doesNotMatch(app, /class PiperTTS/, 'Piper lifecycle implementation should not remain duplicated in app.js');
assert.match(app, /piperLifecycle\.createPiperTTS\(audio/, 'the app should create Piper through the module owner');

console.log('Piper lifecycle contract passed: dependency wiring, serial worker queue, pause, playback envelope and graceful cancellation.');
