import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

const app = fs.readFileSync(new URL('../app.js', import.meta.url), 'utf8');
const html = fs.readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const en = JSON.parse(fs.readFileSync(new URL('../locales/en.json', import.meta.url), 'utf8'));
const ml = JSON.parse(fs.readFileSync(new URL('../locales/ml.json', import.meta.url), 'utf8'));
const scripts = JSON.parse(fs.readFileSync(new URL('../scripts.json', import.meta.url), 'utf8'));
const testScripts = JSON.parse(fs.readFileSync(new URL('../test-script.json', import.meta.url), 'utf8'));
const dotScripts = JSON.parse(fs.readFileSync(new URL('../docs/dot.json', import.meta.url), 'utf8'));
const timingConfig = JSON.parse(fs.readFileSync(new URL('../timing-config.json', import.meta.url), 'utf8'));

assert.deepEqual(
    Object.fromEntries(['root', 'sacral', 'solar', 'heart', 'throat', 'thirdeye', 'crown', 'high_energy'].map(key => [key, scripts[key].frequency])),
    { root: 396, sacral: 417, solar: 528, heart: 639, throat: 741, thirdeye: 852, crown: 963, high_energy: 528 },
    'the production chakra and HRIM frequencies must remain the approved JSON values',
);

const ratiosMatch = app.match(/const DRONE_DURATION_RATIOS = Object\.freeze\((\{[\s\S]*?\})\);/);
const referenceMatch = app.match(/const DRONE_REFERENCE_SECONDS = (\d+);/);
const normalizeMatch = app.match(/function normalizeDroneDurationMode\([\s\S]*?\n\}/);
const hrimNormalizeMatch = app.match(/function normalizeHrimDroneDurationMode\([\s\S]*?\n\}/);
const sleepNormalizeMatch = app.match(/function normalizeSleepDroneDurationMode\([\s\S]*?\n\}/);
const durationMatch = app.match(/function getDroneDurationMs\([\s\S]*?\n\}/);
assert.ok(ratiosMatch && referenceMatch && normalizeMatch && hrimNormalizeMatch && sleepNormalizeMatch && durationMatch, 'drone duration helpers must remain extractable');
const shotDurationMatch = app.match(/function getShotDefaultDuration\([\s\S]*?\n\}/);
assert.ok(shotDurationMatch, 'the per-type Shot duration helper must remain extractable');

const helpers = vm.runInNewContext(`
    const DRONE_DURATION_RATIOS = Object.freeze(${ratiosMatch[1]});
    const DRONE_REFERENCE_SECONDS = ${referenceMatch[1]};
    const DEFAULT_DRONE_DURATION_MODE = 'beginner';
    const DEFAULT_HRIM_DRONE_DURATION_MODE = 'intermediate';
    const DEFAULT_SLEEP_DRONE_DURATION_MODE = 'intermediate';
    ${normalizeMatch[0]}
    ${hrimNormalizeMatch[0]}
    ${sleepNormalizeMatch[0]}
    ${durationMatch[0]}
    ({ DRONE_DURATION_RATIOS, DRONE_REFERENCE_SECONDS, normalizeDroneDurationMode, normalizeHrimDroneDurationMode, normalizeSleepDroneDurationMode, getDroneDurationMs });
`);
assert.deepEqual(
    JSON.parse(JSON.stringify(helpers.DRONE_DURATION_RATIOS)),
    { beginner: 0.2, intermediate: 0.5, advanced: 0.7, expert: 1 },
    'the four approved drone duration percentages must remain exact',
);
assert.equal(helpers.DRONE_REFERENCE_SECONDS, 20, 'drone exposure should use a fixed 20-second reference');
assert.equal(helpers.getDroneDurationMs(5, 'beginner'), 4_000, 'Beginner should use 20% of the fixed 20-second reference');
assert.equal(helpers.getDroneDurationMs(5, 'intermediate'), 10_000, 'Intermediate should use 50% of the fixed 20-second reference');
assert.equal(helpers.getDroneDurationMs(5, 'advanced'), 14_000, 'Advanced should use 70% of the fixed 20-second reference');
assert.equal(helpers.getDroneDurationMs(5, 'expert'), 20_000, 'Expert should use 100% of the fixed 20-second reference');
assert.equal(helpers.getDroneDurationMs(1, 'expert'), 20_000, 'core practice duration must not change drone exposure');
assert.equal(helpers.getDroneDurationMs(30, 'expert'), 20_000, 'long HRIM duration must not extend drone exposure');
assert.equal(helpers.normalizeDroneDurationMode('unknown'), 'beginner', 'missing or invalid preferences should safely default to Beginner');
assert.equal(helpers.normalizeHrimDroneDurationMode('beginner'), 'intermediate', 'HRIM must not allow Beginner mode');
assert.equal(helpers.normalizeHrimDroneDurationMode('unknown'), 'intermediate', 'HRIM must default to Intermediate');
assert.equal(helpers.normalizeHrimDroneDurationMode('advanced'), 'advanced', 'HRIM may use Advanced mode');
assert.equal(helpers.normalizeSleepDroneDurationMode('unknown'), 'intermediate', 'Sleep Mode should default to Intermediate');
assert.equal(helpers.normalizeSleepDroneDurationMode('beginner'), 'beginner', 'Sleep Mode may use Beginner when selected');

