import assert from 'node:assert/strict';
import fs from 'node:fs';

const app = fs.readFileSync(new URL('../app.js', import.meta.url), 'utf8');
const html = fs.readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const en = JSON.parse(fs.readFileSync(new URL('../locales/en.json', import.meta.url), 'utf8'));
const ml = JSON.parse(fs.readFileSync(new URL('../locales/ml.json', import.meta.url), 'utf8'));

assert.match(html, /id="music-tuning-panel"/, 'the mixer should expose a separate background-music tuning panel');
assert.match(html, /id="music-echo"/, 'the mixer should expose a separate music echo selector');
assert.match(html, /data-i18n="ui\.musicEcho"/, 'the music echo selector should use localized labels');

for (const locale of [en, ml]) {
    for (const key of ['musicTuning', 'musicEcho', 'musicEchoOff', 'musicEchoLight', 'musicEchoSpacious', 'musicEchoNote']) {
        assert.ok(locale.ui[key]?.trim(), `locale ui.${key} is required`);
    }
}

assert.match(app, /musicEchoSend = null/);
assert.match(app, /musicEchoDelay = null/);
assert.match(app, /musicEchoConvolver = null/);
assert.match(app, /musicEchoWetGain = null/);
assert.match(app, /bgMusicBusGain = null/);
assert.match(app, /this\.bgMusicGain\.connect\(this\.musicEchoSend\)/, 'music echo must receive background music only');
assert.match(app, /this\.musicEchoWetGain\.connect\(this\.bgMusicBusGain\)/, 'music echo must return to the music-only bus');
assert.match(app, /this\.bgMusicBusGain\.connect\(this\.lowCutFilter\)/, 'the complete music bus must enter the shared output chain');
assert.match(app, /this\.voiceClarityFilter\.connect\(this\.voiceEchoSend\)/, 'narration echo should remain on the voice-only path');

const setMusicEchoStart = app.indexOf('    setMusicEcho(mode = \'light\')');
const setMusicEchoEnd = app.indexOf('\n    toggleEyesCloseMode(', setMusicEchoStart);
assert.ok(setMusicEchoStart >= 0 && setMusicEchoEnd > setMusicEchoStart, 'setMusicEcho() must remain readable');
const setMusicEcho = app.slice(setMusicEchoStart, setMusicEchoEnd);
assert.match(setMusicEcho, /off: \{ delay: 0\.06, wet: 0 \}/);
assert.match(setMusicEcho, /light: \{ delay: 0\.055, wet: 0\.10 \}/);
assert.match(setMusicEcho, /spacious: \{ delay: 0\.09, wet: 0\.15 \}/);
assert.match(setMusicEcho, /musicEchoSend\.gain\.linearRampToValueAtTime/);
assert.match(setMusicEcho, /musicEchoWetGain\.gain\.linearRampToValueAtTime/);

const mantraStart = app.indexOf('    async playMantraTrack(key)');
const mantraEnd = app.indexOf('    // New: Studio Reverb Swell', mantraStart);
assert.ok(mantraStart >= 0 && mantraEnd > mantraStart, 'mantra audio methods must remain readable');
const mantraBlock = app.slice(mantraStart, mantraEnd);
assert.match(mantraBlock, /this\.stopMantraTrack\(\{ restoreMusic: false \}\)/);
assert.match(mantraBlock, /this\.muteBackgroundMusicForMantra\(MANTRA_MUSIC_FADE_SECONDS\)/);
assert.doesNotMatch(mantraBlock, /bgMusicEQ\.gain\.linearRampToValueAtTime\(-12/, 'mantra muting must not rely on partial EQ ducking');
assert.match(mantraBlock, /this\.restoreBackgroundMusicAfterMantra\(\)/, 'failed mantra loading must release the music mute');
assert.match(mantraBlock, /this\.masterGain\.gain\.linearRampToValueAtTime\(state\.volDrone \* 0\.15/, 'drone ducking should remain separate from music muting');

const stopMantraStart = app.indexOf('    stopMantraTrack({ restoreMusic = true } = {})');
const stopMantraEnd = app.indexOf('    // New: Studio Reverb Swell', stopMantraStart);
const stopMantraBlock = app.slice(stopMantraStart, stopMantraEnd);
assert.match(stopMantraBlock, /linearRampToValueAtTime\(0, now \+ MANTRA_FADE_SECONDS\)/, 'mantra should fade out smoothly');
assert.match(stopMantraBlock, /setTimeout\(\(\) => \{[\s\S]*?restoreBackgroundMusicAfterMantra\(\)/, 'music should remain muted until the mantra fade completes');
assert.match(app, /this\.bgMusicBusGain\.gain\.linearRampToValueAtTime\(0, now \+ Math\.max\(0, duration\)\)/, 'music mute should fade the complete music bus to silence');
assert.match(app, /this\.bgMusicBusGain\.gain\.linearRampToValueAtTime\(1, now \+ Math\.max\(0, duration\)\)/, 'music restore should use a smooth bus fade-in');
assert.match(app, /musicEcho: localStorage\.getItem\('chakra_music_echo'\) \|\| 'light'/, 'music echo preference should have a safe default');
assert.match(app, /syncValue\('music-echo', state\.musicEcho\)/, 'the music echo selector should restore its saved value');
assert.match(app, /document\.getElementById\('music-echo'\)\?\.addEventListener\('change'/, 'music echo changes should be persisted independently');
assert.match(app, /if \(state\.noMantraMode\) return;/, 'No Mantra Mode should be independent from No Frequency Mode');
assert.match(app, /if \(state\.noFrequencyMode \|\| state\.noMantraMode\) return;/, 'a chakra drone should not start without its mantra');

console.log('Background music mantra mute and echo contract passed.');
