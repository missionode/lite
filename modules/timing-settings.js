(function installTimingSettings(global) {
    'use strict';

    const FALLBACKS = Object.freeze({
        'transitions.initialSettle': 2,
        'transitions.openingPause': 1,
        'transitions.postBreathing': 3,
        'transitions.breathingPreparation': 5,
        'transitions.breathingTutorialFade': 1,
        'transitions.breathingCompletion': 5,
        'transitions.corpseTransitionAt': 60,
        'transitions.corpseFinalSettle': 3,
        'transitions.bathToYogaRest': 900,
        'transitions.yogaPoseGap': 5,
        'transitions.yogaFinalSettle': 5,
        'transitions.chakraPostMantra': 4,
        'transitions.chakraLeadOut': 15,
        'transitions.intervalPreparation': 2,
        'transitions.closingFirstPause': 2,
        'transitions.closingSecondPause': 3,
        'transitions.hooponoponoIntroPause': 2,
        'transitions.hooponoponoPhrasePause': 2,
        'transitions.hooponoponoFinalRest': 15,
        'transitions.finalSilence': 60,
        'narration.piperLeadIn': 1.2,
        'narration.sentenceGap': 1.5,
        'narration.exitGap': 2,
        'narration.fadeOutPause': 2.5,
        'narration.browserSafetyPerCharacter': 200,
        'narration.browserSafetyBuffer': 3000,
        'estimate.baseOverhead': 5,
        'estimate.normalExtra': 7,
        'estimate.highEnergyExtra': 3,
        'estimate.boxBreathingOverhead': 4,
        'estimate.hooponoponoOverhead': 3,
        'estimate.chakraStageOverhead': 2,
        'estimate.yogaPoseTransitionEstimate': 15
    });

    const CONTROL_KEYS = Object.freeze({
        'time-per-chakra': 'timePerChakra',
        'time-high-energy': 'timeHighEnergy',
        'time-icebreaker': 'icebreaker',
        'time-emergence': 'emergence',
        'time-breathing': 'breathingStep',
        'time-corpse': 'corpsePose',
        'time-interval': 'interval',
        'time-yoga-prep': 'yogaPreparation',
        'time-yoga-pose': 'yogaPose',
        'time-bath': 'bath',
        'time-perineal-care': 'perinealCare',
        'time-assisted-bathing': 'assistedBathing'
    });

    const STATE_DEFAULTS = Object.freeze({
        timePerChakra: ['chakra_time', 'timePerChakra', 5],
        timeHighEnergy: ['chakra_time_high_energy', 'timeHighEnergy', 5],
        timeSleepStage: ['chakra_time_sleep_stage', 'sleepStageDuration', 5],
        timeShot: ['chakra_time_shot', 'shotDuration', 7],
        timeIcebreaker: ['chakra_time_icebreaker', 'icebreaker', 60],
        timeEmergence: ['chakra_time_emergence', 'emergence', 60],
        timeBreathing: ['chakra_time_breathing', 'breathingStep', 8],
        timeCorpse: ['chakra_time_corpse', 'corpsePose', 300],
        timeInterval: ['chakra_time_interval', 'interval', 10],
        timeYogaPrep: ['chakra_time_yoga_prep', 'yogaPreparation', 60],
        timeYogaPose: ['chakra_time_yoga_pose', 'yogaPose', 60],
        timeBath: ['chakra_time_bath', 'bath', 600],
        timePerinealCare: ['chakra_time_perineal_care', 'perinealCare', 300],
        timeAssistedBathing: ['chakra_time_assisted_bathing', 'assistedBathing', 600]
    });

    function shotDefaultDuration(type, definition = {}, multiStageTypes = ['meditation', 'sleep']) {
        const isMultiStage = multiStageTypes.includes(type);
        const configured = isMultiStage ? definition.default : definition.singleFrequencyDefault;
        const fallback = isMultiStage ? 7 : 1;
        const duration = Number(configured ?? fallback);
        const minimum = Number(definition.min ?? 1);
        const maximum = Number(definition.max ?? 20);
        return Number.isFinite(duration) ? Math.min(maximum, Math.max(minimum, duration)) : fallback;
    }

    function normalizeDroneDurationMode(value, ratios, fallback) {
        return Object.prototype.hasOwnProperty.call(ratios, value) ? value : fallback;
    }

    function normalizeHrimDroneDurationMode(value, ratios, standardFallback, hrimFallback) {
        const normalized = normalizeDroneDurationMode(value, ratios, standardFallback);
        return normalized === 'beginner' ? hrimFallback : normalized;
    }

    function normalizeSleepDroneDurationMode(value, ratios, fallback) {
        return Object.prototype.hasOwnProperty.call(ratios, value) ? value : fallback;
    }

    function droneDurationMs(mode, ratios, fallback, referenceSeconds) {
        return Math.round(referenceSeconds * 1000 * ratios[normalizeDroneDurationMode(mode, ratios, fallback)]);
    }

    function formatClockDuration(durationMs) {
        const totalSeconds = Math.max(0, Math.round(Number(durationMs) / 1000));
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    }

    function normalizeSleepStages(scripts, expectedCount = 5) {
        const stages = scripts?.sleep_mode?.stages;
        if (!Array.isArray(stages) || stages.length !== expectedCount) {
            throw new Error('Sleep Mode requires five script-defined frequency stages.');
        }
        return stages.map((stage, index) => {
            const frequency = Number(stage?.frequency);
            if (!stage?.key || !Number.isFinite(frequency) || frequency <= 0 || frequency > 20000) {
                throw new Error(`Sleep Mode stage ${index + 1} has an invalid frequency.`);
            }
            return { ...stage, frequency };
        });
    }

    function resolve(config, section, key, fallback = 0) {
        const value = config?.[section]?.[key];
        return value == null ? (FALLBACKS[`${section}.${key}`] ?? fallback) : value;
    }

    function resolveJourneyDefault(config, key, fallback) {
        return config?.journey?.[key]?.default ?? fallback;
    }

    function mergeProfile(base, profile) {
        return ['journey', 'transitions', 'narration', 'estimate'].reduce((merged, section) => {
            merged[section] = { ...(base?.[section] || {}), ...(profile?.[section] || {}) };
            return merged;
        }, { schemaVersion: base?.schemaVersion });
    }

    function applyControlBounds({ document, config, enhanceRangeControls = () => {} }) {
        if (!document || typeof document.getElementById !== 'function') {
            throw new TypeError('Timing controls require a document');
        }
        Object.entries(CONTROL_KEYS).forEach(([id, key]) => {
            const input = document.getElementById(id);
            const definition = config?.journey?.[key];
            if (!input || !definition) return;
            ['min', 'max', 'step'].forEach(attribute => {
                if (definition[attribute] != null) input.setAttribute(attribute, definition[attribute]);
            });
        });
        enhanceRangeControls();
    }

    function hydratePreferences({ config, state, storage }) {
        if (!state || !storage || typeof storage.getItem !== 'function') return;
        Object.entries(STATE_DEFAULTS).forEach(([stateKey, [storageKey, configKey, fallback]]) => {
            if (storage.getItem(storageKey) === null) state[stateKey] = resolveJourneyDefault(config, configKey, fallback);
            const definition = config?.journey?.[configKey];
            if (!definition) return;
            const minimum = Number(definition.min);
            const maximum = Number(definition.max);
            const bounded = Math.min(maximum, Math.max(minimum, Number(state[stateKey])));
            if (Number.isFinite(bounded) && bounded !== state[stateKey]) {
                state[stateKey] = bounded;
                storage.setItem(storageKey, String(bounded));
            }
        });
    }

    async function loadAndApply({
        initialConfig,
        fetchConfig,
        search = '',
        storage,
        state,
        document,
        enhanceRangeControls,
        applyDemoCoreDurationPreset,
        onConfig = () => {},
        onProfile = () => {},
        onWarning = () => {},
        SearchParams = global.URLSearchParams
    }) {
        let config = initialConfig;
        try {
            const response = await fetchConfig('timing-config.json');
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            config = await response.json();
            const profileName = new SearchParams(search).get('timingProfile');
            if (profileName && config.profiles?.[profileName]) {
                config = mergeProfile(config, config.profiles[profileName]);
                onProfile(profileName);
            }
        } catch (error) {
            onWarning('Timing configuration unavailable; using built-in timing defaults.', error);
        }

        onConfig(config);
        applyControlBounds({ document, config, enhanceRangeControls });
        hydratePreferences({ config, state, storage });
        if (state) applyDemoCoreDurationPreset?.();
        return config;
    }

    global.ChakraTimingSettings = Object.freeze({
        fallbacks: FALLBACKS,
        shotDefaultDuration,
        normalizeDroneDurationMode,
        normalizeHrimDroneDurationMode,
        normalizeSleepDroneDurationMode,
        droneDurationMs,
        formatClockDuration,
        normalizeSleepStages,
        resolve,
        resolveJourneyDefault,
        mergeProfile,
        applyControlBounds,
        hydratePreferences,
        loadAndApply
    });
})(typeof window === 'undefined' ? globalThis : window);