const shotHelpers = vm.runInNewContext(`
    const MULTI_STAGE_SHOT_TYPES = Object.freeze(['meditation', 'sleep']);
    const timingConfig = { journey: { shotDuration: { default: 7, singleFrequencyDefault: 1, min: 1, max: 20 } } };
    ${shotDurationMatch[0]}
    ({ getShotDefaultDuration });
`);
assert.equal(shotHelpers.getShotDefaultDuration('meditation'), 7, 'Meditation Shot should default to seven seconds');
assert.equal(shotHelpers.getShotDefaultDuration('sleep'), 7, 'Sleep Shot should default to seven seconds');
for (const type of ['high_energy', 'anesthetic', 'mood_relaxation', 'custom']) {
    assert.equal(shotHelpers.getShotDefaultDuration(type), 1, `${type} should default to one second`);
}

assert.deepEqual(scripts.sleep_mode.stages.map(stage => ({ key: stage.key, frequency: stage.frequency })), [
    { key: 'drowsiness', frequency: 10 },
    { key: 'lightSleep', frequency: 6 },
    { key: 'trueSleep', frequency: 5 },
    { key: 'deepSleep', frequency: 2 },
    { key: 'remRest', frequency: 6 },
], 'Sleep Mode should retain its five script-defined frequency targets');
assert.equal(scripts.sleep_mode.intervalSeconds, 2, 'Sleep Mode stage intervals should remain script-defined');
assert.equal(timingConfig.journey.shotDuration.default, 7, 'Shots should default to seven seconds');
assert.equal(timingConfig.journey.shotDuration.singleFrequencyDefault, 1, 'Single-frequency Shots should default to one second');
assert.equal(timingConfig.journey.shotDuration.max, 20, 'Shots should cap at twenty seconds');
for (const bundle of [scripts, testScripts, dotScripts]) {
    assert.equal(bundle.sound_shots?.anesthetic?.frequency, 174, 'every script bundle should provide the Anesthetic Shot at 174 Hz');
    assert.equal(bundle.sound_shots?.mood_relaxation?.frequency, 221.23, 'every script bundle should provide the Mood & Relaxation Shot at 221.23 Hz');
}

