import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

const source = fs.readFileSync(new URL('../modules/audio-signal-design.js', import.meta.url), 'utf8');
const context = vm.createContext({ Float32Array, Math, Object, window: {} });
vm.runInContext(source, context);
const design = context.window.ChakraAudioSignalDesign;
assert.ok(Object.isFrozen(design));

const makeContext = sampleRate => ({
    sampleRate,
    buffers: [],
    createBuffer(channels, length, rate) {
        const buffer = { channels, length, rate, samples: Array.from({ length: channels }, () => new Float32Array(length)), getChannelData(channel) { return this.samples[channel]; } };
        this.buffers.push(buffer);
        return buffer;
    }
});

const curve = design.makeDistortionCurve(0.002);
assert.equal(curve.length, 44100);
assert.equal(curve[0], -1);
assert.ok(Math.abs(curve[curve.length - 1] - 1) < 0.0001);
assert.equal(curve[22050], 0);

const noiseContext = makeContext(4);
const impulse = design.createImpulseResponse(noiseContext, 0.5, 2, () => 0.75);
assert.equal(impulse.channels, 2);
assert.equal(impulse.length, 2);
assert.deepEqual([...impulse.samples[0]], [0.5, 0.125]);
assert.deepEqual([...impulse.samples[1]], [0.5, 0.125]);

const diffuseContext = makeContext(4);
const diffuseA = design.createDiffuseReverbImpulse(diffuseContext, 0.26, 2, 731);
const diffuseB = design.createDiffuseReverbImpulse(diffuseContext, 0.26, 2, 731);
assert.equal(diffuseA.length, 1);
assert.deepEqual([...diffuseA.samples[0]], [...diffuseB.samples[0]]);
assert.deepEqual([...diffuseA.samples[1]], [...diffuseB.samples[1]]);
assert.notDeepEqual([...diffuseA.samples[0]], [...diffuseA.samples[1]]);

const generatedNoise = design.createNoiseBuffer(makeContext(2), () => 0.25);
assert.equal(generatedNoise.channels, 1);
assert.equal(generatedNoise.length, 4);
assert.deepEqual([...generatedNoise.samples[0]], [-0.5, -0.5, -0.5, -0.5]);

const app = fs.readFileSync(new URL('../app.js', import.meta.url), 'utf8');
assert.match(app, /return audioSignalDesign\.makeDistortionCurve\(amount\)/);
assert.match(app, /return audioSignalDesign\.createImpulseResponse\(this\.ctx, duration, decay\)/);
assert.match(app, /return audioSignalDesign\.createDiffuseReverbImpulse\(this\.ctx, duration, decay, seed\)/);
assert.match(app, /audioSignalDesign\.createNoiseBuffer\(this\.ctx\)/);

const html = fs.readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const serviceWorker = fs.readFileSync(new URL('../sw.js', import.meta.url), 'utf8');
assert.ok(html.indexOf('modules/audio-signal-design.js?v=1.0') < html.indexOf('app.js?v=4.04'));
assert.match(serviceWorker, /\.\/modules\/audio-signal-design\.js\?v=1\.0/);

console.log('Audio signal-design contract passed: distortion, randomized and deterministic impulse responses, noise buffer and app adapters.');
