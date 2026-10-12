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
    const ctx = { currentTime: 20, createOscillator() { const node = { frequency: parameter(), starts: [], stops: [], disconnects: 0, connect(target) { this.target = target; }, start(time) { this.starts.push(time); }, stop(time) { this.stops.push(time); }, disconnect() { this.disconnects++; } }; nodes.push(node); return node; }, createGain() { const node = { gain: parameter(), disconnects: 0, connect(target, output = 0, input = 0) { this.target = target; this.targetInput = input; }, disconnect() { this.disconnects++; } }; nodes.push(node); return node; }, createBufferSource() { const node = { kind: 'buffer', buffer: null, starts: [], stops: [], disconnects: 0, connect(target) { this.target = target; }, start(...args) { this.starts.push(args); }, stop(time) { this.stops.push(time); }, disconnect() { this.disconnects++; } }; nodes.push(node); return node; }, createChannelMerger(count) { const node = { kind: 'merger', count, disconnects: 0, connect(target) { this.target = target; }, disconnect() { this.disconnects++; } }; nodes.push(node); return node; }, destination: { kind: 'destination' } };
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
// Shots on one built-in speaker: the tone skips the shared moving pan and echo
// and feeds a single output channel straight to the device.
{
    const left = makeOwner();
    left.masterGain = { gain: { value: 0.5 } };
    playback.startShot(left, 432, { noFrequencyMode: false, volDrone: 0.2, shotSpeaker: 'left' });
    const [, toneGain, levelGain, merger] = left.nodes;
    assert.equal(toneGain.target, levelGain, 'the tone goes through a level stage');
    assert.equal(levelGain.gain.value, 0.5, 'the level matches the usual Shots loudness');
    assert.equal(levelGain.target, merger, 'then into a two-channel merger');
    assert.equal(levelGain.targetInput, 0, 'single speaker 1 uses the first channel only');
    assert.equal(merger.count, 2);
    assert.equal(merger.target, left.ctx.destination, 'straight to the device, bypassing the shared pan and echo');
    playback.stopShot(left);
    left.nodes[0].onended();
    assert.equal(merger.disconnects, 1, 'the merger is released after the Shot');
    const right = makeOwner();
    right.masterGain = { gain: { value: 0.5 } };
    playback.startShot(right, 432, { noFrequencyMode: false, volDrone: 0.2, shotSpeaker: 'right' });
    assert.equal(right.nodes[2].targetInput, 1, 'single speaker 2 uses the second channel only');
    const both = makeOwner();
    playback.startShot(both, 432, { noFrequencyMode: false, volDrone: 0.2, shotSpeaker: 'both' });
    assert.equal(both.nodes[1].target, both.masterGain, 'Both speakers keeps the shared path');
    // The speaker test plays a short clip of ordinary music (the app's own background music), not a tone.
    const music = { duration: 40 };
    const test = makeOwner();
    test.masterGain = { gain: { value: 0.05 } };
    assert.equal(playback.playSpeakerTest(test, 'right', music), true);
    const [clip, clipGain, clipLevel, clipMerger] = test.nodes;
    assert.equal(clip.kind, 'buffer', 'a music clip, no oscillator');
    assert.equal(clip.buffer, music);
    assert.equal(test.nodes.some(node => node.frequency), false, 'no frequency tone is used for the test');
    assert.equal(clipGain.target, clipLevel);
    assert.equal(clipLevel.gain.value, 1, 'the test is clearly audible, not scaled by the drone volume');
    assert.equal(clipLevel.targetInput, 1, 'the speaker test uses the same single-channel route');
    assert.equal(clipMerger.target, test.ctx.destination);
    assert.ok(clip.stops[0] - clip.starts[0][0] >= 4.9 && clip.stops[0] - clip.starts[0][0] <= 5.1, 'a clip of about five seconds');
    const testBoth = makeOwner();
    assert.equal(playback.playSpeakerTest(testBoth, 'both', music), true);
    assert.equal(testBoth.nodes[1].target, testBoth.ctx.destination, 'Both plays the clip on both speakers');
    assert.equal(playback.playSpeakerTest(makeOwner(), 'left', null), false, 'no clip, no test sound');
}

const sw = fs.readFileSync(new URL('../sw.js', import.meta.url), 'utf8');
assert.ok(html.indexOf('modules/audio-tone-playback.js?v=1.2') < html.indexOf('app.js?v=4.36'));
assert.match(sw, /\.\/modules\/audio-tone-playback\.js\?v=1\.2/);

// Shots speaker setting: saved per device, Both by default, picked with a test tone.
{
    const stateSource = fs.readFileSync(new URL('../modules/app-state.js', import.meta.url), 'utf8');
    assert.match(stateSource, /shotSpeaker: \['left', 'right'\]\.includes\(get\('chakra_shot_speaker'\)\) \? get\('chakra_shot_speaker'\) : 'both'/);
    assert.match(html, /id="shot-options"[\s\S]*?<select id="shot-speaker-select">[\s\S]*?value="both"[\s\S]*?value="left"[\s\S]*?value="right"[\s\S]*?id="test-shot-speaker"/, 'the Shots panel offers the speaker choice and a test');
    const app = fs.readFileSync(new URL('../app.js', import.meta.url), 'utf8');
    assert.match(app, /localStorage\.setItem\('chakra_shot_speaker', state\.shotSpeaker\)/, 'the choice is saved');
    assert.match(app, /audio\.testShotSpeaker\(state\.shotSpeaker\)/, 'the test plays on the chosen speaker');
    for (const language of ['en', 'ml', 'hi', 'ru', 'ta']) {
        const ui = JSON.parse(fs.readFileSync(new URL(`../locales/${language}.json`, import.meta.url), 'utf8')).ui;
        for (const key of ['shotSpeaker', 'shotSpeakerBoth', 'shotSpeakerOne', 'shotSpeakerTwo', 'testShotSpeaker', 'shotSpeakerHelp']) assert.ok(ui[key], `${language} needs ${key}`);
    }
}

console.log('Audio tone playback contract passed: validation, Shot envelopes, transition fades, state cleanup and suppression.');
