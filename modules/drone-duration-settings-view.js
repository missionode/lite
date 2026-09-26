(function installDroneDurationSettingsView(global) {
    'use strict';

    function sync({ document, highEnergy, sleep, activeMode }) {
        if (!document || typeof activeMode !== 'string') {
            throw new TypeError('Drone duration settings view requires document and active mode');
        }

        document.querySelectorAll('input[name="drone-duration-mode"]').forEach(input => {
            input.disabled = Boolean(highEnergy && input.value === 'beginner');
            input.checked = input.value === activeMode;
        });

        const hrimNote = document.getElementById('drone-duration-hrim-note');
        if (hrimNote) hrimNote.hidden = !highEnergy;
        const sleepNote = document.getElementById('drone-duration-sleep-note');
        if (sleepNote) sleepNote.hidden = !sleep;
    }

    function renderSummary({ document, state, highEnergy, sleep, getDurationMs, formatDuration, translate }) {
        if (!document || !state || typeof getDurationMs !== 'function' || typeof formatDuration !== 'function'
            || typeof translate !== 'function') {
            throw new TypeError('Drone duration summary requires state, document and timing/localization services');
        }
        const summary = document.getElementById('drone-duration-summary');
        if (!summary) return;
        const practiceMinutes = highEnergy ? state.timeHighEnergy : (sleep ? state.timeSleepStage : state.timePerChakra);
        const mode = highEnergy ? state.hrimDroneDurationMode : (sleep ? state.sleepDroneDurationMode : state.droneDurationMode);
        const duration = formatDuration(getDurationMs(practiceMinutes, mode));
        const template = translate(highEnergy ? 'ui.droneDurationActiveHrim' : (sleep ? 'ui.droneDurationActiveSleep' : 'ui.droneDurationActive'));
        summary.textContent = template.replace('{duration}', duration);
    }

    function bindSelection({ document, state, storage, getChecked, normalizeHrim, normalizeSleep, normalizeStandard, syncControls, updateSummary }) {
        if (!document || !state || !storage || typeof storage.setItem !== 'function' || typeof getChecked !== 'function'
            || typeof normalizeHrim !== 'function' || typeof normalizeSleep !== 'function' || typeof normalizeStandard !== 'function'
            || typeof syncControls !== 'function' || typeof updateSummary !== 'function') {
            throw new TypeError('Drone duration selection requires preference and refresh services');
        }
        document.querySelectorAll('input[name="drone-duration-mode"]').forEach(input => {
            input.addEventListener('change', event => {
                if (!event.target.checked) return;
                if (getChecked('high-energy-toggle')) {
                    state.hrimDroneDurationMode = normalizeHrim(event.target.value);
                    storage.setItem('chakra_hrim_drone_duration_mode', state.hrimDroneDurationMode);
                } else if (getChecked('sleep-mode-toggle')) {
                    state.sleepDroneDurationMode = normalizeSleep(event.target.value);
                    storage.setItem('chakra_sleep_drone_duration_mode', state.sleepDroneDurationMode);
                } else {
                    state.droneDurationMode = normalizeStandard(event.target.value);
                    storage.setItem('chakra_drone_duration_mode', state.droneDurationMode);
                }
                syncControls();
                updateSummary();
            });
        });
    }

    global.ChakraDroneDurationSettingsView = Object.freeze({ sync, renderSummary, bindSelection });
})(typeof window === 'undefined' ? globalThis : window);
