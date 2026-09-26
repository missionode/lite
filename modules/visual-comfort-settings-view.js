(function installVisualComfortSettingsView(global) {
    'use strict';

    function create({ document = global.document, state, storage = global.localStorage, audio } = {}) {
        if (!document || !state || !storage || !audio) {
            throw new TypeError('Visual comfort settings require document, state, storage and audio services');
        }

        function bindBrightness() {
            const slider = document.getElementById('brightness-slider');
            if (!slider) return;
            slider.addEventListener('input', event => {
                state.brightness = parseFloat(event.target.value);
                storage.setItem('chakra_brightness', state.brightness);
                document.getElementById('app').style.setProperty('--app-brightness', String(state.brightness));
            });
        }

        function bindJourneyComfort() {
            const eyesCloseToggle = document.getElementById('eyes-close-mode-toggle');
            if (eyesCloseToggle) eyesCloseToggle.addEventListener('change', event => {
                state.eyesCloseMode = event.target.checked;
                storage.setItem('chakra_eyes_close_mode', state.eyesCloseMode);
                if (audio.toggleEyesCloseMode) audio.toggleEyesCloseMode(state.eyesCloseMode);
                document.body.classList.toggle('eyes-close-mode', state.eyesCloseMode);
            });
            const audioFiltersToggle = document.getElementById('audio-filters-toggle');
            if (audioFiltersToggle) audioFiltersToggle.addEventListener('change', event => {
                state.audioFilters = event.target.checked;
                storage.setItem('chakra_audio_filters', state.audioFilters);
                if (audio.toggleAudioFilters) audio.toggleAudioFilters(state.audioFilters);
            });
        }

        return Object.freeze({ bindBrightness, bindJourneyComfort });
    }

    global.ChakraVisualComfortSettingsView = Object.freeze({ create });
})(typeof window === 'undefined' ? globalThis : window);
