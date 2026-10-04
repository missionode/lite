import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

const source = fs.readFileSync(new URL('../modules/pitch-mode.js', import.meta.url), 'utf8');
const html = fs.readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const app = fs.readFileSync(new URL('../app.js', import.meta.url), 'utf8');
const sw = fs.readFileSync(new URL('../sw.js', import.meta.url), 'utf8');
const registry = JSON.parse(fs.readFileSync(new URL('../piper-models.json', import.meta.url), 'utf8')).voices;

const context = vm.createContext({ Math, Date, Promise, setTimeout });
vm.runInContext(fs.readFileSync(new URL('../modules/narration-feeling.js', import.meta.url), 'utf8'), context);
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
assert.doesNotMatch(source, /startMantra|startStageDrone|startTimedDrone|startFrequencyShot|meditateOnChakra|playMantra/, 'Pitch Mode never starts mantra, drone or chakra Shot audio');

// One very soft tone per mood, tied to No Frequency Mode.
assert.deepEqual({ ...pitch.MOOD_TONES }, { calm: 639, courage: 396, energy: 528, focus: 852 });
assert.ok(pitch.TONE_LEVEL <= 0.02, 'the mood tone stays at or below a third of the chakra drone level (0.06)');
function mockAudio() {
    const events = [];
    const param = () => ({ value: 0, setValueAtTime(v) { this.value = v; events.push(['set', v]); }, linearRampToValueAtTime(v, t) { this.value = v; events.push(['ramp', v, t]); }, cancelScheduledValues() {} });
    const ctx = {
        currentTime: 0,
        createOscillator() { const o = { type: '', frequency: param(), connect() {}, disconnect() {}, start() { events.push(['start']); }, stop(t) { events.push(['stop', t]); } }; return o; },
        createGain() { return { gain: param(), connect() {}, disconnect() {} }; }
    };
    return { ctx, masterGain: {}, events };
}
const silent = mockAudio();
assert.equal(pitch.startMoodTone(silent, 'calm', { noFrequencyMode: true }), false, 'No Frequency Mode on: no tone');
assert.equal(silent.events.length, 0);
const toned = mockAudio();
assert.equal(pitch.startMoodTone(toned, 'focus', { noFrequencyMode: false }, 10000), true, 'No Frequency Mode off: the mood tone plays');
assert.equal(toned.pitchMoodTone.frequency, 852);
assert.equal(toned.pitchMoodTone.seconds, 10, 'Intermediate: the tone lasts 10 s');
const ramps = toned.events.filter(e => e[0] === 'ramp');
assert.deepEqual(ramps[0], ['ramp', pitch.TONE_LEVEL, 1.5], 'soft fade in');
assert.deepEqual(ramps.at(-1), ['ramp', 0, 10], 'faded out by the end of the Drone Duration window');
assert.ok(toned.events.some(e => e[0] === 'stop' && e[1] <= 10.1), 'the oscillator stops at the end of the window');
// Drone Duration: Beginner 4 s, Intermediate 10 s, Advanced 14 s, Expert 20 s.
for (const [ms, seconds, fade] of [[4000, 4, 1], [10000, 10, 1.5], [14000, 14, 1.5], [20000, 20, 1.5]]) {
    const envelope = pitch.toneEnvelope(ms);
    assert.equal(envelope.seconds, seconds);
    assert.equal(envelope.fade, fade);
    assert.ok(envelope.steadyUntil >= envelope.fade, `${seconds} s has a steady middle`);
}
assert.equal(pitch.toneEnvelope(600000).seconds, 20, 'never longer than the 20 s drone window');
assert.match(app, /toneDurationMs: \(\) => getDroneDurationMs\(0, state\.droneDurationMode\)/, 'the tone follows the standard Drone Duration setting');
assert.match(source, /startMoodTone\(owner\.audio, mood, state, toneDurationMs\(\)\)/);
assert.equal(typeof toned.stopPitchTone, 'function', 'turning No Frequency Mode on can stop it');
toned.stopPitchTone();
assert.equal(toned.pitchMoodTone, null);
assert.ok(toned.events.some(e => e[0] === 'stop'), 'the tone stops');
assert.equal(pitch.startMoodTone(mockAudio(), 'rest', { noFrequencyMode: false }), false, 'unknown moods have no tone');
assert.match(fs.readFileSync(new URL('../modules/audio-mode-settings-view.js', import.meta.url), 'utf8'), /if \(state\.noFrequencyMode\) \{[\s\S]*?audio\.stopPitchTone\?\.\(\);/, 'switching No Frequency Mode on stops the Pitch tone');
assert.match(source, /fadeInBackgroundMusic\(3\);\s*startMoodTone\(owner\.audio, mood, state, toneDurationMs\(\)\);/, 'the tone starts with the music');
assert.match(source, /finally \{\s*stopMoodTone\(owner\.audio, 0\.3\);/, 'the tone always stops when the demo ends');

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
    narrate: async (text, fadeOut, keepSilence, pacing, transition, feeling) => { spoken.push({ text, voice: state.voiceName, pace: state.voicePace, feeling }); clock += 6000; },
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
assert.deepEqual(spoken.map(line => line.feeling), ['warm', 'uplift', 'uplift', 'warm', 'uplift', 'uplift'], 'each Energy line has its feeling');
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
assert.match(sw, /'\.\/modules\/pitch-mode\.js\?v=1\.2'/, 'Pitch Mode works offline');
assert.match(app, /startPitch\(mood\)[\s\S]*?pitchMode\.start\(this, mood,/);

// Every language has every label and full script.
const keys = ['pitchTitle', 'pitchSubtitle', 'pitchInviteTitle', 'pitchInviteText', 'pitchInviteJourney', 'pitchInviteAgain',
    ...Array.from(pitch.MOODS).flatMap(mood => [`pitch_${mood}_label`, `pitch_${mood}_title`, `pitch_${mood}_opening`, `pitch_${mood}_closing`])];
for (const language of ['en', 'ml', 'hi', 'ru', 'ta']) {
    const locale = JSON.parse(fs.readFileSync(new URL(`../locales/${language}.json`, import.meta.url), 'utf8'));
    for (const key of keys) assert.ok(locale.ui[key], `${language} is missing ui.${key}`);
    for (const mood of pitch.MOODS) assert.equal(locale.ui[`pitch_${mood}_steps`]?.length, 4, `${language} ${mood} has four guided steps`);
    // Demos are often done standing: every opening welcomes sitting or standing.
    const posture = { en: [/sit/i, /stand/i], ml: [/ഇരി|ഇരു/, /നിൽ|നിന്/], hi: [/बैठ/, /खड़/], ru: [/[Сс]ид|[Сс]яд/, /[Сс]то|[Вв]ста/], ta: [/அமர/, /நில|நின்/] }[language];
    for (const mood of pitch.MOODS) {
        const opening = locale.ui[`pitch_${mood}_opening`];
        for (const pattern of posture) assert.match(opening, pattern, `${language} ${mood} opening mentions both sitting and standing`);
    }
    assert.doesNotMatch(JSON.stringify(locale.ui.pitch_calm_steps), /ഇരിപ്പിട|இருக்கை/, `${language} Calm does not assume a seat`);
    // Owner: no repeated breathing cues; each mood uses body, senses, movement or thought instead.
    const guided = JSON.stringify(Array.from(pitch.MOODS).flatMap(mood => [...locale.ui[`pitch_${mood}_steps`], locale.ui[`pitch_${mood}_closing`]]));
    assert.doesNotMatch(guided, /breath|ശ്വാസ|ശ്വസി|साँस|вдох|выдох|дыш|மூச்சு|மூச்சை/i, `${language} Pitch steps have no breathing cues`);
    const copy = JSON.stringify(keys.map(key => locale.ui[key]));
    assert.doesNotMatch(copy, /\bheal|\bcure|guarantee/i, `${language} Pitch copy makes no healing claims`);
}

console.log('Pitch Mode passed: four moods, fixed male voices restored after use, guided-only, two-minute timing, public placement and five languages.');
