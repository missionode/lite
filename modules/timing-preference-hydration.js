(function installTimingPreferenceHydration(global) {
    'use strict';

    function requireServices(state, syncValue, setText) {
        if (!state || (syncValue !== undefined && typeof syncValue !== 'function') || typeof setText !== 'function') {
            throw new TypeError('Timing preference hydration requires state and display services');
        }
    }

    function setRangeValue(document, id, value) {
        const slider = document.getElementById(id);
        if (!slider) return;
        slider.value = value;
        const percentage = ((slider.value - slider.min) / (slider.max - slider.min) * 100).toFixed(1) + '%';
        slider.style.setProperty('--range-fill', percentage);
    }

    function hydrateCore({ state, document, setText }) {
        requireServices(state, undefined, setText);
        if (!document) throw new TypeError('Timing preference hydration requires a document');
        setRangeValue(document, 'time-per-chakra', state.timePerChakra);
        setText('time-display', `${state.timePerChakra.toFixed(1)} mins`);
        setRangeValue(document, 'time-high-energy', state.timeHighEnergy);
        setText('high-energy-time-display', `${state.timeHighEnergy} mins`);
    }

    function hydrateJourney({ state, syncValue, setText }) {
        requireServices(state, syncValue, setText);
        const entries = [
            ['time-icebreaker', 'display-icebreaker', state.timeIcebreaker, 's', value => value],
            ['time-emergence', 'display-emergence', state.timeEmergence, 's', value => value],
            ['time-breathing', 'display-breathing', state.timeBreathing, 's', value => value],
            ['time-corpse', 'display-corpse', state.timeCorpse, 's', value => value],
            ['time-interval', 'display-interval', state.timeInterval, 's', value => value],
            ['time-yoga-prep', 'display-yoga-prep', state.timeYogaPrep, 's', value => value],
            ['time-yoga-pose', 'display-yoga-pose', state.timeYogaPose, 's', value => value],
            ['time-bath', 'display-bath', state.timeBath, 'm', value => Math.floor(value / 60)],
            ['time-perineal-care', 'display-perineal-care', state.timePerinealCare, 'm', value => Math.floor(value / 60)],
            ['time-assisted-bathing', 'display-assisted-bathing', state.timeAssistedBathing, 'm', value => Math.floor(value / 60)]
        ];
        entries.forEach(([controlId, displayId, value, unit, format]) => {
            syncValue(controlId, value);
            setText(displayId, `${format(value)}${unit}`);
        });
    }

    global.ChakraTimingPreferenceHydration = Object.freeze({ hydrateCore, hydrateJourney });
})(typeof window === 'undefined' ? globalThis : window);
