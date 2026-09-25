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

    global.ChakraJourneyPreparationSelection = Object.freeze({ bind });
})(typeof window === 'undefined' ? globalThis : window);
