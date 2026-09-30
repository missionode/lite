import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

const source = fs.readFileSync(new URL('../modules/pitch-mode.js', import.meta.url), 'utf8');
const html = fs.readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const app = fs.readFileSync(new URL('../app.js', import.meta.url), 'utf8');
const sw = fs.readFileSync(new URL('../sw.js', import.meta.url), 'utf8');
const registry = JSON.parse(fs.readFileSync(new URL('../piper-models.json', import.meta.url), 'utf8')).voices;

const context = vm.createContext({ Math, Date, Promise, setTimeout });
vm.runInContext(source, context);
const pitch = context.ChakraPitchMode;
assert.ok(Object.isFrozen(pitch));

// Four public moods, no Rest.
assert.deepEqual(Array.from(pitch.MOODS), ['calm', 'courage', 'energy', 'focus']);

// Fixed young male voice per language; each exists in the registry, is male,
// and is hidden from the Settings voice picker when it is Pitch-only.
assert.deepEqual({ ...pitch.FIXED_VOICES }, {
    en: 'piper:en_US-ryan-medium',
    hi: 'piper:hi_IN-pratham-medium',
    ru: 'piper:ru_RU-dmitri-medium',
    ml: 'piper:ml_IN-arjun-medium',
    ta: 'piper:ta_IN-rasa_male-medium'
});
for (const [language, value] of Object.entries(pitch.FIXED_VOICES)) {
    const voice = registry.find(entry => `piper:${entry.id}` === value);
    assert.ok(voice, `${value} is in piper-models.json`);
    assert.equal(voice.language, language, `${value} speaks ${language}`);
    assert.equal(voice.gender, 'male', `${value} is a male voice`);
}
for (const id of ['en_US-ryan-medium', 'hi_IN-pratham-medium', 'ru_RU-dmitri-medium']) {
    assert.equal(registry.find(entry => entry.id === id).pitchOnly, true, `${id} is reserved for Pitch Mode`);
}
assert.match(app, /const selectablePiperVoices = \(\) => piperVoiceRegistry\.filter\(voice => !voice\.pitchOnly\)/);
assert.match(app, /piperVoices: selectablePiperVoices\(\)/, 'the Settings picker never lists Pitch-only voices');
assert.match(app, /registry: selectablePiperVoices\(\)/, 'automatic voice choice never picks a Pitch-only voice');
assert.equal(pitch.fixedVoiceFor('xx'), 'piper:en_US-ryan-medium', 'unknown languages use the English fixed voice');

// Guided voice only: no mantra, drone, frequency or chakra audio.
assert.doesNotMatch(source, /startMantra|startStageDrone|startTimedDrone|startFrequencyShot|meditateOnChakra|playMantra/, 'Pitch Mode never starts mantra, drone or frequency audio');

// Pause spreading keeps the guide inside two minutes.
assert.equal(pitch.gapBefore({ now: 0, narrationEndsAt: 50000, linesLeft: 5 }), 10000);
assert.equal(pitch.gapBefore({ now: 0, narrationEndsAt: 1000, linesLeft: 5 }), 2500, 'never shorter than 2.5 s');
assert.equal(pitch.gapBefore({ now: 0, narrationEndsAt: 900000, linesLeft: 1 }), 14000, 'never longer than 14 s');
assert.equal(pitch.SESSION_MS, 120000);

