(function installCarePreferenceHydration(global) {
    'use strict';

    function hydrate({ state, syncChecked }) {
        if (!state) throw new TypeError('Care preference hydration requires state');
        if (typeof syncChecked !== 'function') throw new TypeError('Care preference hydration requires checkbox synchronization');
        syncChecked('perineal-care-toggle', state.perinealCareEnabled);
        syncChecked('assisted-bathing-toggle', state.assistedBathingEnabled);
        syncChecked('massage-toggle', state.massageEnabled);
    }

    global.ChakraCarePreferenceHydration = Object.freeze({ hydrate });
})(typeof window === 'undefined' ? globalThis : window);
