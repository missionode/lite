(function installIntentionSettingsView(global) {
    'use strict';

    function bind({ document = global.document, state, storage = global.localStorage } = {}) {
        if (!document || !state || !storage) {
            throw new TypeError('Intention settings require document, state and storage');
        }
        document.getElementById('intention-input')?.addEventListener('input', event => {
            state.intention = event.target.value;
            storage.setItem('chakra_intention', state.intention);
        });
    }

    global.ChakraIntentionSettingsView = Object.freeze({ bind });
})(typeof window === 'undefined' ? globalThis : window);
