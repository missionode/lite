(function installAppState(global) {
    'use strict';

    function storedNumber(storage, key, fallback) {
        const storedValue = storage.getItem(key);
        if (storedValue === null || storedValue === '') return fallback;
        const value = Number(storedValue);
        return Number.isFinite(value) ? value : fallback;
    }

    function storedBooleanWithLegacy(storage, key, legacyKey) {
        const storedValue = storage.getItem(key);
        if (storedValue !== null) return storedValue === 'true';
        return legacyKey ? storage.getItem(legacyKey) === 'true' : false;
    }

    function createInitialState({ storage = global.localStorage, helpers, constants }) {
        const get = (key) => storage.getItem(key);
        const number = (key, fallback) => storedNumber(storage, key, fallback);
        const {
            normalizeDroneDurationMode,
            normalizeHrimDroneDurationMode,
            normalizeSleepDroneDurationMode,
            normalizeSpatialMode,
            clampAudioLevel,
            clampPleasureAmbienceGain,
            normalizePleasureAmbienceUrl,
            clampPleasureAmbienceBlurAmount,
            normalizeMeditationVisualEffect
        } = helpers;
        const {
            PLEASURE_AMBIENCE_GAIN,
            PLEASURE_AMBIENCE_URL_STORAGE_KEY,
            PLEASURE_BLUR_DEFAULT_AMOUNT
        } = constants;

        return {
            language: get('chakra_lang') || 'ml',
            displayLanguage: get('chakra_display_language') || 'en',
            voiceName: get('chakra_voice') || 'piper:ml_IN-arjun-medium',
            timePerChakra: parseFloat(get('chakra_time')) || 5.0,
            timeHighEnergy: parseFloat(get('chakra_time_high_energy')) || 5.0,
            droneDurationMode: normalizeDroneDurationMode(get('chakra_drone_duration_mode')),
            hrimDroneDurationMode: normalizeHrimDroneDurationMode(get('chakra_hrim_drone_duration_mode')),
            voices: [],
            volVoice: clampAudioLevel(number('chakra_vol_voice', 0.9), 0.2, 2, 0.9),
            volDrone: clampAudioLevel(number('chakra_vol_drone', 0.05), 0.02, 0.2, 0.05),
            volBell: clampAudioLevel(number('chakra_vol_bell', 0.04), 0.02, 0.12, 0.04),
            volMantra: clampAudioLevel(number('chakra_vol_mantra', 0.35), 0.005, 1, 0.35),
            volMusic: clampAudioLevel(number('chakra_vol_music', 0.20), 0.02, 0.5, 0.20),
            volVisualizationAmbience: clampAudioLevel(number('chakra_vol_visualization_ambience', 0.10), 0.02, 0.5, 0.10),
            visualizationAmbience: get('chakra_visualization_ambience') || 'silence',
            volVideo: clampAudioLevel(number('chakra_vol_video', 0.20), 0.02, 0.5, 0.20),
            pleasureAmbienceGain: clampPleasureAmbienceGain(number('chakra_pleasure_ambience_gain', PLEASURE_AMBIENCE_GAIN)),
            pleasureAmbienceUrl: normalizePleasureAmbienceUrl(get(PLEASURE_AMBIENCE_URL_STORAGE_KEY)),
            pleasureAmbienceBlurAmount: clampPleasureAmbienceBlurAmount(number('chakra_pleasure_ambience_blur_amount', PLEASURE_BLUR_DEFAULT_AMOUNT)),
            pleasureAmbienceIntensity: 'gentle',
            voiceClarity: parseFloat(get('chakra_voice_clarity')) || 50,
            voiceWarmth: parseFloat(get('chakra_voice_warmth')) || 50,
            voicePace: parseFloat(get('chakra_voice_pace')) || 1,
            voiceEcho: get('chakra_voice_echo') || 'light',
            musicEcho: get('chakra_music_echo') || 'light',
            spatialMode: normalizeSpatialMode(get('chakra_spatial_mode')),
            stats: {
                journeys: parseInt(get('chakra_stats_journeys')) || 0,
                time: parseInt(get('chakra_stats_time')) || 0
            },
            selectedChakras: JSON.parse(get('chakra_selected')) || [],
            intention: get('chakra_intention') || '',
            sleepMode: false,
            returningJourney: get('chakra_returning_journey') !== null
                ? get('chakra_returning_journey') === 'true'
                : (parseInt(get('chakra_stats_journeys')) || 0) > 0,
            journeyVideoPreludeEnabled: get('chakra_journey_video_prelude') === 'true',
            audioFilters: get('chakra_audio_filters') === 'true',
            boxBreathingExperienceEnabled: false,
            hooponoponoExperienceEnabled: false,
            yogaExperienceEnabled: false,
            noFrequencyMode: get('chakra_no_frequency_mode') === 'true',
            noMantraMode: get('chakra_no_mantra_mode') === 'true',
            moodRelaxationIntentionEnabled: false,
            pleasureAmbienceBlur: true,
            deityPath: get('chakra_deity_path') || 'none',
            visualEffect: normalizeMeditationVisualEffect(get('chakra_visual_effect')),
            advancedFeaturesUnlocked: false,
            bgMusicMode: false,
            highEnergyEnabled: false,
            sleepExperienceEnabled: false,
            sleepDroneDurationMode: normalizeSleepDroneDurationMode(get('chakra_sleep_drone_duration_mode')),
            eyesCloseMode: get('chakra_eyes_close_mode') === 'true',
            corpsePoseEnabled: get('chakra_corpse_enabled') === 'true',
            brightness: parseFloat(get('chakra_brightness')) || 1.0,
            bathSessionEnabled: get('chakra_bath_enabled') === 'true',
            perinealCareEnabled: storedBooleanWithLegacy(storage, 'chakra_intimate_perineal_care', 'chakra_perineal_care'),
            assistedBathingEnabled: storedBooleanWithLegacy(storage, 'chakra_intimate_assisted_bathing', 'chakra_assisted_bathing'),
            massageEnabled: storedBooleanWithLegacy(storage, 'chakra_intimate_massage', 'chakra_massage'),
            selectedYogaPoses: JSON.parse(get('chakra_yoga_selected')) || ['vrikshasana', 'adho_mukha_svanasana', 'marjaryasana', 'balasana', 'ananda_balasana'],
            timeSleepStage: parseFloat(get('chakra_time_sleep_stage')) || 5.0,
            timeShot: parseInt(get('chakra_time_shot')) || 7,
            timeIcebreaker: parseInt(get('chakra_time_icebreaker')) || 60,
            timeEmergence: parseInt(get('chakra_time_emergence')) || 60,
            timeBreathing: parseInt(get('chakra_time_breathing')) || 8,
            timeCorpse: parseInt(get('chakra_time_corpse')) || 300,
            timeInterval: parseInt(get('chakra_time_interval')) || 10,
            timeYogaPrep: parseInt(get('chakra_time_yoga_prep')) || 60,
            timeYogaPose: parseInt(get('chakra_time_yoga_pose')) || 60,
            timeBath: parseInt(get('chakra_time_bath')) || 600,
            timePerinealCare: parseInt(get('chakra_time_perineal_care')) || 300,
            timeAssistedBathing: parseInt(get('chakra_time_assisted_bathing')) || 600,
            scriptSource: get('chakra_script_source') || 'default',
            customScript: JSON.parse(get('chakra_custom_script')) || null
        };
    }

    global.ChakraAppState = Object.freeze({ createInitialState, storedNumber, storedBooleanWithLegacy });
})(typeof window === 'undefined' ? globalThis : window);
