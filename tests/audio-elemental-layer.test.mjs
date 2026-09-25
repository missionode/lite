import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

const source = fs.readFileSync(new URL('../modules/audio-elemental-layer.js', import.meta.url), 'utf8');
const context = vm.createContext({ Math, Object, window: {} });
vm.runInContext(source, context);
const layer = context.window.ChakraAudioElementalLayer;
assert.ok(Object.isFrozen(layer));

function makeNode(kind) {
    return {
        kind, connections: [], stops: 0, starts: 0, disconnects: 0,
        gain: { events: [], setValueAtTime(value, time) { this.events.push(['set', value, time]); }, linearRampToValueAtTime(value, time) { this.events.push(['ramp', value, time]); } },
        frequency: { events: [], setValueAtTime(value, time) { this.events.push(['set', value, time]); } },
        Q: { events: [], setValueAtTime(value, time) { this.events.push(['set', value, time]); } },
        connect(node) { this.connections.push(node); },
        start() { this.starts++; },
        stop() { this.stops++; },
        disconnect() { this.disconnects++; }
    };
}

function makeOwner() {
    const created = [];
    const ctx = {
        currentTime: 12,
        createBufferSource() { const node = makeNode('source'); created.push(node); return node; },
        createBiquadFilter() { const node = makeNode('filter'); created.push(node); return node; },
        createGain() { const node = makeNode('gain'); created.push(node); return node; },
        createOscillator() { const node = makeNode('oscillator'); created.push(node); return node; }
    };
    return { ctx, created, masterGain: makeNode('master'), elementalNodes: [], createNoiseBuffer: () => ({ cached: true }) };
}

const expected = [
    ['lowpass', 100, 0.2, 400], ['lowpass', 250, 0.2, 400],
    ['bandpass', 700, 1.5, 400], ['bandpass', 1200, 1.5, 400],
    ['highpass', 4700, 0.4, 1200], ['highpass', 5000, 0.4, 1200], ['highpass', 5300, 0.4, 1200]
];

for (let index = 0; index < expected.length; index++) {
    const owner = makeOwner();
    let randomCalls = 0;
    layer.start(owner, index, () => { randomCalls++; return 0.5; });
    const [sourceNode, filter, gain, oscillator, gainMod, frequencyMod] = owner.created;
    const [type, frequency, q, modulation] = expected[index];
    assert.equal(randomCalls, 1);
    assert.equal(sourceNode.buffer.cached, true);
    assert.equal(sourceNode.loop, true);
    assert.deepEqual(gain.gain.events, [['set', 0, 12], ['ramp', 0.012, 17]]);
    assert.deepEqual(oscillator.frequency.events, [['set', 0.03, 12]]);
    assert.deepEqual(gainMod.gain.events, [['set', 0.004, 12]]);
    assert.deepEqual(frequencyMod.gain.events, [['set', modulation, 12]]);
    assert.deepEqual(filter.frequency.events, [['set', frequency, 12]]);
    assert.deepEqual(filter.Q.events, [['set', q, 12]]);
    assert.equal(filter.type, type);
    assert.equal(sourceNode.connections[0], filter);
    assert.equal(filter.connections[0], gain);
    assert.equal(gain.connections[0], owner.masterGain);
    assert.equal(oscillator.starts, 1);
    assert.equal(sourceNode.starts, 1);
    assert.equal(owner.elementalNodes.length, 1);

    sourceNode.onended();
    assert.equal(oscillator.stops, 1);
    for (const node of owner.created) assert.equal(node.disconnects, 1);
}

const owner = makeOwner();
const oldLayer = { src: makeNode('old-source'), lfo: makeNode('old-lfo') };
owner.elementalNodes = [oldLayer];
layer.start(owner, 0, () => 0);
assert.equal(oldLayer.src.stops, 1);
assert.equal(oldLayer.lfo.stops, 1);
assert.equal(owner.elementalNodes.length, 1);

const app = fs.readFileSync(new URL('../app.js', import.meta.url), 'utf8');
assert.match(app, /startElementalLayer\(index\)\s*\{\s*return audioElementalLayer\.start\(this, index\);/);
const html = fs.readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const sw = fs.readFileSync(new URL('../sw.js', import.meta.url), 'utf8');
assert.ok(html.indexOf('modules/audio-elemental-layer.js?v=1.0') < html.indexOf('app.js?v=4.04'));
assert.match(sw, /\.\/modules\/audio-elemental-layer\.js\?v=1\.0/);

console.log('Audio elemental-layer contract passed: frequency bands, gain/LFO values, replacement stop, node routing and ended cleanup.');
