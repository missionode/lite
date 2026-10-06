import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

const source = fs.readFileSync(new URL('../modules/audio-comfort-effects.js', import.meta.url), 'utf8');
const app = fs.readFileSync(new URL('../app.js', import.meta.url), 'utf8');
const html = fs.readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const sw = fs.readFileSync(new URL('../sw.js', import.meta.url), 'utf8');
const context = vm.createContext({ window: {}, Float32Array });
vm.runInContext(source, context);
const comfort = context.window.ChakraAudioComfortEffects;
assert.ok(Object.isFrozen(comfort));
assert.match(app, /toggleEyesCloseMode\(enabled\)\s*\{\s*return audioComfortEffects\.setEyesCloseMode\(this, enabled, state\);/);
assert.match(app, /toggleAudioFilters\(enabled\)\s*\{\s*return audioComfortEffects\.setAudioFilters\(this, enabled, state\);/);
assert.ok(html.indexOf('modules/audio-comfort-effects.js?v=1.1') < html.indexOf('app.js?v=4.30'));
assert.match(sw, /\.\/modules\/audio-comfort-effects\.js\?v=1\.1/);
assert.match(sw, /chakra-v5\.370/);

function param(value = 100) {
    return { value, events: [], cancelScheduledValues(t) { this.events.push(['cancel', t]); }, setValueAtTime(v, t) { this.value = v; this.events.push(['set', v, t]); }, linearRampToValueAtTime(v, t) { this.value = v; this.events.push(['linear', v, t]); }, exponentialRampToValueAtTime(v, t) { this.value = v; this.events.push(['exponential', v, t]); } };
}
function makeOwner() {
    const frequency = () => ({ frequency: param() });
    return {
        ctx: { currentTime: 12 }, exciter: {}, eyesCloseFilter: frequency(), bgMusicEQ: { gain: param(), frequency: param(), Q: param() },
        bgMusicHumFilter: { gain: param() }, bgMusicSmoothGain: { gain: param() }, bgMusicLPF: { frequency: param() },
        presenceFilter: { gain: param() }, mantraFilter: frequency(), voiceAirFilter: { gain: param(2) }, makeDistortionCurve: amount => amount
    };
}

const owner = makeOwner();
comfort.setEyesCloseMode(owner, true, { audioFilters: true });
assert.deepEqual(Array.from(owner.exciter.curve), [-1, 1]);
assert.equal(owner.eyesCloseFilter.frequency.events.at(-1)[1], 1600, 'Eyes Close softens music/drone/mantra only, not to a muffled 1 kHz');
assert.equal(owner.voiceAirFilter.gain.events.at(-1)[1], 1, 'the voice keeps a little air with eyes closed');
assert.deepEqual(owner.bgMusicEQ.gain.events.slice(-3), [['cancel', 12], ['set', 100, 12], ['linear', -24, 14.5]]);
assert.equal(owner.bgMusicEQ.frequency.events.at(-1)[1], 3000);
assert.equal(owner.bgMusicEQ.Q.events.at(-1)[1], 0.4);
assert.equal(owner.bgMusicHumFilter.gain.events.at(-1)[1], -15);
assert.equal(owner.bgMusicSmoothGain.gain.events.at(-1)[1], 0.6);
assert.equal(owner.bgMusicLPF.frequency.events.at(-1)[1], 600);
assert.equal(owner.presenceFilter.gain.events.at(-1)[1], -6);
const openOwner = makeOwner();
comfort.setEyesCloseMode(openOwner, false, { audioFilters: false });
assert.deepEqual(Array.from(openOwner.exciter.curve), [-1, 1], 'no added distortion in open-eyes mode either');
assert.equal(openOwner.voiceAirFilter.gain.events.at(-1)[1], 2);

const filterOwner = makeOwner();
comfort.setAudioFilters(filterOwner, true, { eyesCloseMode: true });
assert.deepEqual(filterOwner.presenceFilter.gain.events.at(-1), ['linear', -6, 13.5]);
assert.deepEqual(filterOwner.bgMusicLPF.frequency.events.at(-1), ['linear', 1200, 13.5]);
assert.deepEqual(filterOwner.mantraFilter.frequency.events.at(-1), ['linear', 2200, 13.5]);
filterOwner.ctx = null;
assert.equal(comfort.setAudioFilters(filterOwner, false, {}), undefined, 'uninitialized context remains a no-op');
console.log('Audio comfort effects contract passed: eyes-closed and audio-filter targets, timing, adapters and service-worker wiring.');
