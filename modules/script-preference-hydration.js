(function installScriptPreferenceHydration(global) {
    'use strict';

    function hydrate({ state, syncValue, document, isDemoScriptSelected, getDemoScriptTimingMessage }) {
        if (!state) throw new TypeError('Script preference hydration requires state');
        if (typeof syncValue !== 'function') throw new TypeError('Script preference hydration requires value synchronization');
        if (!document || typeof document.getElementById !== 'function') throw new TypeError('Script preference hydration requires a document');
        if (typeof isDemoScriptSelected !== 'function' || typeof getDemoScriptTimingMessage !== 'function') {
            throw new TypeError('Script preference hydration requires demo-script services');
        }

        syncValue('script-source-select', state.scriptSource);
        const customScriptUI = document.getElementById('custom-script-ui');
        if (customScriptUI) customScriptUI.style.display = state.scriptSource === 'custom' ? 'flex' : 'none';
        if (state.customScript) {
            const statusEl = document.getElementById('script-status');
            if (statusEl) {
                statusEl.textContent = isDemoScriptSelected() ? getDemoScriptTimingMessage() : 'Custom script loaded and ready.';
                statusEl.style.display = 'block';
                statusEl.style.color = '#4ade80';
            }
        }
    }

    global.ChakraScriptPreferenceHydration = Object.freeze({ hydrate });
})(typeof window === 'undefined' ? globalThis : window);
