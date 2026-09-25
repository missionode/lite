import assert from 'node:assert/strict';
import fs from 'node:fs';

const app = fs.readFileSync(new URL('../app.js', import.meta.url), 'utf8');
const audioInitialization = fs.readFileSync(new URL('../modules/audio-engine-initialization.js', import.meta.url), 'utf8');
const audioTonePlayback = fs.readFileSync(new URL('../modules/audio-tone-playback.js', import.meta.url), 'utf8');
const audioDroneStart = fs.readFileSync(new URL('../modules/audio-drone-start.js', import.meta.url), 'utf8');
const audioDroneStop = fs.readFileSync(new URL('../modules/audio-drone-stop.js', import.meta.url), 'utf8');
const audioMantraPlayback = fs.readFileSync(new URL('../modules/audio-mantra-playback.js', import.meta.url), 'utf8');
const lobbyVisibility = fs.readFileSync(new URL('../modules/lobby-experience-visibility.js', import.meta.url), 'utf8');
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
assert.match(app, /function setNoFrequencyMode\(enabled\)[\s\S]*?meditation\.cancelDroneTimer\(\);[\s\S]*?audio\.stopDrone\(\);[\s\S]*?audio\.stopFrequencyShot\(\);/, 'enabling the setting during a journey should stop active frequency audio');
const noFrequencySetter = app.slice(app.indexOf('function setNoFrequencyMode(enabled)'), app.indexOf('function setNoMantraMode(enabled)'));
assert.doesNotMatch(noFrequencySetter, /audio\.stopMantraTrack\(\)/, 'No Frequency Mode must leave mantra playback available');
assert.match(app, /function setNoMantraMode\(enabled\)[\s\S]*?audio\.stopDrone\(\);[\s\S]*?audio\.stopMantraTrack\(\)/, 'No Mantra Mode should stop both mantra and its matching drone');
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
