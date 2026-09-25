import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

const source = fs.readFileSync(new URL('../modules/audio-mantra-playback.js', import.meta.url), 'utf8');
const app = fs.readFileSync(new URL('../app.js', import.meta.url), 'utf8');
const html = fs.readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const sw = fs.readFileSync(new URL('../sw.js', import.meta.url), 'utf8');
const context = vm.createContext({ window: {} });
vm.runInContext(source, context);
const playback = context.window.ChakraAudioMantraPlayback;

assert.ok(Object.isFrozen(playback));
assert.match(app, /playMantraTrack\(key\) \{\s*return audioMantraPlayback\.play\(this, key/);
assert.match(app, /stopMantraTrack\(\{ restoreMusic = true, invalidate = true, stageWindow = null \} = \{\}\) \{\s*return audioMantraPlayback\.stop\(this/);
assert.ok(html.indexOf('modules/audio-mantra-playback.js?v=1.0') < html.indexOf('app.js?v=4.07'));
assert.match(sw, /\.\/modules\/audio-mantra-playback\.js\?v=1\.0/);
assert.match(source, /owner\.muteBackgroundMusicForMantra\(musicFadeSeconds\)[\s\S]*?owner\.mantraLoop\.start\(musicFadeSeconds\)/);
assert.match(source, /if \(requestId !== owner\.mantraRequestId \|\| state\.noMantraMode\) return;/);
assert.match(source, /if \(requestId === owner\.mantraRequestId\) owner\.restoreBackgroundMusicAfterMantra\(\)/);

function parameter(value = 0) {
    return {
        value, events: [],
        cancelScheduledValues(time) { this.events.push(['cancel', time]); },
        cancelAndHoldAtTime(time) { this.events.push(['hold', time]); },
        setValueAtTime(next, time) { this.value = next; this.events.push(['set', next, time]); },
        linearRampToValueAtTime(next, time) { this.value = next; this.events.push(['ramp', next, time]); }
    };
}
const state = { volDrone: 0.2, volMantra: 0.4 };
const wet = parameter(0.26);
let stoppedFade;
let restoredAt;
const owner = {
    ctx: { currentTime: 20 }, mantraRequestId: 0, mantraLoop: { stop(value) { stoppedFade = value; } },
    mantraFilter: {}, mantraTailConvolver: {}, mantraTailFilter: {}, mantraTailWetGain: { gain: wet },
    mantraPresenceLFO: null, mantraPresenceLFOGain: null, masterGain: { gain: parameter(1) },
    elementalNodes: [], setConvolverActive(...args) { this.retirement = args.at(-1); },
    restoreBackgroundMusicAfterMantra(value) { restoredAt = value; }
};
playback.stop(owner, { stageWindow: 4 }, { state, fadeSeconds: 8, tailSeconds: 7 });
assert.equal(stoppedFade, 2, 'short stage uses its bounded half-window fade');
assert.equal(owner.retirement, 4.1, 'convolver retires after the shortened tail');
assert.deepEqual(wet.events.at(-1), ['ramp', 0, 24]);
assert.equal(restoredAt, 2, 'music returns during the mantra tail');
assert.equal(owner.mantraLoop, null);

console.log('Audio mantra playback contract passed: cancellation guards, decoded handoff, independent buses, shortened stage tail and stable adapters.');
