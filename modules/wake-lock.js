(function installWakeLock(global) {
    'use strict';

    // Keeps the screen awake for a journey or a game. One owner for the Screen
    // Wake Lock API: request() holds the screen on, release() lets it sleep,
    // and reacquire() takes the lock back after the browser dropped it (it does
    // so whenever the page is hidden). Unsupported browsers fail silently.
    function create({ navigator = global.navigator, document = global.document } = {}) {
        if (!navigator || !document) throw new TypeError('Wake lock needs navigator and document');
        let sentinel = null;

        async function request() {
            if (!('wakeLock' in navigator)) return false;
            try {
                sentinel = await navigator.wakeLock.request('screen');
                return true;
            } catch (error) {
                return false;
            }
        }

        function release() {
            if (sentinel === null) return;
            const held = sentinel;
            sentinel = null;
            try { held.release(); } catch (error) { /* already released by the browser */ }
        }

        // The browser releases the lock when the page is hidden. If a holder
        // still wants it, ask again once the page is visible.
        async function reacquire() {
            if (sentinel !== null && document.visibilityState === 'visible') return request();
            return false;
        }

        return Object.freeze({
            request,
            release,
            reacquire,
            isHeld: () => sentinel !== null,
            // Kept for callers that checked the old manager's property.
            get wakeLock() { return sentinel; }
        });
    }

    global.ChakraWakeLock = Object.freeze({ create });
})(typeof window === 'undefined' ? globalThis : window);
