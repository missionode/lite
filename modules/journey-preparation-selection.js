(function installJourneyPreparationSelection(global) {
    'use strict';

    function bind({
        document = global.document,
        state,
        toggles,
        clearMusicOnlyMode,
        clearHighEnergyMode,
        clearSleepMode,
        clearFocusedExperiences,
        clearIntimateService,
        updateExperienceModeVisibility,
        updateSessionEstimate
    } = {}) {
        if (!document || !state || !toggles || typeof updateExperienceModeVisibility !== 'function' || typeof updateSessionEstimate !== 'function') {
            throw new TypeError('Journey preparation selection requires document, state, toggles and update services');
        }

        const clearCompetingModes = () => {
            clearMusicOnlyMode();
            clearHighEnergyMode();
            clearSleepMode();
            clearFocusedExperiences();
            clearIntimateService();
        };
        const refresh = () => {
            updateExperienceModeVisibility();
            updateSessionEstimate();
        };

        [toggles.boxBreathing, toggles.hooponopono].forEach(toggle => {
            toggle?.addEventListener('change', event => {
                state.boxBreathingExperienceEnabled = toggles.boxBreathing?.checked === true;
                state.hooponoponoExperienceEnabled = toggles.hooponopono?.checked === true;
                if (event.target.checked) clearCompetingModes();
                refresh();
            });
        });

        const optionToggles = [
            [toggles.dharana, 'dharana-options'],
            [toggles.visualization, 'visualization-options'],
            [toggles.bodyScan, 'body-scan-options'],
            [toggles.noting, 'noting-options'],
            [toggles.undoUnlearn, 'undo-unlearn-options']
        ];
        optionToggles.forEach(([toggle, optionsId]) => {
            toggle?.addEventListener('change', event => {
                const options = document.getElementById(optionsId);
                if (options) options.hidden = !event.target.checked;
                if (event.target.checked) clearCompetingModes();
                refresh();
            });
        });
    }

    function bindDurationRefresh({ document = global.document, updateSessionEstimate } = {}) {
        if (!document || typeof updateSessionEstimate !== 'function') {
            throw new TypeError('Preparation durations require document and estimate services');
        }
        ['visualization-duration', 'body-scan-duration', 'noting-duration', 'undo-unlearn-duration'].forEach(id => {
            document.getElementById(id)?.addEventListener('change', updateSessionEstimate);
        });
    }

    function bindVisualizationAmbiencePreference({ document = global.document, state, storage = global.localStorage } = {}) {
        if (!document || !state || !storage || typeof storage.setItem !== 'function') {
            throw new TypeError('Visualization ambience preference requires document, state and storage');
        }
        document.getElementById('visualization-ambience')?.addEventListener('change', event => {
            state.visualizationAmbience = event.target.value === 'space-race' ? 'space-race' : 'silence';
            storage.setItem('chakra_visualization_ambience', state.visualizationAmbience);
        });
    }

    function bindPrimaryModeToggles({ musicOnlyToggle, highEnergyToggle, state, enforceMasterToggle, updateExperienceModeVisibility, updateSessionEstimate }) {
        if (!state || typeof enforceMasterToggle !== 'function' || typeof updateExperienceModeVisibility !== 'function'
            || typeof updateSessionEstimate !== 'function') {
            throw new TypeError('Primary mode toggles require state and mode-refresh services');
        }
        musicOnlyToggle?.addEventListener('change', event => {
            state.bgMusicMode = event.target.checked;
            enforceMasterToggle(event.target);
            updateExperienceModeVisibility();
            updateSessionEstimate();
        });
        highEnergyToggle?.addEventListener('change', event => {
            state.highEnergyEnabled = event.target.checked;
            enforceMasterToggle(event.target);
            updateExperienceModeVisibility();
            updateSessionEstimate();
        });
    }

    global.ChakraJourneyPreparationSelection = Object.freeze({ bind, bindDurationRefresh, bindVisualizationAmbiencePreference, bindPrimaryModeToggles });
})(typeof window === 'undefined' ? globalThis : window);
