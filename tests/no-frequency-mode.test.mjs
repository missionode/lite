import assert from 'node:assert/strict';
import fs from 'node:fs';

const app = fs.readFileSync(new URL('../app.js', import.meta.url), 'utf8');
const html = fs.readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const en = JSON.parse(fs.readFileSync(new URL('../locales/en.json', import.meta.url), 'utf8'));
const ml = JSON.parse(fs.readFileSync(new URL('../locales/ml.json', import.meta.url), 'utf8'));

assert.match(html, /id="no-frequency-mode-toggle"/, 'Settings should expose No Frequency Mode');
assert.match(html, /id="mixer-no-frequency-mode-toggle"/, 'the in-session mixer should expose No Frequency Mode');
assert.doesNotMatch(html, /id="frequencies-toggle"|id="mixer-frequencies-toggle"/, 'the former 110 Hz fallback controls should not remain');
assert.match(app, /noFrequencyMode: localStorage\.getItem\('chakra_no_frequency_mode'\) === 'true'/, 'No Frequency Mode should default to off and persist only when enabled');
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
const mantra = method('async playMantraTrack(key)', 'stopMantraTrack()');
const bowlStart = app.indexOf('    playSingingBowl()');
const bowlEnd = app.indexOf('\n}\n\n// Visual Engine', bowlStart);
assert.ok(bowlStart >= 0 && bowlEnd > bowlStart, 'playSingingBowl() must remain readable');
const bowl = app.slice(bowlStart, bowlEnd);

assert.match(drone, /this\.stopDrone\(\);[\s\S]*?if \(state\.noFrequencyMode\) return;/, 'chakra and HRIM drones should stop or skip in No Frequency Mode');
assert.match(sleepDrone, /this\.stopDrone\(\);[\s\S]*?if \(state\.noFrequencyMode\) return;/, 'sleep-stage drones should stop or skip in No Frequency Mode');
assert.match(shot, /if \(state\.noFrequencyMode\)[\s\S]*?frequency-only Shots/, 'frequency-only Shots should be rejected at the audio boundary');
assert.match(mantra, /if \(state\.noFrequencyMode\) return;/, 'mantra tracks should be silent in No Frequency Mode');
assert.match(bowl, /state\.noFrequencyMode/, 'singing-bowl tones should be silent in No Frequency Mode');
assert.match(app, /if \(state\.eyesCloseMode && !state\.noFrequencyMode\)/, 'Eyes Close anchoring should not create a 40 Hz tone in No Frequency Mode');
assert.match(app, /function setNoFrequencyMode\(enabled\)[\s\S]*?meditation\.cancelDroneTimer\(\);[\s\S]*?audio\.stopDrone\(\);[\s\S]*?audio\.stopFrequencyShot\(\);[\s\S]*?audio\.stopMantraTrack\(\);/, 'enabling the setting during a journey should stop active frequency audio');
assert.match(app, /shotsToggle\.disabled = noFrequencyMode/, 'Shots should be unavailable in the Lobby while the setting is active');
assert.match(app, /if \(state\.noFrequencyMode\) \{\s*alert\(t\('ui\.noFrequencyShotsUnavailable'\)\);\s*return;/, 'direct Shot activation should also be rejected');
assert.match(app, /audio\.startBackgroundMusic\(/, 'background music remains part of normal journeys');
assert.match(app, /this\.narrate\(/, 'narration remains part of normal journeys');

for (const locale of [en, ml]) {
    for (const key of ['noFrequencyMode', 'noFrequencyModeNote', 'noFrequencyShotsUnavailable']) {
        assert.ok(locale.ui[key]?.trim(), `locale ui.${key} is required`);
    }
}

console.log('No Frequency Mode contract passed: narration and background music remain while intentional frequency audio is disabled.');
