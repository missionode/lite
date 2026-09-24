(function installAppearancePreferenceHydration(global) {
    'use strict';

    function requireFunction(value, name) {
        if (typeof value !== 'function') throw new TypeError(`Appearance preference hydration requires ${name}`);
    }

    function hydrateEffect({ state, syncValue, applyImageEffect }) {
        if (!state) throw new TypeError('Appearance preference hydration requires state');
        requireFunction(syncValue, 'value synchronization');
        requireFunction(applyImageEffect, 'image-effect application');
        syncValue('visual-effect-select', state.visualEffect);
        applyImageEffect();
    }

    function hydrateBrightness({ state, syncValue, document }) {
        if (!state) throw new TypeError('Appearance preference hydration requires state');
        requireFunction(syncValue, 'value synchronization');
        if (!document || typeof document.getElementById !== 'function') {
            throw new TypeError('Appearance preference hydration requires a document');
        }
        syncValue('brightness-slider', state.brightness);
        document.getElementById('app').style.setProperty('--app-brightness', String(state.brightness));
    }

    global.ChakraAppearancePreferenceHydration = Object.freeze({ hydrateEffect, hydrateBrightness });
})(typeof window === 'undefined' ? globalThis : window);
