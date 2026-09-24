(function installAssessmentPersistence(global) {
    'use strict';

    const STATE_KEY = 'chakraAssessmentTournamentV1';
    const LEGACY_KEYS = Object.freeze(['chakraAnswers', 'chakraAssessmentNotes']);

    function hasProgress(state) {
        return Boolean(state?.answeredIds?.length || state?.valueHistory?.length);
    }

    function create(storage, engine) {
        if (!engine?.createState || !engine?.restoreState) throw new Error('Assessment persistence requires the tournament engine');

        function fresh(bank) {
            return engine.createState(bank);
        }

        function load(bank) {
            try {
                const raw = storage?.getItem?.(STATE_KEY);
                if (!raw) return { state: fresh(bank), resumed: false, available: typeof storage?.getItem === 'function' };
                const state = engine.restoreState(bank, JSON.parse(raw));
                return { state, resumed: hasProgress(state), available: true };
            } catch (error) {
                return { state: fresh(bank), resumed: false, available: false };
            }
        }

        function save(bank, candidate) {
            const state = engine.restoreState(bank, candidate);
            try {
                storage?.setItem?.(STATE_KEY, JSON.stringify(state));
                return { state, persisted: typeof storage?.setItem === 'function' };
            } catch (error) {
                return { state, persisted: false };
            }
        }

        function clear() {
            let cleared = typeof storage?.removeItem === 'function';
            for (const key of [STATE_KEY, ...LEGACY_KEYS]) {
                try {
                    storage?.removeItem?.(key);
                } catch (error) {
                    cleared = false;
                }
            }
            return cleared;
        }

        return Object.freeze({ load, save, clear });
    }

    global.ChakraAssessmentPersistence = Object.freeze({
        STATE_KEY,
        LEGACY_KEYS,
        create
    });
})(typeof window === 'undefined' ? globalThis : window);
