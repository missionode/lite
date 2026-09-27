(function installScreenNavigation(global) {
    'use strict';

    function create({ body, document, window, screens, lobbyScreen, configScreen, experimentScreen, dispatchDecorationChange }) {
        if (!body || !document || !window || !Array.isArray(screens) ||
            typeof dispatchDecorationChange !== 'function') {
            throw new TypeError('Screen navigation requires the application views and browser services');
        }

        function showScreen(screen) {
            body.classList.toggle('static-decorations', screen !== lobbyScreen && screen !== configScreen);
            dispatchDecorationChange();
            screens.forEach(candidate => {
                if (candidate) candidate.classList.add('hidden');
            });
            if (screen) {
                screen.classList.remove('hidden');
                // Screen sections can exceed a viewport. Reset both possible
                // scroll containers so navigation always returns to the top.
                screen.scrollTop = 0;
                if (document.scrollingElement) document.scrollingElement.scrollTop = 0;
                if (typeof window.scrollTo === 'function') window.scrollTo(0, 0);
            }
        }

        function checkFirstTime(storage) {
            if (storage.getItem('chakra_configured')) {
                showScreen(lobbyScreen);
                const aura = document.getElementById('aura-bg');
                if (aura) {
                    aura.style.background = 'radial-gradient(ellipse at 50% 100%, rgba(124,58,237,0.25) 0%, transparent 55%)';
                    aura.style.opacity = '1';
                }
            } else {
                showScreen(configScreen);
                const aura = document.getElementById('aura-bg');
                if (aura) {
                    aura.style.background = 'radial-gradient(ellipse at 50% 0%, rgba(124,58,237,0.3) 0%, transparent 55%)';
                    aura.style.opacity = '1';
                }
            }
        }

        function bindLobbyActions({ settingsButton, experimentButton, closeExperimentButton, assessmentButton } = {}) {
            settingsButton?.addEventListener('click', () => showScreen(configScreen));
            experimentButton?.addEventListener('click', () => showScreen(experimentScreen));
            closeExperimentButton?.addEventListener('click', () => showScreen(configScreen));
            assessmentButton?.addEventListener('click', () => { window.location.href = './docs/assesment.html'; });
        }

        return Object.freeze({ showScreen, checkFirstTime, bindLobbyActions });
    }

    global.ChakraScreenNavigation = Object.freeze({ create });
})(typeof window === 'undefined' ? globalThis : window);
