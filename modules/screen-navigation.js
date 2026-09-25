(function installScreenNavigation(global) {
    'use strict';

    function create({ body, document, window, screens, lobbyScreen, configScreen, dispatchDecorationChange }) {
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

        return Object.freeze({ showScreen });
    }

    global.ChakraScreenNavigation = Object.freeze({ create });
})(typeof window === 'undefined' ? globalThis : window);
