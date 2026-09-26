(function installJourneyPreferenceSettingsView(global) {
    'use strict';

    function bind({ document = global.document, state, storage = global.localStorage, updateJourneyRoadmap } = {}) {
        if (!document || !state || !storage || typeof updateJourneyRoadmap !== 'function') {
            throw new TypeError('Journey preference settings require document, state, storage and roadmap services');
        }
        const preferences = [
            ['returning-journey-toggle', 'returningJourney', 'chakra_returning_journey'],
            ['journey-video-prelude-toggle', 'journeyVideoPreludeEnabled', 'chakra_journey_video_prelude']
        ];
        preferences.forEach(([id, stateKey, storageKey]) => {
            document.getElementById(id)?.addEventListener('change', event => {
                state[stateKey] = event.target.checked;
                storage.setItem(storageKey, String(state[stateKey]));
                updateJourneyRoadmap();
            });
        });
    }

    global.ChakraJourneyPreferenceSettingsView = Object.freeze({ bind });
})(typeof window === 'undefined' ? globalThis : window);
