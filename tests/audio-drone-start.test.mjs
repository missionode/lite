import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

const source = fs.readFileSync(new URL('../modules/audio-drone-start.js', import.meta.url), 'utf8');
const context = vm.createContext({ Math, Number, Object, window: {} });
vm.runInContext(source, context);
const droneStart = context.window.ChakraAudioDroneStart;
assert.ok(Object.isFrozen(droneStart));

const param = value => ({ value, events: [], setValueAtTime(next, time) { this.value = next; this.events.push(['set', next, time]); }, linearRampToValueAtTime(next, time) { this.value = next; this.events.push(['ramp', next, time]); } });
function createOwner() {
    const nodes = [];
    const ctx = {
        currentTime: 3, sampleRate: 48000,
        createOscillator() { const node = { frequency: param(0), starts: [], disconnects: 0, connect(target) { this.target = target; }, start(time) { this.starts.push(time); }, disconnect() { this.disconnects++; } }; nodes.push(node); return node; },
        createBiquadFilter() { const node = { frequency: param(0), Q: param(0), disconnects: 0, connect(target) { this.target = target; }, disconnect() { this.disconnects++; } }; nodes.push(node); return node; },
        createStereoPanner() { const node = { pan: param(0), disconnects: 0, connect(target) { this.target = target; }, disconnect() { this.disconnects++; } }; nodes.push(node); return node; },
        createGain() { const node = { gain: param(0), disconnects: 0, connect(target) { this.target = target; }, disconnect() { this.disconnects++; } }; nodes.push(node); return node; }
    };
    return { ctx, nodes, masterGain: {}, droneOscillators: [], binauralNodes: [], elementalCalls: [], stopCalls: 0, startElementalLayer(index) { this.elementalCalls.push(index); }, stopDrone() { this.stopCalls++; this.droneOscillators = []; this.binauralNodes = []; } };
}

const owner = createOwner();
droneStart.startDrone(owner, 528, 4, { noFrequencyMode: false, eyesCloseMode: true });
assert.equal(owner.stopCalls, 1);
assert.deepEqual([...owner.elementalCalls], [4]);
assert.equal(owner.nodes[0].frequency.value, 528);
assert.equal(owner.nodes[3].frequency.value, 80);
assert.equal(owner.nodes[4].frequency.value, 82);
assert.deepEqual(owner.nodes[2].frequency.events[0], ['set', Math.min(528 * 4, 48000 * 0.45), 3]);
assert.deepEqual(owner.nodes[2].Q.events[0], ['set', 0.5, 3]);
assert.equal(owner.droneOscillators.length, 1);
assert.equal(owner.droneOscillators[0].osc, owner.nodes[0]);
assert.equal(owner.binauralNodes.length, 3);
assert.equal(owner.binauralNodes[0], owner.nodes[3]);
assert.equal(owner.binauralNodes[1], owner.nodes[4]);
assert.equal(owner.binauralNodes[2], owner.nodes[7]);
assert.deepEqual(owner.nodes[7].gain.events.at(-1), ['ramp', 0.002, 13]);
owner.nodes[0].onended(); owner.nodes[3].onended(); owner.nodes[4].onended();
assert.ok(owner.nodes[0].disconnects && owner.nodes[1].disconnects && owner.nodes[4].disconnects && owner.nodes[5].disconnects && owner.nodes[6].disconnects);

const muted = createOwner();
droneStart.startDrone(muted, 528, 0, { noFrequencyMode: true, eyesCloseMode: false });
assert.equal(muted.stopCalls, 1);
assert.equal(muted.nodes.length, 0);
assert.deepEqual([...muted.elementalCalls], []);

const invalidFrequency = createOwner();
droneStart.startDrone(invalidFrequency, NaN, 0, { noFrequencyMode: false, eyesCloseMode: false });
assert.equal(invalidFrequency.nodes[0].frequency.value, 110);
const cappedFrequency = createOwner();
droneStart.startDrone(cappedFrequency, 30000, 0, { noFrequencyMode: false, eyesCloseMode: false });
assert.equal(cappedFrequency.nodes[0].frequency.value, 20000);

const sleep = createOwner();
droneStart.startSleepDrone(sleep, 2, { noFrequencyMode: false });
assert.equal(sleep.elementalCalls.length, 0);
assert.equal(sleep.nodes[0].frequency.value, 2);
assert.equal(sleep.nodes[3].frequency.value, 80);
assert.equal(sleep.nodes[4].frequency.value, 82);
assert.deepEqual(sleep.nodes[7].gain.events.at(-1), ['ramp', 0.002, 13]);
sleep.nodes[0].onended(); sleep.nodes[3].onended(); sleep.nodes[4].onended();
assert.ok(sleep.nodes.every(node => node.disconnects > 0));

const invalidBeat = createOwner();
droneStart.startSleepDrone(invalidBeat, NaN, { noFrequencyMode: false });
assert.equal(invalidBeat.nodes[0].frequency.value, 6);
const lowerBound = createOwner();
droneStart.startSleepDrone(lowerBound, 0, { noFrequencyMode: false });
assert.equal(lowerBound.nodes[0].frequency.value, 0.1);
const upperBound = createOwner();
droneStart.startSleepDrone(upperBound, 25000, { noFrequencyMode: false });
assert.equal(upperBound.nodes[0].frequency.value, 20000);

const app = fs.readFileSync(new URL('../app.js', import.meta.url), 'utf8');
assert.match(app, /startDrone\(baseFreq, index = 0\)\s*\{\s*return audioDroneStart\.startDrone\(this, baseFreq, index, state\);/);
assert.match(app, /startSleepDrone\(beatFrequency\)\s*\{\s*return audioDroneStart\.startSleepDrone\(this, beatFrequency, state\);/);
const html = fs.readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const sw = fs.readFileSync(new URL('../sw.js', import.meta.url), 'utf8');
assert.ok(html.indexOf('modules/audio-drone-start.js?v=1.0') < html.indexOf('app.js?v=4.11'));
assert.match(sw, /\.\/modules\/audio-drone-start\.js\?v=1\.0/);

console.log('Audio drone-start contract passed: chakra and sleep tones, guards, bounds, ramps, binaural support and disposal.');
