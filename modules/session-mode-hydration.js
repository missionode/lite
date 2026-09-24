(function installSessionModeHydration(global) {
    'use strict';

    const RETIRED_PREPARATION_KEYS = Object.freeze([
        'chakra_reverse_journey',
        'chakra_box_meditation',
        'chakra_hooponopono'
    ]);
    const RETIRED_MODE_KEYS = Object.freeze([
        'chakra_bg_music_mode',
        'chakra_high_energy',
        'chakra_sleep_experience'
    ]);

    function requireServices(storage, syncChecked) {
        if (!storage || typeof storage.removeItem !== 'function' || typeof syncChecked !== 'function') {
            throw new TypeError('Session mode hydration requires storage and checkbox synchronization services');
        }
    }

    function resetPreparationSelections({ storage, syncChecked }) {
        requireServices(storage, syncChecked);
        RETIRED_PREPARATION_KEYS.forEach(key => storage.removeItem(key));
        syncChecked('box-breathing-experience-toggle', false);
        syncChecked('hooponopono-experience-toggle', false);
    }

    function resetExclusiveModes({ storage, syncChecked }) {
        requireServices(storage, syncChecked);
        RETIRED_MODE_KEYS.forEach(key => storage.removeItem(key));
        syncChecked('music-only-toggle', false);
        syncChecked('high-energy-toggle', false);
        syncChecked('sleep-mode-toggle', false);
    }

    global.ChakraSessionModeHydration = Object.freeze({
        resetPreparationSelections,
        resetExclusiveModes
    });
})(typeof window === 'undefined' ? globalThis : window);
