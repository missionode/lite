import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

const source = fs.readFileSync('modules/app-state.js', 'utf8');
const context = vm.createContext({});
vm.runInContext(source, context);

const storageFrom = entries => {
    const values = new Map(entries);
    return { getItem: key => values.has(key) ? values.get(key) : null };
};
const clamp = (value, min, max, fallback) => Number.isFinite(Number(value)) ? Math.min(max, Math.max(min, Number(value))) : fallback;
const helpers = {
    normalizeDroneDurationMode: value => value || 'beginner',
    normalizeHrimDroneDurationMode: value => value || 'intermediate',
    normalizeSleepDroneDurationMode: value => value || 'intermediate',
    normalizeSpatialMode: value => value || 'off',
    clampAudioLevel: clamp,
    clampPleasureAmbienceGain: value => clamp(value, 0.002, 0.07, 0.003),
    normalizePleasureAmbienceUrl: value => value || '',
    clampPleasureAmbienceBlurAmount: value => clamp(value, 0.1, 0.65, 0.35),
    normalizeMeditationVisualEffect: value => value || 'natural'
};
const constants = {
    PLEASURE_AMBIENCE_GAIN: 0.003,
    PLEASURE_AMBIENCE_URL_STORAGE_KEY: 'chakra_pleasure_ambience_url',
    PLEASURE_BLUR_DEFAULT_AMOUNT: 0.35
};
const create = entries => context.ChakraAppState.createInitialState({ storage: storageFrom(entries), helpers, constants });

const defaults = create([]);
assert.equal(defaults.language, 'ml');
assert.equal(defaults.displayLanguage, 'en');
assert.deepEqual([...defaults.selectedChakras], []);
assert.equal(defaults.volVisualizationAmbience, 0.10);
assert.equal(defaults.volVideo, 0.20);
assert.equal(defaults.pleasureAmbienceGain, 0.003);
assert.equal(defaults.pleasureAmbienceBlurAmount, 0.35);
assert.equal(defaults.pleasureAmbienceIntensity, 'gentle');
assert.equal(defaults.pleasureAmbienceBlur, true);
assert.equal(defaults.musicEcho, 'light');
assert.equal(defaults.spatialMode, 'off');
assert.equal(defaults.noFrequencyMode, false);
assert.equal(defaults.visualEffect, 'natural');
for (const key of ['sleepMode', 'boxBreathingExperienceEnabled', 'hooponoponoExperienceEnabled', 'yogaExperienceEnabled', 'moodRelaxationIntentionEnabled', 'advancedFeaturesUnlocked', 'bgMusicMode', 'highEnergyEnabled', 'sleepExperienceEnabled']) {
    assert.equal(defaults[key], false, `${key} must begin as session-only false`);
}

const restored = create([
    ['chakra_lang', 'ru'],
    ['chakra_display_language', 'hi'],
    ['chakra_selected', '["root","heart"]'],
    ['chakra_vol_visualization_ambience', '0.14'],
    ['chakra_vol_video', '0.32'],
    ['chakra_pleasure_ambience_gain', '0.05'],
    ['chakra_pleasure_ambience_blur_amount', '0.5'],
    ['chakra_music_echo', 'spacious'],
    ['chakra_spatial_mode', 'headphones'],
    ['chakra_no_frequency_mode', 'true'],
    ['chakra_visual_effect', 'aura'],
    ['chakra_journey_video_prelude', 'true'],
    ['chakra_stats_journeys', '2'],
    ['chakra_perineal_care', 'true']
]);
assert.equal(restored.language, 'ru');
assert.equal(restored.displayLanguage, 'hi');
assert.deepEqual([...restored.selectedChakras], ['root', 'heart']);
assert.equal(restored.volVisualizationAmbience, 0.14);
assert.equal(restored.volVideo, 0.32);
assert.equal(restored.pleasureAmbienceGain, 0.05);
assert.equal(restored.pleasureAmbienceBlurAmount, 0.5);
assert.equal(restored.musicEcho, 'spacious');
assert.equal(restored.spatialMode, 'headphones');
assert.equal(restored.noFrequencyMode, true);
assert.equal(restored.visualEffect, 'aura');
assert.equal(restored.journeyVideoPreludeEnabled, true);
assert.equal(restored.returningJourney, true, 'journey history remains the legacy returning default');
assert.equal(restored.perinealCareEnabled, true, 'legacy care preference remains readable');

const explicit = create([
    ['chakra_stats_journeys', '4'],
    ['chakra_returning_journey', 'false'],
    ['chakra_intimate_perineal_care', 'false'],
    ['chakra_perineal_care', 'true']
]);
assert.equal(explicit.returningJourney, false, 'explicit returning preference overrides journey history');
assert.equal(explicit.perinealCareEnabled, false, 'current care preference overrides legacy data');

console.log('Application state contract passed: defaults, persisted preferences, session-only flags and legacy precedence.');