// Full run with mocks: fixed voice during the session, restored afterwards,
// no statistics (stop, not finish), invite shown at the end.
function element() {
    const listeners = {};
    return {
        hidden: false, style: {}, listeners,
        classList: { set: new Set(['hidden']), add(name) { this.set.add(name); }, remove(name) { this.set.delete(name); }, contains(name) { return this.set.has(name); } },
        addEventListener(name, fn) { listeners[name] = fn; },
        focus() {}
    };
}
const elements = new Map();
const document = { getElementById: id => { if (!elements.has(id)) elements.set(id, element()); return elements.get(id); } };
const state = { language: 'hi', voiceName: 'piper:hi_IN-priyamvada-medium', voicePace: 0.7 };
const spoken = [];
const configured = [];
let clock = 0;
const owner = {
    isMeditationActive: false, isStarting: false, isShotActive: false,
    audio: { init: async () => {}, startBackgroundMusic: async () => {}, fadeInBackgroundMusic() {} },
    visual: { stop() {} },
    startSessionCountdown(ms) { this.countdown = ms; },
    narrate: async text => { spoken.push({ text, voice: state.voiceName, pace: state.voicePace }); clock += 6000; },
    pauseAwareSleep: async ms => { clock += ms; },
    stop() { this.isMeditationActive = false; this.stopped = (this.stopped || 0) + 1; },
    finish() { throw new Error('Pitch Mode must not record journey statistics'); }
};
const hindi = JSON.parse(fs.readFileSync(new URL('../locales/hi.json', import.meta.url), 'utf8'));
const runner = pitch.create();
let invited = null;
runner.bindInvite({ document, onJourney: () => { invited = 'journey'; }, onAgain: () => { invited = 'again'; } });
const run = runner.start(owner, 'energy', {
    state, document,
    piperTTS: { isSupported: () => true, configure: value => { configured.push(value); return true; }, warmup: async () => {} },
    isPiperVoice: value => String(value).startsWith('piper:'),
    wakeLock: { request: async () => {} },
    showScreen() {}, meditationScreen: {}, setText() {},
    journeyT: key => { const leaf = key.replace(/^ui\./, ''); return hindi.ui[leaf]; },
    setVoiceStatus() {}, t: key => key, logError() {}, now: () => clock
});
await new Promise(resolve => setTimeout(resolve, 0));
for (let tick = 0; tick < 200 && document.getElementById('pitch-invite').classList.contains('hidden'); tick++) {
    await new Promise(resolve => setTimeout(resolve, 0));
}
assert.equal(document.getElementById('pitch-invite').classList.contains('hidden'), false, 'the invite appears after the guide');
assert.equal(state.voiceName, 'piper:hi_IN-priyamvada-medium', 'the Settings voice is restored before the invite');
document.getElementById('pitch-invite-journey').listeners.click();
assert.equal(await run, true);
assert.equal(invited, 'journey');
assert.equal(owner.countdown, 120000, 'the on-screen countdown is two minutes');
assert.equal(owner.stopped, 1, 'the demo ends with stop(), so no statistics are recorded');
assert.equal(spoken.length, 6, 'opening, four steps and closing are spoken');
assert.ok(spoken.every(line => line.voice === 'piper:hi_IN-pratham-medium' && line.pace === 1), 'every line uses the fixed Hindi voice at a fixed pace');
assert.equal(spoken[0].text, hindi.ui.pitch_energy_opening, 'the text follows the selected language');
assert.equal(configured[0], 'piper:hi_IN-pratham-medium');
assert.equal(configured.at(-1), 'piper:hi_IN-priyamvada-medium', 'Piper is switched back to the Settings voice');
assert.equal(state.voicePace, 0.7);

// Placement and availability: public (not dev mode), between Sound Shot and Meditation Room.
const shots = html.indexOf('id="shots-control"');
const panel = html.indexOf('id="pitch-mode-panel"');
const room = html.indexOf('id="lobby-title"');
assert.ok(shots > 0 && panel > shots && room > panel, 'Pitch Mode sits between Sound Shot and Meditation Room');
assert.doesNotMatch(html.slice(panel, html.indexOf('>', panel)), /hidden|disabled/, 'Pitch Mode is visible in normal mode');
for (const mood of pitch.MOODS) assert.match(html, new RegExp(`data-pitch-mood="${mood}"`));
assert.match(html, /id="pitch-invite"[^>]*class="modal hidden"|class="modal hidden"[^>]*id="pitch-invite"/);
assert.match(sw, /'\.\/modules\/pitch-mode\.js\?v=1\.0'/, 'Pitch Mode works offline');
assert.match(app, /startPitch\(mood\)[\s\S]*?pitchMode\.start\(this, mood,/);

// Every language has every label and full script.
const keys = ['pitchTitle', 'pitchSubtitle', 'pitchInviteTitle', 'pitchInviteText', 'pitchInviteJourney', 'pitchInviteAgain',
    ...Array.from(pitch.MOODS).flatMap(mood => [`pitch_${mood}_label`, `pitch_${mood}_title`, `pitch_${mood}_opening`, `pitch_${mood}_closing`])];
for (const language of ['en', 'ml', 'hi', 'ru', 'ta']) {
    const locale = JSON.parse(fs.readFileSync(new URL(`../locales/${language}.json`, import.meta.url), 'utf8'));
    for (const key of keys) assert.ok(locale.ui[key], `${language} is missing ui.${key}`);
    for (const mood of pitch.MOODS) assert.equal(locale.ui[`pitch_${mood}_steps`]?.length, 4, `${language} ${mood} has four guided steps`);
    const copy = JSON.stringify(keys.map(key => locale.ui[key]));
    assert.doesNotMatch(copy, /\bheal|\bcure|guarantee/i, `${language} Pitch copy makes no healing claims`);
}

console.log('Pitch Mode passed: four moods, fixed male voices restored after use, guided-only, two-minute timing, public placement and five languages.');
