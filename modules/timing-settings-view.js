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

    function bindJourneyDurationControl({ document, state, getChecked, storage, updateDroneSummary, updateSessionEstimate }) {
        if (!document || !state || typeof getChecked !== 'function' || !storage || typeof storage.setItem !== 'function'
            || typeof updateDroneSummary !== 'function' || typeof updateSessionEstimate !== 'function') {
            throw new TypeError('Journey duration control requires preference and refresh services');
        }
        document.getElementById('time-per-chakra').addEventListener('input', event => {
            const value = parseFloat(event.target.value);
            if (getChecked('shots-toggle')) {
                state.timeShot = value;
                document.getElementById('time-display').textContent = `${state.timeShot.toFixed(0)} secs`;
                storage.setItem('chakra_time_shot', state.timeShot);
            } else if (getChecked('sleep-mode-toggle')) {
                state.timeSleepStage = value;
                document.getElementById('time-display').textContent = `${state.timeSleepStage.toFixed(1)} mins`;
                storage.setItem('chakra_time_sleep_stage', state.timeSleepStage);
            } else {
                state.timePerChakra = value;
                document.getElementById('time-display').textContent = `${state.timePerChakra.toFixed(1)} mins`;
                storage.setItem('chakra_time', state.timePerChakra);
            }
            const percent = ((event.target.value - event.target.min) / (event.target.max - event.target.min) * 100).toFixed(1) + '%';
            event.target.style.setProperty('--range-fill', percent);
            updateDroneSummary();
            updateSessionEstimate();
        });
    }

    function bindHighEnergyDurationControl({ document, state, storage, setText, updateDroneSummary, updateSessionEstimate }) {
        if (!document || !state || !storage || typeof storage.setItem !== 'function' || typeof setText !== 'function'
            || typeof updateDroneSummary !== 'function' || typeof updateSessionEstimate !== 'function') {
            throw new TypeError('High Energy duration control requires preference and refresh services');
        }
        const slider = document.getElementById('time-high-energy');
        if (!slider) return false;
        slider.addEventListener('input', event => {
            state.timeHighEnergy = parseFloat(event.target.value);
            setText('high-energy-time-display', `${state.timeHighEnergy} mins`);
            storage.setItem('chakra_time_high_energy', state.timeHighEnergy);
            const percent = ((event.target.value - event.target.min) / (event.target.max - event.target.min) * 100).toFixed(1) + '%';
            event.target.style.setProperty('--range-fill', percent);
            updateDroneSummary();
            updateSessionEstimate();
        });
        return true;
    }

    global.ChakraTimingSettingsView = Object.freeze({
        bindTransitionDurationControls, bindCareDurationControls,
        bindJourneyDurationControl, bindHighEnergyDurationControl
    });
})(typeof window === 'undefined' ? globalThis : window);
