import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

const source = fs.readFileSync(new URL('../modules/audio-drone-stop.js', import.meta.url), 'utf8');
class AudioParam {}
const context = vm.createContext({ Object, window: { AudioParam } });
vm.runInContext(source, context);
const lifecycle = context.window.ChakraAudioDroneStop;
assert.ok(Object.isFrozen(lifecycle));

function gainParam(value = 0.4, supportsHold = true) {
    return {
        value,
        events: [],
        ...(supportsHold ? { cancelAndHoldAtTime(time) { this.events.push(['hold', time]); } } : {}),
        cancelScheduledValues(time) { this.events.push(['cancel', time]); },
        setValueAtTime(next, time) { this.value = next; this.events.push(['set', next, time]); },
        linearRampToValueAtTime(next, time) { this.value = next; this.events.push(['ramp', next, time]); }
    };
}
function oscillator() { return { stops: [], stop(time) { this.stops.push(time); } }; }

const empty = { ctx: null, binauralNodes: [1], droneOscillators: [1], groundingAnchor: {}, elementalNodes: [1], vibrationLFO: {} };
lifecycle.stopDrone(empty);
assert.deepEqual([...empty.binauralNodes], []);
assert.deepEqual([...empty.droneOscillators], []);
assert.equal(empty.groundingAnchor, null);
assert.deepEqual([...empty.elementalNodes], []);
assert.equal(empty.vibrationLFO, null);

const nativeParam = new AudioParam();
nativeParam.stop = () => assert.fail('AudioParam-like binaural node must not be treated as an oscillator');
const binauralGain = { gain: gainParam(0.2) };
const binauralOsc = oscillator();
const binauralOwner = { ctx: { currentTime: 2 }, binauralNodes: [nativeParam, binauralGain, binauralOsc] };
lifecycle.stopBinaural(binauralOwner);
assert.deepEqual(binauralGain.gain.events, [['cancel', 2], ['set', 0.2, 2], ['ramp', 0, 7]]);
assert.deepEqual(binauralOsc.stops, [7]);
assert.deepEqual([...binauralOwner.binauralNodes], []);

const droneOsc = oscillator();
const droneGain = { gain: gainParam(0.7) };
const anchorOsc = oscillator();
const anchorGain = { gain: gainParam(0.5, false) };
const elementalSrc = oscillator();
const elementalLfo = oscillator();
const elementalGain = { gain: gainParam(0.3, false) };
const vibration = oscillator();
const owner = {
    ctx: { currentTime: 10 }, binauralNodes: [binauralOsc], droneOscillators: [{ osc: droneOsc, gain: droneGain }],
    groundingAnchor: { osc: anchorOsc, gain: anchorGain }, elementalNodes: [{ src: elementalSrc, lfo: elementalLfo, gain: elementalGain }],
    vibrationLFO: vibration, stopBinaural() { lifecycle.stopBinaural(this); }
};
lifecycle.stopDrone(owner);
assert.deepEqual([...owner.droneOscillators], []);
assert.equal(owner.groundingAnchor, null);
assert.deepEqual([...owner.elementalNodes], []);
assert.equal(owner.vibrationLFO, null);
assert.deepEqual(droneGain.gain.events, [['hold', 10], ['ramp', 0, 15]]);
assert.deepEqual(droneOsc.stops, [15.1]);
assert.deepEqual(anchorGain.gain.events, [['cancel', 10], ['set', 0.5, 10], ['ramp', 0, 15]]);
assert.deepEqual(anchorOsc.stops, [15.1]);
assert.deepEqual(elementalGain.gain.events, [['cancel', 10], ['set', 0.3, 10], ['ramp', 0, 15]]);
assert.deepEqual(elementalSrc.stops, [15.1]);
assert.deepEqual(elementalLfo.stops, [15.1]);
assert.deepEqual(vibration.stops, [15]);

const app = fs.readFileSync(new URL('../app.js', import.meta.url), 'utf8');
assert.match(app, /stopBinaural\(\)\s*\{\s*return audioDroneStop\.stopBinaural\(this\);/);
assert.match(app, /stopDrone\(\)\s*\{\s*return audioDroneStop\.stopDrone\(this\);/);
const html = fs.readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const sw = fs.readFileSync(new URL('../sw.js', import.meta.url), 'utf8');
assert.ok(html.indexOf('modules/audio-drone-stop.js?v=1.0') < html.indexOf('app.js?v=4.10'));
assert.match(sw, /\.\/modules\/audio-drone-stop\.js\?v=1\.0/);

console.log('Audio drone-stop contract passed: uninitialized reset, AudioParam discrimination, 5-second fades and source cleanup.');
