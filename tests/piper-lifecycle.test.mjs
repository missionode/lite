import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

const source = fs.readFileSync('modules/piper-lifecycle.js', 'utf8');
const context = vm.createContext({});
vm.runInContext(source, context);
const service = context.ChakraPiperLifecycle;
assert.ok(Object.isFrozen(service), 'Piper lifecycle should expose a stable API');

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
