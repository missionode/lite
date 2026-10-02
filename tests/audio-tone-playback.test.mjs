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

const bowlOwner = makeOwner();
bowlOwner.bellGain = {};
bowlOwner.ctx.createBiquadFilter = () => {
    const filter = { frequency: parameter(), Q: parameter(), disconnects: 0, connect(target) { this.target = target; }, disconnect() { this.disconnects++; } };
    bowlOwner.nodes.push(filter);
    return filter;
};
playback.playSingingBowl(bowlOwner, { noFrequencyMode: false, volBell: 0.5 });
assert.equal(bowlOwner.nodes.length, 15, 'the bell uses five oscillator/filter/gain partials');
for (let index = 0; index < bowlOwner.nodes.length; index += 3) {
    const [oscillator, gain, filter] = bowlOwner.nodes.slice(index, index + 3);
    assert.equal(oscillator.frequency.value, 180 * [1, 2.8, 5, 8.1, 12.5][index / 3]);
    assert.equal(filter.frequency.value, oscillator.frequency.value);
    assert.equal(filter.Q.value, 50);
    assert.deepEqual(gain.gain.events, [['set', 0.0001, 20], ['exponential', 0.1, 20.1], ['exponential', 0.001, 28]]);
    assert.equal(gain.target, bowlOwner.bellGain);
    assert.deepEqual(oscillator.starts, [20]);
    assert.deepEqual(oscillator.stops, [28.1]);
    oscillator.onended();
    assert.equal(oscillator.disconnects, 1);
    assert.equal(filter.disconnects, 1);
    assert.equal(gain.disconnects, 1);
}
for (const muted of [
    { noFrequencyMode: true, volBell: 0.5 },
    { noFrequencyMode: false, volBell: 0 }
]) {
    const silentOwner = makeOwner();
    silentOwner.bellGain = {};
    silentOwner.ctx.createBiquadFilter = () => { throw new Error('muted bell must not allocate'); };
    playback.playSingingBowl(silentOwner, muted);
    assert.equal(silentOwner.nodes.length, 0);
}
const uninitializedBell = makeOwner();
uninitializedBell.ctx = null;
playback.playSingingBowl(uninitializedBell, { noFrequencyMode: false, volBell: 0.5 });
assert.equal(uninitializedBell.nodes.length, 0);

const app = fs.readFileSync(new URL('../app.js', import.meta.url), 'utf8');
assert.match(app, /startFrequencyShot\(frequency\)\s*\{\s*return audioTonePlayback\.startShot\(this, frequency, state\);/);
assert.match(app, /startGuidedTransitionTone\(frequency, durationMs\)\s*\{\s*return audioTonePlayback\.startTransitionTone\(this, frequency, durationMs, state\);/);
assert.match(app, /playSingingBowl\(\)\s*\{\s*return audioTonePlayback\.playSingingBowl\(this, state\);/);
const html = fs.readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const sw = fs.readFileSync(new URL('../sw.js', import.meta.url), 'utf8');
assert.ok(html.indexOf('modules/audio-tone-playback.js?v=1.0') < html.indexOf('app.js?v=4.24'));
assert.match(sw, /\.\/modules\/audio-tone-playback\.js\?v=1\.0/);

console.log('Audio tone playback contract passed: validation, Shot envelopes, transition fades, state cleanup and suppression.');
