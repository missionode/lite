(function installAppState(global) {
    'use strict';

    function storedNumber(storage, key, fallback) {
        const storedValue = storage.getItem(key);
        if (storedValue === null || storedValue === '') return fallback;
        const value = Number(storedValue);
        return Number.isFinite(value) ? value : fallback;
    }

    function storedBooleanWithLegacy(storage, key, legacyKey) {
        const storedValue = storage.getItem(key);
        if (storedValue !== null) return storedValue === 'true';
        return legacyKey ? storage.getItem(legacyKey) === 'true' : false;
    }

    global.ChakraAppState = Object.freeze({ storedNumber, storedBooleanWithLegacy });
})(typeof window === 'undefined' ? globalThis : window);
