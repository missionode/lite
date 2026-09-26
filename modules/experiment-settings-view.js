(function installExperimentSettingsView(global) {
    'use strict';

    function create({ document = global.document, state, setText, startExperiment } = {}) {
        if (!document || !state || typeof setText !== 'function' || typeof startExperiment !== 'function') {
            throw new TypeError('Experiment settings require document, state and activity services');
        }
        const activity = document.getElementById('experiment-activity');
        const duration = document.getElementById('experiment-core-duration');
        const durationGroup = document.getElementById('experiment-core-duration-group');

        function formatDuration() {
            const unit = duration?.dataset.unit || 'min';
            const value = Number(duration?.value);
            return unit === 'min' && value >= 60 ? `${value / 60} min` : `${duration?.value ?? ''} ${unit}`;
        }

        function syncDuration() {
            const selected = activity?.value || '';
            const config = selected.startsWith('chakra:') || selected === 'hrim'
                ? { min: 1, max: 7, step: 0.5, value: state.timePerChakra, unit: 'min' }
                : selected === 'box'
                    ? { min: 4, max: 16, step: 1, value: state.timeBreathing, unit: 'sec' }
                    : selected === 'corpse'
                        ? { min: 60, max: 600, step: 30, value: state.timeCorpse, unit: 'sec' }
                        : selected === 'perineal'
                            ? { min: 30, max: 900, step: 30, value: state.timePerinealCare, unit: 'min' }
                            : selected === 'assisted-bath'
                                ? { min: 60, max: 1800, step: 60, value: state.timeAssistedBathing, unit: 'min' }
                                : selected === 'bath'
                                    ? { min: 60, max: 1800, step: 60, value: state.timeBath, unit: 'min' }
                                    : null;
            if (durationGroup) durationGroup.hidden = !config;
            if (duration) {
                if (config) {
                    duration.min = String(config.min);
                    duration.max = String(config.max);
                    duration.step = String(config.step);
                    duration.value = String(config.value);
                    duration.dataset.unit = config.unit;
                }
                setText('experiment-core-duration-value', formatDuration());
            }
        }

        function bind() {
            activity?.addEventListener('change', syncDuration);
            duration?.addEventListener('input', () => setText('experiment-core-duration-value', formatDuration()));
            syncDuration();
            document.getElementById('start-experiment')?.addEventListener('click', () => {
                const selected = document.getElementById('experiment-activity')?.value;
                if (selected) startExperiment(selected);
            });
        }

        return Object.freeze({ bind, syncDuration });
    }

    global.ChakraExperimentSettingsView = Object.freeze({ create });
})(typeof window === 'undefined' ? globalThis : window);
