(function installTimingSettingsView(global) {
    'use strict';

    const TRANSITION_DURATION_CONTROLS = Object.freeze([
        ['time-icebreaker', 'timeIcebreaker', 'display-icebreaker', 'chakra_time_icebreaker'],
        ['time-emergence', 'timeEmergence', 'display-emergence', 'chakra_time_emergence'],
        ['time-breathing', 'timeBreathing', 'display-breathing', 'chakra_time_breathing'],
        ['time-corpse', 'timeCorpse', 'display-corpse', 'chakra_time_corpse'],
        ['time-interval', 'timeInterval', 'display-interval', 'chakra_time_interval'],
        ['time-yoga-prep', 'timeYogaPrep', 'display-yoga-prep', 'chakra_time_yoga_prep'],
        ['time-yoga-pose', 'timeYogaPose', 'display-yoga-pose', 'chakra_time_yoga_pose']
    ]);

    const CARE_DURATION_CONTROLS = Object.freeze([
        ['time-bath', 'timeBath', 'display-bath', 'chakra_time_bath'],
        ['time-perineal-care', 'timePerinealCare', 'display-perineal-care', 'chakra_time_perineal_care'],
        ['time-assisted-bathing', 'timeAssistedBathing', 'display-assisted-bathing', 'chakra_time_assisted_bathing']
    ]);

    function bindDurationControls(controls, { document, state, storage, setText, updateSessionEstimate }, format) {
        if (!document || !state || !storage || typeof storage.setItem !== 'function'
            || typeof setText !== 'function' || typeof updateSessionEstimate !== 'function') {
            throw new TypeError('Timing settings view requires document, state, storage and update callbacks');
        }

        controls.forEach(([controlId, stateKey, displayId, storageKey]) => {
            document.getElementById(controlId).addEventListener('input', event => {
                const value = parseInt(event.target.value);
                state[stateKey] = value;
                setText(displayId, format(value));
                storage.setItem(storageKey, value);
                updateSessionEstimate();
            });
        });
    }

    function bindTransitionDurationControls(services) {
        bindDurationControls(TRANSITION_DURATION_CONTROLS, services, value => `${value}s`);
    }

    function bindCareDurationControls(services) {
        bindDurationControls(CARE_DURATION_CONTROLS, services, value => `${Math.floor(value / 60)}m`);
    }

    global.ChakraTimingSettingsView = Object.freeze({ bindTransitionDurationControls, bindCareDurationControls });
})(typeof window === 'undefined' ? globalThis : window);
