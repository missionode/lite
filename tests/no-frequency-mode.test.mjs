import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

const app = fs.readFileSync(new URL('../app.js', import.meta.url), 'utf8');
const audioInitialization = fs.readFileSync(new URL('../modules/audio-engine-initialization.js', import.meta.url), 'utf8');
const audioTonePlayback = fs.readFileSync(new URL('../modules/audio-tone-playback.js', import.meta.url), 'utf8');
const audioDroneStart = fs.readFileSync(new URL('../modules/audio-drone-start.js', import.meta.url), 'utf8');
const audioDroneStop = fs.readFileSync(new URL('../modules/audio-drone-stop.js', import.meta.url), 'utf8');
const audioMantraPlayback = fs.readFileSync(new URL('../modules/audio-mantra-playback.js', import.meta.url), 'utf8');
const lobbyVisibility = fs.readFileSync(new URL('../modules/lobby-experience-visibility.js', import.meta.url), 'utf8');
const audioModeView = fs.readFileSync(new URL('../modules/audio-mode-settings-view.js', import.meta.url), 'utf8');
const html = fs.readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const en = JSON.parse(fs.readFileSync(new URL('../locales/en.json', import.meta.url), 'utf8'));
const ml = JSON.parse(fs.readFileSync(new URL('../locales/ml.json', import.meta.url), 'utf8'));

assert.match(html, /id="no-frequency-mode-toggle"/, 'Settings should expose No Frequency Mode');
assert.match(html, /id="mixer-no-frequency-mode-toggle"/, 'the in-session mixer should expose No Frequency Mode');
assert.match(html, /id="no-mantra-mode-toggle"/, 'Settings should expose the independent No Mantra Mode');
assert.match(html, /id="mixer-no-mantra-mode-toggle"/, 'the in-session mixer should expose the independent No Mantra Mode');
assert.doesNotMatch(html, /id="frequencies-toggle"|id="mixer-frequencies-toggle"/, 'the former 110 Hz fallback controls should not remain');
assert.doesNotMatch(app, /state\.chakraFrequencies|chakra_frequencies/, 'the former fallback preference must not control generated audio');

const method = (name, nextName) => {
    const start = app.indexOf(`    ${name}`);
    const end = app.indexOf(`    ${nextName}`, start);
    assert.ok(start >= 0 && end > start, `${name} must remain readable`);
    return app.slice(start, end);
};

const drone = method('startDrone(baseFreq, index = 0)', 'startSleepDrone(beatFrequency)');
const sleepDrone = method('startSleepDrone(beatFrequency)', 'startFrequencyShot(frequency)');
const shot = method('startFrequencyShot(frequency)', 'stopFrequencyShot()');
const stopBinaural = method('stopBinaural()', 'stopDrone()');
const stopDrone = method('stopDrone()', 'async playMantraTrack(key)');
const mantra = audioMantraPlayback;
const bowlStart = app.indexOf('    playSingingBowl()');
const bowlEnd = app.indexOf('\n}\n\n// Meditation Controller', bowlStart);
assert.ok(bowlStart >= 0 && bowlEnd > bowlStart, 'playSingingBowl() must remain readable');
const bowl = app.slice(bowlStart, bowlEnd);

