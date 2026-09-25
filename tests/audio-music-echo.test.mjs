import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

const source = fs.readFileSync('modules/audio-music-echo.js', 'utf8');
const app = fs.readFileSync('app.js', 'utf8');
const html = fs.readFileSync('index.html', 'utf8');
const sw = fs.readFileSync('sw.js', 'utf8');
const context = vm.createContext({ window: {} });
vm.runInContext(source, context);
const echo = context.window.ChakraAudioMusicEcho;
assert.ok(Object.isFrozen(echo));
assert.ok(Object.isFrozen(echo.PROFILES));
assert.match(app, /setMusicEcho\(mode = 'light'\) \{\s*return audioMusicEcho\.setMusicEcho\(this, mode, MUSIC_REVERB_TAIL_SECONDS\)/);
assert.ok(html.indexOf('modules/audio-music-echo.js?v=1.0') < html.indexOf('app.js?v=4.09'));
assert.match(sw, /chakra-v5\.305[\s\S]*?\.\/modules\/audio-music-echo\.js\?v=1\.0/);

function param(value = 0.3) {
    return {
        value, events: [],
        cancelScheduledValues(time) { this.events.push(['cancel', time]); },
        setValueAtTime(next, time) { this.value = next; this.events.push(['set', next, time]); },
        linearRampToValueAtTime(next, time) { this.value = next; this.events.push(['ramp', next, time]); }
    };
}
function makeOwner() {
    const owner = {
        ctx: { currentTime: 5 }, setConvolverActive(...args) { this.convolver = args; },
        musicEchoDelay: { delayTime: param(0.02) }, musicEchoSend: { gain: param(0.6) },
        musicEchoConvolver: {}, musicEchoWetGain: { gain: param(0.1) },
        musicEchoFilter: { frequency: param(3100) }
    };
    return owner;
}

for (const [mode, expected] of Object.entries({
    off: { delay: 0.018, wet: 0, filter: 2800, enabled: false },
    light: { delay: 0.018, wet: 0.12, filter: 2800, enabled: true },
    spacious: { delay: 0.035, wet: 0.18, filter: 3400, enabled: true },
    invalid: { delay: 0.018, wet: 0.12, filter: 2800, enabled: true }
})) {
    const owner = makeOwner();
    echo.setMusicEcho(owner, mode, 5);
    assert.equal(owner.convolver[0], 'music');
    assert.equal(owner.convolver[4], expected.enabled);
    assert.equal(owner.convolver[5], 5.3);
    assert.deepEqual(owner.musicEchoDelay.delayTime.events.at(-1), ['ramp', expected.delay, 5.25]);
    assert.deepEqual(owner.musicEchoSend.gain.events.at(-1), ['ramp', expected.enabled ? 1 : 0, 5.25]);
    assert.deepEqual(owner.musicEchoWetGain.gain.events.at(-1), ['ramp', expected.wet, 5.25]);
    assert.deepEqual(owner.musicEchoFilter.frequency.events.at(-1), ['ramp', expected.filter, 5.25]);
}

const incomplete = makeOwner();
incomplete.ctx = null;
echo.setMusicEcho(incomplete, 'spacious');
assert.equal(incomplete.convolver, undefined, 'missing context keeps echo application a no-op');
console.log('Music echo preset contract passed: immutable profiles, invalid-mode fallback, 250 ms ramps, tail window and startup guard.');
