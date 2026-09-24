(function installJourneySelectionHydration(global) {
    'use strict';

    function hydrate({ state, document, syncValue, syncChecked, defaultIntention }) {
        if (!state || !document || typeof syncValue !== 'function' || typeof syncChecked !== 'function'
            || typeof defaultIntention !== 'function') {
            throw new TypeError('Journey selection hydration requires state, document and preference services');
        }
        document.querySelectorAll('#chakra-selection input').forEach(input => {
            input.checked = state.selectedChakras.includes(input.value);
        });
        if (!state.intention.trim()) state.intention = defaultIntention();
        syncValue('intention-input', state.intention);
        syncChecked('returning-journey-toggle', state.returningJourney);
        syncChecked('journey-video-prelude-toggle', state.journeyVideoPreludeEnabled);
        syncChecked('audio-filters-toggle', state.audioFilters);
    }

    global.ChakraJourneySelectionHydration = Object.freeze({ hydrate });
})(typeof window === 'undefined' ? globalThis : window);
