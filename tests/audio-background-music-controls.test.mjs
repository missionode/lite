import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

const source = fs.readFileSync(new URL('../modules/audio-background-music-controls.js', import.meta.url), 'utf8');
const app = fs.readFileSync(new URL('../app.js', import.meta.url), 'utf8');
const html = fs.readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const sw = fs.readFileSync(new URL('../sw.js', import.meta.url), 'utf8');
const context = vm.createContext({ window: {}, clearTimeout() {} });
vm.runInContext(source, context);
const controls = context.window.ChakraAudioBackgroundMusicControls;
assert.ok(Object.isFrozen(controls));
assert.ok(Object.keys(controls).length === 6);
assert.match(app, /fadeOutBackgroundMusic\(duration = 4\) \{\s*return audioBackgroundMusicControls\.fadeOut\(this, duration\)/);
assert.match(app, /muteBackgroundMusicForMantra\(duration = MANTRA_MUSIC_FADE_SECONDS\) \{\s*return audioBackgroundMusicControls\.muteForMantra\(this, duration\)/);
assert.ok(html.indexOf('modules/audio-background-music-controls.js?v=1.0') < html.indexOf('app.js?v=4.08'));
assert.match(sw, /\.\/modules\/audio-background-music-controls\.js\?v=1\.0/);

function param(value = 0.4, modern = true) {
    const result = {
        value, events: [],
        cancelScheduledValues(time) { this.events.push(['cancel', time]); },
        setValueAtTime(next, time) { this.value = next; this.events.push(['set', next, time]); },
        linearRampToValueAtTime(next, time) { this.value = next; this.events.push(['ramp', next, time]); }
    };
    if (modern) result.cancelAndHoldAtTime = time => result.events.push(['hold', time]);
    return result;
}
const bus = param(0.5);
const musicGain = param(0.4);
const musicEq = param(-3);
const tail = param(1);
let loopGainCalls = 0;
const owner = {
    ctx: { currentTime: 10 }, bgMusicLoop: { setGain() { loopGainCalls++; } },
    stageFadeWindow: { limit: 2 }, bgMusicGain: { gain: musicGain }, bgMusicEQ: { gain: musicEq },
    bgMusicBusGain: { gain: bus }, musicEchoTailGate: { gain: tail },
    bgMusicEntryEndsAt: 5, bgMusicSuppressedByMantra: false,
    bgMusicTargetVolume: 0.4, bgMusicTargetEQ: 0,
    bgMusicRestoreTimer: 9
};
controls.fadeIn(owner, 8, true, { volMusic: 0.4 });
assert.equal(owner.bgMusicTargetVolume, 0.06);
assert.equal(owner.bgMusicTargetEQ, -3);
assert.deepEqual(musicGain.events.at(-1), ['ramp', 0.06, 12]);
assert.equal(loopGainCalls, 1, 'entry complete can release the seamless-loop overlap gain');
assert.deepEqual(bus.events.at(-1), ['ramp', 1, 12]);

owner.bgMusicSuppressedByMantra = true;
const busEventsBefore = bus.events.length;
controls.fadeIn(owner, 3, 0.08, { volMusic: 0.4 });
assert.equal(bus.events.length, busEventsBefore, 'narration updates cannot reopen music during mantra suppression');

controls.fadeOut(owner, 4);
assert.equal(owner.bgMusicTargetVolume, 0);
assert.equal(owner.bgMusicTargetEQ, 0);
assert.deepEqual(musicGain.events.at(-1), ['ramp', 0, 14]);
controls.setVolume(owner, 0.8, 0.4);
assert.equal(owner.bgMusicTargetVolume, 0, 'slider updates cannot revive an intentional silent role');

owner.bgMusicTargetVolume = 0.2;
musicGain.value = 0.3;
controls.setVolume(owner, 0.8, 0.4);
assert.equal(owner.bgMusicTargetVolume, 0.4, 'slider updates preserve the existing 50% duck');
assert.deepEqual(musicGain.events.at(-1), ['ramp', 0.4, 10.25]);

const mute = controls.muteForMantra(owner, 6);
assert.equal(mute.startedAt, 10);
assert.equal(mute.duration, 6);
assert.equal(owner.bgMusicSuppressedByMantra, true);
assert.deepEqual(bus.events.at(-1), ['ramp', 0, 16]);
assert.deepEqual(tail.events.at(-1), ['ramp', 0, 16]);
assert.equal(owner.bgMusicRestoreTimer, null);
controls.restoreAfterMantra(owner, 8);
assert.equal(owner.bgMusicSuppressedByMantra, false);
assert.deepEqual(bus.events.at(-1), ['ramp', 1, 18]);
assert.deepEqual(tail.events.at(-1), ['ramp', 1, 18]);

const fallbackBus = param(0.35, false);
const fallbackTail = param(0.65, false);
let clearedTimer = null;
const fallbackOwner = {
    ctx: { currentTime: 20 }, bgMusicBusGain: { gain: fallbackBus },
    musicEchoTailGate: { gain: fallbackTail }, bgMusicRestoreTimer: 12,
    bgMusicSuppressedByMantra: false
};
const fallbackContext = vm.createContext({ window: {}, clearTimeout(value) { clearedTimer = value; } });
vm.runInContext(source, fallbackContext);
fallbackContext.window.ChakraAudioBackgroundMusicControls.muteForMantra(fallbackOwner, 2);
assert.deepEqual(fallbackBus.events.slice(-3), [['cancel', 20], ['set', 0.35, 20], ['ramp', 0, 22]]);
assert.deepEqual(fallbackTail.events.slice(-3), [['cancel', 20], ['set', 0.65, 20], ['ramp', 0, 22]]);
assert.equal(clearedTimer, 12, 'the previous restoration timer is cancelled before a new mantra mute');
assert.equal(fallbackOwner.bgMusicRestoreTimer, null);

console.log('Background music controls contract passed: fade windows, duck/silence preservation, mantra mute/restore, tail-gate parity and gain fallbacks.');
