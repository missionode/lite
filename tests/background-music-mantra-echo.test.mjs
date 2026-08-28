import assert from 'node:assert/strict';
import fs from 'node:fs';

const app = fs.readFileSync(new URL('../app.js', import.meta.url), 'utf8');
const html = fs.readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const css = fs.readFileSync(new URL('../style.css', import.meta.url), 'utf8');
const serviceWorker = fs.readFileSync(new URL('../sw.js', import.meta.url), 'utf8');
const gitignore = fs.readFileSync(new URL('../.gitignore', import.meta.url), 'utf8');
const pleasureManifest = JSON.parse(fs.readFileSync(new URL('../audio/ambience-manifest.json', import.meta.url), 'utf8'));
const en = JSON.parse(fs.readFileSync(new URL('../locales/en.json', import.meta.url), 'utf8'));
const ml = JSON.parse(fs.readFileSync(new URL('../locales/ml.json', import.meta.url), 'utf8'));
assert.match(gitignore, /audio\/pleasure\.\*/, 'the locally supplied pleasure ambience should not be committed');
assert.match(gitignore, /audio\/pleasure-\*/, 'future pleasure ambience layers should remain local-only regardless of extension');
assert.doesNotMatch(serviceWorker, /audio\/pleasure\.mp3/, 'an optional local-only asset must not break service-worker installation when absent');
assert.match(serviceWorker, /audio\/ambience-manifest\.json/, 'the pleasure asset manifest should be available offline');
assert.deepEqual(pleasureManifest.files, ['pleasure.mp3', 'pleasure-1.ogg'], 'the pleasure manifest should list the current overlay layers');

