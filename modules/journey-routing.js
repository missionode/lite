(function installJourneyRouting(global) {
    'use strict';

    const MASSAGE_CHAKRA_ORDER = Object.freeze([
        'crown', 'thirdeye', 'throat', 'heart', 'solar', 'sacral', 'root'
    ]);

    function resolveFocusedExperience({
        yogaSelected = false,
        intimateSelected = false,
        selectedChakraCount = 0,
        preparationSelected = false
    } = {}) {
        if (yogaSelected) return 'yoga';
        if (intimateSelected) return 'intimate';
        if (selectedChakraCount === 0 && preparationSelected) return 'preparation';
        return null;
    }

    function resolveLaunchRoute({
        shotsSelected = false,
        backgroundMusicMode = false,
        sleepSelected = false
    } = {}) {
        if (shotsSelected) return 'shot';
        if (backgroundMusicMode) return 'music';
        if (sleepSelected) return 'sleep';
        return 'guided';
    }

    function validateLobbyStart({
        route = 'guided',
        highEnergySelected = false,
        focusedExperience = null,
        selectedChakraCount = 0
    } = {}) {
        const valid = route !== 'guided' || highEnergySelected || Boolean(focusedExperience) || selectedChakraCount > 0;
        return Object.freeze({ valid, reason: valid ? null : 'chakra-required' });
    }

    function buildChakraOrder({
        focusedExperience = null,
        massageSelected = false,
        selectedChakras = []
    } = {}) {
        if (focusedExperience === 'intimate' && massageSelected) return [...MASSAGE_CHAKRA_ORDER];
        return Array.isArray(selectedChakras) ? [...selectedChakras] : [];
    }

    global.ChakraJourneyRouting = Object.freeze({
        resolveFocusedExperience,
        resolveLaunchRoute,
        validateLobbyStart,
        buildChakraOrder,
        MASSAGE_CHAKRA_ORDER
    });
})(typeof window === 'undefined' ? globalThis : window);
