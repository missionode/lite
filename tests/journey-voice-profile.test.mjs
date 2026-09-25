import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

const source = fs.readFileSync('modules/journey-voice-profile.js', 'utf8');
const app = fs.readFileSync('app.js', 'utf8');
const html = fs.readFileSync('index.html', 'utf8');
const serviceWorker = fs.readFileSync('sw.js', 'utf8');
const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
assert.match(app, /journeyVoiceProfile\.apply\(\{/);
assert.match(app, /isFeminineVoice: !isHighEnergy && isFeminineNarrationVoice\(\)/);
assert.match(html, /modules\/journey-voice-profile\.js\?v=1\.0[\s\S]*?app\.js\?v=4\.08/);
assert.match(serviceWorker, /chakra-v5\.304[\s\S]*?modules\/journey-voice-profile\.js\?v=1\.0/);
assert.equal(packageJson.scripts['test:journey-voice-profile'], 'node tests/journey-voice-profile.test.mjs');

const context = vm.createContext({});
vm.runInContext(source, context);
const owner = context.ChakraJourneyVoiceProfile;
assert.ok(Object.isFrozen(owner));

function run(isHighEnergy, isFeminineVoice) {
    const events = [];
    const state = { musicEcho: 'warm', spatialMode: 'wide' };
    const values = new Map();
    const buttons = ['balanced', 'shringara', 'soft'].map(preset => ({
        dataset: { voicePreset: preset },
        classList: { toggle(name, active) { events.push(['class', preset, name, active]); } }
    }));
    const document = { querySelectorAll(selector) { assert.equal(selector, '[data-voice-preset]'); return buttons; } };
    const audio = {
        setVoiceTuning(warmth, clarity) { events.push(['tuning', warmth, clarity]); },
        setVoiceEcho(echo) { events.push(['echo', echo]); }
    };
    const profile = owner.apply({
        isHighEnergy,
        isFeminineVoice,
        state,
        storage: { setItem(key, value) { values.set(key, String(value)); events.push(['save', key, String(value)]); } },
        syncValue(id, value) { events.push(['sync', id, value]); },
        document,
        audio
    });
    return { profile, state, values, events };
}

for (const [highEnergy, feminine, expected, preset] of [
    [true, true, { clarity: 50, warmth: 50, pace: 1, echo: 'light' }, 'balanced'],
    [false, true, { clarity: 28, warmth: 82, pace: 0.92, echo: 'light' }, 'shringara'],
    [false, false, { clarity: 35, warmth: 65, pace: 0.9, echo: 'spacious' }, 'soft']
]) {
    const result = run(highEnergy, feminine);
    assert.deepEqual(JSON.parse(JSON.stringify(result.profile)), expected);
    assert.equal(result.state.voicePace, expected.pace);
    assert.deepEqual([...result.values.entries()].sort(), [
        ['chakra_voice_clarity', String(expected.clarity)],
        ['chakra_voice_echo', expected.echo],
        ['chakra_voice_pace', String(expected.pace)],
        ['chakra_voice_warmth', String(expected.warmth)]
    ]);
    assert.ok(result.events.some(event => event[0] === 'class' && event[1] === preset && event[3] === true));
    assert.deepEqual(result.events.slice(-2), [['tuning', expected.warmth, expected.clarity], ['echo', expected.echo]]);
}

const optionalAudio = run(false, false);
assert.equal(owner.apply({
    isHighEnergy: false,
    isFeminineVoice: false,
    state: {},
    storage: { setItem() {} },
    syncValue() {},
    document: { querySelectorAll() { return []; } }
}).echo, 'spacious', 'the selected profile still applies when optional audio tuning methods are absent');
assert.throws(() => owner.apply({}), /requires state, storage, UI and document services/);
assert.ok(optionalAudio.events.some(event => event[0] === 'sync' && event[1] === 'mixer-spatial-mode' && event[2] === 'wide'));
console.log('Journey voice profile contract passed: preset selection, persisted values, UI synchronization, audio tuning and validation.');
