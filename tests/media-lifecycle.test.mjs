import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

const source = fs.readFileSync('modules/media-lifecycle.js', 'utf8');
const app = fs.readFileSync('app.js', 'utf8');
const context = vm.createContext({});
vm.runInContext(source, context);
const media = context.ChakraMediaLifecycle;

assert.ok(Object.isFrozen(media), 'media lifecycle should expose a stable API');
assert.ok(Object.isFrozen(media.constants), 'media envelope constants should be immutable');
assert.equal(media.constants.PIPER_CLIP_FADE_SECONDS, 0.05);
assert.equal(media.constants.PIPER_CANCEL_FADE_SECONDS, 0.12);

for (const [duration, expected] of [[0, 0], [1, 0.2], [10, 2], [30, 3], [60, 3], [NaN, 0]]) {
    assert.equal(media.stageFadeSeconds(duration), expected);
}

const audio = { stageFadeWindow: { limit: 1 } };
const previousWindow = audio.stageFadeWindow;
await media.withAudioStageFade(audio, 10, async () => {
    assert.equal(audio.stageFadeWindow.limit, 2);
});
assert.equal(audio.stageFadeWindow, previousWindow, 'stage fade scope should restore its previous owner');
await assert.rejects(media.withAudioStageFade(audio, 10, async () => {
    throw new Error('cancelled');
}));
assert.equal(audio.stageFadeWindow, previousWindow, 'failed actions cannot leak a temporary fade cap');

const multilingual = `${'മലയാളം '.repeat(90)}${'😀'.repeat(190)}`;
const chunks = [...media.splitNarrationText(multilingual)];
assert.ok(chunks.every(chunk => Array.from(chunk).length <= 180), 'narration chunks should respect Unicode code points');
assert.equal(chunks.join('').replace(/\s/g, ''), multilingual.replace(/\s/g, ''), 'chunking cannot lose narration text');

class Param {
    constructor() { this.value = 1; this.events = []; }
    setValueAtTime(value, time) { this.value = value; this.events.push(['set', value, time]); }
    linearRampToValueAtTime(value, time) { this.value = value; this.events.push(['ramp', value, time]); }
    cancelAndHoldAtTime(time) { this.events.push(['hold', time]); }
    cancelScheduledValues(time) { this.events.push(['cancel', time]); }
}

const sources = [];
const makeBuffer = (channels, length, sampleRate) => {
    const data = Array.from({ length: channels }, () => new Float32Array(length));
    return {
        length,
        sampleRate,
        numberOfChannels: channels,
        duration: length / sampleRate,
        getChannelData: channel => data[channel]
    };
};
const ctx = {
    currentTime: 10,
    createBuffer: makeBuffer,
    createGain() {
        return { gain: new Param(), connect() {}, disconnect() {} };
    },
    createBufferSource() {
        const node = {
            connect() {},
            disconnect() {},
            start(time) { this.startedAt = time; },
            stop(time) { this.stoppedAt = time; }
        };
        sources.push(node);
        return node;
    }
};
const buffer = makeBuffer(1, 2000, 100);
for (let index = 0; index < buffer.length; index++) buffer.getChannelData(0)[index] = Math.sin(index * 0.017) * 0.4;
const loop = new media.SeamlessLoop(ctx, buffer, {}, 0.35, 5);
loop.start(6);
assert.equal(loop.activeSources.length, 1, 'native looping should retain one source');
assert.equal(sources[0].loop, true);
assert.equal(sources[0].loopStart, 5);
assert.equal(sources[0].loopEnd, 20);
assert.deepEqual(loop.output.gain.events.slice(-2), [['set', 0, 10], ['ramp', 0.35, 16]]);
const repeated = new media.SeamlessLoop(ctx, buffer, {}, 1, 5);
assert.equal(repeated.prepareBuffer(), sources[0].buffer, 'prepared overlap PCM should be reused');
loop.stop(4);
assert.equal(sources[0].stoppedAt, 14.02);
const exitEnvelope = JSON.stringify(loop.output.gain.events);
loop.stop(4);
assert.equal(JSON.stringify(loop.output.gain.events), exitEnvelope, 'repeated stop cannot restart the fade');
sources[0].onended();
assert.equal(loop.activeSources.length, 0, 'ended sources should release their loop ownership');

assert.match(app, /return mediaLifecycle\.stageFadeSeconds\(durationSeconds\)/, 'app fade callers should use the module owner');
assert.match(app, /return mediaLifecycle\.splitNarrationText\(text, limit\)/, 'app narration callers should use the module owner');
assert.match(app, /const SeamlessLoop = mediaLifecycle\.SeamlessLoop;/, 'audio callers should bind to the module loop owner');

console.log('Media lifecycle contract passed: immutable envelopes, scoped fades, Unicode narration chunks and native seamless loop cleanup.');
