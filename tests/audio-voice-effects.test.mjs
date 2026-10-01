import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

const read = file => fs.readFileSync(new URL(`../${file}`, import.meta.url), 'utf8');
const source = read('modules/audio-voice-effects.js');
const app = read('app.js');
const context = vm.createContext({ window: {} });
vm.runInContext(source, context);
const effects = context.window.ChakraAudioVoiceEffects;
assert.ok(Object.isFrozen(effects));

function makeOwner(hold = false) {
    const events = [];
    const param = (name, value) => ({
        value,
        ...(hold ? { cancelAndHoldAtTime(time) { events.push([name, 'hold', time]); } } : {}),
        cancelScheduledValues(time) { events.push([name, 'cancel', time]); },
        setValueAtTime(next, time) { events.push([name, 'set', next, time]); this.value = next; },
        linearRampToValueAtTime(next, time) { events.push([name, 'ramp', next, time]); this.value = next; }
    });
    return {
        events, ctx: { currentTime: 10 },
        voiceWarmthFilter: { gain: param('warmth', 0.7) },
        voiceClarityFilter: { gain: param('clarity', -0.6) },
        voiceEchoSend: { gain: param('send', 0.4) },
        voiceEchoDelay: { delayTime: param('delay', 0.035) },
        voiceEchoConvolver: {},
        voiceEchoWetGain: { gain: param('wet', 0.09) },
        voiceEchoFilter: { frequency: param('filter', 3100) },
        setConvolverActive(...args) { events.push(['route']); this.route = args; }
    };
}

const held = (hold, name, initial) => hold
    ? [[name, 'hold', 10]]
    : [[name, 'cancel', 10], [name, 'set', initial, 10]];

// Numeric coercion, finite fallback, clamp and exact asymmetric dB gains.
for (const [input, warmth, clarity] of [
    [undefined, 0, 0], [50, 0, 0], [0, -3, -4], [100, 3, 4],
    [-500, -3, -4], [500, 3, 4], [25, -1.5, -2], ['75', 1.5, 2],
    [null, -3, -4], ['', -3, -4], [false, -3, -4], [true, -2.94, -3.92],
    [NaN, 0, 0], [Infinity, 0, 0], [-Infinity, 0, 0], ['invalid', 0, 0]
]) {
    for (const hold of [false, true]) {
        const owner = makeOwner(hold);
        assert.equal(effects.setVoiceTuning(owner, input, input), undefined);
        assert.deepEqual(owner.events, [
            ...held(hold, 'warmth', 0.7), ['warmth', 'ramp', warmth, 10.25],
            ...held(hold, 'clarity', -0.6), ['clarity', 'ramp', clarity, 10.25]
        ]);
    }
}
const mixed = makeOwner();
effects.setVoiceTuning(mixed, 100, 0);
assert.equal(mixed.voiceWarmthFilter.gain.value, 3);
assert.equal(mixed.voiceClarityFilter.gain.value, -4);

for (const [method, missingNodes] of [
    ['setVoiceTuning', ['ctx', 'voiceWarmthFilter', 'voiceClarityFilter']],
    ['setVoiceEcho', ['ctx', 'voiceEchoSend', 'voiceEchoDelay', 'voiceEchoConvolver', 'voiceEchoWetGain']]
]) {
    for (const missing of missingNodes) {
        const owner = makeOwner();
        owner[missing] = null;
        assert.equal(effects[method](owner), undefined);
        assert.deepEqual(owner.events, [], `${method}: absent ${missing} must be a no-op`);
    }
}

for (const [mode, wet, filter] of [
    ['off', 0, 6000], ['light', 0.14, 5500], ['spacious', 0.22, 6500],
    [undefined, 0, 6000], [null, 0, 6000], ['invalid', 0, 6000],
    ['toString', 0, 6000], ['constructor', 0, 6000], ['__proto__', 0, 6000]
]) {
    for (const active of [true, false, undefined, 1, 'true']) {
        for (const hold of [false, true]) {
            const owner = makeOwner(hold);
            owner.voicePlaybackActive = active;
            owner.voiceExitFade = 1.75;
            assert.equal(effects.setVoiceEcho(owner, mode, 3.2), undefined);
            assert.deepEqual(owner.route, [
                'voice', owner.voiceEchoDelay, owner.voiceEchoConvolver, owner.voiceEchoFilter,
                wet > 0 && active === true, 3.2 + 1.75 + 0.3
            ]);
            assert.deepEqual(owner.events, [
                ['route'], ...held(hold, 'send', 0.4), ...held(hold, 'wet', 0.09), ...held(hold, 'filter', 3100),
                ['send', 'ramp', wet > 0 ? 1 : 0, 10.25],
                ['wet', 'ramp', wet, 10.25], ['filter', 'ramp', filter, 10.25]
            ], 'route first, hold every parameter, then ramp; pre-delay remains untouched');
            assert.equal(owner.voiceEchoDelay.delayTime.value, 0.035);
        }
    }
}
for (const [fade, tail] of [[undefined, 5.3], [null, 5.3], [NaN, 5.3], [0, 5.3], [2, 7.3], [-1, 4.3]]) {
    const owner = makeOwner();
    owner.voiceExitFade = fade;
    effects.setVoiceEcho(owner, 'light');
    assert.equal(owner.route[5], tail);
}

