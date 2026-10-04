(function installChakraTiming(global) {
    'use strict';

    // Separate practice time for each chakra (optional). Core Practice
    // Duration stays the base: a chakra with no own time (null) follows it.
    // The switch is off by default; HRIM, Sleep, Shots, demo scripts and
    // experiments keep their own timers.
    const CHAKRA_IDS = Object.freeze(['root', 'sacral', 'solar', 'heart', 'throat', 'thirdeye', 'crown']);
    const ENABLED_KEY = 'chakra_per_chakra_time_enabled';
    const TIMES_KEY = 'chakra_per_chakra_times';
    const DEFAULT_RANGE = Object.freeze({ min: 1, max: 7, step: 0.5 });
    // Assessment autofill: focus chakras get the core time plus 50%.
    const FOCUS_FACTOR = 1.5;

    function clampMinutes(value, range = DEFAULT_RANGE) {
        const number = Number(value);
        if (!Number.isFinite(number)) return null;
        const step = range.step || 0.5;
        const stepped = Math.round(number / step) * step;
        return Math.max(range.min, Math.min(range.max, Number(stepped.toFixed(2))));
    }

    function normalizeTimes(raw, range = DEFAULT_RANGE) {
        let source = raw;
        if (typeof raw === 'string') {
            try { source = JSON.parse(raw); } catch (error) { source = {}; }
        }
        const times = {};
        for (const id of CHAKRA_IDS) {
            const value = source && source[id];
            times[id] = value === null || value === undefined || value === '' ? null : clampMinutes(value, range);
        }
        return times;
    }

    function load(storage, range = DEFAULT_RANGE) {
        const get = key => { try { return storage?.getItem?.(key); } catch (error) { return null; } };
        return { enabled: get(ENABLED_KEY) === 'true', times: normalizeTimes(get(TIMES_KEY), range) };
    }

    function save(storage, state) {
        try {
            storage?.setItem?.(ENABLED_KEY, String(Boolean(state.perChakraTimeEnabled)));
            storage?.setItem?.(TIMES_KEY, JSON.stringify(normalizeTimes(state.perChakraTimes)));
        } catch (error) { /* storage is optional */ }
    }

    // Minutes for one chakra in a normal journey.
    function minutesFor(state, key, { demo = false } = {}) {
        const core = Number(state?.timePerChakra) || 5;
        if (demo || !state?.perChakraTimeEnabled || !CHAKRA_IDS.includes(key)) return core;
        const own = state.perChakraTimes?.[key];
        return Number.isFinite(Number(own)) && own !== null ? Number(own) : core;
    }

    function totalMinutes(state, keys, options) {
        return (keys || []).reduce((sum, key) => sum + minutesFor(state, key, options), 0);
    }

    // Suggested times from a chakra assessment result (ChakraAssessmentTournament.buildResult).
    // Only chakras with enough answers can change; focus areas get more time; others follow the core.
    function suggestFromAssessment(result, core, minimumEvidence = 1, range = DEFAULT_RANGE) {
        const times = Object.fromEntries(CHAKRA_IDS.map(id => [id, null]));
        if (!result || result.focusStatus !== 'candidate' || !Array.isArray(result.focusAreas) || !result.focusAreas.length) {
            return { status: result?.focusStatus === 'no-clear-lowest' ? 'no-clear-focus' : 'not-enough', times, focus: [] };
        }
        const evidence = Object.fromEntries((result.chakras || []).map(item => [item.id, Number(item.evidenceCount) || 0]));
        const focus = result.focusAreas.map(item => item.id).filter(id => CHAKRA_IDS.includes(id) && evidence[id] >= minimumEvidence);
        for (const id of focus) times[id] = clampMinutes((Number(core) || 5) * FOCUS_FACTOR, range);
        return { status: focus.length ? 'ready' : 'not-enough', times, focus };
    }

    global.ChakraTiming = Object.freeze({
        CHAKRA_IDS, ENABLED_KEY, TIMES_KEY, DEFAULT_RANGE, FOCUS_FACTOR,
        clampMinutes, normalizeTimes, load, save, minutesFor, totalMinutes, suggestFromAssessment
    });
})(typeof window === 'undefined' ? globalThis : window);
