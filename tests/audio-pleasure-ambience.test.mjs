import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

const source = fs.readFileSync(new URL('../modules/audio-pleasure-ambience.js', import.meta.url), 'utf8');
const app = fs.readFileSync(new URL('../app.js', import.meta.url), 'utf8');
const html = fs.readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const sw = fs.readFileSync(new URL('../sw.js', import.meta.url), 'utf8');
const context = vm.createContext({ window: {}, console: { warn() {} } });
vm.runInContext(source, context);
const module = context.window.ChakraAudioPleasureAmbience;
assert.ok(Object.isFrozen(module));
assert.match(app, /loadPleasureAmbienceBuffers\(\)\s*\{\s*return audioPleasureAmbience\.loadBuffers\(this\)/);
assert.match(app, /loadPleasureAmbienceUrl\(url\)\s*\{\s*return audioPleasureAmbience\.loadUrl\(this, url\)/);
assert.ok(html.indexOf('modules/audio-pleasure-ambience.js?v=1.0') < html.indexOf('app.js?v=4.22'));
assert.match(sw, /const CACHE_NAME = 'chakra-v5\.\d+'[\s\S]*?modules\/audio-pleasure-ambience\.js\?v=1\.0/);

const state = {
    pleasureAmbienceUrl: '', moodRelaxationIntentionEnabled: true, noFrequencyMode: false,
    pleasureAmbienceIntensity: 'gentle', pleasureAmbienceGain: 0.04, pleasureAmbienceBlur: true
};
const fetches = [];
const stored = new Map();
let loopCount = 0;
let syncCount = 0;
let warnings = 0;
function makeParam(value = 1) {
    return {
        value,
        cancelScheduledValues() {},
        setValueAtTime(next) { this.value = next; },
        linearRampToValueAtTime(next) { this.value = next; }
    };
}
class Loop {
    constructor(context, buffer, gain, level, fade) {
        this.context = context; this.buffer = buffer; this.gain = gain; this.level = level; this.fade = fade;
        this.isRunning = false; loopCount += 1;
    }
    start() { this.isRunning = true; }
    stop(seconds) { this.stopFade = seconds; this.isRunning = false; }
}
const lifecycle = module.create({
    state,
    fetchAudio: async (url, options) => {
        fetches.push({ url, options });
        if (url === 'audio/ambience-manifest.json') return { ok: true, async json() { return { files: ['pleasure.mp3', 'pleasure-1.ogg', '../ignore.mp3'] }; } };
        if (url === 'https://bad.test/track.mp3') return { ok: false, status: 503, async arrayBuffer() { return new ArrayBuffer(0); } };
        if (url === 'audio/pleasure-1.ogg') return { ok: false, status: 404, async arrayBuffer() { return new ArrayBuffer(0); } };
        return { ok: true, async arrayBuffer() { return new ArrayBuffer(8); } };
    },
    storage: {
        setItem(key, value) { stored.set(key, value); },
        removeItem(key) { stored.delete(key); }
    },
    SeamlessLoop: Loop,
    syncControl() { syncCount += 1; },
    warn() { warnings += 1; },
    normalizeUrl(value) { return value ? new URL(value).href : ''; },
    normalizeIntensity(value) { return ['gentle', 'deep'].includes(value) ? value : 'gentle'; },
    intensityProfile() { return { harmonicMix: 0.04, blurCutoff: 900, approachSeconds: 45, nearDistanceMultiplier: 1, fallbackNearGain: 0.8 }; },
    clampGain(value) { return Math.max(0.002, Math.min(0.07, Number(value))); },
    blurMix(enabled) { return enabled ? { dry: 0.65, wet: 0.35 } : { dry: 1, wet: 0 }; },
    constants: { manifestUrl: 'audio/ambience-manifest.json', urlStorageKey: 'pleasure-url', fadeSeconds: 5, spatialFallbackFarGain: 0.35 }
});
const owner = {
    ctx: { currentTime: 10, async decodeAudioData(value) { return { bytes: value.byteLength }; } },
    pleasureBuffers: new Map(), pleasureManifest: null, pleasureManifestKey: null, pleasureGeneration: 0,
    pleasureAudioAvailable: null, pleasureLoops: [], pleasureGain: { gain: makeParam() }, pleasureEnhancerGain: { gain: makeParam() },
    pleasureBlurDryGain: { gain: makeParam() }, pleasureBlurWetGain: { gain: makeParam() },
    pleasureBlurFilter: { frequency: makeParam() }, pleasureBlurConvolver: {}, pleasureSourceGain: {},
    spatialMode: 'headphones', spatialPleasurePanner: { positionZ: makeParam(-6) },
    pleasureSpatialPosition: { z: -6, nearZ: -2 },
    setConvolverActive() {},
    loadPleasureAmbienceBuffers() { return lifecycle.loadBuffers(this); },
    stopPleasureAmbience(seconds) { return lifecycle.stop(this, seconds); },
    startPleasureAmbience() { return lifecycle.start(this); },
    setPleasureAmbienceIntensity(value) { return lifecycle.setIntensity(this, value); },
    setPleasureAmbienceGain(value) { return lifecycle.setGain(this, value); },
    setPleasureAmbienceBlur(value) { return lifecycle.setBlur(this, value); },
    async init() { this.isInitialized = true; }
};

await lifecycle.loadBuffers(owner);
assert.deepEqual([...owner.pleasureBuffers.keys()], ['audio/pleasure.mp3']);
assert.equal(fetches[0].options.cache, 'no-store');
assert.equal(warnings, 0, 'optional missing ambience layers remain quiet');
assert.equal(await lifecycle.start(owner), true);
assert.equal(owner.pleasureLoops.length, 1);
assert.equal(loopCount, 1);
assert.equal(owner.pleasureLoops[0].fade, 5);
assert.equal(lifecycle.setGain(owner, 0.05), 0.05);
assert.equal(owner.pleasureGain.gain.value, 0.05);
assert.equal(lifecycle.setBlur(owner, false), false);
assert.equal(owner.pleasureBlurWetGain.gain.value, 0);
lifecycle.scheduleSpatialApproach(owner, true);
assert.equal(owner.spatialPleasurePanner.positionZ.value, -2);

assert.equal(await lifecycle.loadUrl(owner, 'https://custom.test/track.mp3'), 'https://custom.test/track.mp3');
assert.equal(stored.get('pleasure-url'), 'https://custom.test/track.mp3');
assert.equal(syncCount, 3, 'custom source load and ambience start refresh availability');
await assert.rejects(lifecycle.loadUrl(owner, 'https://bad.test/track.mp3'), /Unable to load the pleasure ambience URL/);
assert.equal(state.pleasureAmbienceUrl, 'https://custom.test/track.mp3', 'failed candidate retains the prior URL');
assert.equal(stored.get('pleasure-url'), 'https://custom.test/track.mp3', 'failed candidate does not overwrite the stored URL');

const liveLoop = owner.pleasureLoops[0];
lifecycle.stop(owner, 8);
assert.equal(liveLoop.stopFade, 8);
assert.equal(owner.pleasureLoops.length, 0);
assert.equal(owner.pleasureBuffers.size, 0, 'stop releases decoded ambience buffers');
assert.equal(owner.pleasureManifest, null, 'stop invalidates the manifest cache');

console.log('Pleasure ambience lifecycle contract passed: manifest selection, optional 404, decode, loop start, gain/blur/spatial ramps, URL rollback and stop cleanup.');
