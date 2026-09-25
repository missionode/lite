(function installDroneDurationSettingsView(global) {
    'use strict';

    function sync({ document, highEnergy, sleep, activeMode }) {
        if (!document || typeof activeMode !== 'string') {
            throw new TypeError('Drone duration settings view requires document and active mode');
        }

        document.querySelectorAll('input[name="drone-duration-mode"]').forEach(input => {
            input.disabled = Boolean(highEnergy && input.value === 'beginner');
            input.checked = input.value === activeMode;
        });

        const hrimNote = document.getElementById('drone-duration-hrim-note');
        if (hrimNote) hrimNote.hidden = !highEnergy;
        const sleepNote = document.getElementById('drone-duration-sleep-note');
        if (sleepNote) sleepNote.hidden = !sleep;
    }

    global.ChakraDroneDurationSettingsView = Object.freeze({ sync });
})(typeof window === 'undefined' ? globalThis : window);