assert.match(audioDroneStart, /function startDrone\(owner, baseFreq, index, state\)[\s\S]*?owner\.stopDrone\(\);\s*if \(state\.noFrequencyMode\) return;/, 'chakra and HRIM drones should stop or skip in No Frequency Mode');
assert.match(audioDroneStart, /function startSleepDrone\(owner, beatFrequency, state\)[\s\S]*?owner\.stopDrone\(\);\s*if \(state\.noFrequencyMode\) return;/, 'sleep-stage drones should stop or skip in No Frequency Mode');
assert.match(audioTonePlayback, /if \(state\.noFrequencyMode\)[\s\S]*?frequency-only Shots/, 'frequency-only Shots should be rejected at the audio boundary');
assert.match(audioDroneStop, /function stopBinaural\(owner\)[\s\S]*?if \(!owner\.ctx\)[\s\S]*?owner\.binauralNodes = \[\];[\s\S]*?return;/, 'stopping binaural audio before Web Audio initialization should be safe');
assert.match(audioDroneStop, /function stopDrone\(owner\)[\s\S]*?if \(!owner\.ctx\)[\s\S]*?owner\.groundingAnchor = null;[\s\S]*?return;/, 'No Frequency Mode should safely stop an uninitialized drone graph');
assert.doesNotMatch(mantra, /if \(state\.noFrequencyMode\) return;/, 'No Frequency Mode must not disable recorded mantra tracks');
assert.match(mantra, /if \(state\.noMantraMode\) return;/, 'mantra tracks should have their own independent disable mode');
assert.match(bowl, /state\.noFrequencyMode/, 'singing-bowl tones should be silent in No Frequency Mode');
assert.match(audioInitialization, /if \(state\.eyesCloseMode && !state\.noFrequencyMode\)/, 'Eyes Close anchoring should not create a 40 Hz tone in No Frequency Mode');
const context = vm.createContext({});
vm.runInContext(audioModeView, context);
const listeners = new Map();
const nodes = new Map(['no-frequency-mode-toggle','mixer-no-frequency-mode-toggle','no-mantra-mode-toggle','mixer-no-mantra-mode-toggle','mood-relaxation-intention-toggle'].map(id => [id, { disabled: false, addEventListener: (_type, fn) => listeners.set(id, fn) }]));
const calls = [];
const modeState = { noFrequencyMode: false, noMantraMode: false, moodRelaxationIntentionEnabled: false, bgMusicMode: false };
const audioDependencies = { stopDrone: () => calls.push('drone'), stopFrequencyShot: () => calls.push('shot'), stopGuidedTransitionTone: () => calls.push('transition'), stopPleasureAmbience: () => calls.push('ambience'), stopMantraTrack: () => calls.push('mantra'), startPleasureAmbience: () => calls.push('ambience-start') };
const view = context.ChakraAudioModeSettingsView.create({
    document: { getElementById: id => nodes.get(id) || null }, state: modeState,
    storage: { setItem: (key, value) => calls.push(`storage:${key}:${value}`) },
    meditation: { cancelDroneTimer: () => calls.push('cancel-timer'), isMeditationActive: true }, audio: audioDependencies,
    syncChecked: (id, value) => calls.push(`sync:${id}:${value}`), syncPleasureAmbienceControl: () => calls.push('ambience-ui'),
    updateExperienceModeVisibility: () => calls.push('visibility'), updateSessionEstimate: () => calls.push('estimate')
});
view.bindPrimaryControls();
listeners.get('no-frequency-mode-toggle')({ target: { checked: true } });
assert.equal(modeState.noFrequencyMode, true);
assert.equal(nodes.get('mood-relaxation-intention-toggle').disabled, true);
for (const expected of ['cancel-timer','drone','shot','transition','ambience']) assert.ok(calls.includes(expected), `No Frequency mode stops ${expected}`);
assert.ok(calls.includes('storage:chakra_no_frequency_mode:true'));
assert.ok(!calls.includes('mantra'), 'No Frequency Mode must leave mantra playback available');
calls.length = 0;
view.bindMixerControls();
listeners.get('mixer-no-mantra-mode-toggle')({ target: { checked: true } });
assert.deepEqual(calls.slice(3, 6), ['cancel-timer', 'drone', 'mantra']);
assert.ok(calls.includes('mantra'), 'No Mantra Mode stops recorded mantra playback');
assert.match(lobbyVisibility, /shotsToggle\.disabled = noFrequencyMode/, 'Shots should be unavailable in the Lobby while the setting is active');
assert.match(app, /if \(state\.noFrequencyMode\) \{\s*alert\(t\('ui\.noFrequencyShotsUnavailable'\)\);\s*return;/, 'direct Shot activation should also be rejected');
assert.match(app, /audio\.startBackgroundMusic\(/, 'background music remains part of normal journeys');
assert.match(app, /this\.narrate\(/, 'narration remains part of normal journeys');

for (const locale of [en, ml]) {
    for (const key of ['noFrequencyMode', 'noFrequencyModeNote', 'noFrequencyShotsUnavailable', 'noMantraMode', 'noMantraModeNote']) {
        assert.ok(locale.ui[key]?.trim(), `locale ui.${key} is required`);
    }
}

console.log('No Frequency Mode contract passed: narration and background music remain while intentional frequency audio is disabled.');
