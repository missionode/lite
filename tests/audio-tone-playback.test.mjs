import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

const moduleSource = fs.readFileSync(new URL('../modules/audio-tone-playback.js', import.meta.url), 'utf8');
const context = vm.createContext({ Math, Number, Object, window: {} });
vm.runInContext(moduleSource, context);
const playback = context.window.ChakraAudioTonePlayback;
assert.ok(Object.isFrozen(playback));

function parameter() {
    return { value: 0, events: [], cancelScheduledValues(time) { this.events.push(['cancel', time]); }, setValueAtTime(value, time) { this.value = value; this.events.push(['set', value, time]); }, linearRampToValueAtTime(value, time) { this.value = value; this.events.push(['linear', value, time]); }, exponentialRampToValueAtTime(value, time) { this.value = value; this.events.push(['exponential', value, time]); } };
}
function makeOwner() {
    const nodes = [];
    const ctx = { currentTime: 20, createOscillator() { const node = { frequency: parameter(), starts: [], stops: [], disconnects: 0, connect(target) { this.target = target; }, start(time) { this.starts.push(time); }, stop(time) { this.stops.push(time); }, disconnect() { this.disconnects++; } }; nodes.push(node); return node; }, createGain() { const node = { gain: parameter(), disconnects: 0, connect(target) { this.target = target; }, disconnect() { this.disconnects++; } }; nodes.push(node); return node; } };
    return { ctx, nodes, masterGain: {}, shotOscillator: null, shotGain: null, guidedTransitionTone: null, stoppedShots: 0, stopFrequencyShot() { this.stoppedShots++; playback.stopShot(this); }, stopGuidedTransitionTone(seconds) { playback.stopTransitionTone(this, seconds); } };
}

const owner = makeOwner();
playback.startShot(owner, '440', { noFrequencyMode: false, volDrone: 0.7 });
const [shotOsc, shotGain] = owner.nodes;
assert.equal(shotOsc.frequency.value, 440);
assert.deepEqual(shotGain.gain.events, [['set', 0, 20], ['linear', 0.2, 20.08]]);
assert.equal(owner.stoppedShots, 1);
playback.stopShot(owner);
assert.equal(owner.shotOscillator, null);
assert.deepEqual(shotGain.gain.events.slice(-3), [['cancel', 20], ['set', 0.2, 20], ['linear', 0, 20.08]]);
assert.deepEqual(shotOsc.stops, [20.1]);
shotOsc.onended();
assert.equal(shotOsc.disconnects, 1);
assert.equal(shotGain.disconnects, 1);

assert.throws(() => playback.startShot(owner, 440, { noFrequencyMode: true, volDrone: 0.1 }), /No Frequency Mode/);
assert.throws(() => playback.startShot(owner, 20001, { noFrequencyMode: false, volDrone: 0.1 }), /between 0 and 20,000/);
assert.throws(() => playback.startShot(owner, NaN, { noFrequencyMode: false, volDrone: 0.1 }), /between 0 and 20,000/);
const mutedOwner = makeOwner();
playback.startShot(mutedOwner, 880, { noFrequencyMode: false, volDrone: 0 });
assert.equal(mutedOwner.nodes[1].gain.value, 0);

const transitionOwner = makeOwner();
assert.equal(playback.startTransitionTone(transitionOwner, 528, 2000, { noFrequencyMode: false, volDrone: 0.1 }), true);
const [transitionOsc, transitionGain] = transitionOwner.nodes;
assert.equal(transitionOsc.frequency.value, 528);
assert.deepEqual(transitionGain.gain.events, [['set', 0.0001, 20], ['exponential', 0.025, 20.5], ['set', 0.025, 21.5], ['exponential', 0.0001, 22]]);
assert.deepEqual(transitionOsc.stops, [22.05]);
playback.stopTransitionTone(transitionOwner, 1.1);
assert.equal(transitionOwner.guidedTransitionTone, null);
assert.ok(Math.abs(transitionOsc.stops.at(-1) - 21.15) < 1e-10);
assert.equal(transitionGain.gain.events.at(-1)[0], 'exponential');
transitionOsc.onended();
assert.equal(transitionOsc.disconnects, 1);
assert.equal(transitionGain.disconnects, 1);

assert.equal(playback.startTransitionTone(makeOwner(), 528, 1000, { noFrequencyMode: true, volDrone: 0.1 }), false);
assert.equal(playback.startTransitionTone(makeOwner(), 0, 1000, { noFrequencyMode: false, volDrone: 0.1 }), false);
assert.equal(playback.startTransitionTone(makeOwner(), 528, NaN, { noFrequencyMode: false, volDrone: 0.1 }), false);
assert.equal(playback.startTransitionTone(makeOwner(), 528, 1000, { noFrequencyMode: false, volDrone: 0 }), false);

const app = fs.readFileSync(new URL('../app.js', import.meta.url), 'utf8');
assert.match(app, /startFrequencyShot\(frequency\)\s*\{\s*return audioTonePlayback\.startShot\(this, frequency, state\);/);
assert.match(app, /startGuidedTransitionTone\(frequency, durationMs\)\s*\{\s*return audioTonePlayback\.startTransitionTone\(this, frequency, durationMs, state\);/);
const html = fs.readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const sw = fs.readFileSync(new URL('../sw.js', import.meta.url), 'utf8');
assert.ok(html.indexOf('modules/audio-tone-playback.js?v=1.0') < html.indexOf('app.js?v=4.12'));
assert.match(sw, /\.\/modules\/audio-tone-playback\.js\?v=1\.0/);

console.log('Audio tone playback contract passed: validation, Shot envelopes, transition fades, state cleanup and suppression.');
