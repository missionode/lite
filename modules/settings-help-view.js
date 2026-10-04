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

        // Benefits and safety (FAQ): opened from Settings and from this help.
        const faq = document.getElementById('benefits-safety-modal');
        const faqClose = document.getElementById('benefits-safety-close');
        if (!faq || !faqClose) return;
        const openFaq = () => {
            modal.classList.add('hidden');
            faq.classList.remove('hidden');
            faqClose.focus();
        };
        for (const id of ['benefits-safety-button', 'settings-help-faq']) document.getElementById(id)?.addEventListener('click', openFaq);
        faqClose.addEventListener('click', () => faq.classList.add('hidden'));
        faq.addEventListener('click', event => { if (event.target === faq) faq.classList.add('hidden'); });
    }

    global.ChakraSettingsHelpView = Object.freeze({ bind });
})(typeof window === 'undefined' ? globalThis : window);