// Exercise the public adapters with spies, including state assignment before echo.
const method = (name, next, dependencies) => vm.runInNewContext(
    `({${app.slice(app.indexOf(`    ${name}(`), app.indexOf(`    ${next}(`))}})`, dependencies
)[name];
const calls = [];
const sentinel = {};
const dependencies = {
    audioVoiceEffects: {
        setVoiceTuning(...args) { calls.push(args); return sentinel; },
        setVoiceEcho(...args) { calls.push(args); return sentinel; }
    },
    VOICE_REVERB_TAIL_SECONDS: 8.5
};
const adapterOwner = {};
const tune = method('setVoiceTuning', 'setConvolverActive', dependencies);
const echo = method('setVoiceEcho', 'setMusicEcho', dependencies);
assert.equal(tune.call(adapterOwner), sentinel);
assert.equal(tune.call(adapterOwner, 17, 83), sentinel);
assert.equal(echo.call(adapterOwner), sentinel);
assert.equal(echo.call(adapterOwner, 'spacious'), sentinel);
assert.deepEqual(calls, [
    [adapterOwner, 50, 50], [adapterOwner, 17, 83],
    [adapterOwner, 'off', 8.5], [adapterOwner, 'spacious', 8.5]
]);
const state = { voiceEcho: 'spacious' };
const playback = method('setVoicePlaybackActive', 'setVoiceEcho', { state, audioVoiceEffects: effects });
const owner = makeOwner();
owner.setVoiceEcho = function(mode) {
    calls.push([mode, this.voicePlaybackActive, this.voiceExitFade]);
    effects.setVoiceEcho(this, mode, 5);
};
playback.call(owner, true);
assert.deepEqual(calls.at(-1), ['spacious', true, 0]);
assert.equal(owner.route[4], true);
state.voiceEcho = 'light';
playback.call(owner, false, 2);
assert.deepEqual(calls.at(-1), ['light', false, 2]);
assert.equal(owner.route[4], false);
assert.equal(owner.route[5], 7.3);

const scripts = [...read('index.html').matchAll(/<script\b[^>]*src="([^"]+)"/g)].map(match => match[1]);
const moduleUrl = 'modules/audio-voice-effects.js?v=1.1';
assert.equal(scripts.filter(url => url === moduleUrl).length, 1);
assert.equal(scripts[scripts.indexOf('modules/audio-music-echo.js?v=1.1') + 1], moduleUrl);
assert.ok(scripts.indexOf(moduleUrl) < scripts.findIndex(url => url.startsWith('app.js?')));
assert.ok(read('sw.js').includes(`'./${moduleUrl}'`));
assert.match(app, /const audioVoiceEffects = window\.ChakraAudioVoiceEffects;/);
assert.match(app, /if \(!audioVoiceEffects\) throw new Error/);
assert.doesNotMatch(app, /const voiceEchoSettings|const warmthGain|const clarityGain/);
console.log('Voice effects passed: exact tuning/profile values, guards, route gates/tails, hold/fallback ramps, adapters and shell delivery.');

// Heavenly halo: the echo is ducked under words and blooms in the pauses.
{
    const duckEvents = [];
    const duckParam = { value: 1, cancelScheduledValues() {}, setValueAtTime(v) { this.value = v; }, linearRampToValueAtTime(v, t) { this.value = v; duckEvents.push([v, t]); } };
    const duckOwner = { ctx: { currentTime: 4 }, voiceEchoDuck: { gain: duckParam } };
    effects.setVoiceEchoDuck(duckOwner, true);
    assert.deepEqual(duckEvents.at(-1), [effects.ECHO_DUCK.speaking, 4 + effects.ECHO_DUCK.attack]);
    effects.setVoiceEchoDuck(duckOwner, false);
    assert.deepEqual(duckEvents.at(-1), [1, 4 + effects.ECHO_DUCK.release]);
    assert.ok(effects.ECHO_DUCK.speaking > 0.4 && effects.ECHO_DUCK.speaking < 0.8, 'the halo dips under words but never vanishes');
    assert.equal(effects.setVoiceEchoDuck({ ctx: null }, true), undefined, 'no context is a no-op');
    assert.match(app, /audioVoiceEffects\.setVoiceEchoDuck\(this, active\)/, 'every narration clip start and end drives the duck');
}
console.log('Voice echo duck passed: halo ducks under words and blooms in pauses.');
