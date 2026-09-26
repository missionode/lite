(function installSettingsHelpView(global) {
    'use strict';

    function bind({ document = global.document } = {}) {
        if (!document) throw new TypeError('Settings help view requires a document');
        const modal = document.getElementById('settings-help-modal');
        const openButton = document.getElementById('settings-help-button');
        const closeButton = document.getElementById('settings-help-close');
        if (!modal || !openButton || !closeButton) return;
        openButton.addEventListener('click', () => {
            modal.classList.remove('hidden');
            closeButton.focus();
        });
        closeButton.addEventListener('click', () => modal.classList.add('hidden'));
    }

    global.ChakraSettingsHelpView = Object.freeze({ bind });
})(typeof window === 'undefined' ? globalThis : window);