assert.match(html, /id="music-tuning-panel"/, 'the mixer should expose a separate background-music tuning panel');
assert.match(html, /id="music-echo"/, 'the mixer should expose a separate music echo selector');
assert.match(html, /data-i18n="ui\.musicEcho"/, 'the music echo selector should use localized labels');
assert.match(html, /id="mood-relaxation-ambience-level-control"[^>]*hidden/, 'the ambience level control should be hidden until the ambience is selected');
assert.match(html, /id="mood-relaxation-intention-toggle"/, 'Journey Tuning should expose the ambience toggle');
assert.match(html, /id="pleasure-ambience-blur-toggle"[^>]*checked/, 'pleasure ambience blur should be enabled by default');
assert.match(html, /id="pleasure-ambience-blur-control"[^>]*hidden/, 'pleasure blur should appear only when ambience is selected');
assert.match(html, /id="mood-relaxation-ambience-level"[^>]*min="0\.2"[^>]*max="7\.0"[^>]*step="0\.1"/, 'the ambience level slider should skip the first non-zero step and retain its 7.0% maximum');
const ambienceControl = html.match(/<div id="mood-relaxation-ambience-level-control"[\s\S]*?<\/div>\s*<\/div>/)?.[0] || '';
assert.equal((ambienceControl.match(/class="range-meta"/g) || []).length, 1, 'the ambience control should contain one metadata row');
assert.match(ambienceControl, /range-decrement[\s\S]*range-min[\s\S]*range-current[\s\S]*range-max[\s\S]*range-increment/, 'the ambience metadata row should keep both step buttons inline');
assert.match(app, /const existingMeta = container\.querySelector\(':scope > \.range-meta'\)/, 'range enhancement should reuse an existing metadata row');
assert.match(app, /if \(current\.parentElement !== meta\) meta\.appendChild\(current\)/, 'generated range values should be moved into the metadata row before insertion');
assert.match(app, /if \(input\.id === 'mood-relaxation-ambience-level'\) return `\$\{value\.toFixed\(1\)\}%`/, 'the ambience value should remain a percentage in the shared range row');
assert.match(app, /if \(!minimum\.dataset\.i18n\) minimum\.textContent = input\.min/, 'localized range labels should not be overwritten by range updates');
assert.doesNotMatch(css, /#mood-relaxation-ambience-level-control \.range-meta/, 'the ambience control should use the shared five-column range layout');
assert.match(app, /const PLEASURE_AMBIENCE_MAX_GAIN = 0\.07/, 'the ambience engine should enforce the 7.0% maximum');
assert.match(app, /const PLEASURE_AMBIENCE_CONFIRM_THRESHOLD = 0\.05/, 'the ambience engine should require confirmation above 5.0%');
assert.match(app, /requestedGain > PLEASURE_AMBIENCE_CONFIRM_THRESHOLD[\s\S]*?window\.confirm\(t\('ui\.pleasureAmbienceAboveFiveConfirm'\)\)[\s\S]*?syncPleasureAmbienceControl\(\)[\s\S]*?return;/, 'cancelling the high-level confirmation should restore the previous ambience value');
assert.match(app, /const PLEASURE_AMBIENCE_MIN_GAIN = 0\.002/, 'the ambience engine should skip the first non-zero step');
assert.doesNotMatch(app, /localStorage\.getItem\('chakra_mood_relaxation_intention'\)/, 'the ambience selection must not be restored from local storage');
assert.doesNotMatch(app, /localStorage\.setItem\('chakra_mood_relaxation_intention'/, 'the ambience selection must not be saved to local storage');
assert.match(app, /this\.pleasureLoops\.forEach\(loop => loop\.stop\(Math\.max\(0, fadeTime\)\)\)/, 'all ambience layers should use the same smooth fade');
assert.match(app, /if \(section\) section\.hidden = audioUnavailable/, 'the ambience section should hide when its asset is unavailable');
for (const [id, min] of [['vol-voice', '0\.2'], ['vol-drone', '0\.02'], ['vol-bell', '0\.2'], ['vol-mantra', '0\.1'], ['vol-music', '0\.02']]) {
    assert.match(html, new RegExp(`id="${id}"[^>]*min="${min}"`), `${id} should skip the first non-zero step`);
}
assert.match(css, /\.settings-help-content\s*\{[\s\S]*?max-height:\s*calc\(100vh - 2rem\);[\s\S]*?overflow:\s*hidden;/, 'the Help modal should remain within the viewport');
assert.match(css, /\.settings-help-list\s*\{[\s\S]*?overflow-y:\s*auto;/, 'the Help content should scroll inside the modal');

for (const locale of [en, ml]) {
    for (const key of ['musicTuning', 'musicEcho', 'musicEchoOff', 'musicEchoLight', 'musicEchoSpacious', 'musicEchoNote', 'settingsHelpAudioCredit', 'cc0Details', 'moodRelaxationIntention', 'moodRelaxationIntentionNote', 'pleasureAmbienceBlur', 'pleasureAmbienceBlurNote', 'pleasureAmbienceAboveFiveConfirm']) {
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
assert.match(app, /this\.bgMusicBusGain\.connect\(this\.spatialMusicPanner\)[\s\S]*?this\.spatialMusicPanner\.connect\(this\.lowCutFilter\)/, 'the complete music bus must enter the shared output chain through spatial routing');
assert.match(app, /this\.voiceClarityFilter\.connect\(this\.voiceEchoSend\)/, 'narration echo should remain on the voice-only path');
assert.match(app, /const PLEASURE_AMBIENCE_GAIN = 0\.003/, 'pleasure ambience should use a fixed barely-audible gain');
assert.match(app, /const PLEASURE_AMBIENCE_HARMONIC_MIX = 0\.04/, 'pleasure harmonic enrichment should remain a very low parallel mix');
assert.match(app, /const PLEASURE_AMBIENCE_MANIFEST_URL = 'audio\/ambience-manifest\.json'/, 'pleasure files should be loaded from the folder manifest');
assert.ok(app.includes(".filter(entry => /^pleasure(?:-\\d+)?\\.[^./]+$/i.test(entry))"), 'pleasure layers should support numbered files with any extension');
assert.match(app, /this\.pleasureLoops = \[\]/, 'pleasure ambience should support multiple simultaneous loops');
assert.match(app, /this\.pleasureBuffers = new Map\(\)/, 'pleasure ambience buffers should be tracked per file');
assert.ok(app.includes('[...this.pleasureBuffers.values()].map(buffer =>'), 'all decoded pleasure layers should be overlaid');
assert.match(app, /this\.pleasureSourceGain\.connect\(this\.pleasureGain\)/, 'pleasure ambience should retain its clean path');
assert.match(app, /this\.pleasureSourceGain\.connect\(this\.pleasureEnhancer\)/, 'pleasure ambience should have a dedicated harmonic path');
assert.match(app, /this\.pleasureEnhancer\.oversample = '2x'/, 'pleasure harmonic enrichment should use oversampling for cleaner processing');
assert.match(app, /this\.pleasureEnhancerGain\.connect\(this\.pleasureBlurDryGain\)/, 'pleasure harmonic enrichment should enter the blur mix');
assert.match(app, /this\.pleasureGain\.connect\(this\.pleasureBlurDryGain\)/, 'pleasure ambience should use its own blur mix');
assert.match(app, /this\.pleasureLoops = \[\.\.\.this\.pleasureBuffers\.values\(\)\]\.map\(buffer =>/, 'each listed pleasure file should feed its own loop');
assert.match(app, /async startPleasureAmbience\(\)/, 'the pleasure ambience should have an explicit session start method');
assert.match(app, /await this\.loadPleasureAmbienceBuffers\(\)/, 'the pleasure ambience should load its files from the manifest');
assert.match(app, /if \(this\.pleasureLoops\.some\(loop => loop\.isRunning\)\) \{[\s\S]*?this\.setPleasureAmbienceBlur\(state\.pleasureAmbienceBlur\)[\s\S]*?return true;/, 'an already-running ambience bus should reapply the shared blur profile');
assert.match(app, /this\.pleasureLoops = \[\.\.\.this\.pleasureBuffers\.values\(\)\]\.map\(buffer =>[\s\S]*?this\.setPleasureAmbienceBlur\(state\.pleasureAmbienceBlur\)[\s\S]*?this\.schedulePleasureSpatialApproach\(\)/, 'every manifest layer should use the same blur profile throughout the journey');
assert.doesNotMatch(app, /fetch\('audio\/pleasure\.mp3'\)/, 'individual pleasure filenames should not be hardcoded in the app');
assert.match(app, /catch \(error\) \{[\s\S]*?pleasureAudioAvailable = false[\s\S]*?return false;/, 'a missing pleasure asset must fail soft without stopping the journey');
assert.match(app, /stopPleasureAmbience\(fadeTime = PLEASURE_AMBIENCE_FADE_SECONDS\)/, 'the pleasure ambience should have an explicit stop method');
assert.match(app, /if \(!state\.bgMusicMode\) void this\.audio\.startPleasureAmbience\(\)/, 'guided sessions should start the pleasure ambience without changing Music Only');
assert.match(app, /this\.audio\.stopPleasureAmbience\(\)/, 'session completion and cancellation should stop the pleasure ambience');
assert.match(app, /pleasureAmbienceGain: clampPleasureAmbienceGain\(storedNumber\('chakra_pleasure_ambience_gain', PLEASURE_AMBIENCE_GAIN\)\)/, 'the ambience level should have a bounded saved preference');
assert.match(app, /setPleasureAmbienceGain\(gain\)/, 'the audio engine should expose a smooth ambience level update');
assert.match(app, /this\.pleasureBlurFilter = this\.ctx\.createBiquadFilter\(\)/, 'pleasure ambience should have a dedicated blur filter');
assert.match(app, /this\.pleasureBlurConvolver\.buffer = this\.createImpulseResponse\(0\.9, 4\.5\)/, 'pleasure blur should use gentle diffusion');
assert.match(app, /setPleasureAmbienceBlur\(enabled = true\)/, 'pleasure blur should be independently toggleable');
assert.match(app, /state\.pleasureAmbienceBlur = true/, 'enabling the ambience should restore blur as the default');
assert.match(app, /mood-relaxation-ambience-level'\)\?\.addEventListener\('input'/, 'the ambience level slider should update from user input');

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
assert.match(mantraBlock, /this\.stopMantraTrack\(\{ restoreMusic: false, invalidate: false \}\)/);
assert.match(mantraBlock, /this\.muteBackgroundMusicForMantra\(MANTRA_MUSIC_FADE_SECONDS\)/);
assert.ok(
    mantraBlock.indexOf('this.mantraBuffer[key] = await this.ctx.decodeAudioData(arrayBuffer);') <
    mantraBlock.indexOf('const musicFade = this.muteBackgroundMusicForMantra(MANTRA_MUSIC_FADE_SECONDS);'),
    'music mute should begin after first-use mantra decoding to avoid a loading silence',
);
assert.doesNotMatch(mantraBlock, /bgMusicEQ\.gain\.linearRampToValueAtTime\(-12/, 'mantra muting must not rely on partial EQ ducking');
assert.match(mantraBlock, /this\.restoreBackgroundMusicAfterMantra\(\)/, 'failed mantra loading must release the music mute');
assert.match(mantraBlock, /this\.masterGain\.gain\.linearRampToValueAtTime\(state\.volDrone \* 0\.15/, 'drone ducking should remain separate from music muting');

const stopMantraStart = app.indexOf('    stopMantraTrack({ restoreMusic = true, invalidate = true } = {})');
const stopMantraEnd = app.indexOf('    // New: Studio Reverb Swell', stopMantraStart);
const stopMantraBlock = app.slice(stopMantraStart, stopMantraEnd);
assert.match(stopMantraBlock, /linearRampToValueAtTime\(0, now \+ MANTRA_FADE_SECONDS\)/, 'mantra should fade out smoothly');
assert.match(stopMantraBlock, /setTimeout\(\(\) => \{[\s\S]*?restoreBackgroundMusicAfterMantra\(\)/, 'music should remain muted until the mantra fade completes');
assert.match(app, /const BACKGROUND_MUSIC_STOP_FADE_SECONDS = 5/);
assert.match(app, /const BACKGROUND_MUSIC_ENTRY_FADE_SECONDS = 10/);
assert.match(app, /const BACKGROUND_MUSIC_RESTORE_FADE_SECONDS = 8/);
assert.match(app, /const MANTRA_MUSIC_FADE_SECONDS = 4/, 'music should receive a deliberate handoff fade before mantra playback');
assert.match(app, /const MANTRA_FADE_SECONDS = 4/, 'mantra should use a deliberate fade when stopping');
assert.match(app, /const PIPER_CLIP_FADE_SECONDS = 0\.05/);
assert.match(app, /const NARRATION_MANTRA_FADE_SECONDS = 2/);
assert.match(app, /const PIPER_CANCEL_FADE_SECONDS = 0\.12/);
assert.match(app, /const requestedFadeIn = Number\(callbacks\.fadeInSeconds\)/, 'Piper should keep the normal clip fade-in separate from the transition fade-out');
assert.match(app, /const requestedFadeOut = Number\(callbacks\.fadeOutSeconds\)/, 'Piper should support an explicit final-clip fade-out');
assert.match(app, /cancel\(reason = 'cancelled', \{ immediate = false \} = \{\}\)/, 'Piper cancellation should distinguish graceful and emergency stops');
assert.match(app, /source\.stop\(now \+ fadeSeconds \+ 0\.02\)/, 'graceful Piper cancellation should ramp the clip down before stopping');
assert.match(app, /piperTTS\.cancel\('experiment stopped', \{ immediate: true \}\)/, 'Experiment stop should cancel active narration immediately');
assert.match(app, /piperTTS\.cancel\('journey finished', \{ immediate: true \}\)/, 'completion should cancel any stale narration immediately');
assert.match(app, /piperTTS\.cancel\('journey stopped', \{ immediate: true \}\)/, 'manual stop should cancel any active narration immediately');
assert.match(app, /const musicFade = this\.muteBackgroundMusicForMantra\(MANTRA_MUSIC_FADE_SECONDS\)[\s\S]*?remainingMs[\s\S]*?await new Promise/, 'mantra should wait for the music fade to finish');
assert.match(app, /if \(invalidate\) this\.mantraRequestId \+= 1/, 'stopping should invalidate pending mantra startup');
assert.match(app, /if \(requestId !== this\.mantraRequestId \|\| state\.noMantraMode\) return;/, 'a cancelled handoff must not start the mantra');
assert.match(app, /cancelAndHoldAtTime\(now\)/, 'the music fade should preserve the live gain value without a jump');
assert.match(app, /const fadeDuration = Math\.max\(0, duration\)[\s\S]*?this\.bgMusicBusGain\.gain\.linearRampToValueAtTime\(0, now \+ fadeDuration\)/, 'music mute should fade the complete music bus to silence');
assert.match(app, /restoreBackgroundMusicAfterMantra\(duration = BACKGROUND_MUSIC_RESTORE_FADE_SECONDS\)[\s\S]*?this\.bgMusicBusGain\.gain\.linearRampToValueAtTime\(1, now \+ Math\.max\(0, duration\)\)/, 'music restore should use a smooth bus fade-in');
assert.doesNotMatch(app, /this\.bgMusicLoop\.stop\(0\)/, 'background music must never be restarted with an immediate cut');
assert.match(app, /stopBackgroundMusic\(fadeTime = BACKGROUND_MUSIC_STOP_FADE_SECONDS\)[\s\S]*?this\.bgMusicLoop\.stop\(Math\.max\(0, fadeTime\)\)/, 'background music stops should use a controlled fade');
assert.match(app, /stopMantraTrack\(\{ restoreMusic: false \}\)[\s\S]*?fadeOutBackgroundMusic\(BACKGROUND_MUSIC_STOP_FADE_SECONDS\)[\s\S]*?stopBackgroundMusic\(BACKGROUND_MUSIC_STOP_FADE_SECONDS\)/, 'completion should coordinate mantra and music fades without restoring music');
assert.match(app, /musicEcho: localStorage\.getItem\('chakra_music_echo'\) \|\| 'light'/, 'music echo preference should have a safe default');
assert.match(app, /syncValue\('music-echo', state\.musicEcho\)/, 'the music echo selector should restore its saved value');
assert.match(app, /document\.getElementById\('music-echo'\)\?\.addEventListener\('change'/, 'music echo changes should be persisted independently');
assert.match(app, /if \(state\.noMantraMode\) return;/, 'No Mantra Mode should be independent from No Frequency Mode');
assert.match(app, /if \(state\.noFrequencyMode \|\| state\.noMantraMode\) return;/, 'a chakra drone should not start without its mantra');

console.log('Background music mantra mute and echo contract passed.');
