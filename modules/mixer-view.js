(function installMixerView(global) {
    'use strict';

    function create({ document = global.document, state, syncChecked, syncValue } = {}) {
        if (!document || !state || typeof syncChecked !== 'function' || typeof syncValue !== 'function') {
            throw new TypeError('Mixer view requires document, state and synchronization services');
        }
        const mixer = document.getElementById('volume-mixer');

        function hide() {
            mixer?.classList.add('hidden');
        }

        function bind() {
            const openButton = document.getElementById('btn-mixer');
            const closeButtons = [document.getElementById('close-mixer'), document.getElementById('close-mixer-bottom')].filter(Boolean);
            openButton?.addEventListener('click', event => {
                event.stopPropagation();
                if (!mixer) return;
                mixer.classList.remove('hidden');
                syncChecked('mixer-no-frequency-mode-toggle', state.noFrequencyMode);
                syncChecked('mixer-no-mantra-mode-toggle', state.noMantraMode);
                syncValue('mixer-spatial-mode', state.spatialMode);
                document.getElementById('close-mixer')?.focus();
            });
            closeButtons.forEach(button => button.addEventListener('click', event => {
                event.stopPropagation();
                hide();
                openButton?.focus();
            }));
        }

        return Object.freeze({ bind, hide });
    }

    global.ChakraMixerView = Object.freeze({ create });
})(typeof window === 'undefined' ? globalThis : window);