const controlMatch = html.match(/<fieldset id="drone-duration-control"[\s\S]*?<\/fieldset>/);
assert.ok(controlMatch, 'the Lobby should expose the drone duration control');
const modeValues = [...controlMatch[0].matchAll(/name="drone-duration-mode" value="([^"]+)"/g)].map(match => match[1]);
assert.deepEqual(modeValues, ['beginner', 'intermediate', 'advanced', 'expert'], 'the Lobby should show all four modes in order');
assert.match(controlMatch[0], /value="beginner" checked/, 'Beginner should be selected in clean HTML');
assert.match(html, /id="sleep-mode-toggle"/, 'the Lobby should expose Sleep Mode as an Experience Mode');
assert.match(html, /id="drone-duration-sleep-note"/, 'the Lobby should explain Sleep Mode drone behavior');
assert.match(html, /id="shots-toggle"/, 'the Lobby should expose the session-only Shots toggle');
assert.match(html, /id="shot-frequency-input"/, 'the Lobby should expose a custom shot frequency input');
assert.match(html, /option value="anesthetic"[^>]*data-i18n="ui\.anestheticShot"/, 'the Shot selector should offer the Anesthetic Shot');
assert.match(html, /option value="mood_relaxation"[^>]*data-i18n="ui\.moodRelaxationShot"/, 'the Shot selector should offer the Mood & Relaxation Shot');
assert.match(html, /id="mood-relaxation-intention-toggle"/, 'Settings should expose the session-only intention tone toggle');
assert.ok(
    html.indexOf('id="sound-healing-title"') < html.indexOf('id="shots-control"') &&
    html.indexOf('id="shots-control"') < html.indexOf('id="lobby-title"'),
    'the Lobby should present Sound Shot, then Shots, then Meditation Room',
);
assert.match(app, /meditationRoomTitle\.hidden = shots/, 'Shots should hide the Meditation Room heading');
assert.match(app, /MULTI_STAGE_SHOT_TYPES = Object\.freeze\(\['meditation', 'sleep'\]\)/, 'Meditation and Sleep should retain the multi-stage duration default');
assert.match(app, /resetShotDurationForType\(event\.target\.value\)/, 'changing Shot type should apply that type\'s duration default');
assert.match(app, /anesthetic: Number\(this\.scripts\.sound_shots\?\.anesthetic\?\.frequency\)/, 'Anesthetic Shot should load 174 Hz from the active script bundle');
assert.match(app, /mood_relaxation: Number\(this\.scripts\.sound_shots\?\.mood_relaxation\?\.frequency\)/, 'Mood & Relaxation Shot should load 221.23 Hz from the active script bundle');
assert.match(app, /mood_relaxation: 'ui\.activateMoodRelaxationShot'/, 'the Mood & Relaxation Shot should have a localized activation label');
assert.match(app, /moodRelaxationShotNote/, 'the Mood & Relaxation Shot should explain its evidence limits in the Lobby');
assert.doesNotMatch(app, /localStorage\.(?:getItem|setItem)\(['"](?:chakra_)?shot_type['"]\)/, 'the selected Shot type must remain session-only');
assert.match(app, /if \(!state\.moodRelaxationIntentionEnabled \|\| state\.noFrequencyMode\) return false;/, 'the intention tone must require explicit activation and respect No Frequency Mode');
assert.match(app, /getDroneDurationMs\(practiceMinutes, durationMode\)/, 'the intention tone must use the active drone-duration timing');
assert.match(app, /narrateIntentionWithFrequency\(intentionText/, 'the intention narration must be the activation point for the optional tone');
assert.match(app, /moodRelaxationIntentionEnabled: localStorage\.getItem\('chakra_mood_relaxation_intention'\) === 'true'/, 'the intention tone choice should be restored from local storage');
assert.match(app, /localStorage\.setItem\('chakra_mood_relaxation_intention', state\.moodRelaxationIntentionEnabled\)/, 'the intention tone choice should be saved to local storage');
assert.match(app, /startFrequencyShot\(frequency\)/, 'Shots should use a dedicated frequency-only oscillator');
assert.match(app, /stopBackgroundMusic\(\);[\s\S]{0,100}stopMantraTrack\(\);/, 'Shots should stop music and mantra before activation');
assert.match(app, /shotToggle\) shotToggle\.disabled = true/, 'Shots should remain disabled after activation');
assert.match(app, /finishShot\(\)[\s\S]*shotToggle\.disabled = true[\s\S]*window\.location\.reload\(\)/, 'Successful Shots should disable controls and reload the page');
assert.match(app, /if \(!window\.confirm\(t\('ui\.shotConfirm'\)\)\)/, 'Shots should confirm when the toggle is enabled');
assert.doesNotMatch(app.slice(app.indexOf('async runShot('), app.indexOf('finishShot()')), /window\.confirm/, 'Shot start should not prompt a second time');
assert.match(app, /ui\.sleepStage\$\{stage\.key\[0\]\.toUpperCase\(\)\}/, 'Sleep Shot status labels should use localized sleep-stage values');
assert.doesNotMatch(app, /t\(`ui\.\$\{stage\.key === 'thirdeye'/, 'Shot status labels must not expose raw ui paths for Sleep stages');
assert.match(app, /startSleepDrone\(beatFrequency\)/, 'Sleep Mode should use a dedicated binaural sleep drone');
assert.match(app, /await this\.audio\.startBackgroundMusic\(\)/, 'Sleep Mode should start continuous background music');
assert.match(app, /normalizeSleepStages\(this\.scripts\)/, 'Sleep Mode should load its staged frequencies from the script bundle');
assert.match(app, /mainOscillator\.frequency\.setValueAtTime\(beat, now\)/, 'Sleep Mode should play low script frequencies as the main oscillator');
assert.match(app, /this\.startTimedDrone\(136\.1, 3, state\.timeYogaPose, state\.droneDurationMode\)/, 'Yoga grounding drone should use the fixed exposure timer');
assert.doesNotMatch(app, /this\.audio\.startDrone\(136\.1, 3\)/, 'Yoga must not start an unbounded grounding drone');
assert.match(app, /state\.timeSleepStage \* SLEEP_STAGE_COUNT/, 'Sleep Mode should estimate one common duration across five stages');
assert.equal(timingConfig.journey.sleepStageDuration.max, 10, 'Sleep Mode should cap the shared stage duration at 10 minutes');
for (const key of ['chakra_bg_music_mode', 'chakra_high_energy', 'chakra_sleep_experience']) {
    assert.doesNotMatch(app, new RegExp(`localStorage\\.getItem\\(['"]${key}['"]\\)`), `${key} must not restore an Experience Mode selection`);
    assert.doesNotMatch(app, new RegExp(`localStorage\\.setItem\\(['"]${key}['"]`), `${key} must not persist an Experience Mode selection`);
}

for (const locale of [en, ml]) {
    for (const key of ['droneDurationMode', 'droneBeginner', 'droneIntermediate', 'droneAdvanced', 'droneExpert', 'droneDurationHelp', 'droneDurationHrimNote', 'droneDurationSleepNote', 'droneDurationActive', 'droneDurationActiveHrim', 'droneDurationActiveSleep', 'sleepModeIntro', 'sleepStageGuidance', 'sleepStageDrowsiness', 'sleepStageLightSleep', 'sleepStageTrueSleep', 'sleepStageDeepSleep', 'sleepStageRemRest', 'shotsMode', 'soundHealing', 'shotType', 'meditationShot', 'highEnergyShot', 'anestheticShot', 'moodRelaxationShot', 'sleepShot', 'customShot', 'shotFrequency', 'shotDuration', 'shotsHelp', 'moodRelaxationShotNote', 'moodRelaxationIntention', 'moodRelaxationIntentionNote', 'activateMeditationShot', 'activateHighEnergyShot', 'activateAnestheticShot', 'activateMoodRelaxationShot', 'activateSleepShot', 'beginCustomShot', 'shotConfirm', 'shotInvalidFrequency', 'noFrequencyMode', 'noFrequencyModeNote', 'noFrequencyShotsUnavailable']) {
        assert.ok(locale.ui[key]?.trim(), `locale ui.${key} is required`);
    }
}
assert.match(en.ui.shotConfirm, /disconnect any Bluetooth or external speaker/i, 'the English Shot confirmation should instruct the guide to disconnect external audio');
assert.match(en.ui.shotConfirm, /Lite cannot disconnect it for you/i, 'the English Shot confirmation should not imply the PWA can control Bluetooth');
assert.match(ml.ui.shotConfirm, /ബ്ലൂടൂത്ത് അല്ലെങ്കിൽ മറ്റേതെങ്കിലും പുറം സ്പീക്കർ വിച്ഛേദിക്കൂ/, 'the Malayalam Shot confirmation should instruct the guide to disconnect external audio');
assert.match(ml.ui.shotConfirm, /Lite-ന് അത് നിങ്ങൾക്കു പകരം വിച്ഛേദിക്കാനാകില്ല/, 'the Malayalam Shot confirmation should not imply the PWA can control Bluetooth');

const startDroneStart = app.indexOf('    startDrone(baseFreq, index = 0)');
const startDroneEnd = app.indexOf('    stopBinaural()', startDroneStart);
const startDrone = app.slice(startDroneStart, startDroneEnd);
assert.match(startDrone, /mainOscillator\.frequency\.setValueAtTime\(droneFreq,/, 'the generated drone should retain its actual main tone');
assert.match(startDrone, /const droneFreq = safeBaseFrequency;/, 'the main drone should use the validated JSON frequency directly');
assert.doesNotMatch(startDrone, /safeBaseFrequency\s*\/\s*[24]/, 'higher chakra frequencies must not be octave-lowered');
assert.doesNotMatch(startDrone, /droneFreq\s*\*\s*0\.5|\bf\s*:\s*0\.5/, 'the half-frequency lower oscillator must not return');
assert.match(startDrone, /Number\.isFinite\(requestedFrequency\)/, 'the audio boundary should reject malformed custom frequencies');

const meditationStart = app.indexOf('    async meditateOnChakra(chakra, key)');
const meditationEnd = app.indexOf('    async narrateFeeble(', meditationStart);
const meditationBlock = app.slice(meditationStart, meditationEnd);
assert.match(meditationBlock, /this\.startTimedDrone\(chakra\.frequency,/, 'the stage must pass its JSON frequency into the drone engine');
assert.match(meditationBlock, /key === 'high_energy' \? state\.hrimDroneDurationMode : state\.droneDurationMode/, 'HRIM and normal chakra stages must use separate duration preferences');
assert.ok(
    meditationBlock.indexOf('await this.narrate(localized(chakra') < meditationBlock.indexOf('await this.audio.playMantraTrack(key)') &&
    meditationBlock.indexOf('await this.audio.playMantraTrack(key)') < meditationBlock.indexOf('this.startTimedDrone('),
    'the narration must finish and mantra playback must start before the drone',
);
assert.match(meditationBlock, /if \(!state\.noMantraMode && this\.audio\.mantraLoop\) \{[\s\S]*?this\.startTimedDrone\(/, 'the drone must be conditional on active mantra playback');
assert.match(meditationBlock, /key === 'high_energy' \? state\.timeHighEnergy : state\.timePerChakra/, 'normal and HRIM paths should use their active practice durations');
assert.match(app, /if \(!this\.isPaused\) remaining -= step;/, 'pausing the journey should pause the drone timer');
assert.match(app, /generation !== this\.droneTimerGeneration/, 'a stale timer must not stop a later chakra drone');
assert.match(app, /chakra_drone_duration_mode/, 'the selected mode should persist locally');
assert.match(app, /chakra_hrim_drone_duration_mode/, 'the HRIM mode should persist separately');
assert.match(app, /input\.disabled = highEnergy && input\.value === 'beginner'/, 'Beginner must be disabled in the HRIM UI');
assert.match(app, /'high_energy\.frequency'/, 'HRIM custom scripts should require a frequency');
assert.match(app, /frequency < 1 \|\| frequency > 20000/, 'custom frequency values should remain in the safe Web Audio range');

const validationStart = app.indexOf('function getScriptPath(');
const validationEnd = app.indexOf('let piperVoiceRegistry', validationStart);
const validation = vm.runInNewContext(`
    let languageRegistry = [];
    ${app.slice(validationStart, validationEnd)}
    ({ validateScriptBundle });
`);
assert.equal(
    validation.validateScriptBundle(scripts, { languages: ['ml', 'en'], highEnergy: true }).valid,
    true,
    'the production content should satisfy the strengthened frequency contract',
);
const missingHrimFrequency = structuredClone(scripts);
delete missingHrimFrequency.high_energy.frequency;
assert.equal(
    validation.validateScriptBundle(missingHrimFrequency, { languages: ['ml', 'en'], highEnergy: true }).valid,
    false,
    'HRIM should fail validation without its drone frequency',
);
const invalidRootFrequency = structuredClone(scripts);
invalidRootFrequency.root.frequency = 0;
assert.equal(
    validation.validateScriptBundle(invalidRootFrequency, { languages: ['ml', 'en'] }).valid,
    false,
    'an invalid custom frequency should be rejected before Web Audio initialization',
);

console.log('Drone duration contract passed with exact JSON pitches, four modes, pause-safe timing, and one main oscillator.');
