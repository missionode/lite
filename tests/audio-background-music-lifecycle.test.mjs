import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

const source = fs.readFileSync(new URL('../modules/audio-background-music-lifecycle.js', import.meta.url), 'utf8');
const app = fs.readFileSync(new URL('../app.js', import.meta.url), 'utf8');
const html = fs.readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const sw = fs.readFileSync(new URL('../sw.js', import.meta.url), 'utf8');
let timerCallback;
let timerDelay;
const context = vm.createContext({
    window: {},
    fetch: async url => ({ async arrayBuffer() { return { url }; } }),
    setTimeout(callback, delay) { timerCallback = callback; timerDelay = delay; return 1; }
});
vm.runInContext(source, context);
const lifecycle = context.window.ChakraAudioBackgroundMusicLifecycle;
assert.ok(Object.isFrozen(lifecycle));
assert.match(app, /startBackgroundMusic\(\) \{\s*return audioBackgroundMusicLifecycle\.start\(this/);
assert.match(app, /stopBackgroundMusic\(fadeTime = BACKGROUND_MUSIC_STOP_FADE_SECONDS\) \{\s*return audioBackgroundMusicLifecycle\.stop\(this/);
assert.ok(html.indexOf('modules/audio-background-music-lifecycle.js?v=1.0') < html.indexOf('app.js?v=4.10'));
assert.match(sw, /\.\/modules\/audio-background-music-lifecycle\.js\?v=1\.0/);

function param(value = 1) {
    return { value, cancelScheduledValues() {}, setValueAtTime(next) { this.value = next; } };
}
let loopsCreated = 0;
class Loop {
    constructor(...args) { this.args = args; this.isRunning = false; loopsCreated += 1; }
    start() { this.isRunning = true; }
    stop(seconds) { this.stoppedAt = seconds; this.isRunning = false; }
}
const state = { musicEcho: 'light' };
const owner = {
    ctx: { currentTime: 7, async decodeAudioData(buffer) { return buffer; } },
    bgMusicBuffer: null, bgMusicLoop: null, bgMusicGain: { gain: param(0.8) },
    bgMusicBusGain: { gain: param(0.1) }, musicEchoTailGate: { gain: param(0) },
    bgMusicEntryEndsAt: 0, bgMusicSuppressedByMantra: true, bgMusicRetirePromise: null,
    setMusicEcho(value) { this.musicEcho = value; }, cancelBackgroundMusicRestore() { this.restoreCancelled = true; },
    setConvolverActive(...args) { this.convolverRetirement = args.at(-1); }
};
const config = { state, SeamlessLoop: Loop, url: 'music.mp3', entryFadeSeconds: 10, stopFadeSeconds: 8 };
await lifecycle.start(owner, config);
assert.equal(owner.bgMusicBuffer.url, 'music.mp3');
assert.equal(owner.bgMusicLoop.args[4], 10);
assert.equal(owner.bgMusicLoop.isRunning, true);
assert.equal(owner.bgMusicEntryEndsAt, 17);
assert.equal(owner.bgMusicGain.gain.value, 0);
assert.equal(owner.bgMusicBusGain.gain.value, 1);
assert.equal(owner.musicEchoTailGate.gain.value, 1);
assert.equal(owner.bgMusicSuppressedByMantra, false);
await lifecycle.start(owner, config);
assert.equal(loopsCreated, 1, 'reusing a live loop avoids restarting its timeline');

lifecycle.stop(owner, 4, 5);
assert.equal(owner.bgMusicLoop, null);
assert.equal(owner.bgMusicEntryEndsAt, 0);
assert.equal(owner.convolverRetirement, 9.1);
assert.equal(timerDelay, 4100, 'fade retirement retains its small scheduling cushion');
assert.equal(typeof owner.bgMusicRetirePromise?.then, 'function');
timerCallback();
await Promise.resolve();
await Promise.resolve();
assert.equal(owner.bgMusicRetirePromise, null);

console.log('Background music lifecycle contract passed: loop reuse, entry reset, fade retirement and cleanup.');
