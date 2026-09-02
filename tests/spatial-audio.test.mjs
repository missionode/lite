import assert from 'node:assert/strict';
import fs from 'node:fs';

const app = fs.readFileSync(new URL('../app.js', import.meta.url), 'utf8');
const html = fs.readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const styles = fs.readFileSync(new URL('../style.css', import.meta.url), 'utf8');
const en = JSON.parse(fs.readFileSync(new URL('../locales/en.json', import.meta.url), 'utf8'));
const ml = JSON.parse(fs.readFileSync(new URL('../locales/ml.json', import.meta.url), 'utf8'));

assert.match(app, /const SPATIAL_MODES = Object\.freeze\(\['off', 'stereo', 'headphones', 'room'\]\)/);
assert.match(app, /const DEFAULT_SPATIAL_MODE = 'off'/, 'Spatial audio must be off by default');
assert.match(app, /function normalizeSpatialMode\(value\)[\s\S]*?DEFAULT_SPATIAL_MODE/);
assert.match(app, /spatialMode: normalizeSpatialMode\(localStorage\.getItem\('chakra_spatial_mode'\)\)/);

for (const id of ['spatial-mode', 'mixer-spatial-mode']) {
    assert.match(html, new RegExp(`id="${id}"`), `${id} should be available`);
    for (const value of ['off', 'stereo', 'headphones', 'room']) {
        assert.match(html, new RegExp(`id="${id}"[\\s\\S]*?value="${value}"`), `${id} should offer ${value}`);
    }
}

for (const locale of [en, ml]) {
    for (const key of ['spatialSound', 'spatialOff', 'spatialStereo', 'spatialHeadphones', 'spatialRoom', 'spatialNote']) {
        assert.ok(locale.ui[key]?.trim(), `locale ui.${key} is required`);
    }
}

assert.match(app, /this\.spatialDronePanner = this\.createSpatialPanner\(\)/);
assert.match(app, /this\.spatialMusicPanner = this\.createSpatialPanner\(\)/);
assert.match(app, /this\.spatialMantraPanner = this\.createSpatialPanner\(\)/);
assert.match(app, /this\.spatialPleasurePanner = this\.createSpatialPanner\(\)/);
assert.match(app, /const PLEASURE_SPATIAL_APPROACH_SECONDS = 45/);
assert.match(app, /this\.spatialPleasurePanner\.rolloffFactor = 0\.55/);
assert.match(app, /schedulePleasureSpatialApproach\(\)[\s\S]*?positionZ\.linearRampToValueAtTime/);
assert.match(app, /pleasure: \{ x: 0, y: 0\.2, z: -7, nearZ: -2\.8 \}/, 'headphone pleasure ambience should approach a closer position');
assert.match(app, /this\.pannerNode\.connect\(this\.spatialDronePanner\)[\s\S]*?this\.spatialDronePanner\.connect\(this\.lowCutFilter\)/);
assert.match(app, /this\.bgMusicBusGain\.connect\(this\.spatialMusicPanner\)[\s\S]*?this\.spatialMusicPanner\.connect\(this\.lowCutFilter\)/);
assert.match(app, /this\.mantraFilter\.connect\(this\.spatialMantraPanner\)[\s\S]*?this\.spatialMantraPanner\.connect\(this\.lowCutFilter\)/);
assert.match(app, /const VOICE_REVERB_TAIL_SECONDS = 4\.5/, 'narration should receive an extended diffuse tail');
assert.match(app, /const MUSIC_REVERB_TAIL_SECONDS = 3\.2/, 'background music should receive an extended diffuse tail');
assert.match(app, /const MANTRA_REVERB_TAIL_SECONDS = 5\.5/, 'mantra should receive a dedicated extended tail');
assert.match(app, /this\.mantraFilter\.connect\(this\.mantraTailConvolver\)[\s\S]*?this\.mantraTailWetGain\.connect\(this\.spatialMantraPanner\)/, 'mantra tail should share the mantra spatial path without touching narration or music');
assert.match(app, /this\.pleasureGain\.connect\(this\.pleasureBlurDryGain\)[\s\S]*?this\.pleasureSpatialDepthGain\.connect\(this\.spatialPleasurePanner\)[\s\S]*?this\.spatialPleasurePanner\.connect\(this\.lowCutFilter\)/);
assert.match(app, /this\.setSpatialPosition\(this\.spatialPleasurePanner, configurations\.pleasure, now\)/);
assert.match(app, /this\.voiceClarityFilter\.connect\(this\.lowCutFilter\)/, 'Narration should remain on its centered path');
assert.doesNotMatch(app, /this\.voiceClarityFilter\.connect\(this\.spatial[A-Za-z]+Panner\)/, 'Narration must not be spatialized');

