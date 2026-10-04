import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

const source = fs.readFileSync(new URL('../modules/audio-engine-initialization.js', import.meta.url), 'utf8');
const app = fs.readFileSync(new URL('../app.js', import.meta.url), 'utf8');
const html = fs.readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const serviceWorker = fs.readFileSync(new URL('../sw.js', import.meta.url), 'utf8');
const packageJson = JSON.parse(fs.readFileSync(new URL('../package.json', import.meta.url), 'utf8'));
assert.match(app, /async init\(\)\s*\{\s*return window\.ChakraAudioEngineInitialization\.initialize\(this,/);
assert.match(html, /modules\/audio-engine-initialization\.js\?v=1\.2[\s\S]*?app\.js\?v=4.27/);
assert.match(serviceWorker, /chakra-v\d+\.\d+[\s\S]*?modules\/audio-engine-initialization\.js\?v=1\.2/);
assert.equal(packageJson.scripts['test:audio-engine-initialization'], 'node tests/audio-engine-initialization.test.mjs');

class FakeParam {
  constructor(value = 0) { this.value = value; this.events = []; }
  setValueAtTime(value, time) { this.value = value; this.events.push(['set', value, time]); }
  linearRampToValueAtTime(value, time) { this.value = value; this.events.push(['ramp', value, time]); }
}

class FakeNode {
  constructor(type) {
    this.type = type;
    this.connections = [];
    for (const name of ['gain', 'frequency', 'Q', 'delayTime', 'threshold', 'knee', 'ratio', 'attack', 'release', 'pan', 'positionX', 'positionY', 'positionZ']) {
      this[name] = new FakeParam();
    }
  }
  connect(destination) { this.connections.push(destination); return destination; }
  disconnect(destination) {
    if (destination) this.connections = this.connections.filter(node => node !== destination);
    else this.connections = [];
  }
  start() { this.started = true; }
}

class FakeAudioContext {
  constructor(options) {
    this.options = options;
    this.currentTime = 12;
    this.sampleRate = 44100;
    this.state = 'suspended';
    this.destination = new FakeNode('destination');
    this.nodes = [];
    this.resumeCount = 0;
    this.selectedSink = null;
  }
  make(type, ...args) {
    const node = new FakeNode(type);
    node.args = args;
    this.nodes.push(node);
    return node;
  }
  createGain() { return this.make('gain'); }
  createWaveShaper() { return this.make('waveshaper'); }
  createBiquadFilter() { return this.make('filter'); }
  createDelay(...args) { return this.make('delay', ...args); }
  createConvolver() { return this.make('convolver'); }
  createDynamicsCompressor() { return this.make('compressor'); }
  createStereoPanner() { return this.make('stereo-panner'); }
  createPanner() {
    const panner = this.make('panner');
    panner.distanceModel = 'linear';
    return panner;
  }
  createOscillator() { return this.make('oscillator'); }
  async setSinkId(id) { this.selectedSink = id; }
  async resume() { this.resumeCount += 1; this.state = 'running'; }
}

const settings = overrides => ({
  volDrone: 0.31,
  volVoice: 0.82,
  volBell: 0.44,
  eyesCloseMode: false,
  noFrequencyMode: false,
  audioFilters: false,
  pleasureAmbienceGain: 0.08,
  pleasureAmbienceBlur: true,
  voiceWarmth: 50,
  voiceClarity: 50,
  voiceEcho: 'light',
  musicEcho: 'light',
  spatialMode: 'off',
  pleasureAmbienceIntensity: 'gentle',
  ...overrides
});

function createHarness(currentSettings) {
  const warnings = [];
  const context = vm.createContext({ console: { warn: (...args) => warnings.push(args) } });
  context.window = context;
  context.AudioContext = FakeAudioContext;
  vm.runInContext(source, context);
  const calls = [];
  const engine = {
    isInitialized: false,
    groundingAnchor: null,
    makeDistortionCurve(amount) { calls.push(['distortion', amount]); return new Float32Array([-1, 1]); },
    createDiffuseReverbImpulse(duration, decay, seed) { return { kind: 'diffuse', duration, decay, seed }; },
    createImpulseResponse(duration, decay) { return { kind: 'impulse', duration, decay }; },
    createHeavenlyImpulse(duration, decay, seed) { return { kind: 'heavenly', duration, decay, seed }; },
    createSpatialPanner() { calls.push(['panner']); return this.ctx.createPanner(); },
    toggleEyesCloseMode(value) { calls.push(['eyes', value]); },
    setVoiceTuning(warmth, clarity) { calls.push(['voice', warmth, clarity]); },
    setVoiceEcho(value) { calls.push(['voice-echo', value]); },
    setMusicEcho(value) { calls.push(['music-echo', value]); },
    setSpatialMode(value) { calls.push(['spatial', value]); },
    setPleasureAmbienceIntensity(value) { calls.push(['pleasure', value]); }
  };
  const dependencies = {
    audioWindow: context,
    state: currentSettings,
    VOICE_REVERB_TAIL_SECONDS: 5,
    VOICE_REVERB_TAIL_DECAY: 2.6,
    MUSIC_REVERB_TAIL_SECONDS: 5,
    MUSIC_REVERB_TAIL_DECAY: 2.2,
    MANTRA_REVERB_TAIL_SECONDS: 7,
    MANTRA_REVERB_TAIL_DECAY: 3.1,
    MANTRA_REVERB_TAIL_WET: 0.16,
    PLEASURE_AMBIENCE_HARMONIC_MIX: 0.04,
    getPleasureBlurMix: enabled => enabled ? { dry: 0.7, wet: 0.3 } : { dry: 1, wet: 0 }
  };
  return { context, engine, dependencies, calls, warnings };
}

const connected = (from, to) => assert.ok(from.connections.includes(to), `${from.type} should connect to ${to.type}`);

const standard = createHarness(settings());
await standard.context.ChakraAudioEngineInitialization.initialize(standard.engine, standard.dependencies);
const { engine, calls } = standard;
const audioContext = engine.ctx;
assert.equal(audioContext.options.latencyHint, 'playback');
assert.equal(audioContext.options.sampleRate, undefined, 'the device sample rate is used, so nothing is resampled');
assert.equal(audioContext.state, 'running');
assert.equal(audioContext.selectedSink, 'default');
assert.equal(audioContext.resumeCount, 1);
assert.equal(engine.masterGain.gain.value, 0.31);
assert.equal(engine.voiceGain.gain.value, 0.82);
assert.equal(engine.bellGain.gain.value, 0.44);
assert.equal(engine.exciter.curve.length, 2);
assert.equal(engine.voiceEchoDelay.delayTime.value, 0.07, '70 ms pre-delay keeps words clean before the halo');
assert.equal(engine.voiceEchoLowCut.frequency.value, 280);
assert.equal(engine.voiceEchoFilter.frequency.value, 5500);
assert.equal(engine.voiceEchoDuck.gain.value, 1);
assert.equal(engine.voiceEchoConvolver.buffer.kind, 'heavenly');
assert.equal(engine.musicEchoConvolver.buffer.kind, 'heavenly');
assert.equal(engine.mantraTailConvolver.buffer.kind, 'heavenly');
assert.equal(engine.mantraTailConvolver.buffer.seed, 2029, 'the mantra tail is deterministic on every device');
assert.equal(engine.voiceMudFilter.frequency.value, 320);
assert.equal(engine.voiceMudFilter.gain.value, -2);
assert.equal(engine.voiceDeEsser.frequency.value, 6500);
assert.equal(engine.voiceDeEsser.gain.value, -3);
assert.equal(engine.voiceAirFilter.type, 'highshelf');
assert.equal(engine.voiceAirFilter.gain.value, 2);
assert.equal(engine.voiceLowCut.frequency.value, 90);
assert.equal(engine.masterCompressor.threshold.value, -18);
assert.equal(engine.masterCompressor.ratio.value, 2);
assert.equal(engine.masterCompressor.attack.value, 0.03);
assert.equal(engine.masterCompressor.release.value, 0.6);
assert.equal(engine.masterLimiter.threshold.value, -2);
assert.equal(engine.masterLimiter.knee.value, 2);
assert.equal(engine.delayFeedback.gain.value, 0.3);
assert.equal(engine.musicEchoDelay.delayTime.value, 0.018);
assert.equal(engine.voiceEchoConvolver.buffer.duration, 5); // harness value; app uses 3.5 s
assert.equal(engine.musicEchoConvolver.buffer.duration, 5);
assert.equal(engine.mantraTailConvolver.buffer.duration, 7);
assert.equal(engine.pleasureBlurDryGain.gain.value, 0.7);
assert.equal(engine.pleasureBlurWetGain.gain.value, 0.3);
assert.equal(engine.spatialPleasurePanner.rolloffFactor, 0.55);
assert.equal(engine.groundingAnchor, null);
assert.equal(engine.isInitialized, true);

connected(engine.bgMusicGain, engine.bgMusicEQ);
connected(engine.bgMusicSmoothGain, engine.bgMusicBusGain);
connected(engine.bgMusicSmoothGain, engine.musicEchoTailGate);
connected(engine.musicEchoTailGate, engine.musicEchoSend);
connected(engine.musicEchoWetGain, engine.spatialMusicPanner);
connected(engine.bgMusicBusGain, engine.spatialMusicPanner);
connected(engine.spatialMusicPanner, engine.lowCutFilter);
connected(engine.voiceGain, engine.voiceWarmthFilter);
connected(engine.voiceWarmthFilter, engine.voiceClarityFilter);
connected(engine.voiceClarityFilter, engine.voiceMudFilter);
connected(engine.voiceMudFilter, engine.voiceDeEsser);
connected(engine.voiceDeEsser, engine.voiceAirFilter);
connected(engine.voiceAirFilter, engine.voiceLowCut);
connected(engine.voiceLowCut, engine.voiceBus);
connected(engine.voiceAirFilter, engine.voiceEchoSend);
connected(engine.voiceEchoWetGain, engine.voiceEchoDuck);
connected(engine.voiceEchoDuck, engine.voiceBus);
connected(engine.voiceBus, engine.masterCompressor);
assert.ok(!engine.voiceClarityFilter.connections.includes(engine.lowCutFilter), 'the voice skips the shared Eyes Close chain');
assert.ok(!engine.voiceEchoWetGain.connections.includes(engine.lowCutFilter));
connected(engine.mantraFilter, engine.spatialMantraPanner);
connected(engine.mantraFilter, engine.mantraTailConvolver);
connected(engine.mantraTailWetGain, engine.spatialMantraPanner);
connected(engine.pleasureSourceGain, engine.pleasureGain);
connected(engine.pleasureSourceGain, engine.pleasureEnhancer);
connected(engine.pleasureSpatialDepthGain, engine.spatialPleasurePanner);
connected(engine.spatialPleasurePanner, engine.lowCutFilter);
connected(engine.bellGain, engine.masterLimiter);
connected(engine.masterCompressor, engine.masterLimiter);
connected(engine.masterLimiter, engine.pauseFader);
connected(engine.pauseFader, audioContext.destination);
assert.equal(calls.filter(([name]) => name === 'panner').length, 4);
assert.deepEqual(calls.filter(([name]) => ['eyes', 'voice', 'voice-echo', 'music-echo', 'spatial', 'pleasure'].includes(name)), [
  ['eyes', false], ['voice', 50, 50], ['voice-echo', 'light'], ['music-echo', 'light'], ['spatial', 'off'], ['pleasure', 'gentle']
]);

const nodeCountBeforeReentry = audioContext.nodes.length;
audioContext.state = 'suspended';
await standard.context.ChakraAudioEngineInitialization.initialize(engine, standard.dependencies);
assert.equal(audioContext.resumeCount, 2, 'Re-entry resumes the suspended context.');
assert.equal(audioContext.nodes.length, nodeCountBeforeReentry, 'Re-entry does not rebuild the existing graph.');

const closedEyes = createHarness(settings({ eyesCloseMode: true, noFrequencyMode: false, audioFilters: true }));
closedEyes.context.AudioContext = class RejectingSinkAudioContext extends FakeAudioContext {
  async setSinkId() { throw new Error('sink selection unsupported'); }
};
await closedEyes.context.ChakraAudioEngineInitialization.initialize(closedEyes.engine, closedEyes.dependencies);
assert.equal(closedEyes.engine.exciter.curve[0], -1, 'Closed-eyes mode retains the straight-line exciter curve.');
assert.equal(closedEyes.engine.lowCutFilter.frequency.value, 40);
assert.equal(closedEyes.engine.eyesCloseFilter.frequency.value, 3200);
assert.equal(closedEyes.engine.presenceFilter.gain.value, -6);
assert.equal(closedEyes.engine.bgMusicLPF.frequency.value, 1200);
assert.equal(closedEyes.engine.groundingAnchor, null, 'no inaudible 40 Hz hum in Eyes Close mode');
assert.equal(closedEyes.engine.voiceAirFilter.gain.value, 1, 'a little less air with eyes closed');
assert.equal(closedEyes.engine.exciter.curve.length, 2);
assert.equal(closedEyes.engine.ctx.state, 'running', 'A rejected optional output-device selection must not block audio startup.');
assert.equal(closedEyes.warnings.length, 1, 'Unsupported default sink selection is reported but recovered.');

const noFrequencyClosed = createHarness(settings({ eyesCloseMode: true, noFrequencyMode: true }));
await noFrequencyClosed.context.ChakraAudioEngineInitialization.initialize(noFrequencyClosed.engine, noFrequencyClosed.dependencies);
assert.equal(noFrequencyClosed.engine.groundingAnchor, null, 'No Frequency mode never has a grounding oscillator.');
assert.ok(!noFrequencyClosed.engine.ctx.nodes.some(node => node.type === 'oscillator' && node.frequency.value === 40));

console.log('AudioEngine initialization passed: graph routing, heavenly voice path, gentle mastering values, effect returns, spatial buses, grounding mode and idempotent context re-entry.');
