import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
const app = fs.readFileSync('app.js', 'utf8');
let settings = { lengthScale: 1 };
const { PiperTTS, splitNarrationText } = vm.runInNewContext(
    app.slice(app.indexOf('function splitNarrationText('), app.indexOf('// Audio Engine')) + '; ({PiperTTS, splitNarrationText})',
    { getPiperMeditationSettings: () => settings }
);
const text = ('മലയാളം '.repeat(90) + '😀'.repeat(190));
const chunks = splitNarrationText(text);
assert.ok(chunks.every(chunk => Array.from(chunk).length <= 180));
assert.equal(chunks.join('').replace(/\s/g, ''), text.replace(/\s/g, ''), 'No Unicode text is lost');
const piper = new PiperTTS({});
let builds = 0;
piper.synthesize = async text => { builds++; return text; };
piper.decode = async text => ({ text, length: 1024 * 1024, numberOfChannels: 1 });
piper.getNormalizationGain = () => 1;
await piper.prepare('one'); await piper.prepare('one');
assert.equal(builds, 1, 'Repeated speech reuses decoded audio');
settings = { lengthScale: 1.2 }; await piper.prepare('one');
piper.voiceId = 'different'; await piper.prepare('one');
assert.equal(builds, 3, 'Pace and voice changes cannot reuse stale speech');
for (let i = 0; i < 20; i++) await piper.prepare(String(i));
assert.ok(piper.clipCacheBytes <= 16 * 1024 * 1024);
assert.equal(piper.clipCache.size, 4);
const size = piper.clipCache.size;
piper.decode = async () => { piper.generation++; return { length: 10, numberOfChannels: 1 }; };
await assert.rejects(piper.prepare('cancelled'));
assert.equal(piper.clipCache.size, size, 'Cancelled preparation never enters the cache');

const method = app.slice(app.indexOf('    setConvolverActive('), app.indexOf('    setVoicePlaybackActive('));
const setConvolverActive = vm.runInNewContext('({' + method + '})').setConvolverActive;
const nodes = () => ({ connections: 1, connect() { this.connections++; }, disconnect() { this.connections--; } });
const input = nodes(), convolution = nodes(), output = nodes();
const deadlines = [];
const engine = { ctx: { currentTime: 10, sampleRate: 48000, destination: {}, createBuffer: () => ({}), createBufferSource() {
    const node = { connect(){}, disconnect(){}, start(){}, stop(at){ this.endsAt = at; } }; deadlines.push(node); return node;
} } };
setConvolverActive.call(engine, 'test', input, convolution, output, false, 3);
assert.equal(input.connections, 1, 'Tail remains connected until the audio deadline');
assert.equal(deadlines[0].endsAt, 13);
setConvolverActive.call(engine, 'test', input, convolution, output, true);
assert.equal(deadlines[0].onended, null, 'Restart cancels stale retirement');
setConvolverActive.call(engine, 'test', input, convolution, output, false, 3);
deadlines[1].onended();
assert.equal(input.connections, 0); assert.equal(convolution.connections, 0);
setConvolverActive.call(engine, 'test', input, convolution, output, true);
setConvolverActive.call(engine, 'test', input, convolution, output, true);
assert.equal(input.connections, 1, 'Reactivation reconnects exactly once');
assert.match(app, /screen !== lobbyScreen && screen !== configScreen/);
assert.match(app, /buffer.duration - 12/);
assert.match(fs.readFileSync('style.css', 'utf8'), /body.static-decorations/);
console.log('Thermal budgets passed: Unicode chunks, bounded keyed cache, cancellation and audio-clock effect retirement.');
