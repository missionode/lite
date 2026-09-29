(function installSessionTransportControls(global) {
    'use strict';

    function bind({ document = global.document, meditation, logger = global.console } = {}) {
        if (!document || !meditation || typeof meditation.togglePause !== 'function' || typeof meditation.stop !== 'function' || typeof meditation.skipCurrentItem !== 'function') {
            throw new TypeError('Session transport controls require document and meditation lifecycle methods');
        }
        document.getElementById('pause-meditation').addEventListener('click', event => {
            logger.log('Pause/Play button clicked');
            event.stopImmediatePropagation();
            meditation.togglePause();
        });
        document.getElementById('skip-meditation').addEventListener('click', event => {
            logger.log('Skip current item button clicked');
            event.stopImmediatePropagation();
            meditation.skipCurrentItem();
        });
        document.getElementById('stop-meditation').addEventListener('click', event => {
            logger.log('Stop button clicked');
            event.stopImmediatePropagation();
            meditation.stop();
        });
    }

    global.ChakraSessionTransportControls = Object.freeze({ bind });
})(typeof window === 'undefined' ? globalThis : window);
