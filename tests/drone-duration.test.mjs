import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

const app = fs.readFileSync(new URL('../app.js', import.meta.url), 'utf8');
const html = fs.readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const en = JSON.parse(fs.readFileSync(new URL('../locales/en.json', import.meta.url), 'utf8'));
const ml = JSON.parse(fs.readFileSync(new URL('../locales/ml.json', import.meta.url), 'utf8'));
const scripts = JSON.parse(fs.readFileSync(new URL('../scripts.json', import.meta.url), 'utf8'));

const ratiosMatch = app.match(/const DRONE_DURATION_RATIOS = Object\.freeze\((\{[\s\S]*?\})\);/);
const normalizeMatch = app.match(/function normalizeDroneDurationMode\([\s\S]*?\n\}/);
const durationMatch = app.match(/function getDroneDurationMs\([\s\S]*?\n\}/);
assert.ok(ratiosMatch && normalizeMatch && durationMatch, 'drone duration helpers must remain extractable');

const helpers = vm.runInNewContext(`
    const DRONE_DURATION_RATIOS = Object.freeze(${ratiosMatch[1]});
    const DEFAULT_DRONE_DURATION_MODE = 'beginner';
    ${normalizeMatch[0]}
    ${durationMatch[0]}
    ({ DRONE_DURATION_RATIOS, normalizeDroneDurationMode, getDroneDurationMs });
`);
assert.deepEqual(
    JSON.parse(JSON.stringify(helpers.DRONE_DURATION_RATIOS)),
    { beginner: 0.2, intermediate: 0.5, advanced: 0.7, expert: 1 },
    'the four approved drone duration percentages must remain exact',
);
assert.equal(helpers.getDroneDurationMs(5, 'beginner'), 60_000, 'Beginner should use 20% of five minutes');
assert.equal(helpers.getDroneDurationMs(5, 'intermediate'), 150_000, 'Intermediate should use 50% of five minutes');
assert.equal(helpers.getDroneDurationMs(5, 'advanced'), 210_000, 'Advanced should use 70% of five minutes');
assert.equal(helpers.getDroneDurationMs(5, 'expert'), 300_000, 'Expert should use 100% of five minutes');
assert.equal(helpers.getDroneDurationMs(1, 'beginner'), 12_000, 'the calculation should follow the active core duration');
assert.equal(helpers.normalizeDroneDurationMode('unknown'), 'beginner', 'missing or invalid preferences should safely default to Beginner');

const controlMatch = html.match(/<fieldset id="drone-duration-control"[\s\S]*?<\/fieldset>/);
assert.ok(controlMatch, 'the Lobby should expose the drone duration control');
const modeValues = [...controlMatch[0].matchAll(/name="drone-duration-mode" value="([^"]+)"/g)].map(match => match[1]);
assert.deepEqual(modeValues, ['beginner', 'intermediate', 'advanced', 'expert'], 'the Lobby should show all four modes in order');
assert.match(controlMatch[0], /value="beginner" checked/, 'Beginner should be selected in clean HTML');

for (const locale of [en, ml]) {
    for (const key of ['droneDurationMode', 'droneBeginner', 'droneIntermediate', 'droneAdvanced', 'droneExpert', 'droneDurationHelp', 'droneDurationActive', 'droneDurationActiveHrim']) {
        assert.ok(locale.ui[key]?.trim(), `locale ui.${key} is required`);
    }
}

const startDroneStart = app.indexOf('    startDrone(baseFreq, index = 0)');
const startDroneEnd = app.indexOf('    stopBinaural()', startDroneStart);
const startDrone = app.slice(startDroneStart, startDroneEnd);
assert.match(startDrone, /mainOscillator\.frequency\.setValueAtTime\(droneFreq,/, 'the generated drone should retain its actual main tone');
assert.doesNotMatch(startDrone, /droneFreq\s*\*\s*0\.5|\bf\s*:\s*0\.5/, 'the half-frequency lower oscillator must not return');
assert.match(startDrone, /Number\.isFinite\(requestedFrequency\)/, 'the audio boundary should reject malformed custom frequencies');

const meditationStart = app.indexOf('    async meditateOnChakra(chakra, key)');
const meditationEnd = app.indexOf('    async narrateFeeble(', meditationStart);
const meditationBlock = app.slice(meditationStart, meditationEnd);
assert.ok(
    meditationBlock.indexOf('this.startTimedDrone(') < meditationBlock.indexOf('await this.narrate(localized(chakra'),
    'the timer and drone must start before chakra narration',
);
assert.match(meditationBlock, /key === 'high_energy' \? state\.timeHighEnergy : state\.timePerChakra/, 'normal and HRIM paths should use their active practice durations');
assert.match(app, /if \(!this\.isPaused\) remaining -= step;/, 'pausing the journey should pause the drone timer');
assert.match(app, /generation !== this\.droneTimerGeneration/, 'a stale timer must not stop a later chakra drone');
assert.match(app, /chakra_drone_duration_mode/, 'the selected mode should persist locally');
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

console.log('Drone duration contract passed for four modes, pause-safe timing, and one main oscillator.');