assert.match(app, /createSpatialPanner\(\)[\s\S]*?if \(this\.ctx\?\.createPanner\)[\s\S]*?return this\.ctx\.createStereoPanner\(\)/, 'Spatial routing needs a stereo fallback');
assert.match(app, /setSpatialMode\(mode = DEFAULT_SPATIAL_MODE\)[\s\S]*?model: 'HRTF'/, 'Headphone mode should use HRTF positioning');
assert.match(app, /setSpatialMode\(mode = DEFAULT_SPATIAL_MODE\)[\s\S]*?model: 'equalpower'/, 'Speaker-safe modes should use equal-power positioning');
assert.match(app, /setSpatialMode\(state\.spatialMode\)/, 'Saved spatial mode should apply when the audio graph initializes');
assert.match(app, /this\.setVoiceEcho\(state\.voiceEcho\)/, 'Spatial mode should apply the narration ambience without changing the saved voice preference');
assert.match(app, /localStorage\.setItem\('chakra_spatial_mode', state\.spatialMode\)/, 'Spatial mode changes should persist');
assert.match(app, /getElementById\('spatial-mode'\)\?\.addEventListener\('change'/);
assert.match(app, /getElementById\('mixer-spatial-mode'\)\?\.addEventListener\('change'/);
assert.match(app, /ethereal: \{ delay: 0\.06, wet: 0\.24, filter: 4600 \}/, 'Spatial Sound should use a diffuse, non-repeating ethereal narration reverb');
assert.match(app, /const effectiveMode = this\.spatialMode !== 'off' \? 'ethereal' : requestedMode/, 'Spatial Sound should apply ethereal ambience only while enabled');
assert.match(html, /id="session-countdown"[\s\S]*?data-session-countdown-progress/, 'The meditation view should expose a circular session countdown');
assert.match(html, /id="session-countdown-right"[\s\S]*?data-session-countdown-progress/, 'The meditation view should expose a mirrored circular session countdown');
assert.match(html, /id="session-countdown-layer"[\s\S]*?id="session-countdown-right"/, 'The countdown should live in a shared layer outside individual screens');
assert.doesNotMatch(html, /id="timer-display"/, 'The legacy text timer should be removed');
assert.doesNotMatch(html, /data-session-countdown-value/, 'The circular countdown should not contain a numeric ticker');
assert.match(app, /startSessionCountdown\(totalMs\)/, 'The meditation controller should start one journey-level countdown');
assert.match(app, /this\.sessionCountdownRemainingMs/, 'The journey countdown should retain continuous remaining time');
assert.match(app, /this\.startSessionCountdown\(this\.getSessionDurationMs\(focusedExperience\)\)/, 'The main journey should initialize its total duration once');
assert.doesNotMatch(app, /setSessionCountdown\(remaining, chantDurationMs\)/, 'The circular countdown must not reset for each chakra');
assert.doesNotMatch(app, /setSessionCountdown\(remaining, activeMs\)/, 'The circular countdown must not reset for each shot stage');
assert.match(styles, /\.session-countdown\s*\{[\s\S]*?position:\s*fixed[\s\S]*?top:\s*max\(1rem, env\(safe-area-inset-top\)\)/, 'The countdown should stay pinned to the upper screen corners');
assert.match(styles, /\.session-countdown\s*\{[\s\S]*?opacity:\s*0\.24/, 'The mirrored countdowns should remain visually subtle');
assert.match(styles, /#session-countdown-layer\s*\{[\s\S]*?z-index:\s*100/, 'The shared countdown layer should remain above meditation content');
assert.match(styles, /#session-overlay #mantra-display\s*\{[\s\S]*?opacity:\s*0\.48/, 'The chakra title should remain visually secondary');
assert.match(styles, /#session-overlay #progress-tracker\s*\{[\s\S]*?opacity:\s*0\.34/, 'The progress dots should remain visually secondary');
assert.match(styles, /#breathing-screen\s*\{[\s\S]*?position:\s*fixed[\s\S]*?height:\s*100dvh/, 'The breathing experience should fill the viewport responsively');
assert.match(styles, /\.tutorial-overlay\s*\{[\s\S]*?position:\s*fixed[\s\S]*?overflow-y:\s*auto/, 'The breathing tutorial should be a full-screen responsive layer');
assert.match(styles, /\.tutorial-overlay::before[\s\S]*?conic-gradient[\s\S]*?animation:\s*liveChakraGradientA/, 'The breathing tutorial should use a live layered gradient');
assert.match(styles, /color-mix\(in srgb, var\(--primary-color\)/, 'The live gradient should follow the active chakra color');
assert.match(en.ui.spatialNote, /ethereal/i, 'English spatial guidance should explain the ethereal narration presence');
assert.match(ml.ui.spatialNote, /അശരീരി/u, 'Malayalam spatial guidance should explain the ethereal narration presence');
assert.ok(en.ui.sessionCountdown?.trim() && en.ui.sessionCountdownLabel?.trim(), 'English countdown labels are required');
assert.ok(ml.ui.sessionCountdown?.trim() && ml.ui.sessionCountdownLabel?.trim(), 'Malayalam countdown labels are required');

console.log('Spatial audio routing contract passed.');
